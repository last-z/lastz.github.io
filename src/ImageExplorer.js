import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ImageExplorer.css';

const PLAYER_SIZE = 80;
const KEYBOARD_STEP = 10;

function ImageExplorer() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const playerRef = useRef(null);
  const [playerX, setPlayerX] = useState(50);
  const [playerY, setPlayerY] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [letterInput, setLetterInput] = useState('');

  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

  const setPlayerPosition = useCallback((newX, newY) => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    const clampedX = clamp(newX, 0, containerWidth - PLAYER_SIZE);
    const clampedY = clamp(newY, 0, containerHeight - PLAYER_SIZE);

    setPlayerX(clampedX);
    setPlayerY(clampedY);
  }, []);

  const handleDragStart = (e) => {
    if (e.target === playerRef.current?.querySelector('input')) {
      return;
    }

    e.preventDefault();
    const rect = playerRef.current?.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (rect && containerRect) {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      setIsDragging(true);
    }
  };

  const handleDrag = useCallback((e) => {
    setIsDragging((isDragging) => {
      if (!isDragging || !containerRef.current) return isDragging;

      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const containerRect = containerRef.current.getBoundingClientRect();
      const rect = playerRef.current?.getBoundingClientRect();

      if (rect) {
        const newX = clientX - containerRect.left - (clientX - rect.left);
        const newY = clientY - containerRect.top - (clientY - rect.top);
        setPlayerPosition(newX, newY);
      }

      return isDragging;
    });
  }, [setPlayerPosition]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (document.activeElement?.tagName === 'INPUT') {
      return;
    }

    setPlayerPosition((playerX, playerY) => {
      let newX = playerX;
      let newY = playerY;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          newY -= KEYBOARD_STEP;
          break;
        case 'ArrowDown':
          e.preventDefault();
          newY += KEYBOARD_STEP;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newX -= KEYBOARD_STEP;
          break;
        case 'ArrowRight':
          e.preventDefault();
          newX += KEYBOARD_STEP;
          break;
        default:
          return playerY;
      }

      setPlayerPosition(newX, newY);
      return playerY;
    });
  }, [setPlayerPosition]);

  const handleLetterInput = (e) => {
    const value = e.target.value.toUpperCase();
    const validLetters = ['A', 'B', 'C', 'D'];
    
    if (value && !validLetters.includes(value)) {
      setLetterInput('');
    } else {
      setLetterInput(value);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDrag);
    document.addEventListener('touchend', handleDragEnd);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDrag);
      document.removeEventListener('touchend', handleDragEnd);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleDrag, handleDragEnd, handleKeyDown]);

  return (
    <div className="explorer-container">
      <h1>Canyon Clash Planner</h1>
      <p className="instructions">Use <strong>Arrow Keys</strong> or <strong>Drag</strong> the square to explore</p>
      
      <div className="game-container" ref={containerRef}>
        <img 
          ref={imageRef}
          className="background-image" 
          src="background.svg" 
          alt="Background"
        />
        <div
          ref={playerRef}
          className={`player ${isDragging ? 'dragging' : ''}`}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          style={{
            left: `${playerX}px`,
            top: `${playerY}px`
          }}
        >
          <input
            type="text"
            className="letter-input"
            maxLength="1"
            placeholder=""
            value={letterInput}
            onChange={handleLetterInput}
          />
        </div>
      </div>

      <div className="coordinates">
        Position: X: <span id="pos-x">{Math.round(playerX)}</span>px, Y: <span id="pos-y">{Math.round(playerY)}</span>px
      </div>
    </div>
  );
}

export default ImageExplorer;
