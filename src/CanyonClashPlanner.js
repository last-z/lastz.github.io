import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './CanyonClashPlanner.css';

const TEAMS = {
  A: { labelKey: 'teams.A', color: '#FF6B6B', descKey: 'teamDescriptions.A' },
  B: { labelKey: 'teams.B', color: '#4ECDC4', descKey: 'teamDescriptions.B' },
  C: { labelKey: 'teams.C', color: '#FFE66D', descKey: 'teamDescriptions.C' },
  D: { labelKey: 'teams.D', color: '#B78DD9', descKey: 'teamDescriptions.D' }
};

const BATTLE_PHASES = [
  { nameKey: 'battlePhases.prepPhase', timeKey: 'battlePhases.prepPhaseDesc', time: 0 },
  { nameKey: 'battlePhases.phaseIStart', timeKey: 'battlePhases.phaseIStartDesc', time: 2 },
  { nameKey: 'battlePhases.freeTeleport1', timeKey: 'battlePhases.freeTeleport1Desc', time: 6 },
  { nameKey: 'battlePhases.freeTeleport2', timeKey: 'battlePhases.freeTeleport2Desc', time: 12 },
  { nameKey: 'battlePhases.energyCore', timeKey: 'battlePhases.energyCoreDesc', time: 20 },
  { nameKey: 'battlePhases.freeTeleport3', timeKey: 'battlePhases.freeTeleport3Desc', time: 18 },
  { nameKey: 'battlePhases.battleEnd', timeKey: 'battlePhases.battleEndDesc', time: 40 }
];

