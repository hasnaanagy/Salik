import React from "react";
import "../../styles/Text.css";

const TextComponent = () => {
  return (
    <section className="stats-section">
      <div className="section-content">
        <h1 className="section-title">
          Challenging injustice to make the world a fairer place for one billion
          people
        </h1>
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">888</span>
            <span className="stat-label">cities</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">48</span>
            <span className="stat-label">countries</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">280</span>
            <span className="stat-label">million app downloads</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextComponent;
