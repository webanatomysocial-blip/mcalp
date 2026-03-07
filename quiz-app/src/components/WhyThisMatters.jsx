import { useNavigate } from 'react-router-dom';

function WhyThisMatters() {
  const navigate = useNavigate();

  return (
    <div className="page-content">
      <div className="why-matters-container">
        <div className="card">
          <div className="card-header text-center">
            <h2>Why This Matters?</h2>
          </div>
          
          <div className="card-body">
            <div className="why-matters-content">
              <p>
                Under the <strong>Companies (Accounts) Rules, 2021 (MCA Mandate)</strong>, 
                Indian companies using ERP systems like SAP must enable tamper-proof audit trails 
                for all financial data changes.
              </p>
              
              <p>
                Non-compliance can lead to <strong>penalties, auditor red flags, and reputational risks</strong>.
              </p>
              
              <p>
                This <strong>15-question quiz</strong> helps you quickly evaluate your organization's 
                readiness level—from basic configuration to full MCA compliance.
              </p>

              <div className="benefits-section-content">
                <h3>What you'll get:</h3>
                <ul className="benefits-list-content">
                  <li>A quick scorecard on your MCA audit-trail compliance level</li>
                  <li>Personalized recommendations based on your answers</li>
                  <li>A summary you can share with your IT/Finance teams</li>
                  <li>Optional free checklist template to track improvements</li>
                </ul>
              </div>

              <div className="action-buttons">
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/quiz/1')}>
                  Start Quiz Now
                </button>
                <button className="btn btn-secondary btn-lg" onClick={() => navigate('/')}>
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhyThisMatters;
