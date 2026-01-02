import React from 'react';
import '../styles/AvABusterPlanner.css';

const AvABusterPlanner = ({ onAdminClick, onAboutClick }) => {
  return (
    <div className="ava-buster-planner">
      <div className="coming-soon">
        <h2>💥 AvA Buster Day Strategy</h2>
        <p>Coming Soon!</p>
        <p>Strategy planning tool for AvA Buster Day events</p>
        <button onClick={onAdminClick} className="coming-soon-btn">← Back</button>
      </div>
    </div>
  );
};

export default AvABusterPlanner;
