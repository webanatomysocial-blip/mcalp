import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { QuizContext } from "./context/QuizContext.jsx";
import { questions } from "./data/questions.js";
import MainLayout from "./components/MainLayout.jsx";
import Home from "./components/Home.jsx";
import WhyThisMatters from "./components/WhyThisMatters.jsx";
import QuizQuestion from "./components/QuizQuestion.jsx";
import Completion from "./components/Completion.jsx";
import UserForm from "./components/UserForm.jsx";
import Result from "./components/Result.jsx";
import ViewAnswers from "./components/ViewAnswers.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
// import ViewAnswers from './components/ViewAnswers.jsx';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Push page view to GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      page_path: location.pathname,
      page_title: document.title,
    });
  }, [location]);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [result, setResult] = useState(null);

  const updateAnswer = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const submitQuiz = async (userData) => {
    // Standardize data payload
    const yesCount = answers.filter(
      (a) => a && a.toLowerCase() === "yes",
    ).length;
    const totalQuestions = answers.filter((a) => a !== null).length;
    const scorePercentage =
      totalQuestions > 0 ? Math.round((yesCount / totalQuestions) * 100) : 0;

    const payload = {
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      company: userData.company || "",
      message: userData.message || "",
      jobTitle: userData.jobTitle || "",
      score: scorePercentage,
      answers: answers,
    };

    console.log("Submitting quiz with payload:", payload);

    try {
      // Send to PHP API (which also forwards to Zapier server-side)
      console.log("Starting API submission...");
      // Make sure this points to your API server running locally
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const response = await fetch(`${API_BASE_URL}/api.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const responseText = await response.text();
      console.log("Response text:", responseText);

      let resultData;
      try {
        resultData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Response was:", responseText);
        throw new Error("Invalid JSON response from server");
      }

      console.log("Parsed result:", resultData);

      if (resultData.success) {
        // Set result state BEFORE redirecting
        setResult(resultData);
        console.log("Result set successfully");

        // Return success so UserForm can handle navigation
        return { success: true, data: resultData };
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      throw error;
    }
  };

  const resetQuiz = () => {
    setAnswers(Array(questions.length).fill(null));
    setResult(null);
  };

  const contextValue = {
    questions,
    answers,
    updateAnswer,
    submitQuiz,
    result,
    resetQuiz,
  };

  return (
    <QuizContext.Provider value={contextValue}>
      <ErrorBoundary>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/why-this-matters" element={<WhyThisMatters />} />
            <Route path="/quiz/:id" element={<QuizQuestion />} />
            <Route path="/completion" element={<Completion />} />
            <Route path="/form" element={<UserForm />} />
            <Route path="/result" element={<Result />} />
            <Route path="/view-answers" element={<ViewAnswers />} />
            {/* <Route path="/view-answers" element={<ViewAnswers />} /> */}
          </Route>
        </Routes>
      </ErrorBoundary>
    </QuizContext.Provider>
  );
}

export default App;
