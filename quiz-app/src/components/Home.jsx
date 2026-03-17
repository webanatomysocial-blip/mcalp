import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Home() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* for desktop */}
      {!isMobile && (
        <div className="home-content">
          <div className="home-inner">
            <h1 className="main-heading">
              MCA Rule 11(g) Is Now an Audit Requirement — Is Your SAP Ready?
            </h1>

            <div className="warning-box">
              <h3>99% Compliance = 100% Non-compliance</h3>
            </div>

            <div className="cta-section">
              <h2 className="cta-title">Avoid Penalties. Prove Compliance.</h2>
              <p className="cta-description">
                Identify Your MCA Audit-Trail Compliance Risk in Minutes.
              </p>
              <div className="cta-button">
                <button
                  className="btn-primary-large"
                  onClick={() => navigate("/quiz/1")}
                >
                  Start the Assessment
                </button>
                <button
                  className="link-button"
                  onClick={() => navigate("/why-this-matters")}
                >
                  Why This Matters?
                </button>
              </div>

              <p className="meta-text">
                Takes less than 3 minutes — no signup required.
              </p>
            </div>

            <div className="social-proof-box">
              <p>
                Over 500 companies have used this quiz to benchmark their audit
                trail readiness. Don't fall behind — secure your compliance
                advantage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* for mobile */}
      {isMobile && (
        <div className="home-content">
          <div className="home-inner">
            <h1 className="main-heading" style={{ fontSize: "1.67rem" }}>
              Is your SAP ready for the MCA Rule 11(g) audit?
            </h1>
            <p className="cta-description">
              Takes 2 minutes · Used by 500+ listed companies
            </p>
            <div className="cta-button">
              <button
                className="btn-primary-large"
                onClick={() => navigate("/quiz/1")}
              >
                Start the Assessment
              </button>
              <button
                className="link-button"
                onClick={() => navigate("/why-this-matters")}
              >
                Why This Matters?
              </button>
            </div>
            <div className="warning-box">
              <h3>99% Compliance = 100% Non-compliance</h3>
            </div>

            <div className="cta-section">
              <h2 className="cta-title" style={{ fontSize: "1.37rem" }}>
                Avoid Penalties. Prove Compliance.
              </h2>

              <p className="meta-text">
                No signup required anywhere else.
              </p>
            </div>

            <div className="social-proof-box">
              <p>
                Over 500 companies have used this quiz to benchmark their audit
                trail readiness. Don't fall behind — secure your compliance
                advantage.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
