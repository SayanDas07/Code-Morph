import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';

interface QueueItem {
  position: [number, number];
  time: number;
}

export const RottingOrangesVisualizer = () => {
  const [grid, setGrid] = useState([
    [2, 1, 1],
    [1, 1, 0],
    [0, 1, 1],
  ]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [visited, setVisited] = useState<boolean[][]>([]);
  const [freshCount, setFreshCount] = useState(0);
  const [rottenCount, setRottenCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [currentCell, setCurrentCell] = useState<[number, number] | null>(null);
  const [speed, setSpeed] = useState(1000);

  // Initialize BFS
  useEffect(() => {
    const initializeSimulation = () => {
      const rows = grid.length;
      const cols = grid[0].length;
      const newQueue: QueueItem[] = [];
      const newVisited = Array(rows).fill(0).map(() => Array(cols).fill(false));
      let fresh = 0;
      let rotten = 0;

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (grid[i][j] === 2) {
            newQueue.push({ position: [i, j], time: 0 });
            newVisited[i][j] = true;
            rotten++;
          } else if (grid[i][j] === 1) {
            fresh++;
          }
        }
      }

      setQueue(newQueue);
      setVisited(newVisited);
      setFreshCount(fresh);
      setRottenCount(rotten);
    };

    initializeSimulation();
  }, []);

  const dx = [-1, 0, 1, 0];
  const dy = [0, 1, 0, -1];

  const simulateStep = () => {
    if (queue.length === 0) {
      setIsPlaying(false);
      return;
    }

    const { position: [r, c], time } = queue[0];
    const newQueue = [...queue.slice(1)];
    const newGrid = [...grid.map((row) => [...row])];
    const newVisited = [...visited.map((row) => [...row])];

    setCurrentCell([r, c]);
    setCurrentTime(time);

    for (let i = 0; i < 4; i++) {
      const nr = r + dx[i];
      const nc = c + dy[i];

      if (
        nr >= 0 &&
        nr < grid.length &&
        nc >= 0 &&
        nc < grid[0].length &&
        !newVisited[nr][nc] &&
        newGrid[nr][nc] === 1
      ) {
        newQueue.push({ position: [nr, nc], time: time + 1 });
        newGrid[nr][nc] = 2;
        newVisited[nr][nc] = true;
        setRottenCount((prev) => prev + 1);
        setFreshCount((prev) => prev - 1);
      }
    }

    setQueue(newQueue);
    setGrid(newGrid);
    setVisited(newVisited);
    setStep((prev) => prev + 1);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(simulateStep, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, queue, speed]);

  const getCellColor = (value: number, isHighlighted: boolean) => {
    if (isHighlighted) return 'bg-yellow-200';
    switch (value) {
      case 0:
        return 'bg-gray-100';
      case 1:
        return 'bg-orange-100';
      case 2:
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getCellBorder = (value: number) => {
    switch (value) {
      case 0:
        return 'border-gray-300';
      case 1:
        return 'border-orange-400';
      case 2:
        return 'border-red-400';
      default:
        return 'border-gray-300';
    }
  };

  const reset = () => {
    setGrid([
      [2, 1, 1],
      [1, 1, 0],
      [0, 1, 1],
    ]);
    setStep(0);
    setCurrentTime(0);
    setIsPlaying(false);
    setCurrentCell(null);
    setQueue([]);
    setVisited([]);
    setFreshCount(0);
    setRottenCount(0);

    // Re-initialize
    const rows = 3;
    const cols = 3;
    const newQueue: QueueItem[] = [];
    const newVisited = Array(rows).fill(0).map(() => Array(cols).fill(false));
    let fresh = 0;
    let rotten = 0;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j] === 2) {
          newQueue.push({ position: [i, j], time: 0 });
          newVisited[i][j] = true;
          rotten++;
        } else if (grid[i][j] === 1) {
          fresh++;
        }
      }
    }

    setQueue(newQueue);
    setVisited(newVisited);
    setFreshCount(fresh);
    setRottenCount(rotten);
  };

  return (
    <div className="p-8 bg-gray-900 text-white rounded-lg shadow-lg max-w-auto mx-auto">
      <h1 className="text-2xl font-bold mb-6 bg-gray-800">Rotting Oranges Problem Visualization</h1>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Given Grid Matrix</h2>
            <div className="grid grid-cols-3 gap-2">
              {grid.map((row, i) =>
                row.map((cell, j) => (
                  <motion.div
                    key={`${i}-${j}`}
                    className={`w-20 h-20 border-2 rounded-lg flex items-center justify-center
                      ${getCellColor(cell, currentCell?.[0] === i && currentCell?.[1] === j)}
                      ${getCellBorder(cell)}`}
                    initial={{ scale: 0.9 }}
                    animate={{
                      scale: currentCell?.[0] === i && currentCell?.[1] === j ? [1, 1.1, 1] : 1,
                      rotate: cell === 2 ? [0, 2, -2, 0] : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-2xl">
                      {cell === 1 ? '🍊' : cell === 2 ? '🦠' : ''}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Simulation Speed</label>
              <div className="flex gap-4 items-center">
                <span className="text-sm">Slow</span>

                <div className='bg-zinc-100'>
                  <Slider
                    value={[2000 - speed]} // Invert the initial value
                    onValueChange={(value) => setSpeed(2000 - value[0])} // Keep the same calculation for consistency
                    min={200}
                    max={1800}
                    step={100}
                    className="w-48"
                  />
                </div>
                <span className="text-sm">Fast</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {isPlaying ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Go to Previous state
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">BFS Queue</h2>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {queue.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2 p-2 bg-gray-800 rounded border border-gray-200"
                >
                  <span className="font-mono">
                    ({item.position[0]}, {item.position[1]}) - Time: {item.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Results</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Fresh Oranges:</span>
                <motion.span key={freshCount} initial={{ scale: 1.2 }} animate={{ scale: 1 }}>
                  {freshCount}
                </motion.span>
              </div>
              <div className="flex justify-between">
                <span>Rotten Oranges:</span>
                <motion.span key={rottenCount} initial={{ scale: 1.2 }} animate={{ scale: 1 }}>
                  {rottenCount}
                </motion.span>
              </div>
              <div className="flex justify-between">
                <span>Current Time:</span>
                <span>{currentTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Steps:</span>
                <span>{step}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Specifications</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-orange-100 border-2 border-orange-400 rounded"></span>
                <span>Fresh Orange (1)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-100 border-2 border-red-400 rounded"></span>
                <span>Rotten Orange (2)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></span>
                <span>Empty Cell (0)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-yellow-200 border-2 border-yellow-400 rounded"></span>
                <span>Current Cell</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


