import React, { useState, useRef, useEffect } from 'react';
import './StrategyPlanner.css';

const TEAMS = {
  A: { label: 'Team A - Enemy Hospital', color: '#FF6B6B', description: 'Frontline Strike' },
  B: { label: 'Team B - Our Hospital', color: '#4ECDC4', description: 'Defensive Command' },
  C: { label: 'Team C - Captain Side', color: '#FFE66D', description: 'Captain Squadron' },
  D: { label: 'Team D - Military Centers', color: '#95E1D3', description: 'Resource Squad' }
};

const OBJECTIVES = {
  'enemy-hospital': { x: 150, y: 150, label: 'Enemy Hospital', color: '#FF6B6B', team: 'A' },
  'our-hospital': { x: 850, y: 850, label: 'Our Hospital', color: '#4ECDC4', team: 'B' },
  'captain': { x: 850, y: 150, label: 'Canyon Captain', color: '#FFE66D', team: 'C' },
  'military': { x: 150, y: 850, label: 'Military Centers', color: '#95E1D3', team: 'D' },
  'energy-core': { x: 500, y: 500, label: 'Energy Core/Beacon', color: '#FFA500', team: 'ALL' }
};

function StrategyPlanner() {
  const canvasRef = useRef(null);
  const [selectedTeam, setSelectedTeam] = useState('A');
  const [markings, setMarkings] = useState([]);
  const [schedule, setSchedule] = useState({
    A: { startTime: '00:00', description: 'Teleport to enemy hospital' },
    B: { startTime: '00:00', description: 'Hold defensive position' },
    C: { startTime: '02:00', description: 'Move to Captain side' },
    D: { startTime: '02:00', description: 'Capture military centers' }
  });
  const [viewMode, setViewMode] = useState('strategy'); // 'strategy' or 'schedule'

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw objectives
    Object.entries(OBJECTIVES).forEach(([key, obj]) => {
      ctx.fillStyle = obj.color;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(obj.label, obj.x, obj.y + 35);
    });

    // Draw markings
    markings.forEach((marking) => {
      const teamColor = TEAMS[marking.team].color;
      ctx.fillStyle = teamColor;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(marking.x - 15, marking.y - 15, 30, 30);
      ctx.globalAlpha = 1;

      ctx.strokeStyle = teamColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(marking.x - 15, marking.y - 15, 30, 30);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(marking.team, marking.x, marking.y);
    });
  }, [markings]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newMarking = {
      id: Date.now(),
      x,
      y,
      team: selectedTeam
    };

    setMarkings([...markings, newMarking]);
  };

  const handleClearMarkings = () => {
    setMarkings([]);
  };

  const handleRemoveMarking = (id) => {
    setMarkings(markings.filter(m => m.id !== id));
  };

  const handleScheduleChange = (team, field, value) => {
    setSchedule({
      ...schedule,
      [team]: {
        ...schedule[team],
        [field]: value
      }
    });
  };

  const handleExportImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `canyon-clash-strategy-${new Date().toISOString().split('T')[0]}.png`;
    link.click();
  };

  return (
    <div className="strategy-planner">
      <h1>Canyon Clash Strategy Planner</h1>
      
      <div className="planner-tabs">
        <button 
          className={`tab-button ${viewMode === 'strategy' ? 'active' : ''}`}
          onClick={() => setViewMode('strategy')}
        >
          Strategy Map
        </button>
        <button 
          className={`tab-button ${viewMode === 'schedule' ? 'active' : ''}`}
          onClick={() => setViewMode('schedule')}
        >
          Team Schedule
        </button>
      </div>

      {viewMode === 'strategy' ? (
        <div className="strategy-view">
          <div className="canvas-container">
            <canvas 
              ref={canvasRef} 
              width={1000} 
              height={1000}
              onClick={handleCanvasClick}
              className="strategy-canvas"
            />
          </div>

          <div className="controls-panel">
            <div className="team-selector">
              <h3>Select Team to Mark</h3>
              {Object.entries(TEAMS).map(([key, team]) => (
                <button
                  key={key}
                  className={`team-button ${selectedTeam === key ? 'active' : ''}`}
                  style={{ borderColor: team.color }}
                  onClick={() => setSelectedTeam(key)}
                >
                  <span className="team-circle" style={{ backgroundColor: team.color }}></span>
                  {team.label}
                </button>
              ))}
            </div>

            <div className="markings-list">
              <h3>Markings ({markings.length})</h3>
              <div className="markings-scroll">
                {markings.map((marking) => (
                  <div key={marking.id} className="marking-item" style={{ borderLeftColor: TEAMS[marking.team].color }}>
                    <span>{TEAMS[marking.team].label}</span>
                    <span>({Math.round(marking.x)}, {Math.round(marking.y)})</span>
                    <button onClick={() => handleRemoveMarking(marking.id)}>✕</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn-primary" onClick={handleExportImage}>
                📸 Export Map
              </button>
              <button className="btn-danger" onClick={handleClearMarkings}>
                🗑️ Clear All
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="schedule-view">
          <div className="schedule-container">
            {Object.entries(TEAMS).map(([key, team]) => (
              <div key={key} className="schedule-card" style={{ borderLeftColor: team.color }}>
                <div className="card-header" style={{ backgroundColor: team.color }}>
                  <h3>{team.label}</h3>
                  <p className="team-description">{team.description}</p>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label>Start Time</label>
                    <input
                      type="time"
                      value={schedule[key].startTime}
                      onChange={(e) => handleScheduleChange(key, 'startTime', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Objective/Notes</label>
                    <textarea
                      value={schedule[key].description}
                      onChange={(e) => handleScheduleChange(key, 'description', e.target.value)}
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="special-objectives">
              <div className="special-card">
                <h3>⚡ Energy Core Phase</h3>
                <p>When Energy Core appears: Strongest players secure it and carry to Alliance Beacon (100k points)</p>
              </div>
              <div className="special-card">
                <h3>🗻 Canyon Captain Bonus</h3>
                <p>6-10 people (1 from A, 1 from B, 2 from C, 2 from D) attack Canyon Captain. Max damage alliance gets buff!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StrategyPlanner;
