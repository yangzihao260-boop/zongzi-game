/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect, useRef, useCallback, MouseEvent } from 'react';
import { motion } from 'motion/react';
import { playBounceSound, playGameOverSound } from './audio';

const GAME_WIDTH = 600;
const GAME_HEIGHT = 800;
const BOAT_WIDTH = 100;
const BOAT_HEIGHT = 30;
const ZONGZI_SIZE = 50;

export default function App() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(true);
  const boatX = useRef(GAME_WIDTH / 2 - BOAT_WIDTH / 2);
  const zongzi = useRef({ x: GAME_WIDTH / 2, y: 50, dx: 4, dy: 4, speed: 1 });
  const requestRef = useRef<number>();
  
  const containerRef = useRef<HTMLDivElement>(null);

  const resetGame = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setPaused(false);
    zongzi.current = { x: GAME_WIDTH / 2, y: 50, dx: 4, dy: 4, speed: 1 };
  }, []);

  const animate = useCallback((time: number) => {
    if (paused || gameOver) return;

    let { x, y, dx, dy, speed } = zongzi.current;

    x += dx * speed;
    y += dy * speed;

    // Wall collision
    if (x <= 0 || x >= GAME_WIDTH - ZONGZI_SIZE) {
      dx = -dx;
      playBounceSound();
    }
    if (y <= 0) {
      dy = -dy;
      playBounceSound();
    }

    // Boat collision
    if (
      y + ZONGZI_SIZE >= GAME_HEIGHT - 100 &&
      y + ZONGZI_SIZE <= GAME_HEIGHT - 100 + BOAT_HEIGHT &&
      x + ZONGZI_SIZE / 2 >= boatX.current &&
      x + ZONGZI_SIZE / 2 <= boatX.current + BOAT_WIDTH
    ) {
      dy = -Math.abs(dy);
      speed += 0.2;
      setScore(s => s + 5);
      playBounceSound();
    }

    // Game over
    if (y >= GAME_HEIGHT) {
      setGameOver(true);
      playGameOverSound();
      return;
    }

    zongzi.current = { x, y, dx, dy, speed };
    
    // Simple rendering could be here, but using React state for positions
    requestRef.current = requestAnimationFrame(animate);
    
    // Force re-render for positions
    // In a real game, this might be better with canvas
    setForceUpdate(prev => !prev);
  }, [paused, gameOver]);

  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [animate]);

  const handleMouseMove = (e: MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      boatX.current = Math.max(0, Math.min(GAME_WIDTH - BOAT_WIDTH, e.clientX - rect.left - BOAT_WIDTH / 2));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-100 font-sans">
      <div 
        ref={containerRef}
        className="relative bg-white border-4 border-sky-300 shadow-xl overflow-hidden cursor-none"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onMouseMove={handleMouseMove}
      >
        {/* River */}
        <div className="absolute bottom-0 w-full h-20 bg-blue-500/80" />

        {/* Zongzi */}
        <motion.img
          src="zongzi.png"
          alt="Zongzi"
          className="absolute"
          style={{ 
            width: ZONGZI_SIZE, 
            height: ZONGZI_SIZE,
            left: zongzi.current.x,
            top: zongzi.current.y
          }}
        />

        {/* Boat */}
        <div
          className="absolute bg-amber-800 rounded-t-lg"
          style={{ 
            width: BOAT_WIDTH, 
            height: BOAT_HEIGHT,
            left: boatX.current,
            bottom: 80 
          }}
        />

        {/* Score */}
        <div className="absolute top-4 left-4 text-2xl font-bold text-sky-900">
          Score: {score}
        </div>

        {/* Overlays */}
        {(paused || gameOver) && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white gap-4">
            {gameOver ? (
              <>
                <h2 className="text-4xl font-bold">Game Over!</h2>
                <p>Final Score: {score}</p>
                <button onClick={resetGame} className="px-6 py-2 bg-sky-600 rounded-lg">Try Again</button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold">Zongzi Catcher</h2>
                <button onClick={() => setPaused(false)} className="px-6 py-2 bg-sky-600 rounded-lg">Start Game</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

