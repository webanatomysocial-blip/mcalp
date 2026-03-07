import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../context/QuizContext.jsx';

function UserForm() {
  const navigate = useNavigate();
  const { submitQuiz } = useContext(QuizContext);
  const [userData, setUserData] = useState({ 
    name: '', 
    jobTitle: '',
    company: '',
    email: '', 
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    
    if (submitError) setSubmitError('');
    
    if (name === 'email') {
      validateEmail(value);
    }
  };

  const validateEmail = (email) => {
    const lowerEmail = email.toLowerCase();
    const blockedDomains = ['gmail.com', 'yahoo.com', 'yahoo.co.in', 'googlemail.com'];
    
    const domain = lowerEmail.split('@')[1];
    
    if (domain && blockedDomains.includes(domain)) {
      setEmailError('Please use your corporate/work email address. Gmail and Yahoo are not accepted.');
      return false;
    }
    
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSubmitError('');
    
    if (!validateEmail(userData.email)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Starting form submission...');
      
      const result = await submitQuiz(userData);
      
      console.log('Submit successful, result:', result);
      
      if (result && result.success) {
        console.log('Navigating to result page...');
        
        // Navigate with state indicator
        navigate('/result', { 
          replace: true,
          state: { fromForm: true }
        });
      } else {
        throw new Error('Submission failed - no success flag');
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      setSubmitError('Error submitting form. Please check your connection and try again.');
    }
  };

  return (
    <div className="form-page">
      <div className="back-button-container">
        <button
          className="btn-back"
          type="button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
      
      <div className="form-container-page">
        <div className="card shadow-lg">
          <div className="card-header text-center">
            <h4 className="mb-0">Get Your Results</h4>
          </div>
          <div className="card-body">
            <p className="text-center mb-4">Enter your details to receive your compliance report and checklist via email</p>
            
            {submitError && (
              <div className="alert alert-danger" role="alert">
                {submitError}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div>
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input 
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="jobTitle" className="form-label">Job Title</label>
                  <input 
                    type="text"
                    className="form-control"
                    id="jobTitle"
                    name="jobTitle"
                    value={userData.jobTitle}
                    onChange={handleChange}
                    placeholder="e.g., SAP Manager"
                    required
                  />
                </div>
              </div>
              <div className="form-row-single">
                <div>
                  <label htmlFor="company" className="form-label">Company Name</label>
                  <input 
                    type="text"
                    className="form-control"
                    id="company"
                    name="company"
                    value={userData.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label htmlFor="email" className="form-label">Work Email</label>
                  <input 
                    type="email"
                    className={`form-control ${emailError ? 'form-control-error' : ''}`}
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="your.email@company.com"
                    required
                  />
                  {emailError && (
                    <small className="form-error-text">{emailError}</small>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="form-label">Work Phone</label>
                  <input 
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={isSubmitting || emailError}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sending...
                  </>
                ) : (
                  <>Send My Results</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserForm;
