<?php
/* --------------------------------------------------------------
   RESULT-FORM ENDPOINT – ONLY ADMIN EMAIL
   -------------------------------------------------------------- */
error_reporting(0);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-errors.log');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $input = file_get_contents('php://input');
    $data  = json_decode($input, true);

    if (!isset($data['answers']) || !isset($data['user'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        exit;
    }

    $answers = $data['answers'];
    $user    = $data['user'];

    /* ---- Count Yes answers ------------------------------------------------ */
    $filteredAnswers = array_filter($answers, fn($a) => $a !== null);
    $yesCount        = 0;
    foreach ($filteredAnswers as $a) {
        if (strtolower($a) === 'yes') $yesCount++;
    }
    $totalQuestions  = count($filteredAnswers);
    $scorePercentage = $totalQuestions ? round(($yesCount / $totalQuestions) * 100) : 0;

    /* ---- Risk level ------------------------------------------------------- */
    $riskLevel = 'High Risk';
    $meaning   = 'Immediate action needed';
    $riskDesc  = "You're in the Red Zone. Your SAP system is at high risk of non-compliance.";

    if ($yesCount >= 12) {
        $riskLevel = 'Low Risk';
        $meaning   = 'Well aligned with requirements';
        $riskDesc  = "You're On the Right Track. Strengthen controls and evidence to close gaps.";
    } elseif ($yesCount >= 9) {
        $riskLevel = 'Moderate Risk';
        $meaning   = 'Partial compliance';
        $riskDesc  = "You're Making Progress. Your SAP setup is partially compliant.";
    }

    $description = "Score: {$scorePercentage}% | {$riskLevel}";

    /* ---- Save to file ----------------------------------------------------- */
    $submission = [
        'timestamp'       => date('Y-m-d H:i:s'),
        'name'            => $user['name'] ?? 'Unknown',
        'jobTitle'        => $user['jobTitle'] ?? 'Unknown',
        'company'         => $user['company'] ?? 'Unknown',
        'email'           => $user['email'] ?? 'Unknown',
        'phone'           => $user['phone'] ?? 'Unknown',
        'yesCount'        => $yesCount,
        'totalQuestions'  => $totalQuestions,
        'scorePercentage' => $scorePercentage,
        'riskLevel'       => $riskLevel,
        'riskDescription'=> $riskDesc,
    ];
    @file_put_contents(__DIR__ . '/submissions-result.txt', json_encode($submission) . "\n", FILE_APPEND);

    /* ---- EMAIL: ONLY ADMIN ------------------------------------------------ */
    $emailSent = false;
    try {
        if (file_exists(__DIR__ . '/PHPMailer/PHPMailer.php')) {
            require __DIR__ . '/PHPMailer/Exception.php';
            require __DIR__ . '/PHPMailer/PHPMailer.php';
            require __DIR__ . '/PHPMailer/SMTP.php';

            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'social@togglenow.com';   // Google Workspace account
            $mail->Password   = 'xsxq moqq ewze sins';    // App password
            $mail->SMTPSecure = 'tls';
            $mail->Port       = 587;
            $mail->CharSet    = 'UTF-8';
            $mail->SMTPDebug  = 0;

            // ---- Build answer list for admin ----
            $answersList = '';
            $q = 1;
            foreach ($answers as $a) {
                if ($a !== null) {
                    $answersList .= "Question{$q}: " . ucfirst($a) . "\n";
                    $q++;
                }
            }

            // ---- USER EMAIL (rich HTML) – **NOT SENT** (commented out) ----
            /*
            $userHTML = "... (the long HTML you posted) ...";
            $mail->clearAllRecipients();
            $mail->setFrom('social@togglenow.com', 'ToggleNow MCA Team');
            $mail->addReplyTo('social@togglenow.com');
            $mail->addAddress($user['email'], $user['name'] ?? '');
            $mail->isHTML(true);
            $mail->Subject = 'Your SAP MCA Audit Trail Readiness Assessment Results';
            $mail->Body    = $userHTML;
            $mail->AltBody = strip_tags($userHTML);
            $mail->send();
            */

            // ---- ADMIN EMAIL (internal report) ----
            $mail->clearAllRecipients();
            $mail->clearCCs();
            $mail->setFrom('social@togglenow.com', 'ToggleNow MCA Team');
            $mail->addReplyTo('social@togglenow.com');
            $mail->addAddress('social@togglenow.com', 'ToggleNow MCA Team');

            // Uncomment any CCs you need:
            // $mail->addCC('raghu@togglenow.com', 'Raghu');
            // $mail->addCC('supraja@mosol9.com', 'Supraja');
            // $mail->addCC('sales@togglenow.com', 'Sales Team');
            // $mail->addCC('udaya@mosol9.com', 'Udaya');

            $mail->Subject = 'New MCA Quiz Submission - ' . ($user['name'] ?? 'Unknown') . ' from ' . ($user['company'] ?? 'Unknown');

            $adminEmailHTML = "
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; }
                        .container { max-width: 650px; margin: 0 auto; padding: 20px; }
                        h2 { color: #204ced; font-size: 22px; margin-bottom: 20px; }
                        .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #204ced; }
                        .info-box p { margin: 8px 0; font-size: 15px; }
                        .score-highlight { background: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center; }
                        .score-highlight strong { font-size: 18px; color: #333; }
                        pre { background: #f4f4f4; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <h2>New MCA Quiz Submission Received</h2>
                        <div class='info-box'>
                            <p><strong>Timestamp:</strong> " . date('Y-m-d H:i:s') . "</p>
                            <p><strong>Name:</strong> {$user['name']}</p>
                            <p><strong>Job Title:</strong> {$user['jobTitle']}</p>
                            <p><strong>Company:</strong> {$user['company']}</p>
                            <p><strong>Email:</strong> {$user['email']}</p>
                            <p><strong>Phone:</strong> {$user['phone']}</p>
                        </div>
                        <div class='score-highlight'>
                            <p><strong>Score:</strong> {$scorePercentage}% ({$yesCount} out of {$totalQuestions} answered 'Yes')</p>
                            <p><strong>Risk Level:</strong> {$riskLevel}</p>
                            <p><strong>Assessment:</strong> {$riskDesc}</p>
                        </div>
                        <h3>Detailed Answers:</h3>
                        <pre>{$answersList}</pre>
                    </div>
                </body>
                </html>
            ";

            $mail->isHTML(true);
            $mail->Body    = $adminEmailHTML;
            $mail->AltBody = strip_tags($adminEmailHTML);
            $mail->send();

            $emailSent = true;
        }
    } catch (Exception $e) {
        error_log('Result-Form Email error: ' . $e->getMessage());
    }

    /* ---- JSON response to frontend ---- */
    echo json_encode([
        'success'         => true,
        'product'         => $riskLevel,
        'description'     => $description,
        'yesCount'        => $yesCount,
        'totalQuestions'  => $totalQuestions,
        'scorePercentage' => $scorePercentage,
        'emailSent'       => $emailSent,
    ]);

} catch (Exception $e) {
    error_log('Result-Form API Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>