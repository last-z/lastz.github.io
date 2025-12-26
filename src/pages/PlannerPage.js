import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './PlannerPage.css';

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

// Objetivos del mapa con tiempos de aparición y bonificadores
const MAP_OBJECTIVES = {
  militaryCenter: {
    name: 'Military Centers',
    icon: '🎖️',
    appearTime: 10,
    bonuses: [
      { type: 'points', value: 1800, unit: '/min', color: '#FFD700' },
      { type: 'damage', value: 30, unit: '%', color: '#FF6B6B' }
    ],
    maxCapturable: 2,
    note: 'Capture both for +60% damage',
    positions: [
      { x: 0.138, y: 0.693 }, // Military Center 1
      { x: 0.349, y: 0.908 }  // Military Center 2
    ]
  },
  hospital: {
    name: 'Hospital',
    icon: '🏥',
    appearTime: 0,
    bonuses: [
      { type: 'healing', value: 50, unit: '%', color: '#4ECDC4' }
    ],
    maxCapturable: 2,
    note: 'Capture both for +100% healing',
    positions: [
      { x: 0.31, y: 0.33 },   // Hospital 1
      { x: 0.7, y: 0.697 }    // Hospital 2
    ]
  },
  captain: {
    name: 'Canyon Captain (Raid Boss)',
    icon: '💀',
    appearances: [
      { time: 5, bonus: { type: 'speed', value: 50, unit: '%', description: 'March Speed' } },
      { time: 15, bonus: { type: 'points', value: 50, unit: '%', description: 'Points Yield' } },
      { time: 25, bonus: { type: 'damage', value: 25, unit: '%', description: 'Damage' } }
    ],
    position: { x: 0.865, y: 0.177 }
  },
  energyCore: {
    name: 'Energy Core Tower',
    icon: '⚡',
    appearTime: 20,
    bonuses: [
      { type: 'points', value: 100000, unit: 'pts', color: '#FFD700' }
    ],
    position: { x:0.5, y: 0.6 }
  },
  refinery: {
    name: 'Water Refinery',
    icon: '💧',
    appearTime: 0,
    bonuses: [
      { type: 'points', value: 600, unit: '/min', color: '#4ECDC4' }
    ],
    note: 'Provides 600 points/minute',
    positions: [
      { x: 0.232, y: 0.321 },  // Refinery 1
      { x: 0.298, y: 0.252 },  // Refinery 2
      { x: 0.532, y: 0.243 },  // Refinery 3
      { x: 0.667, y: 0.379 },  // Refinery 4
      { x: 0.791, y: 0.502 },  // Refinery 5
      { x: 0.745, y: 0.301 },  // Refinery 6
      { x: 0.768, y: 0.757 },  // Refinery 7
      { x: 0.702, y: 0.817 },  // Refinery 8
      { x: 0.472, y: 0.833 },  // Refinery 9
      { x: 0.337, y: 0.7 },    // Refinery 10
      { x: 0.206, y: 0.571 },  // Refinery 11
      { x: 0.255, y: 0.775 }   // Refinery 12
    ]
  }
};

// Spawn area configurations: { topLeft, bottomRight }
const SPAWN_AREAS = {
  BLUE_DOWN: {
    label: 'Blue Spawn (Bottom-Right)',
    ourSpawn: { label: 'Our Spawn', x1: 0.784, y1: 0.784, x2: 1, y2: 1 },
    enemySpawn: { label: 'Enemy Spawn', x1: 0, y1: 0, x2: 0.216, y2: 0.216 }
  },
  RED_UP: {
    label: 'Red Spawn (Top-Left)',
    ourSpawn: { label: 'Our Spawn', x1: 0, y1: 0, x2: 0.216, y2: 0.216 },
    enemySpawn: { label: 'Enemy Spawn', x1: 0.784, y1: 0.784, x2: 1, y2: 1 }
  }
};

