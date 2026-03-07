<?php
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
    $data = json_decode($input, true);
    
    if (!isset($data['answers']) || !isset($data['user'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        exit;
    }
    
    $answers = $data['answers'];
    $user = $data['user'];
    
    $filteredAnswers = array_filter($answers, function($answer) {
        return $answer !== null;
    });
    
    $yesCount = 0;
    foreach ($filteredAnswers as $answer) {
        if (strtolower($answer) === 'yes') {
            $yesCount++;
        }
    }
    
    $totalQuestions = count($filteredAnswers);
    $scorePercentage = round(($yesCount / $totalQuestions) * 100);
    
    // Calculate risk level
    $riskLevel = 'High Risk';
    $meaning = 'Immediate action needed';
    $riskDescription = "You're in the Red Zone. Your SAP system is at high risk of non-compliance.";
    
    if ($yesCount >= 12) {
        $riskLevel = 'Low Risk';
        $meaning = 'Well aligned with requirements';
        $riskDescription = "You're On the Right Track. Strengthen controls and evidence to close gaps.";
    } elseif ($yesCount >= 9) {
        $riskLevel = 'Moderate Risk';
        $meaning = 'Partial compliance';
        $riskDescription = "You're Making Progress. Your SAP setup is partially compliant.";
    }
    
    $description = "Score: {$scorePercentage}% | {$riskLevel}";
    
    $submission = array(
        'timestamp' => date('Y-m-d H:i:s'),
        'name' => $user['name'] ?? 'Unknown',
        'jobTitle' => $user['jobTitle'] ?? 'Unknown',
        'company' => $user['company'] ?? 'Unknown',
        'email' => $user['email'] ?? 'Unknown',
        'phone' => $user['phone'] ?? 'Unknown',
        'yesCount' => $yesCount,
        'totalQuestions' => $totalQuestions,
        'scorePercentage' => $scorePercentage,
        'riskLevel' => $riskLevel,
        'riskDescription' => $riskDescription,
    );
    
    @file_put_contents(__DIR__ . '/submissions.txt', json_encode($submission) . "\n", FILE_APPEND);
    
    // Send emails
    $emailSent = false;
    try {
        if (file_exists(__DIR__ . '/PHPMailer/PHPMailer.php')) {
            require __DIR__ . '/PHPMailer/Exception.php';
            require __DIR__ . '/PHPMailer/PHPMailer.php';
            require __DIR__ . '/PHPMailer/SMTP.php';
            
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;

            // IMPORTANT:
            // Authenticate as the primary account that OWNS the alias (social@togglenow.com)
            // and send From the alias (mca@togglenow.com).
            $mail->Username = 'social@togglenow.com'; // Google Workspace user that has mca@ as a verified alias
            $mail->Password = 'xsxq moqq ewze sins';  // App password for social@
            $mail->SMTPSecure = 'tls'; // use lowercase 'tls'
            $mail->Port = 587;
            $mail->SMTPDebug = 0;
            $mail->CharSet = 'UTF-8';

            // Prepare answer details
            $answersList = '';
            $qNum = 1;
            foreach ($answers as $answer) {
                if ($answer !== null) {
                    $answersList .= "Question{$qNum}: " . ucfirst($answer) . "\n";
                    $qNum++;
                }
            }
            
            // Email HTML Template for USER
            $emailHTML = "
                <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
                        .container { max-width: 650px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .header { background: #204ced; padding: 30px 20px; text-align: center; }
                        .header img { height: 45px; }
                        .content { padding: 40px 30px; }
                        .greeting { font-size: 16px; color: #333; margin-bottom: 20px; }
                        h2 { color: #204ced; font-size: 20px; margin: 25px 0 15px 0; font-weight: 600; }
                        p { color: #555; line-height: 1.8; margin-bottom: 15px; font-size: 15px; }
                        ul { margin: 15px 0; padding-left: 25px; }
                        ul li { color: #555; margin-bottom: 10px; line-height: 1.7; }
                        .highlight { background: #f0f7ff; border-left: 4px solid #204ced; padding: 15px 20px; margin: 20px 0; border-radius: 4px; }
                        .highlight strong { color: #204ced; }
                        .cta-section { text-align: center; margin: 35px 0; }
                        .cta-button { display: inline-block; background: #204ced; color: white; padding: 14px 35px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; }
                        .cta-button:hover { background: #1a3dbf; }
                        .footer { background: #f8f9fa; padding: 25px 30px; border-top: 1px solid #e0e0e0; }
                        .footer p { font-size: 14px; color: #666; margin: 5px 0; }
                        .signature { margin-top: 30px; font-size: 15px; color: #333; }
                        .signature strong { display: block; margin-bottom: 3px; }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <img src='https://togglenow.com/wp-content/uploads/2024/06/Tnow-white-logo-e1698911941985-1-1.png' alt='ToggleNow'>
                        </div>
                        <div class='content'>
                            <p class='greeting'><strong>Dear {$user['name']},</strong></p>
                            
                            <p>Thank you for taking the time to complete our <strong>15-point SAP MCA Audit Trail (Rule 11(g)) Readiness Assessment</strong>. Your participation demonstrates a strong commitment to <strong>data integrity, compliance, and corporate governance</strong> within your organization.</p>
                            
                            <p>As you are aware, under <strong>MCA Rule 11(g)</strong> of the <strong>Companies (Audit and Auditors) Rules, 2014</strong>, the <strong>company's management</strong>, including its <strong>finance leadership</strong>, is responsible for ensuring that a <strong>complete, tamper-proof audit trail</strong> of every financial transaction is maintained for at least <strong>eight financial years</strong>. This audit trail must be <strong>immutable</strong>, <strong>continuously active</strong>, and <strong>readily available</strong> for review during audits.</p>
                            
                            <h2>Why MCA Rule 11(g) Compliance Matters:</h2>
                            <ul>
                                <li>Ensures <strong>financial data transparency and traceability</strong> across SAP modules (FI, CO, MM, SD).</li>
                                <li>Strengthens <strong>internal controls and audit readiness</strong>, reducing risk of non-compliance.</li>
                                <li>Protects the organization from <strong>regulatory penalties</strong> and <strong>reputational damage</strong>.</li>
                                <li>Builds <strong>auditor confidence</strong> through reliable, unalterable records of change.</li>
                                <li>Reinforces <strong>management's fiduciary responsibility</strong> over financial reporting integrity.</li>
                            </ul>
                            
                            <h2>How ThreatSense AI MCAAT Helps You Stay Compliant:</h2>
                            <p>Our <strong>MCAAT (MCA Audit Trail) Solution</strong> is purpose-built to extend SAP's native logging capabilities and ensure full compliance by:</p>
                            <ul>
                                <li>Capturing and securing <strong>end-to-end audit trail data</strong> across both application and database levels.</li>
                                <li>Implementing <strong>tamper-evident controls</strong> and <strong>immutable storage</strong> for audit records.</li>
                                <li>Providing <strong>real-time monitoring and alerts</strong> for unauthorized changes.</li>
                                <li>Enabling <strong>automated reporting dashboards</strong> for Finance, IT, and Audit teams.</li>
                                <li>Supporting <strong>continuous compliance</strong> with MCA Rule 11(g) and broader ITGC frameworks.</li>
                            </ul>
                            
                            <div class='highlight'>
                                <p>As MCA enforcement continues to tighten, <strong>finance and IT leaders</strong> must work hand-in-hand to ensure that audit trails cannot be deactivated, modified, or deleted. Establishing visibility and control over financial data logging is not only a regulatory requirement — it's a <strong>core management responsibility</strong> tied directly to <strong>transparency, governance, and business trust</strong>.</p>
                            </div>
                            
                            <p>We would be delighted to review your assessment results with you and discuss how your organization can achieve <strong>complete MCA Rule 11(g) readiness</strong>.</p>
                            
                            <div class='cta-section'>
                                <a href='https://tidycal.com/togglenow/mca-audit-trail-11g' class='cta-button'>Schedule a Consultation</a>
                            </div>
                            
                            <div class='signature'>
                                <strong>Warm regards,</strong>
                                <strong>Team ToggleNow</strong>
                                <p>SAP Silver Partner | ISO/IEC 27001:2022 Certified Organization</p>
                            </div>
                        </div>
                        <div class='footer'>
                            <p><strong>ToggleNow</strong> - SAP Audit Trail & Compliance Solutions</p>
                            <p>Your responses remain confidential and are used solely for assessment purposes.</p>
                        </div>
                    </div>
                </body>
                </html>
            ";
            
            // ========== SEND TO USER (From alias mca@) ==========
            $mail->clearAllRecipients();
            $mail->setFrom('social@togglenow.com', 'ToggleNow MCA Team'); // visible From (alias)
            $mail->addReplyTo('social@togglenow.com', 'ToggleNow MCA Team'); // replies go to alias
            $mail->Sender = 'social@togglenow.com'; // envelope sender (Return-Path), may be overridden by Gmail
            $mail->addAddress($user['email'], $user['name'] ?? '');
            $mail->isHTML(true);
            $mail->Subject = 'Your SAP MCA Audit Trail Readiness Assessment Results';
            $mail->Body = $emailHTML;
            $mail->AltBody = strip_tags($emailHTML);
            $mail->send();
            
            // ========== SEND TO ADMIN (to the alias inbox with CC to team) ==========
            $mail->clearAddresses();
            $mail->clearCCs(); // Clear any previous CC addresses
            $mail->setFrom('social@togglenow.com', 'ToggleNow MCA Team'); // keep alias as From
            $mail->addReplyTo('social@togglenow.com', 'ToggleNow MCA Team');
            $mail->Sender = 'social@togglenow.com';
            
            // Primary recipient
            $mail->addAddress('social@togglenow.com', 'ToggleNow MCA Team');
            
            // Add CC recipients
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
                            <p><strong>Assessment:</strong> {$riskDescription}</p>
                        </div>
                        <h3>Detailed Answers:</h3>
                        <pre>{$answersList}</pre>
                    </div>
                </body>
                </html>
            ";
            
            $mail->Body = $adminEmailHTML;
            $mail->AltBody = strip_tags($adminEmailHTML);
            $mail->send();
            
            $emailSent = true;
        }
    } catch (Exception $e) {
        error_log('Email error: ' . $e->getMessage());
    }
    
    http_response_code(200);
    echo json_encode(array(
        'success' => true,
        'product' => $riskLevel,
        'description' => $description,
        'yesCount' => $yesCount,
        'totalQuestions' => $totalQuestions,
        'scorePercentage' => $scorePercentage,
        'emailSent' => $emailSent
    ));
    
} catch (Exception $e) {
    error_log('API Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>
