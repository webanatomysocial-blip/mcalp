import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../context/QuizContext.jsx";

function ResultForm() {
  const navigate = useNavigate();
  const { answers } = useContext(QuizContext);

  const [userData, setUserData] = useState({
    name: "",
    jobTitle: "",
    company: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const API_URL = "https://mcalp.togglenow.com//api/api-result.php";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((p) => ({ ...p, [name]: value }));
    if (submitError) setSubmitError("");
    if (name === "email") validateEmail(value);
  };

  const blocked = ["gmail.com", "yahoo.com", "yahoo.co.in", "googlemail.com"];
  const validateEmail = (email) => {
    const domain = email.toLowerCase().split("@")[1];
    if (domain && blocked.includes(domain)) {
      setEmailError("Please use your corporate/work email.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validateEmail(userData.email)) return;

    setIsSubmitting(true);
    try {
      const payload = { answers, user: userData };
      console.log("Sending payload:", payload); // DEBUG

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", res.status); // DEBUG

      const text = await res.text();
      console.log("Raw response:", text); // SEE EXACT SERVER OUTPUT

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.error("JSON parse failed:", parseErr, "Raw:", text);
        throw new Error("Invalid JSON from server");
      }

      console.log("Parsed data:", data); // FINAL CHECK

      if (data.success) {
        // SUCCESS → REDIRECT
        console.log("Redirecting to /result");
        navigate("/result", { replace: true });
      } else {
        throw new Error(data.error || "Submission failed");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError("Failed to submit. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <div className="back-button-container">
        <button className="btn-back" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <div className="form-container-page">
        <div className="card shadow-lg">
          <div className="card-header text-center">
            <h4>Submit to View Answers</h4>
          </div>
          <div className="card-body">
            <p className="text-center mb-4">
              Enter your details to unlock your full answer summary.
            </p>

            {submitError && (
              <div className="alert alert-danger">{submitError}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Job Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="jobTitle"
                    value={userData.jobTitle}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row-single">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="company"
                  value={userData.company}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row-single">
                <label className="form-label">Work Email *</label>
                <input
                  type="email"
                  className={`form-control ${emailError ? "form-control-error" : ""}`}
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                />
                {emailError && (
                  <small className="form-error-text">{emailError}</small>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={isSubmitting || emailError}
              >
                {isSubmitting ? "Submitting…" : "View My Answers"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultForm;
