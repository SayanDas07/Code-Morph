"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  array: number[];
  k: number;
}

export default function WindowAnimation({ array, k }: Props) {
  const [windowStart, setWindowStart] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isPlaying || isFinished) return;

    const interval = setInterval(() => {
      setWindowStart((prev) => {
        const nextWindowStart = prev + 1;
        if (nextWindowStart <= array.length - k) {
          return nextWindowStart;
        } else {
          setIsFinished(true); // End the animation when the window reaches the end
          clearInterval(interval); // Stop the interval once animation is finished
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, array, k, isFinished]);

  const handlePlayPause = () => {
    if (isFinished) {
      setIsFinished(false);
      setWindowStart(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsFinished(false);
    setWindowStart(0);
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-slate-900 p-6 rounded-lg shadow-lg w-full max-w-xl">
      {/* Sliding Window Animation */}
      <div className="flex gap-2 text-xl font-bold mb-4">
        {array.map((num, idx) => (
          <motion.div
            key={idx}
            className={`px-4 py-2 border rounded-lg transition-all duration-500 ease-in-out
              ${idx >= windowStart && idx < windowStart + k ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {num}
          </motion.div>
        ))}
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
          Reset
        </button>
      </div>

      {/* Status Indicator */}
      {isFinished && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4 text-2xl font-bold text-blue-300"
        >
          End of Array!
        </motion.div>
      )}
    </div>
  );
}
