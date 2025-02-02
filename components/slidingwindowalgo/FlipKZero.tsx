import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const WindowAnimationMaxConsecutiveOnes = ({ array, k }: { array: number[]; k: number }) => {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [zeroCount, setZeroCount] = useState(0);
  const [maxLen, setMaxLen] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isPlaying || isFinished) return;

    const interval = setInterval(() => {
      if (right < array.length) {
        if (array[right] === 0) {
          setZeroCount(prev => prev + 1);
        }

        // Shrink window if zero count exceeds k
        if (zeroCount > k) {
          if (array[left] === 0) {
            setZeroCount(prev => prev - 1);
          }
          setLeft(prev => prev + 1);
        }

        setMaxLen(prev => Math.max(prev, right - left + 1));
        setRight(prev => prev + 1);
      } else {
        setIsFinished(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, array, k, isFinished, left, right, zeroCount]);

  const handlePlayPause = () => {
    if (isFinished) {
      setIsFinished(false);
      setLeft(0);
      setRight(0);
      setMaxLen(0);
      setZeroCount(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsFinished(false);
    setLeft(0);
    setRight(0);
    setZeroCount(0);
    setMaxLen(0);
  };

  return (
    <Card className="w-full max-w-auto bg-slate-900">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          {/* K value display */}
          <div className="text-lg text-white">
            <span>Maximum Flips Allowed (k): </span>
            <span className="font-bold text-yellow-300">{k}</span>
          </div>

          {/* Array visualization */}
          <div className="flex gap-2 overflow-x-auto pb-8 relative w-full justify-center">
            {array.map((num, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                {/* Pointer indicators */}
                <div className="h-6 text-sm font-bold">
                  {idx === left && <span className="text-red-500">L</span>}
                  {idx === right && <span className="text-blue-500">R</span>}
                </div>
                
                {/* Array element */}
                <div
                  className={`
                    px-4 py-2 border rounded-lg transition-colors duration-300
                    ${idx >= left && idx <= right 
                      ? num === 0 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                    }
                    font-bold text-lg
                  `}
                >
                  {num}
                </div>
              </div>
            ))}
          </div>

          {/* Stats display */}
          <div className="text-lg text-white space-y-2">
            <p>
              Current Window Zero Count:{' '}
              <span className="font-bold text-yellow-300">
                {isPlaying || isFinished ? zeroCount : '0'}
              </span>
            </p>
            <p>
              Maximum Consecutive Ones:{' '}
              <span className="font-bold text-green-400">
                {isPlaying || isFinished ? maxLen : '0'}
              </span>
            </p>
          </div>

          {/* Controls */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={handlePlayPause}
              disabled={isFinished && isPlaying}
              className={`
                px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-300
                ${isPlaying 
                  ? 'bg-yellow-500 hover:bg-yellow-400' 
                  : 'bg-green-500 hover:bg-green-400'
                }
                disabled:opacity-50
              `}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-lg text-white font-semibold bg-red-500 hover:bg-red-400 transition-colors duration-300"
            >
              Restart
            </button>
          </div>

          {/* Final result */}
          {isFinished && (
            <div className="mt-4 text-2xl font-bold text-blue-300 transition-all duration-300">
              Final Result: {maxLen}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WindowAnimationMaxConsecutiveOnes;