import "./styles/Career.css";

const LocalExperience = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          Local <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Team Member</h4>
                <h5>Colonial Fresh</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Administered NATPOS POS system including product setup, pricing updates,
              tax configuration, and user access management. Generated and analysed
              sales, inventory, and performance reports to support operational decisions.
              Strengthened cultural adaptability by working in a diverse Australian team.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Retail Assistant</h4>
                <h5>Coles Supermarket</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Supported diverse customers with queries, demonstrating active listening,
              patience, and clear communication. Managed stock and coordinated with
              team members to maintain daily store operations. Gained first-hand
              experience in Australian workplace culture, adapting quickly to customer
              service and team collaboration standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalExperience;
