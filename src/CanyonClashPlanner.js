import React, { useState, useRef } from 'react';
import './CanyonClashPlanner.css';

const TEAMS = {
  A: { label: 'Team A - Enemy Hospital', color: '#FF6B6B', description: 'Frontline Strike' },
  B: { label: 'Team B - Our Hospital', color: '#4ECDC4', description: 'Defensive Command' },
  C: { label: 'Team C - Captain Side', color: '#FFE66D', description: 'Captain Squadron' },
  D: { label: 'Team D - Military Centers', color: '#B78DD9', description: 'Resource Squad' }
};

const BATTLE_PHASES = [
  { name: 'Prep Phase', time: 0, description: 'Starters enter battlefield' },
  { name: 'Phase I Start', time: 2, description: 'Hospital & Water Refinery accessible' },
  { name: 'Free Teleport 1', time: 6, description: 'First free teleport available' },
  { name: 'Free Teleport 2', time: 12, description: 'Second free teleport available' },
  { name: 'Energy Core', time: 20, description: 'Energy Core appears' },
  { name: 'Free Teleport 3', time: 18, description: 'Third free teleport available' },
  { name: 'Battle End', time: 40, description: 'Battle concludes' }
];

const TIPS = [
  'Heal troops in batches of 100 to avoid wasting healing speed-ups. All troops will be healed at end of match.',
  'Attacking HQs does not use fuel - use this strategically.',
  'Destroying an HQ prevents the enemy from deploying troops from that location.',
  'Rotate troops in buildings if they are low on health to maintain defensive positions.',
  'Free teleports available every 3 minutes with no cooldown - time them perfectly for objective captures.',
  'Use Energy Core spawn (20 min) as the focal point for final squad coordination and ultimate push.'
];

// Spawn area configurations: { topLeft, bottomRight }
const SPAWN_AREAS = {
  BLUE_DOWN: {
    label: 'Blue Spawn (Bottom-Right)',
    ourSpawn: { label: 'Our Spawn', x1: 0.65, y1: 0.65, x2: 1, y2: 1 },
    enemySpawn: { label: 'Enemy Spawn', x1: 0, y1: 0, x2: 0.35, y2: 0.35 }
  },
  RED_UP: {
    label: 'Red Spawn (Top-Left)',
    ourSpawn: { label: 'Our Spawn', x1: 0, y1: 0, x2: 0.35, y2: 0.35 },
    enemySpawn: { label: 'Enemy Spawn', x1: 0.65, y1: 0.65, x2: 1, y2: 1 }
  }
};

