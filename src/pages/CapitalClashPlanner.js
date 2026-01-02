import React from 'react';
import '../styles/CapitalClashPlanner.css';

const CapitalClashPlanner = ({ onAdminClick, onAboutClick }) => {
  return (
    <div className="capital-clash-planner">
      <div className="coming-soon">
        <h2>🏰 Capital Clash Strategy Planner</h2>
        <p>Coming Soon!</p>
        <p>Strategy planning tool for Capital Clash events</p>
        <button onClick={onAdminClick} className="coming-soon-btn">← Back</button>
      </div>
    </div>
  );
};

export default CapitalClashPlanner;
