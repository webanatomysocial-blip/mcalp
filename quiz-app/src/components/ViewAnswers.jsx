import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../context/QuizContext';

function ViewAnswers() {
  const { questions, answers } = useContext(QuizContext);
  const navigate = useNavigate();

  // "Why it matters?" content for each question
  const whyItMatters = [
    // Question 1
    "Yes, the SAP system's audit trail (change log) must be enabled for all key modules – FI, CO, MM, and SD – at both application and database levels to comply with MCA Rule 11(g). This rule mandates that every transaction or change in accounting records is captured with date, time, and user details, preserved in an unalterable audit trail, and retained for at least eight years. Activating it ensures data integrity, traceability, and accountability, fulfilling statutory and audit compliance requirements under the Companies (Accounts) Rules, 2014.",
    
    // Question 2
    "This is a critical compliance checkpoint under MCA Audit Trail Rule 11(g). Without proper configuration, your organization risks data integrity gaps, regulatory non-compliance, and audit failures. Enabling detailed change logs ensures complete traceability, accountability, and tamper-proof financial records – key foundations for strong internal controls and governance readiness.",
    
    // Question 3
    "This is vital to ensure that audit settings remain tamper-proof and compliant with MCA Rule 11(g). Without proper access restrictions, users with elevated privileges could disable or alter logs, leading to loss of accountability, regulatory breaches, and audit non-conformance. For example: Access to SE16N must be restricted to specific tables. Enforcing role-based access, change approvals, and periodic reviews safeguards the integrity and reliability of your financial records.",
    
    // Question 4
    "This SAP Note is essential for meeting the MCA Audit Trail (Rule 11(g)) requirements – it ensures that every data definition (DDL) and data manipulation (DML) action is captured, timestamped, and linked to the user ID. Without full implementation, your system may fail to provide a complete, tamper-proof audit trail, exposing your organization to compliance risks, data integrity issues, and potential audit observations. Enabling all prescribed steps strengthens transparency, traceability, and regulatory readiness across your SAP landscape.",
    
    // Question 5
    "This is a critical compliance and governance requirement under MCA Rule 11(g). The audit trail must remain immutable and tamper-proof, ensuring that every financial change remains fully traceable and verifiable. If users or admins can modify or delete log data, it undermines data integrity, accountability, and regulatory compliance. Implementing restricted authorizations, system-enforced retention, and database-level protection ensures that your SAP audit trail remains a trusted and legally defensible record.",
    
    // Question 6
    "Organizations must ensure that all financial transaction logs, change histories, and system audit records are securely preserved for a minimum of eight years in a non-editable and retrievable format. Having a defined data retention and archival process not only ensures regulatory compliance, but also strengthens data governance, supports forensic investigations, and builds auditor confidence in the reliability of your SAP environment.",
    
    // Question 7
    "While SAP standard configuration captures these details at the application layer (via tables like CDHDR/CDPOS), it does not natively log all DDL/DML activities at the database layer. To achieve full audit trail compliance under MCA Rule 11(g), enterprises should enable the relevant configurations in SAP Note 3042258 and consider solutions like ThreatSense AI MCAAT. Such tools enhance real-time monitoring, tamper detection, and deep database-level logging, ensuring end-to-end data integrity and regulatory readiness.",
    
    // Question 8
    "Audit trails must remain immutable and always active – even administrators should not be able to turn them off without detection. Implementing restricted authorizations, system alerts, and automated notifications (e.g., via tools like ThreatSense) ensures that any attempt to modify or disable logging is immediately flagged, thereby safeguarding data integrity, transparency, and audit readiness.",
    
    // Question 9
    "This is essential to ensure integrity and authenticity of financial records as mandated by MCA Rule 11(g). Audit trail data must be immutable, with mechanisms in place to detect and alert any unauthorized modification attempts. Organizations should enforce database-level write protection, encryption, and checksum or hash validation, along with real-time monitoring tools such as ThreatSense AI MCAAT, to make the audit trail tamper-evident. These controls strengthen trust, compliance, and forensic reliability of your SAP environment.",
    
    // Question 10
    "Regular review of audit logs is a key MCA Rule 11(g) and ITGC (IT General Controls) requirement. It ensures that unauthorized or suspicious changes in financial and master data are identified, investigated, and remediated promptly. Establishing a formal monitoring cadence, supported by automated alerts or solutions like ThreatSense AI, helps maintain continuous compliance, data integrity, and audit transparency across your SAP landscape.",
    
    // Question 11
    "If you are on SAP Cloud (RISE with SAP), are you taking log backups periodically, and are you aware of the limitations of log availability in SAP-managed cloud environments? In RISE with SAP, system and database administration – including log retention and backup policies – is largely managed by SAP. However, customers remain responsible for compliance under MCA Rule 11(g). While log backups (such as HANA redo logs) are maintained by SAP, access duration is limited, and older logs may not be retrievable beyond the default retention window. To ensure continuous audit readiness, enterprises should: Understand SAP's default log retention and backup policy. Periodically download or archive audit logs before they expire. Implement complementary monitoring tools (like ThreatSense AI) for extended retention, tamper detection, and independent log preservation. This ensures traceability, compliance, and data recovery capability, even within cloud-managed SAP landscapes.",
    
    // Question 12
    "Ensuring these are part of regular backups is essential for MCA Rule 11(g) compliance and for maintaining a complete, tamper-proof audit trail. Backups should cover not only transactional and master data but also change document tables (CDHDR/CDPOS) and database-level audit logs, with periodic validation to confirm they can be restored when needed. Retention policies must align with the eight-year statutory requirement, and audit data should be securely stored in immutable or offsite locations to preserve integrity, continuity, and regulatory readiness.",
    
    // Question 13
    "Awareness and understanding of this rule are crucial to ensure that audit trail configurations, retention policies, and access controls are correctly implemented and maintained. Trained teams can better identify compliance gaps, interpret audit logs, and respond effectively to audit requirements. Regular education sessions and refresher training help build a compliance-focused culture, ensuring data integrity, accountability, and continuous regulatory readiness across the organization.",
    
    // Question 14
    "Having such visibility is essential for MCA Rule 11(g) compliance, ensuring that all financial data changes – including who made them and when – are readily accessible and reviewable. A structured reporting mechanism enables timely monitoring, exception detection, and audit readiness, reducing dependence on technical teams. Integrating audit trail data into periodic compliance reviews helps maintain transparency, control, and confidence in your organization's financial systems.",
    
    // Question 15
    "Early collaboration ensures that your audit trail configurations, log retention practices, and control mechanisms are fully compliant and audit-ready. Discussing the technical setup, evidence formats, and review processes with auditors helps avoid surprises during statutory audits, ensures that your SAP logs meet regulatory and evidentiary standards, and reinforces transparency, governance, and trust in your financial reporting process."
  ];

  if (!answers || answers.filter(a => a !== null).length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="view-answers-page">
      <div className="answers-container">
        <div className="card shadow-lg">
          <div className="card-header text-center">
            <h2 className="mb-0">Your Answers</h2>
          </div>
          <div className="card-body">
            <div className="answers-list">
              {questions.map((question, index) => (
                <div key={index} className="answer-item">
                  <div className="answer-header">
                    <span className="question-number">Question {index + 1}</span>
                    <span className="question-category-badge">{question.category}</span>
                  </div>
                  <p className="answer-question">{question.text}</p>
                  <div className={`answer-response ${answers[index] === 'yes' ? 'answer-yes' : answers[index] === 'no' ? 'answer-no' : 'answer-skipped'}`}>
                    <span className="answer-icon">
                      {answers[index] === 'yes' ? '✓' : answers[index] === 'no' ? '✗' : '-'}
                    </span>
                    <span className="answer-text">
                      {answers[index] === 'yes' ? 'Yes' : answers[index] === 'no' ? 'No' : 'Skipped'}
                    </span>
                  </div>

                  {/* Why it matters section - Always visible */}
                  <div className="why-it-matters-box">
                    <div className="why-it-matters-header">
                      <h4 className="why-title">Why it matters?</h4>
                    </div>
                    <p className="why-content">{whyItMatters[index]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card-footer text-center">
            <button className="btn btn-primary" onClick={() => navigate('/result')}>
              Back to Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewAnswers;