function CanyonClashPlanner() {
  const containerRef = useRef(null);
  const [selectedTeam, setSelectedTeam] = useState('A');
  const [markings, setMarkings] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [teamSpawn, setTeamSpawn] = useState('BLUE_DOWN'); // BLUE_DOWN or RED_UP
  const maxTime = 40;
  const [teamTimings, setTeamTimings] = useState({
    A: 0,
    B: 0,
    C: 4,
    D: 4
  });

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

  // Helper function to get spawn area configuration
  const getSpawnConfig = () => {
    return SPAWN_AREAS[teamSpawn];
  };

  // Helper function to check if position is in spawn area
  const isInSpawnArea = (x, y, area) => {
    if (!containerRef.current) return false;
    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;
    const normalizedX = x / width;
    const normalizedY = y / height;
    return (
      normalizedX >= area.x1 && normalizedX <= area.x2 &&
      normalizedY >= area.y1 && normalizedY <= area.y2
    );
  };

  // Get suggestion text based on team selection and spawn
  const getTeamSuggestion = (team) => {
    const spawn = getSpawnConfig();
    if (team === 'A') {
      return `Deploy at ${spawn.enemySpawn.label}`;
    } else if (team === 'B') {
      return `Deploy near ${spawn.ourSpawn.label}`;
    }
    return '';
  };

  const handleExportPlan = () => {
    const container = containerRef.current;
    if (!container) return;

    // Create a canvas from the container
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    const ctx = canvas.getContext('2d');

    // Fill background with light gray
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Try to draw the SVG background
    const bgImage = new Image();
    bgImage.crossOrigin = 'anonymous';
    bgImage.src = 'background.svg';
    bgImage.onload = () => {
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      drawMarkingsAndExport(ctx, canvas);
    };
    bgImage.onerror = () => {
      // If SVG fails to load, just use the light gray background
      drawMarkingsAndExport(ctx, canvas);
    };
  };

  const drawMarkingsAndExport = (ctx, canvas) => {
    // Draw markings with enhanced styling
    markings.forEach((marking) => {
      const teamColor = TEAMS[marking.team].color;
      
      // Draw shadow effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(marking.x - 14, marking.y - 14, 28, 28);
      
      // Draw marker background
      ctx.fillStyle = teamColor;
      ctx.globalAlpha = 0.75;
      ctx.fillRect(marking.x - 15, marking.y - 15, 30, 30);
      ctx.globalAlpha = 1;

      // Draw marker border
      ctx.strokeStyle = teamColor;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(marking.x - 15, marking.y - 15, 30, 30);

      // Draw team label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(marking.team, marking.x, marking.y - 2);
      
      // Draw time label
      ctx.font = 'bold 10px Arial';
      ctx.fillText(marking.time + 'm', marking.x, marking.y + 8);
    });

    // Add title and legend
    const padding = 10;
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Last Z - Canyon Clash Strategy', padding, 25);
    
    // Draw legend
    const legendY = canvas.height - 45;
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    Object.entries(TEAMS).forEach(([key, team], idx) => {
      const x = padding + (idx * 140);
      ctx.fillStyle = team.color;
      ctx.fillRect(x, legendY, 12, 12);
      ctx.fillStyle = '#333';
      ctx.fillText(key + ' - ' + team.description, x + 16, legendY + 9);
    });

    // Download
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `canyon-clash-plan-${new Date().toISOString().split('T')[0]}.png`;
    link.click();
  };

  return (
    <div className="canyon-clash-planner">
      <div className="header-container">
        <h1>🗻 Canyon Clash Strategic Planner</h1>
        <button 
          className="info-btn"
          onClick={() => setShowTipsModal(!showTipsModal)}
          title="Battle Tips"
        >
          ℹ
        </button>
      </div>

      {showTipsModal && (
        <div className="tips-modal">
          <div className="tips-content">
            <h2>Battle Tips & Strategy</h2>
            <button 
              className="modal-close"
              onClick={() => setShowTipsModal(false)}
            >
              ✕
            </button>
            <ul className="tips-list">
              {TIPS.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="planner-container">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="map-container" ref={containerRef} onClick={handleMapClick}>
            <img 
              src="background.svg" 
              alt="Canyon Clash Map"
              className="map-background"
            />

            {/* Spawn Area Indicators */}
            {(() => {
              const spawn = getSpawnConfig();
              const width = containerRef.current?.offsetWidth || 800;
              const height = containerRef.current?.offsetHeight || 600;
              return (
                <>
                  {/* Our Spawn Area */}
                  <div
                    className="spawn-area spawn-our"
                    style={{
                      left: `${spawn.ourSpawn.x1 * 100}%`,
                      top: `${spawn.ourSpawn.y1 * 100}%`,
                      width: `${(spawn.ourSpawn.x2 - spawn.ourSpawn.x1) * 100}%`,
                      height: `${(spawn.ourSpawn.y2 - spawn.ourSpawn.y1) * 100}%`,
                    }}
                    title="Our Spawn Area"
                  />
                  {/* Enemy Spawn Area */}
                  <div
                    className="spawn-area spawn-enemy"
                    style={{
                      left: `${spawn.enemySpawn.x1 * 100}%`,
                      top: `${spawn.enemySpawn.y1 * 100}%`,
                      width: `${(spawn.enemySpawn.x2 - spawn.enemySpawn.x1) * 100}%`,
                      height: `${(spawn.enemySpawn.y2 - spawn.enemySpawn.y1) * 100}%`,
                    }}
                    title="Enemy Spawn Area"
                  />
                </>
              );
            })()}

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
                <button
                  className="marking-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMarkings(markings.filter(m => m.id !== marking.id));
                  }}
                  title="Delete marking"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          {/* Spawn Selection */}
          <div className="spawn-selector">
            <h3>🏁 Our Spawn Position</h3>
            <div className="spawn-buttons">
              <button
                className={`spawn-btn ${teamSpawn === 'BLUE_DOWN' ? 'active' : ''}`}
                onClick={() => setTeamSpawn('BLUE_DOWN')}
                title="We spawn at bottom-right"
              >
                🔵 Blue (Bottom)
              </button>
              <button
                className={`spawn-btn ${teamSpawn === 'RED_UP' ? 'active' : ''}`}
                onClick={() => setTeamSpawn('RED_UP')}
                title="We spawn at top-left"
              >
                🔴 Red (Top)
              </button>
            </div>
            <p className="spawn-info">
              {teamSpawn === 'BLUE_DOWN' 
                ? '📍 Team A attacks from top-left | Team B defends bottom-right'
                : '📍 Team A attacks from bottom-right | Team B defends top-left'}
            </p>
          </div>

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
