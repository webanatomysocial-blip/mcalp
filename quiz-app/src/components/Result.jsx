import { useContext, useEffect, useState } from "react";
import { QuizContext } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";

function Result() {
  const { answers, questions, result } = useContext(QuizContext);
  const navigate = useNavigate();
  const [needleClass, setNeedleClass] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give time for context to load
    const timer = setTimeout(() => {
      setIsLoading(false);

      // Only redirect if no answers AND no result state after loading
      const hasAnswers =
        answers && answers.filter((a) => a !== null).length > 0;
      if (!hasAnswers && !result) {
        navigate("/", { replace: true });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [answers, result, navigate]);

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

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "quiz_completed",
      page: "/result",
    });
  }, []);

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
    // riskDescription =
    //   "Your audit trail has 3 critical gaps that expose you to regulatory penalties.";
    ctaText = "Get Gap-Closure Plan";
    badgeClass = "badge-low";
  } else if (yesCount >= 9) {
    riskMessage = "You're Making Progress.";
    // riskDescription =
    //   "Your audit trail has 3 critical gaps that expose you to regulatory penalties.";
    ctaText = "Get Compliance Help";
    badgeClass = "badge-medium";
  }

  const riskExplanations = {
    0: "The audit trail isn't fully switched on across your core SAP modules (FI, CO, MM, and SD) at both the application and database layer. This is the first thing your statutory auditor will look for. If it's not on, nothing else matters.",
    1: "Your change logs aren't capturing the full picture — who made the change, when they made it, and what kind of change it was. Without this, your audit trail can't answer the most basic question an auditor will ask.",
    2: "The controls to prevent someone from tampering with your logging configuration aren't in place. Anyone with the right SAP access could quietly turn off audit logging without detection.",
    3: "SAP Note 3042258 hasn't been fully implemented in your environment. The DDL and DML activity logging at the database layer is specifically what auditors are checking for in FY25.",
    4: "Your audit trail can be deleted or altered by an end user or administrator. A tamper-proof audit trail is a legal requirement under MCA Rule 11(g).",
    5: "Your logs and change documents aren't being retained for the full eight financial years required by regulation.",
    6: "Field-level changes at the database layer (vendor, customer, GL, cost center, asset master, PO, invoice) aren't being captured with before and after values.",
    7: "There's no verified control preventing someone from switching off the audit trail and no alert if it happens.",
    8: "Tamper-evident controls at the database layer haven't been validated. There's no proof your audit trail hasn't been modified.",
    9: "Audit logs and change documents aren't being periodically reviewed as part of governance or audit processes.",
    10: "If you're on Rise with SAP, log backups aren't being taken regularly and cloud log retention limitations may not meet the eight-year MCA requirement.",
    11: "Your backup and recovery process doesn't include SAP change logs and database audit logs.",
    12: "Finance and SAP teams haven't been trained on MCA Rule 11(g) compliance requirements.",
    13: "There is no report available for finance or audit teams to independently review database audit trail data.",
    14: "You haven't aligned with your statutory auditor on the interpretation of MCA Rule 11(g) requirements.",
  };

  const identifiedGaps = [];
  answers.forEach((answer, index) => {
    if (answer === "no") {
      identifiedGaps.push({
        number: index + 1,
        explanation: riskExplanations[index],
        questionText: questions[index].text,
      });
    }
  });


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

        <div className="compliance-gaps-section">
          <h3 className="section-title">Potential Compliance Risk Areas</h3>
          {identifiedGaps.length > 0 ? (
            <div className="gaps-container">
              {identifiedGaps.map((gap, idx) => (
                <div key={idx} className="gap-card stagger-in">
                  <div className="gap-card-header">
                    <span className="gap-label">Risk Area {gap.number}</span>
                  </div>
                  <div className="gap-card-body">
                    <p className="gap-explanation">{gap.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-gaps-message">
              <span className="success-icon">✅</span>
              <p>
                Great news — no compliance gaps were detected in your responses.
              </p>
            </div>
          )}
        </div>

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