// Default plan to load on app startup
const DEFAULT_PLAN = {
  id: 1766778108599,
  name: "Canyon-Clash-Plan-2025-12-26",
  description: "Strategy exported from Canyon Clash Planner",
  teamTimings: {
    A: 0,
    B: 0,
    C: 3,
    D: 3
  },
  teamSpawn: "BLUE_DOWN",
  markings: [
    { id: 1766776731170, x: 328, y: 873, team: "D", time: 0, duration: 10 },
    { id: 1766776732010, x: 438, y: 796, team: "D", time: 0, duration: 10 },
    { id: 1766776732907, x: 267, y: 658, team: "D", time: 0, duration: 10 },
    { id: 1766776734336, x: 582, y: 945, team: "D", time: 0, duration: 10 },
    { id: 1766776740110, x: 344, y: 857, team: "D", time: 10, duration: 10 },
    { id: 1766776741084, x: 204, y: 768, team: "D", time: 10, duration: 10 },
    { id: 1766776742135, x: 410, y: 966, team: "D", time: 10, duration: 10 },
    { id: 1766776747235, x: 419, y: 791, team: "D", time: 10, duration: 10 },
    { id: 1766776756391, x: 517, y: 713, team: "D", time: 20, duration: 10 },
    { id: 1766776757539, x: 209, y: 788, team: "D", time: 20, duration: 10 },
    { id: 1766776624188, x: 793, y: 432, team: "C", time: 0, duration: 10 },
    { id: 1766776625788, x: 642, y: 288, team: "C", time: 0, duration: 10 },
    { id: 1766776626750, x: 917, y: 511, team: "C", time: 0, duration: 10 },
    { id: 1766776627379, x: 876, y: 339, team: "C", time: 0, duration: 10 },
    { id: 1766776639593, x: 795, y: 391, team: "C", time: 10, duration: 10 },
    { id: 1766776646733, x: 424, y: 333, team: "C", time: 10, duration: 10 },
    { id: 1766776649296, x: 858, y: 755, team: "C", time: 10, duration: 10 },
    { id: 1766776653167, x: 838, y: 516, team: "C", time: 10, duration: 10 },
    { id: 1766776654127, x: 648, y: 325, team: "C", time: 10, duration: 10 },
    { id: 1766776667957, x: 673, y: 582, team: "C", time: 20, duration: 10 },
    { id: 1766776670461, x: 830, y: 728, team: "C", time: 20, duration: 10 },
    { id: 1766776671749, x: 411, y: 356, team: "C", time: 20, duration: 10 },
    { id: 1766775920022, x: 823, y: 763, team: "A", time: 0, duration: 10 },
    { id: 1766775921761, x: 895, y: 811, team: "A", time: 0, duration: 10 },
    { id: 1766775922658, x: 779, y: 868, team: "A", time: 0, duration: 10 },
    { id: 1766775932934, x: 437, y: 1004, team: "A", time: 10, duration: 10 },
    { id: 1766775934869, x: 744, y: 812, team: "A", time: 10, duration: 10 },
    { id: 1766775935634, x: 746, y: 880, team: "A", time: 10, duration: 10 },
    { id: 1766775936312, x: 900, y: 813, team: "A", time: 10, duration: 10 },
    { id: 1766775943212, x: 580, y: 722, team: "A", time: 20, duration: 10 },
    { id: 1766775946000, x: 748, y: 832, team: "A", time: 20, duration: 10 },
    { id: 1766775949315, x: 446, y: 1019, team: "A", time: 20, duration: 10 },
    { id: 1766776491684, x: 394, y: 391, team: "B", time: 0, duration: 10 },
    { id: 1766776497819, x: 204, y: 354, team: "B", time: 0, duration: 10 },
    { id: 1766776498916, x: 289, y: 265, team: "B", time: 0, duration: 10 },
    { id: 1766776505501, x: 135, y: 715, team: "B", time: 10, duration: 10 },
    { id: 1766776507044, x: 312, y: 402, team: "B", time: 10, duration: 10 },
    { id: 1766776508560, x: 278, y: 300, team: "B", time: 10, duration: 10 },
    { id: 1766776529546, x: 130, y: 729, team: "B", time: 20, duration: 10 },
    { id: 1766777231756, x: 476, y: 550, team: "B", time: 23, duration: 10 },
    { id: 1766777249684, x: 406, y: 965, team: "D", time: 20, duration: 10 },
    { id: 1766777257847, x: 445, y: 562, team: "B", time: 20, duration: 10 },
    { id: 1766777261037, x: 299, y: 402, team: "B", time: 20, duration: 10 }
  ],
  currentTime: 20,
  markerDuration: 10,
  createdAt: "2025-12-26T19:41:48.599Z"
};

