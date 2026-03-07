import { useContext, useEffect, useState } from "react";
import { QuizContext } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";

function Result() {
  const { answers, questions } = useContext(QuizContext);
  const navigate = useNavigate();
  const [needleClass, setNeedleClass] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give time for context to load
    const timer = setTimeout(() => {
      setIsLoading(false);

      // Only redirect if no answers after loading
      if (!answers || answers.filter((a) => a !== null).length === 0) {
        navigate("/", { replace: true });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [answers, navigate]);

  useEffect(() => {
    if (answers && answers.length > 0) {
      setTimeout(() => {
        const yesCount = answers.filter((answer) => answer === "yes").length;
        if (yesCount >= 12) {
          setNeedleClass("risk-low");
        } else if (yesCount >= 9) {
          setNeedleClass("risk-medium");
        } else {
          setNeedleClass("risk-high");
        }
      }, 500);
    }
  }, [answers]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="page-content">
        <div className="result-content">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p style={{ marginTop: "1rem" }}>Loading your results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!answers || answers.filter((a) => a !== null).length === 0) {
    return null;
  }

  const yesCount = answers.filter((answer) => answer === "yes").length;
  const totalQuestions = questions.length;
  const scorePercentage = Math.round((yesCount / totalQuestions) * 100);

  let riskMessage = "You're in the Red Zone.";
  let riskDescription =
    "Your audit trail has 3 critical gaps that expose you to regulatory penalties.";
  let ctaText = "Get Gap-Closure Plan";
  let ctaLink = "https://tidycal.com/togglenow/mca-audit-trail-11g";
  let ctaLink1 = "https://mcalp.togglenow.com/MCA-Deck.pdf";
  let badgeClass = "badge-high";

  if (yesCount >= 12) {
    riskMessage = "You're On the Right Track.";
    riskDescription =
      "Your audit trail has 3 critical gaps that expose you to regulatory penalties.";
    ctaText = "Get Gap-Closure Plan";
    badgeClass = "badge-low";
  } else if (yesCount >= 9) {
    riskMessage = "You're Making Progress.";
    riskDescription =
      "Your audit trail has 3 critical gaps that expose you to regulatory penalties.";
    ctaText = "Get Compliance Help";
    badgeClass = "badge-medium";
  }

  const failedControls = questions.filter(
    (_, index) => answers[index] === "no",
  );

  return (
    <div className="page-content">
      <div className="result-content">
        <div className="results-badge-container">
          <span className="results-badge">RESULTS</span>
        </div>

        <div className="score-badge-container">
          <div className={`score-badge ${badgeClass}`}>
            <span className="score-text">Score: {scorePercentage}%</span>
          </div>
        </div>

        <h1 className="result-title">{riskMessage}</h1>
        <p className="result-subtitle">{riskDescription}</p>

        {failedControls.length > 0 && (
          <div className="failed-controls-section">
            <h3 className="failed-controls-title">Specific Gaps Identified:</h3>
            <ul className="failed-controls-list">
              {failedControls.map((q, idx) => (
                <li key={idx} className="failed-control-item">
                  <span className="failed-icon">✗</span> {q.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="riskometer-section">
          <div className="riskometer-wrapper">
            <svg
              className="riskometer-svg"
              viewBox="0 0 200 110"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="riskGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "#00d084", stopOpacity: 1 }}
                  />
                  <stop
                    offset="50%"
                    style={{ stopColor: "#ffc107", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#ff4444", stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>

              <path
                d="M 15 100 A 85 85 0 0 1 185 100"
                fill="none"
                stroke="#e8e8e8"
                strokeWidth="30"
                strokeLinecap="round"
              />

              <path
                d="M 15 100 A 85 85 0 0 1 185 100"
                fill="none"
                stroke="url(#riskGradient)"
                strokeWidth="30"
                strokeLinecap="round"
              />
            </svg>

            <div className={`gauge-needle ${needleClass}`}></div>
            <div className="gauge-center-dot"></div>

            <div className="gauge-labels-bottom">
              <span
                className={`gauge-label ${needleClass === "risk-low" ? "active" : ""}`}
              >
                LOW
              </span>
              <span
                className={`gauge-label ${needleClass === "risk-medium" ? "active" : ""}`}
              >
                MODERATE
              </span>
              <span
                className={`gauge-label ${needleClass === "risk-high" ? "active" : ""}`}
              >
                HIGH
              </span>
            </div>
          </div>
        </div>

        <p className="social-proof-result">
          Over 500 companies have used this quiz to benchmark their audit trail
          readiness.
        </p>

        <div className="result-actions-grid">
          <a
            href={ctaLink1}
            className="cta-button-result primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {ctaText}
          </a>
          <a
            href={ctaLink}
            className="cta-button-result secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book 15-min Review
          </a>
        </div>

        <div className="additional-actions">
          <button className="action-button" onClick={() => navigate("/")}>
            Retake Quiz
          </button>
          <button
            className="action-button"
            onClick={() => navigate("/view-answers")}
          >
            View My Answers
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;
