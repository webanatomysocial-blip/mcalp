import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-content">
      <div className="home-inner">
        <h1 className="main-heading">MCA Audit Trail Rule 11(g) Readiness</h1>
        <h2 className="sub-heading">Self-Check Quiz</h2>

        <div className="warning-box">
          <h3>99% Compliance = 100% Non-compliance</h3>
        </div>

        <div className="cta-section">
          <h2 className="cta-title">Avoid Penalties. Prove Compliance.</h2>
          <p className="cta-description">
            Take the MCA Audit-Trail Quiz and see where you stand.
          </p>
          <div className="cta-button">
             <button className="btn-primary-large" onClick={() => navigate('/quiz/1')}>
            Start the Quiz
          </button>
            <button className="link-button" onClick={() => navigate('/why-this-matters')}>
            Why This Matters?
          </button>
          </div>

          <p className="meta-text">Takes less than 3 minutes — no signup required.</p>
        </div>

        <div className="social-proof-box">
          <p>
            Over 500 companies have used this quiz to benchmark their audit trail readiness. 
            Don't fall behind — secure your compliance advantage.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