function PlannerPage({ onAdminClick, onAboutClick, pendingPlan, onPlanLoaded }) {
  const { t, i18n } = useTranslation();
  const containerRef = useRef(null);
  const [selectedTeam, setSelectedTeam] = useState('A');
  const [markings, setMarkings] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [teamSpawn, setTeamSpawn] = useState('BLUE_DOWN'); // BLUE_DOWN or RED_UP
  const [isPlaying, setIsPlaying] = useState(false);
  const [markerDuration, setMarkerDuration] = useState(10); // Duración del marcador en minutos
  const [showCalibration, setShowCalibration] = useState(false);
  const [calibrationPoints, setCalibrationPoints] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState('militaryCenter1');
  const [draggingObjective, setDraggingObjective] = useState(null);
  const maxTime = 40;
  const [teamTimings, setTeamTimings] = useState({
    A: 0,
    B: 0,
    C: 4,
    D: 4
  });

  // Load pending plan if one is passed
  useEffect(() => {
    if (pendingPlan) {
      if (pendingPlan.teamTimings) {
        setTeamTimings(pendingPlan.teamTimings);
      }
      if (pendingPlan.teamSpawn) {
        setTeamSpawn(pendingPlan.teamSpawn);
      }
      if (pendingPlan.markings && Array.isArray(pendingPlan.markings)) {
        setMarkings(pendingPlan.markings);
      }
      setCurrentTime(0);
      setIsPlaying(true);
      onPlanLoaded && onPlanLoaded();
    } else {
      // Load default plan if no pending plan
      if (DEFAULT_PLAN.teamTimings) {
        setTeamTimings(DEFAULT_PLAN.teamTimings);
      }
      if (DEFAULT_PLAN.teamSpawn) {
        setTeamSpawn(DEFAULT_PLAN.teamSpawn);
      }
      if (DEFAULT_PLAN.markings && Array.isArray(DEFAULT_PLAN.markings)) {
        setMarkings(DEFAULT_PLAN.markings);
      }
      setCurrentTime(DEFAULT_PLAN.currentTime || 0);
      setMarkerDuration(DEFAULT_PLAN.markerDuration || 10);
    }
  }, [pendingPlan, onPlanLoaded]);

  // Auto-advance time when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prevTime) => {
        if (prevTime >= maxTime) {
          setIsPlaying(false);
          return maxTime;
        }
        return prevTime + 1;
      });
    }, 500);

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
      time: currentTime,
      duration: markerDuration
    };

    setMarkings([...markings, newMarking]);
  };

  const handleTeamTimingChange = (team, value) => {
    setTeamTimings({ ...teamTimings, [team]: parseFloat(value) });
  };

  // Calibration functions
  const handleCalibrationClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normalizedX = x / rect.width;
    const normalizedY = y / rect.height;

    const newPoint = {
      id: Date.now(),
      x: parseFloat(normalizedX.toFixed(3)),
      y: parseFloat(normalizedY.toFixed(3)),
      objective: selectedObjective
    };

    setCalibrationPoints([...calibrationPoints, newPoint]);
  };

  const handleDragStart = (e, objective) => {
    setDraggingObjective(objective);
    e.preventDefault();
  };

  const handleDragMove = (e) => {
    if (!draggingObjective || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normalizedX = Math.max(0, Math.min(1, x / rect.width));
    const normalizedY = Math.max(0, Math.min(1, y / rect.height));

    // Find and update the calibration point for this objective
    const updatedPoints = calibrationPoints.map(point => {
      if (point.objective === draggingObjective) {
        return {
          ...point,
          x: parseFloat(normalizedX.toFixed(3)),
          y: parseFloat(normalizedY.toFixed(3))
        };
      }
      return point;
    });

    setCalibrationPoints(updatedPoints);
  };

  const handleDragEnd = () => {
    setDraggingObjective(null);
  };

  const removeCalibrationPoint = (id) => {
    setCalibrationPoints(calibrationPoints.filter(p => p.id !== id));
  };

  const applyCalibrationPoint = (point) => {
    let updatedObjectives = { ...MAP_OBJECTIVES };
    
    if (point.objective === 'militaryCenter1') {
      updatedObjectives.militaryCenter.positions[0] = { x: point.x, y: point.y };
    } else if (point.objective === 'militaryCenter2') {
      updatedObjectives.militaryCenter.positions[1] = { x: point.x, y: point.y };
    } else if (point.objective === 'hospital1') {
      updatedObjectives.hospital.positions[0] = { x: point.x, y: point.y };
    } else if (point.objective === 'hospital2') {
      updatedObjectives.hospital.positions[1] = { x: point.x, y: point.y };
    } else if (point.objective === 'captain') {
      updatedObjectives.captain.position = { x: point.x, y: point.y };
    } else if (point.objective === 'energyCore') {
      updatedObjectives.energyCore.position = { x: point.x, y: point.y };
    }

    console.log('Updated objectives:', JSON.stringify(updatedObjectives, null, 2));
  };

  const getCalibrationCode = () => {
    const objectives = {};
    calibrationPoints.forEach(point => {
      objectives[point.objective] = { x: point.x, y: point.y };
    });
    return JSON.stringify(objectives, null, 2);
  };

  const getObjectiveIcon = (objective) => {
    const icons = {
      hospital1: '🏥',
      hospital2: '🏥',
      militaryCenter1: '🟩',
      militaryCenter2: '🟩',
      captain: '😊',
      energyCore: '⚡',
      refinery1: '💧',
      refinery2: '💧',
      refinery3: '💧',
      refinery4: '💧',
      refinery5: '💧',
      refinery6: '💧',
      refinery7: '💧',
      refinery8: '💧',
      refinery9: '💧',
      refinery10: '💧',
      refinery11: '💧',
      refinery12: '💧'
    };
    return icons[objective] || '📍';
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
    
    // Load SVG from public folder with correct base URL
    const backgroundUrl = `${process.env.PUBLIC_URL}/background.svg`;
    bgImage.src = backgroundUrl;
    
    bgImage.onload = () => {
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      drawObjectivesAndMarkingsFiltered(ctx, canvas);
    };
    bgImage.onerror = () => {
      // If SVG fails to load, just use the light gray background
      console.error('Failed to load background image');
      drawObjectivesAndMarkingsFiltered(ctx, canvas);
    };
  };

  const drawObjectivesAndMarkingsFiltered = (ctx, canvas) => {
    // Draw dotted lines from Energy Core to corners (if visible)
    if (currentTime >= MAP_OBJECTIVES.energyCore.appearTime) {
      const corePosX = MAP_OBJECTIVES.energyCore.position.x * canvas.width;
      const corePosY = MAP_OBJECTIVES.energyCore.position.y * canvas.height;
      
      // Helper function to draw dashed line
      const drawDashedLine = (fromX, fromY, toX, toY, dashSize = 5) => {
        const dx = toX - fromX;
        const dy = toY - fromY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.setLineDash([dashSize, dashSize]);
        ctx.globalAlpha = 0.7;
        
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      };
      
      // Line to top-left corner
      drawDashedLine(corePosX, corePosY, 0, 0);
      
      // Line to bottom-right corner
      drawDashedLine(corePosX, corePosY, canvas.width, canvas.height);
    }

    // Draw objectives with emojis
    // Hospitals
    MAP_OBJECTIVES.hospital.positions.forEach((pos) => {
      drawObjectiveCircle(ctx, pos.x, pos.y, canvas, '#4ECDC4', 45);
      drawEmojiAtPosition(ctx, MAP_OBJECTIVES.hospital.icon, pos.x, pos.y, canvas, 52);
    });

    // Military Centers
    MAP_OBJECTIVES.militaryCenter.positions.forEach((pos) => {
      drawObjectiveCircle(ctx, pos.x, pos.y, canvas, '#4CAF50', 45);
      drawEmojiAtPosition(ctx, MAP_OBJECTIVES.militaryCenter.icon, pos.x, pos.y, canvas, 52);
    });

    // Energy Core
    if (currentTime >= MAP_OBJECTIVES.energyCore.appearTime) {
      drawObjectiveCircle(ctx, MAP_OBJECTIVES.energyCore.position.x, MAP_OBJECTIVES.energyCore.position.y, canvas, '#FFD700', 45);
      drawEmojiAtPosition(ctx, MAP_OBJECTIVES.energyCore.icon, MAP_OBJECTIVES.energyCore.position.x, MAP_OBJECTIVES.energyCore.position.y, canvas, 52);
    }

    // Captain
    if (currentTime >= 5) {
      drawObjectiveCircle(ctx, MAP_OBJECTIVES.captain.position.x, MAP_OBJECTIVES.captain.position.y, canvas, '#FF6B6B', 45);
      drawEmojiAtPosition(ctx, MAP_OBJECTIVES.captain.icon, MAP_OBJECTIVES.captain.position.x, MAP_OBJECTIVES.captain.position.y, canvas, 52);
    }

    // Refineries
    MAP_OBJECTIVES.refinery.positions.forEach((pos) => {
      drawObjectiveCircle(ctx, pos.x, pos.y, canvas, '#4ECDC4', 35);
      drawEmojiAtPosition(ctx, MAP_OBJECTIVES.refinery.icon, pos.x, pos.y, canvas, 40);
    });

    // Draw ONLY markings at the exact current time
    const activeMarkings = markings.filter(marking => marking.time === currentTime);
    
    activeMarkings.forEach((marking) => {
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
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(marking.team, marking.x, marking.y - 2);
      
      // Draw time label
      ctx.font = 'bold 10px Arial';
      ctx.fillText(marking.time + 'm', marking.x, marking.y + 8);
    });

    // Draw spawn area squares at corners
    const spawn = getSpawnConfig();
    
    // Our Spawn Area (colored square)
    ctx.fillStyle = '#4ECDC4';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(
      spawn.ourSpawn.x1 * canvas.width,
      spawn.ourSpawn.y1 * canvas.height,
      (spawn.ourSpawn.x2 - spawn.ourSpawn.x1) * canvas.width,
      (spawn.ourSpawn.y2 - spawn.ourSpawn.y1) * canvas.height
    );
    
    // Enemy Spawn Area (colored square)
    ctx.fillStyle = '#FF6B6B';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(
      spawn.enemySpawn.x1 * canvas.width,
      spawn.enemySpawn.y1 * canvas.height,
      (spawn.enemySpawn.x2 - spawn.enemySpawn.x1) * canvas.width,
      (spawn.enemySpawn.y2 - spawn.enemySpawn.y1) * canvas.height
    );
    ctx.globalAlpha = 1;

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

  const drawObjectivesAndMarkings = (ctx, canvas) => {
    // Draw objectives with emojis
    // Hospitals
    MAP_OBJECTIVES.hospital.positions.forEach((pos) => {
      drawObjectiveCircle(ctx, pos.x, pos.y, canvas, '#4ECDC4', 45);
      drawEmojiAtPosition(ctx, MAP_OBJECTIVES.hospital.icon, pos.x, pos.y, canvas, 52);
    });

    // Military Centers
    MAP_OBJECTIVES.militaryCenter.positions.forEach((pos) => {
      drawObjectiveCircle(ctx, pos.x, pos.y, canvas, '#4CAF50', 45);
      drawEmojiAtPosition(ctx, MAP_OBJECTIVES.militaryCenter.icon, pos.x, pos.y, canvas, 52);
    });

    // Energy Core
    if (currentTime >= MAP_OBJECTIVES.energyCore.appearTime) {
      drawObjectiveCircle(ctx, MAP_OBJECTIVES.energyCore.position.x, MAP_OBJECTIVES.energyCore.position.y, canvas, '#FFD700', 45);
      drawEmojiAtPosition(ctx, MAP_OBJECTIVES.energyCore.icon, MAP_OBJECTIVES.energyCore.position.x, MAP_OBJECTIVES.energyCore.position.y, canvas, 52);
    }

    // Captain
    if (currentTime >= 5) {
      drawObjectiveCircle(ctx, MAP_OBJECTIVES.captain.position.x, MAP_OBJECTIVES.captain.position.y, canvas, '#FF6B6B', 45);
      drawEmojiAtPosition(ctx, MAP_OBJECTIVES.captain.icon, MAP_OBJECTIVES.captain.position.x, MAP_OBJECTIVES.captain.position.y, canvas, 52);
    }

    // Refineries
    MAP_OBJECTIVES.refinery.positions.forEach((pos) => {
      drawObjectiveCircle(ctx, pos.x, pos.y, canvas, '#4ECDC4', 35);
      drawEmojiAtPosition(ctx, MAP_OBJECTIVES.refinery.icon, pos.x, pos.y, canvas, 40);
    });

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
      ctx.font = 'bold 18px Arial';
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

  const drawObjectiveCircle = (ctx, x, y, canvas, color, radius = 45) => {
    const posX = x * canvas.width;
    const posY = y * canvas.height;
    
    // Draw shadow/glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    
    // Draw semi-transparent background circle
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.arc(posX, posY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // Draw outer border (darker, thicker)
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(posX, posY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw inner border (lighter)
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(posX, posY, radius - 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  };

  const drawEmojiAtPosition = (ctx, emoji, x, y, canvas, fontSize = 52) => {
    const posX = x * canvas.width;
    const posY = y * canvas.height;
    
    // Add shadow for emoji
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 2;
    
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, posX, posY);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
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
      ctx.font = 'bold 18px Arial';
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

  const handleSavePlanClick = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const planName = `Canyon-Clash-Plan-${timestamp}`;
    
    const plan = {
      id: Date.now(),
      name: planName,
      description: 'Strategy exported from Canyon Clash Planner',
      teamTimings: { 
        A: teamTimings.A,
        B: teamTimings.B,
        C: teamTimings.C,
        D: teamTimings.D
      },
      teamSpawn,
      markings: [...markings],
      currentTime,
      markerDuration,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage so it appears in ROLs Plans
    const savedPlans = localStorage.getItem('ROLsPlans');
    let plans = [];
    try {
      plans = savedPlans ? JSON.parse(savedPlans) : [];
    } catch (error) {
      console.error('Error parsing existing plans:', error);
      plans = [];
    }
    plans.push(plan);
    localStorage.setItem('ROLsPlans', JSON.stringify(plans));

    // Export plan as JSON file
    exportPlanAsFile(plan);
  };

  const exportPlanAsFile = (plan) => {
    const dataStr = JSON.stringify(plan, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${plan.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="canyon-clash-planner">
      <div className="header-container">
        <h1>{t('title')}</h1>
        <div className="header-controls">
          <button 
            className="save-plan-btn"
            onClick={handleSavePlanClick}
            title="Save current strategy as ROLs Plan"
          >
            💾 {t('admin.savePlanToROLs') || 'Save as ROLs'}
          </button>
          <button 
            className="admin-btn"
            onClick={onAdminClick}
            title="ROLs Plans Administration"
          >
            ⚙️ {t('admin.rolsPlans') || 'Admin'}
          </button>
          <button 
            className="about-btn"
            onClick={onAboutClick}
            title="About Canyon Clash"
          >
            ℹ️ {t('about.title') || 'About'}
          </button>
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
      {/* Calibration Modal */}
      {showCalibration && (
        <div className="calibration-modal-overlay" onClick={() => setShowCalibration(false)}>
          <div className="calibration-modal" onClick={(e) => e.stopPropagation()}>
            <div className="calibration-header">
              <h2>🎯 Map Calibration Tool</h2>
              <button className="close-btn" onClick={() => setShowCalibration(false)}>✕</button>
            </div>
            
            <div className="calibration-content">
              <div className="calibration-map-section">
                <p className="calibration-instruction">
                  1. Drag objectives on the map to position them correctly
                  <br/>
                  2. Their coordinates update in real-time
                  <br/>
                  3. When done, apply and save
                </p>

                <div className="calibration-map-display" ref={containerRef} onMouseMove={handleDragMove} onMouseUp={handleDragEnd} onMouseLeave={handleDragEnd}>
                  <img 
                    src={`${process.env.PUBLIC_URL}/background.svg`}
                    alt="Canyon Clash Map"
                    className="calibration-map-image"
                  />
                  
                  {/* Guide Grid */}
                  <div className="calibration-map-guide">
                    <div className="calibration-center-mark"></div>
                    <div className="calibration-center-dot"></div>
                  </div>
                  
                  {/* Draggable Objectives */}
                  {calibrationPoints.map((point) => (
                    <div
                      key={point.objective}
                      className="draggable-objective"
                      style={{
                        left: `${point.x * 100}%`,
                        top: `${point.y * 100}%`,
                        cursor: draggingObjective === point.objective ? 'grabbing' : 'grab',
                        zIndex: draggingObjective === point.objective ? 102 : 50
                      }}
                      onMouseDown={(e) => handleDragStart(e, point.objective)}
                      title={`${point.objective}\n(${point.x.toFixed(3)}, ${point.y.toFixed(3)})`}
                    >
                      <span className="objective-emoji">{getObjectiveIcon(point.objective)}</span>
                      <small className="objective-label">{point.objective}</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="calibration-points-section">
                <h3>Recorded Points ({calibrationPoints.length})</h3>
                <div className="calibration-points-list">
                  {calibrationPoints.length === 0 ? (
                    <p className="no-points">No points recorded yet. Start clicking on the map!</p>
                  ) : (
                    calibrationPoints.map((point) => (
                      <div key={point.id} className="calibration-point-item">
                        <div className="point-info">
                          <strong>{point.objective}</strong>
                          <code>x: {point.x}, y: {point.y}</code>
                        </div>
                        <button
                          className="point-delete-btn"
                          onClick={() => removeCalibrationPoint(point.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="calibration-code-section">
                <h3>Configuration Code</h3>
                <pre className="calibration-code">
                  {getCalibrationCode()}
                </pre>
                <button
                  className="copy-code-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(getCalibrationCode());
                    alert('Code copied to clipboard!');
                  }}
                >
                  📋 Copy Code
                </button>
              </div>

              <div className="calibration-actions">
                <button
                  className="apply-calibration-btn"
                  onClick={() => {
                    calibrationPoints.forEach(applyCalibrationPoint);
                    setShowCalibration(false);
                    alert('Calibration applied! Reload the page to see changes.');
                  }}
                >
                  ✓ Apply Calibration
                </button>
                <button
                  className="cancel-calibration-btn"
                  onClick={() => setShowCalibration(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="planner-container">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="map-container" ref={containerRef} onClick={showCalibration ? handleCalibrationClick : handleMapClick}>
            <img 
              src={`${process.env.PUBLIC_URL}/background.svg`}
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
            {markings.filter(marking => {
              const isActive = currentTime >= marking.time && currentTime < marking.time + marking.duration;
              return isActive;
            }).map((marking) => (
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

            {/* Render Map Objectives */}
            {/* Military Centers */}
            {currentTime >= MAP_OBJECTIVES.militaryCenter.appearTime && (
              <>
                {MAP_OBJECTIVES.militaryCenter.positions.map((pos, idx) => (
                  <div
                    key={`military-${idx}`}
                    className="objective-marker military"
                    style={{
                      left: `${pos.x * 100}%`,
                      top: `${pos.y * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    title={`${MAP_OBJECTIVES.militaryCenter.name} - @${MAP_OBJECTIVES.militaryCenter.appearTime}:00`}
                  >
                    <div className="objective-icon">{MAP_OBJECTIVES.militaryCenter.icon}</div>
                    <div className="objective-tooltip">
                      <strong>{MAP_OBJECTIVES.militaryCenter.name}</strong>
                      <div className="tooltip-bonuses">
                        {MAP_OBJECTIVES.militaryCenter.bonuses.map((b, i) => (
                          <span key={i}>+{b.value}{b.unit}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Hospital */}
            {currentTime >= MAP_OBJECTIVES.hospital.appearTime && (
              <>
                {MAP_OBJECTIVES.hospital.positions.map((pos, idx) => (
                  <div
                    key={`hospital-${idx}`}
                    className="objective-marker hospital"
                    style={{
                      left: `${pos.x * 100}%`,
                      top: `${pos.y * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    title={`${MAP_OBJECTIVES.hospital.name} - @${MAP_OBJECTIVES.hospital.appearTime}:00`}
                  >
                    <div className="objective-icon">{MAP_OBJECTIVES.hospital.icon}</div>
                    <div className="objective-tooltip">
                      <strong>{MAP_OBJECTIVES.hospital.name}</strong>
                      <div className="tooltip-bonuses">
                        {MAP_OBJECTIVES.hospital.bonuses.map((b, i) => (
                          <span key={i}>+{b.value}{b.unit}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Energy Core */}
            {currentTime >= MAP_OBJECTIVES.energyCore.appearTime && (
              <>
                {/* Diagonal lines from Energy Core */}
                <svg
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 40
                  }}
                >
                  {/* Line to top-left corner */}
                  <line
                    x1={`${MAP_OBJECTIVES.energyCore.position.x * 100}%`}
                    y1={`${MAP_OBJECTIVES.energyCore.position.y * 100}%`}
                    x2="0%"
                    y2="0%"
                    stroke="#FFD700"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                  {/* Line to bottom-right corner */}
                  <line
                    x1={`${MAP_OBJECTIVES.energyCore.position.x * 100}%`}
                    y1={`${MAP_OBJECTIVES.energyCore.position.y * 100}%`}
                    x2="100%"
                    y2="100%"
                    stroke="#FFD700"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                </svg>
                <div
                  className="objective-marker energy-core"
                  style={{
                    left: `${MAP_OBJECTIVES.energyCore.position.x * 100}%`,
                    top: `${MAP_OBJECTIVES.energyCore.position.y * 100}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={`${MAP_OBJECTIVES.energyCore.name} - @${MAP_OBJECTIVES.energyCore.appearTime}:00`}
                >
                  <div className="objective-icon">{MAP_OBJECTIVES.energyCore.icon}</div>
                  <div className="objective-tooltip">
                    <strong>{MAP_OBJECTIVES.energyCore.name}</strong>
                    <div className="tooltip-bonuses">
                      {MAP_OBJECTIVES.energyCore.bonuses.map((b, i) => (
                        <span key={i}>{b.value}{b.unit}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Canyon Captain */}
            {(() => {
              const captain = MAP_OBJECTIVES.captain;
              const activeAppearances = captain.appearances.filter(app => currentTime >= app.time);
              const activeAppearance = activeAppearances.length > 0 ? activeAppearances[activeAppearances.length - 1] : null;
              return activeAppearance ? (
                <div
                  className="objective-marker captain"
                  style={{
                    left: `${captain.position.x * 100}%`,
                    top: `${captain.position.y * 100}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={`${captain.name} - +${activeAppearance.bonus.value}${activeAppearance.bonus.unit}`}
                >
                  <div className="objective-icon">{captain.icon}</div>
                  <div className="objective-tooltip">
                    <strong>{captain.name}</strong>
                    <span>+{activeAppearance.bonus.value}{activeAppearance.bonus.unit} {activeAppearance.bonus.description}</span>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Water Refineries */}
            {currentTime >= MAP_OBJECTIVES.refinery.appearTime && (
              <>
                {MAP_OBJECTIVES.refinery.positions.map((pos, idx) => (
                  <div
                    key={`refinery-${idx}`}
                    className="objective-marker refinery"
                    style={{
                      left: `${pos.x * 100}%`,
                      top: `${pos.y * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    title={`${MAP_OBJECTIVES.refinery.name} ${idx + 1}`}
                  >
                    <div className="objective-icon">{MAP_OBJECTIVES.refinery.icon}</div>
                    <div className="objective-tooltip">
                      <strong>{MAP_OBJECTIVES.refinery.name}</strong>
                      <div className="tooltip-bonuses">
                        {MAP_OBJECTIVES.refinery.bonuses.map((b, i) => (
                          <span key={i}>+{b.value}{b.unit}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          {/* Calibration Button */}
          <button
            className="calibration-btn"
            onClick={() => {
              // Initialize calibration points with current MAP_OBJECTIVES positions
              const initialPoints = [
                { id: 'h1', objective: 'hospital1', x: MAP_OBJECTIVES.hospital.positions[0].x, y: MAP_OBJECTIVES.hospital.positions[0].y },
                { id: 'h2', objective: 'hospital2', x: MAP_OBJECTIVES.hospital.positions[1].x, y: MAP_OBJECTIVES.hospital.positions[1].y },
                { id: 'm1', objective: 'militaryCenter1', x: MAP_OBJECTIVES.militaryCenter.positions[0].x, y: MAP_OBJECTIVES.militaryCenter.positions[0].y },
                { id: 'm2', objective: 'militaryCenter2', x: MAP_OBJECTIVES.militaryCenter.positions[1].x, y: MAP_OBJECTIVES.militaryCenter.positions[1].y },
                { id: 'cap', objective: 'captain', x: MAP_OBJECTIVES.captain.position.x, y: MAP_OBJECTIVES.captain.position.y },
                { id: 'ec', objective: 'energyCore', x: MAP_OBJECTIVES.energyCore.position.x, y: MAP_OBJECTIVES.energyCore.position.y },
                ...MAP_OBJECTIVES.refinery.positions.map((pos, idx) => ({
                  id: `ref${idx + 1}`,
                  objective: `refinery${idx + 1}`,
                  x: pos.x,
                  y: pos.y
                }))
              ];
              setCalibrationPoints(initialPoints);
              setShowCalibration(true);
            }}
            title="Open map calibration tool to set objective positions"
          >
            🎯 Calibrate Map
          </button>

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
                step="1"
                value={currentTime}
                onChange={(e) => {
                  setCurrentTime(parseInt(e.target.value));
                  if (isPlaying) setIsPlaying(false);
                }}
                className="time-slider"
              />
              <div className="time-display">{currentTime} / {maxTime} {t('min')}</div>
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

          {/* Marker Duration Control */}
          <div className="duration-control">
            <h3>⏱️ Marker Duration</h3>
            <div className="duration-input-group">
              <input
                type="number"
                min="1"
                max={maxTime}
                step="1"
                value={markerDuration}
                onChange={(e) => setMarkerDuration(Math.max(1, parseInt(e.target.value) || 1))}
                className="duration-input"
              />
              <span className="duration-unit">min</span>
            </div>
            <p className="duration-info">Markers will stay for {markerDuration} minute{markerDuration !== 1 ? 's' : ''}</p>
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
                    step="1"
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
                  step="1"
                  value={teamTimings[key]}
                  onChange={(e) => handleTeamTimingChange(key, e.target.value)}
                  className="timing-slider"
                />
              </div>
            ))}
          </div>

          {/* Markings List */}
          <div className="markings-section">
            <h3>📍 {t('markings')} ({markings.filter(m => currentTime >= m.time && currentTime < m.time + m.duration).length}/{markings.length})</h3>
            <div className="markings-list">
              {markings.length === 0 ? (
                <p className="empty-message">{t('noMarkings')}</p>
              ) : (
                markings.map((marking) => {
                  const isActive = currentTime >= marking.time && currentTime < marking.time + marking.duration;
                  return (
                    <div 
                      key={marking.id} 
                      className={`marking-entry ${isActive ? 'active' : 'inactive'}`}
                    >
                      <span className="marking-team" style={{ backgroundColor: TEAMS[marking.team].color }}>
                        {marking.team}
                      </span>
                      <span className="marking-coords">{Math.round(marking.x)}, {Math.round(marking.y)}</span>
                      <div className="marking-time-info">
                        <span className="marking-time-label">{marking.time}m</span>
                        <span className="marking-duration-sep">→</span>
                        <span className="marking-time-label">{marking.time + marking.duration}m</span>
                      </div>
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

export default PlannerPage;