const TIPS = [
  'tips.tip1',
  'tips.tip2',
  'tips.tip3',
  'tips.tip4',
  'tips.tip5',
  'tips.tip6'
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
  const { t, i18n } = useTranslation();
  const containerRef = useRef(null);
  const [selectedTeam, setSelectedTeam] = useState('A');
  const [markings, setMarkings] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [teamSpawn, setTeamSpawn] = useState('BLUE_DOWN'); // BLUE_DOWN or RED_UP
  const [isPlaying, setIsPlaying] = useState(false);
  const maxTime = 40;
  const [teamTimings, setTeamTimings] = useState({
    A: 0,
    B: 0,
    C: 4,
    D: 4
  });

  // Auto-advance time when playing
  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prevTime) => {
        if (prevTime >= maxTime) {
          setIsPlaying(false);
          return maxTime;
        }
        return prevTime + 0.2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, maxTime]);

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
  // eslint-disable-next-line no-unused-vars
  const isInSpawnArea = (x, y, area) => {
    if (!containerRef.current) return false;
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    const normalizedX = x / containerWidth;
    const normalizedY = y / containerHeight;
    return (
      normalizedX >= area.x1 && normalizedX <= area.x2 &&
      normalizedY >= area.y1 && normalizedY <= area.y2
    );
  };

  // Get suggestion text based on team selection and spawn
  // eslint-disable-next-line no-unused-vars
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
      ctx.fillText(key + ' - ' + t(team.descKey), x + 16, legendY + 9);
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
        <h1>{t('title')}</h1>
        <div className="header-controls">
          <select 
            value={i18n.language} 
            onChange={(e) => {
              i18n.changeLanguage(e.target.value);
              localStorage.setItem('language', e.target.value);
            }}
            className="language-selector"
          >
            <option value="en">English</option>
            <option value="zh">简体中文</option>
            <option value="zh-TW">繁體中文</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="es">Español</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
          </select>
          <button 
            className="info-btn"
            onClick={() => setShowTipsModal(!showTipsModal)}
            title="Battle Tips"
          >
            ℹ
          </button>
        </div>
      </div>

      {showTipsModal && (
        <div className="tips-modal">
          <div className="tips-content">
            <h2>{t('battleTips')}</h2>
            <button 
              className="modal-close"
              onClick={() => setShowTipsModal(false)}
            >
              ✕
            </button>
            <ul className="tips-list">
              {TIPS.map((tipKey, idx) => (
                <li key={idx}>{t(tipKey)}</li>
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

            {/* Render markings on map - filtered by exact current time */}
            {markings.filter(marking => Math.abs(marking.time - currentTime) < 0.3).map((marking) => (
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
            <h3>{t('spawnPosition')}</h3>
            <div className="spawn-buttons">
              <button
                className={`spawn-btn ${teamSpawn === 'BLUE_DOWN' ? 'active' : ''}`}
                onClick={() => setTeamSpawn('BLUE_DOWN')}
                title="We spawn at bottom-right"
              >
                {t('blueSpawn')}
              </button>
              <button
                className={`spawn-btn ${teamSpawn === 'RED_UP' ? 'active' : ''}`}
                onClick={() => setTeamSpawn('RED_UP')}
                title="We spawn at top-left"
              >
                {t('redSpawn')}
              </button>
            </div>
            <p className="spawn-info">
              {teamSpawn === 'BLUE_DOWN' 
                ? t('blueSpawnInfo')
                : t('redSpawnInfo')}
            </p>
          </div>

          {/* Team Selection */}
          <div className="team-controls">
            <h3>{t('selectTeam')}</h3>
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
            <p className="current-time">{t('time')}: {currentTime}m | {t('clickToMark')}</p>
          </div>

          {/* Timeline Slider */}
          <div className="timeline-section">
            <div className="timeline-header">
              <h3>⏱️ {t('battleTimeline')}</h3>
              <button
                className={`play-btn ${isPlaying ? 'playing' : ''}`}
                onClick={() => {
                  if (currentTime >= maxTime) {
                    setCurrentTime(0);
                    setIsPlaying(true);
                  } else {
                    setIsPlaying(!isPlaying);
                  }
                }}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
            </div>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max={maxTime}
                value={currentTime}
                onChange={(e) => {
                  setCurrentTime(parseFloat(e.target.value));
                  if (isPlaying) setIsPlaying(false);
                }}
                className="time-slider"
              />
              <div className="time-display">{currentTime.toFixed(1)} / {maxTime} {t('min')}</div>
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
                    <strong>{t(phase.nameKey)}</strong>
                    <p>{t(phase.timeKey)}</p>
                    <small>{phase.time}m</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Timings */}
          <div className="team-timings-section">
            <h3>{t('teamAttackTimes')}</h3>
            {Object.entries(TEAMS).map(([key, team]) => (
              <div key={key} className="timing-card" style={{ borderLeftColor: team.color }}>
                <label>{t(team.labelKey)}</label>
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
                  <span className="timing-unit">{t('min')}</span>
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
            <h3>📍 {t('markings')} ({markings.filter(m => Math.abs(m.time - currentTime) < 0.3).length}/{markings.length})</h3>
            <div className="markings-list">
              {markings.length === 0 ? (
                <p className="empty-message">{t('noMarkings')}</p>
              ) : (
                markings.map((marking) => {
                  const isActive = Math.abs(marking.time - currentTime) < 0.3;
                  return (
                    <div 
                      key={marking.id} 
                      className={`marking-entry ${isActive ? 'active' : 'inactive'}`}
                    >
                      <span className="marking-team" style={{ backgroundColor: TEAMS[marking.team].color }}>
                        {marking.team}
                      </span>
                      <span className="marking-coords">{Math.round(marking.x)}, {Math.round(marking.y)}</span>
                      <span className="marking-time-label">{marking.time}m</span>
                      <span className={`marking-status ${isActive ? 'active-badge' : 'pending-badge'}`}>
                        {isActive ? '✓' : '○'}
                      </span>
                      <button 
                        className="remove-btn"
                        onClick={() => setMarkings(markings.filter(m => m.id !== marking.id))}
                        title={t('deletMarking')}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn-export" onClick={handleExportPlan}>
              📸 {t('exportPlan')}
            </button>
            <button className="btn-clear" onClick={() => setMarkings([])}>
              🗑️ {t('clearAll')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CanyonClashPlanner;
