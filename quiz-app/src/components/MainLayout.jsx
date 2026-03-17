import { Outlet } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

function MainLayout() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const testimonials = useMemo(
    () => [
      {
        text: "ToggleNow helped us achieve 100% MCA compliance in just 3 weeks. Their expertise in SAP audit trails is unmatched.",
        name: "CFO, Information Technology",
      },
      {
        text: "The audit trail quiz immediately identified our compliance gaps. Highly recommend for any SAP user concerned about MCA rules.",
        name: "IT Director, Leading FMCG Company",
      },
      {
        text: "Professional, quick, and thorough. ToggleNow's solution saved us from potential penalties and audit issues.",
        name: "SAP Manager, Petrochemical company",
      },
    ],
    [],
  );

  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Testimonials component
  const TestimonialsSection = () => (
    <>
      <div className="testimonials-container">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`testimonial-card ${index === activeTestimonial ? "active" : ""}`}
          >
            <div className="stars">★★★★★</div>
            <p className="testimonial-text">{testimonial.text}</p>
            <div className="testimonial-author">
              <div className="author-info">
                <h4>{testimonial.name}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="testimonial-dots">
        {testimonials.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === activeTestimonial ? "active" : ""}`}
            onClick={() => setActiveTestimonial(index)}
          ></span>
        ))}
      </div>
    </>
  );

  return (
    <div className="split-layout">
      {/* DESKTOP SIDEBAR - Only show when NOT mobile */}
      {!isMobile && (
        <aside className="sidebar-left">
          <div className="sidebar-content">
            <div className="sidebar-logo">
              <a
                href="https://togglenow.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://mcalp.togglenow.com/togglenow.png"
                  alt="ToggleNow"
                />
              </a>
            </div>

            <div className="sidebar-tagline">
              <h2>Join 500+ companies ensuring MCA audit trail readiness</h2>
            </div>

            <TestimonialsSection />

            <div className="sidebar-footer">
              <p>
                This quiz is created by{" "}
                <a
                  className="mainlink"
                  href="https://togglenow.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ToggleNow
                </a>{" "}
                specialists to help you assess SAP audit trail readiness for MCA
                compliance.
              </p>
              <p>
                Your responses remain confidential and are used only to generate
                your personalized report.
              </p>
            </div>
          </div>
        </aside>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="content-right">
        {/* MOBILE HEADER - Show on ALL mobile pages */}
         {isMobile && (
          <div className="mobile-header">
            <div className="mobile-header-content">
              <div className="sidebar-logo">
                <a
                  href="https://togglenow.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://mcalp.togglenow.com/togglenow.png"
                    alt="ToggleNow"
                  />
                </a>
              </div>

              
            </div>
          </div>
        )}

        {/* PAGE CONTENT */}
        <div className="content-wrapper">
          <Outlet />
        </div>

        {/* MOBILE REVIEWS & FOOTER - Show on ALL mobile pages */}
        {isMobile && (
          <div className="mobile-reviews-section">
            <h3 className="mobile-reviews-title">What Our Clients Say</h3>

            <TestimonialsSection />

            <div className="mobile-reviews-footer">
              <p>
                This quiz is created by{" "}
                <a
                  className="mainlink"
                  href="https://togglenow.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ToggleNow
                </a>{" "}
                specialists to help you assess SAP audit trail readiness for MCA
                compliance.
              </p>
              <p>
                Your responses remain confidential and are used only to generate
                your personalized report.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default MainLayout;
