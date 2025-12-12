import React, { useState, useRef, useEffect } from 'react';
import './CanyonClashPlanner.css';

const TEAMS = {
  A: { label: 'Team A - Enemy Hospital', color: '#FF6B6B', description: 'Frontline Strike' },
  B: { label: 'Team B - Our Hospital', color: '#4ECDC4', description: 'Defensive Command' },
  C: { label: 'Team C - Captain Side', color: '#FFE66D', description: 'Captain Squadron' },
  D: { label: 'Team D - Military Centers', color: '#B78DD9', description: 'Resource Squad' }
};

const BATTLE_PHASES = [
  { name: 'Prep Phase', time: 0, description: 'Starters enter battlefield' },
  { name: 'Phase I Start', time: 1, description: 'Hospital & Water Refinery accessible' },
  { name: 'Free Teleport 1', time: 3, description: 'First free teleport available' },
  { name: 'Free Teleport 2', time: 6, description: 'Second free teleport available' },
  { name: 'Energy Core', time: 10, description: 'Energy Core appears (estimate)' },
  { name: 'Free Teleport 3', time: 9, description: 'Third free teleport available' },
  { name: 'Battle End', time: 20, description: 'Battle concludes' }
];

function CanyonClashPlanner() {
  const containerRef = useRef(null);
  const [playerX, setPlayerX] = useState(50);
  const [playerY, setPlayerY] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('A');
  const [markings, setMarkings] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const maxTime = 20;
  const [teamTimings, setTeamTimings] = useState({
    A: 0,
    B: 0,
    C: 2,
    D: 2
  });

  const PLAYER_SIZE = 80;
  const KEYBOARD_STEP = 10;

  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

  const setPlayerPosition = (newX, newY) => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    const clampedX = clamp(newX, 0, containerWidth - PLAYER_SIZE);
    const clampedY = clamp(newY, 0, containerHeight - PLAYER_SIZE);

    setPlayerX(clampedX);
    setPlayerY(clampedY);
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    
    if (rect) {
      setIsDragging(true);
    }
  };

  const handleDrag = (e) => {
    if (!isDragging || !containerRef.current) return;

    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    const containerRect = containerRef.current.getBoundingClientRect();

    if (clientX && clientY) {
      const newX = clientX - containerRect.left;
      const newY = clientY - containerRect.top;
      setPlayerPosition(newX, newY);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e) => {
    let newX = playerX;
    let newY = playerY;
    let shouldUpdate = false;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newY -= KEYBOARD_STEP;
        shouldUpdate = true;
        break;
      case 'ArrowDown':
        e.preventDefault();
        newY += KEYBOARD_STEP;
        shouldUpdate = true;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newX -= KEYBOARD_STEP;
        shouldUpdate = true;
        break;
      case 'ArrowRight':
        e.preventDefault();
        newX += KEYBOARD_STEP;
        shouldUpdate = true;
        break;
      default:
        return;
    }

    if (shouldUpdate) {
      setPlayerPosition(newX, newY);
    }
  };

  const handleMapClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newMarking = {
      id: Date.now(),
      x,
      y,
      team: selectedTeam,
      time: currentTime
    };

    setMarkings([...markings, newMarking]);
  };

  const handleTeamTimingChange = (team, value) => {
    setTeamTimings({ ...teamTimings, [team]: parseFloat(value) });
  };

  const handleExportPlan = () => {
    const container = containerRef.current;
    if (!container) return;

    // Create a canvas from the container
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    const ctx = canvas.getContext('2d');

    // Fill background
    const bgImage = new Image();
    bgImage.src = 'background.svg';
    bgImage.onload = () => {
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

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

      // Download
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `canyon-clash-plan-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    };
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, playerX, playerY, currentTime]);

  return (
    <div className="canyon-clash-planner">
      <h1>🗻 Canyon Clash Strategic Planner</h1>

      <div className="planner-container">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="map-container" ref={containerRef} onClick={handleMapClick}>
            <img 
              src="background.svg" 
              alt="Canyon Clash Map"
              className="map-background"
            />
            <div
              className={`player-viewport ${isDragging ? 'dragging' : ''}`}
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              style={{
                left: `${playerX}px`,
                top: `${playerY}px`
              }}
            >
              <div className="viewport-label">Viewport</div>
            </div>

            {/* Render markings on map */}
            {markings.map((marking) => (
              <div
                key={marking.id}
                className="marking"
                style={{
                  left: `${marking.x}px`,
                  top: `${marking.y}px`,
                  borderColor: TEAMS[marking.team].color,
                  backgroundColor: TEAMS[marking.team].color
                }}
              >
                <span className="marking-label">{marking.team}</span>
                <span className="marking-time">{marking.time}m</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          {/* Team Selection */}
          <div className="team-controls">
            <h3>Select Team to Mark</h3>
            <div className="team-buttons">
              {Object.entries(TEAMS).map(([key, team]) => (
                <button
                  key={key}
                  className={`team-btn ${selectedTeam === key ? 'active' : ''}`}
                  style={{ borderColor: team.color }}
                  onClick={() => setSelectedTeam(key)}
                >
                  <span className="dot" style={{ backgroundColor: team.color }}></span>
                  {key}
                </button>
              ))}
            </div>
            <p className="current-time">Time: {currentTime}m | Click to mark</p>
          </div>

          {/* Timeline Slider */}
          <div className="timeline-section">
            <h3>⏱️ Battle Timeline</h3>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max={maxTime}
                value={currentTime}
                onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                className="time-slider"
              />
              <div className="time-display">{currentTime.toFixed(1)} / {maxTime} min</div>
            </div>

            <div className="phases-timeline">
              {BATTLE_PHASES.map((phase, idx) => (
                <div
                  key={idx}
                  className={`phase-marker ${currentTime >= phase.time ? 'active' : ''}`}
                  style={{ left: `${(phase.time / maxTime) * 100}%` }}
                >
                  <div className="phase-dot"></div>
                  <div className="phase-tooltip">
                    <strong>{phase.name}</strong>
                    <p>{phase.description}</p>
                    <small>{phase.time}m</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Timings */}
          <div className="team-timings-section">
            <h3>⏰ Team Attack Times</h3>
            {Object.entries(TEAMS).map(([key, team]) => (
              <div key={key} className="timing-card" style={{ borderLeftColor: team.color }}>
                <label>{team.label}</label>
                <div className="timing-input-group">
                  <input
                    type="number"
                    min="0"
                    max={maxTime}
                    step="0.5"
                    value={teamTimings[key]}
                    onChange={(e) => handleTeamTimingChange(key, e.target.value)}
                    className="timing-input"
                  />
                  <span className="timing-unit">min</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxTime}
                  step="0.5"
                  value={teamTimings[key]}
                  onChange={(e) => handleTeamTimingChange(key, e.target.value)}
                  className="timing-slider"
                />
              </div>
            ))}
          </div>

          {/* Markings List */}
          <div className="markings-section">
            <h3>📍 Markings ({markings.length})</h3>
            <div className="markings-list">
              {markings.length === 0 ? (
                <p className="empty-message">Click on map to add markings</p>
              ) : (
                markings.map((marking) => (
                  <div key={marking.id} className="marking-entry">
                    <span className="marking-team" style={{ backgroundColor: TEAMS[marking.team].color }}>
                      {marking.team}
                    </span>
                    <span className="marking-coords">{Math.round(marking.x)}, {Math.round(marking.y)}</span>
                    <span className="marking-time-label">{marking.time}m</span>
                    <button 
                      className="remove-btn"
                      onClick={() => setMarkings(markings.filter(m => m.id !== marking.id))}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn-export" onClick={handleExportPlan}>
              📸 Export Plan
            </button>
            <button className="btn-clear" onClick={() => setMarkings([])}>
              🗑️ Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CanyonClashPlanner;
