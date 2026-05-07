import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Technical Lead</h4>
                <h5>Gopher Industries – Capstone Project</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Serving as a key communication bridge between academic mentors and
              industry guests, aligning requirements and project outcomes with
              real-world needs. Implemented Cypress end-to-end testing for backend
              functionality, deployed CORS-configured APIs, and reviewed Git pull
              requests across multiple teams to maintain code quality and
              integration standards.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Software Developer</h4>
                <h5>Indian Space Research Organisation (ISRO)</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Collaborated with scientists and engineers on satellite data analysis
              projects. Designed an ML-driven Python application using PyQt to
              process and visualise interferograms, improving workflow efficiency
              by ~25%. Applied data analysis techniques to manage complex scientific
              datasets and presented progress in weekly review meetings.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>React Developer</h4>
                <h5>InfoLabz</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Developed responsive React.js components for client-facing web
              applications. Integrated REST APIs for real-time data exchange and
              improved performance. Participated in Agile sprints, stand-ups,
              peer code reviews, and contributed to usability improvements based
              on business and user requirements.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Career;
