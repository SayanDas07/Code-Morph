"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  array: number[];
  k: number;
}

export default function WindowAnimation({ array, k }: Props) {
  const [windowStart, setWindowStart] = useState(0);
  const [windowSum, setWindowSum] = useState(0);
  const [maxSum, setMaxSum] = useState(Number.MIN_SAFE_INTEGER);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isPlaying || isFinished) return;

    // Start with the sum of the first window
    if (windowStart === 0) {
      const initialSum = array.slice(0, k).reduce((sum, num) => sum + num, 0);
      setWindowSum(initialSum);
      setMaxSum(initialSum);
    }

    const interval = setInterval(() => {
      setWindowStart((prev) => {
        const nextWindowStart = prev + 1;
        
        if (nextWindowStart <= array.length - k) {
          const newSum = windowSum + array[nextWindowStart + k - 1] - array[nextWindowStart - 1];
          setWindowSum(newSum);
          setMaxSum((prevMax) => Math.max(prevMax, newSum));
          return nextWindowStart;
        } else {
          setIsFinished(true); // Stop animation when the window reaches the end
          clearInterval(interval);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, array, k, isFinished, windowSum, windowStart]);

  const handlePlayPause = () => {
    if (isFinished) {
      setIsFinished(false);
      setWindowStart(0);
      setWindowSum(array.slice(0, k).reduce((sum, num) => sum + num, 0));
      setMaxSum(array.slice(0, k).reduce((sum, num) => sum + num, 0));
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsFinished(false);
    setWindowStart(0);
    setWindowSum(0);
    setMaxSum(Number.MIN_SAFE_INTEGER);
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-slate-900 p-6 rounded-lg shadow-lg w-full max-w-auto">
      {/* Sliding Window Animation */}
      <div className="flex gap-2 text-xl font-bold mb-4 overflow-x-auto">
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

      {/* Window Sum & Max Sum */}
    <div className="text-lg text-white">
        <p>Current Window Sum: 
            <span className="font-bold text-yellow-300">
            {isPlaying || isFinished ? windowSum : ""}
            </span>
        </p>
        <p>Maximum Sum Found: 
            <span className="font-bold text-green-400">
            {isPlaying || isFinished ? maxSum : ""}
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

      {/* Status Indicator */}
      {isFinished && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4 text-2xl font-bold text-blue-300"
        >
          Max Subarray Sum: {maxSum}
        </motion.div>
      )}
    </div>
  );
}
