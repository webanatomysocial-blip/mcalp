import { useNavigate } from "react-router-dom";

function Completion() {
  const navigate = useNavigate();

  return (
    <div className="page-content">
      {/* Back Button */}
      <div className="back-button-container">
        <button
          className="btn-back"
          type="button"
          onClick={() => navigate(-1)} // Navigates to previous page
        >
          Back
        </button>
      </div>
      <div className="completion-container">
        <div className="card card-bg completion-card">
          <div className="card-body card-bg text-center">
            <h2 className="card-title">Quiz Completed!</h2>
            <p className="completion-text">
              You've answered all 15 questions. Your MCA audit trail readiness
              assessment is ready.
            </p>
            <div className="completion-actions">
              <button
                className="btn btn-primary btn-lg completion-btn"
                onClick={() => navigate("/form")}
              >
                Send me the results & checklist
              </button>
            </div>
            <p className="completion-note">
              Get the full report with personalized recommendations sent to your
              email, or view your results immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Completion;
