import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuizContext } from '../context/QuizContext.jsx';

function QuizQuestion() {
  const { questions, answers, updateAnswer } = useContext(QuizContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(false);
  }, [id]);

  // Safe data access
  const questionsData = questions || [];
  const answersData = answers || [];

  if (!questionsData || !Array.isArray(questionsData) || questionsData.length === 0) {
    return (
      <div className="page-content">
        <div className="alert">
          <h4>Loading Questions...</h4>
          <p>Please wait while we load the quiz questions.</p>
        </div>
      </div>
    );
  }

  const currentIndex = parseInt(id) - 1;

  // Validate current index
  if (isNaN(currentIndex) || currentIndex < 0 || currentIndex >= questionsData.length) {
    return (
      <div className="page-content">
        <div className="alert">
          <h4>Invalid Question</h4>
          <p>This question doesn't exist. Please start from the beginning.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/')}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const question = questionsData[currentIndex];
  const selected = answersData ? answersData[currentIndex] : null;

  const handleSelect = (value) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Update answer in context
    if (updateAnswer) {
      updateAnswer(currentIndex, value);
    }
    
    // Navigate after animation
    setTimeout(() => {
      if (currentIndex + 1 < questionsData.length) {
        navigate(`/quiz/${currentIndex + 2}`);
      } else {
        navigate('/completion');
      }
    }, 400);
  };

  const handleSkip = () => {
    if (currentIndex + 1 < questionsData.length) {
      navigate(`/quiz/${currentIndex + 2}`);
    } else {
      navigate('/completion');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      navigate(`/quiz/${currentIndex}`);
    } else {
      navigate('/');
    }
  };

  // Calculate progress percentage safely
  const progressPercentage = Math.round(((currentIndex + 1) / questionsData.length) * 100);

  return (
    <div className="page-content">
      {/* Back Button */}
      <div className="back-button-container">
        <button className="btn-back" onClick={handleBack}>
          Back
        </button>
      </div>

      {/* Quiz Card */}
      <div className="card quiz-card-fixed">
        <div className="card-header">
          <div className="header-flex">
            <div className="category-flex">
              <span className="question-category">{question.category || 'General'}</span>
              <h4 className="question-number">
                Question {currentIndex + 1} of {questionsData.length}
              </h4>
            </div>
            <span className="badge">{progressPercentage}%</span>
          </div>
          <div className="progress">
            <div
              className="progress-bar"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="card-body">
          <div className="question-text-container">
            <h5 className="question-text">{question.text}</h5>
          </div>
          
          <div className="options-container">
            {question.options && question.options.map((option, idx) => (
              <button
                key={idx}
                className={`option-button ${selected === option.value ? 'selected' : ''} ${isAnimating ? 'disabled' : ''}`}
                onClick={() => handleSelect(option.value)}
                disabled={isAnimating}
              >
                <span className="option-icon">
                  {option.value === 'yes' ? '✓' : option.value === 'no' ? '✗' : '?'}
                </span>
                <span className="option-text">{option.text}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card-footer">
          <div className="footer-flex">
            <small>Select an option to proceed</small>
            <button 
              className="btn-skip" 
              onClick={handleSkip}
              disabled={isAnimating}
            >
              {isAnimating ? '...' : 'Skip'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizQuestion;