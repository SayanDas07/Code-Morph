"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  array: number[];
  k: number;
}

export default function WindowAnimationMaxConsecutiveOnes({ array, k = 2 }: Props) {
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
        // If the number is 0, increase the zero count
        if (array[right] === 0) {
          setZeroCount((prevZeroCount) => prevZeroCount + 1);
        }

        // Shrink the window from the left if the zero count exceeds k
        while (zeroCount > k) {
          if (array[left] === 0) {
            setZeroCount((prevZeroCount) => prevZeroCount - 1);
          }
          setLeft((prevLeft) => prevLeft + 1);
        }

        setMaxLen((prevMaxLen) => Math.max(prevMaxLen, right - left + 1));

        setRight((prevRight) => prevRight + 1);
      } else {
        setIsFinished(true);
        clearInterval(interval);
      }
    }, 500); // Adjust speed of the animation

    return () => clearInterval(interval);
  }, [isPlaying, array, k, isFinished, left, right, zeroCount]);

  const handlePlayPause = () => {
    if (isFinished) {
      // Reset values when starting again
      setIsFinished(false);
      setLeft(0);
      setRight(0);
      setMaxLen(0);
      setZeroCount(0);
    }
    setIsPlaying(!isPlaying); // Toggle play/pause
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
    <div className="flex flex-col items-center gap-4 bg-slate-900 p-6 rounded-lg shadow-lg w-full max-w-xl">
      {/* Display k value */}
      <div className="text-lg text-white">
        <p>
          Maximum Flips Allowed (k): <span className="font-bold text-yellow-300">{k}</span>
        </p>
      </div>

      {/* Sliding Window Animation */}
      <div className="flex gap-2 text-xl font-bold mb-4 overflow-x-auto relative">
        {array.map((num, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {/* Pointer markers */}
            {idx === left && (
              <motion.div
                className="text-sm text-red-500 font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                L
              </motion.div>
            )}
            {idx === right && (
              <motion.div
                className="text-sm text-blue-500 font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                R
              </motion.div>
            )}
            {/* Array element */}
            <motion.div
              className={`px-4 py-2 border rounded-lg transition-all duration-500 ease-in-out
                ${idx >= left && idx <= right ? "bg-blue-500 text-white" : "bg-gray-200"}
                ${idx >= left && idx <= right && num === 0 ? "bg-green-500 text-white" : ""}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {num}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Display current window details */}
      <div className="text-lg text-white">
        <p>
          Current Window Zero Count:{" "}
          <span className="font-bold text-yellow-300">
            {isPlaying || isFinished ? zeroCount : ""}
          </span>
        </p>
        <p>
          Maximum Consecutive Ones After Flipping:{" "}
          <span className="font-bold text-green-400">
            {isPlaying || isFinished ? maxLen : ""}
          </span>
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handlePlayPause}
          className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-300 ease-in-out
            ${isPlaying ? "bg-yellow-500 hover:bg-yellow-400" : "bg-green-500 hover:bg-green-400"} 
            ${isFinished && !isPlaying ? "bg-gray-600 hover:bg-gray-600" : ""}`}
          disabled={isFinished}
          aria-label={isPlaying ? "Pause the sliding window animation" : "Start the sliding window animation"}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-lg text-white font-semibold bg-red-500 hover:bg-red-400 transition duration-300 ease-in-out"
          aria-label="Reset the animation"
        >
          Restart
        </button>
      </div>

      {/* Display the final result */}
      {isFinished && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4 text-2xl font-bold text-blue-300"
        >
          Max Consecutive Ones After Flipping: {maxLen}
        </motion.div>
      )}
    </div>
  );
}
