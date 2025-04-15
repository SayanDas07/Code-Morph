"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code, Database, RefreshCw, Play } from "lucide-react";

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
  const [activeCodeLine, setActiveCodeLine] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Speed settings with descriptive labels
  const speedOptions = [
    { label: "Very Slow", value: 2500 },
    { label: "Slow", value: 2000 },
    { label: "Normal", value: 1500 },
    { label: "Fast", value: 800 },
    { label: "Very Fast", value: 500 }
  ];

  const [animationSpeed, setAnimationSpeed] = useState(1500);

  // Initial window calculation
  useEffect(() => {
    if (!isPlaying || isFinished) return;

    // Function to run the algorithm step by step
    const runAlgorithm = async () => {
      if (windowStart === 0 && animationPhase === 0) {
        // Step 1: Initialize variables
        setActiveCodeLine(1); // vector<int> result
        await new Promise(resolve => setTimeout(resolve, animationSpeed * 0.3));

        setActiveCodeLine(2); // int windowSum = 0
        await new Promise(resolve => setTimeout(resolve, animationSpeed * 0.3));

        // Step 2: Calculate first window sum
        setActiveCodeLine(4); // First for loop line
        await new Promise(resolve => setTimeout(resolve, animationSpeed * 0.3));

        // Update sum and highlight the sum line
        setActiveCodeLine(5); // windowSum += arr[i]
        const initialSum = array.slice(0, k).reduce((sum, num) => sum + num, 0);
        setWindowSum(initialSum);
        setMaxSum(initialSum);
        await new Promise(resolve => setTimeout(resolve, animationSpeed * 0.5));

        // Step 3: Store first window sum
        setActiveCodeLine(7); // result.push_back
        await new Promise(resolve => setTimeout(resolve, animationSpeed * 0.3));

        // Step 4: Prepare for sliding
        setActiveCodeLine(8); // Comment line
        setAnimationPhase(1); // Move to sliding phase
        await new Promise(resolve => setTimeout(resolve, animationSpeed * 0.3));
      }
    };

    runAlgorithm();
  }, [isPlaying, isFinished, windowStart, animationPhase, animationSpeed, array, k]);

  // Sliding window effect
  useEffect(() => {
    if (!isPlaying || isFinished || animationPhase === 0) return;

    const interval = setInterval(async () => {
      const nextWindowStart = windowStart + 1;

      if (nextWindowStart <= array.length - k) {
        // Highlight the for loop condition
        setActiveCodeLine(9);
        await new Promise(resolve => setTimeout(resolve, animationSpeed * 0.3));

        // Highlight the window sum update
        setActiveCodeLine(10);
        const newSum = windowSum + array[nextWindowStart + k - 1] - array[nextWindowStart - 1];
        setWindowSum(newSum);
        setMaxSum(prevMax => Math.max(prevMax, newSum));
        await new Promise(resolve => setTimeout(resolve, animationSpeed * 0.3));

        // Highlight result push
        setActiveCodeLine(11);
        await new Promise(resolve => setTimeout(resolve, animationSpeed * 0.2));

        // Move window
        setWindowStart(nextWindowStart);

        // Back to for loop for next iteration
        setActiveCodeLine(9);
      } else {
        // Algorithm completed
        setIsFinished(true);
        setActiveCodeLine(13); // Return result line
        clearInterval(interval);
      }
    }, animationSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, isFinished, windowStart, animationPhase, windowSum, array, k, animationSpeed]);

  const handlePlayPause = () => {
    if (isFinished) {
      setIsFinished(false);
      setWindowStart(0);
      setWindowSum(0);
      setMaxSum(Number.MIN_SAFE_INTEGER);
      setActiveCodeLine(0);
      setAnimationPhase(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsFinished(false);
    setWindowStart(0);
    setWindowSum(0);
    setMaxSum(Number.MIN_SAFE_INTEGER);
    setActiveCodeLine(0);
    setAnimationPhase(0);
  };

  // Pseudo code for the algorithm
  const pseudoCode = [
    { line: "vector<int> slidingWindow(vector<int>& arr, int k) {", active: activeCodeLine === 0 },
    { line: "  vector<int> result;", active: activeCodeLine === 1 },
    { line: "  int windowSum = 0;", active: activeCodeLine === 2 },
    { line: "  // Calculate the sum of the first window", active: activeCodeLine === 3 },
    { line: "  for (int i = 0; i < k; ++i) {", active: activeCodeLine === 4 },
    { line: "    windowSum += arr[i];", active: activeCodeLine === 5 },
    { line: "  }", active: activeCodeLine === 6 },
    { line: "  result.push_back(windowSum);", active: activeCodeLine === 7 },
    { line: "  // Slide the window and update the sum", active: activeCodeLine === 8 },
    { line: "  for (int i = k; i < arr.size(); ++i) {", active: activeCodeLine === 9 },
    { line: "    windowSum += arr[i] - arr[i - k];", active: activeCodeLine === 10 },
    { line: "    result.push_back(windowSum);", active: activeCodeLine === 11 },
    { line: "  }", active: activeCodeLine === 12 },
    { line: "  return result;", active: activeCodeLine === 13 },
    { line: "}", active: activeCodeLine === 14 }
  ];

  // Animation duration for motion components based on speed setting
  const getAnimationDuration = () => {
    return Math.max(0.1, Math.min(0.5, animationSpeed / 2000));
  };

  return (
    <div className="p-6 bg-slate-800 rounded-lg shadow-xl min-h-[600px]">
      {/* Controls section */}
      <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white">
              Sliding Window Size(k): {k}
            </div>
            <div className="px-4 py-2 rounded-lg font-semibold bg-slate-800 text-slate-300">
              Array: [{array.join(', ')}]
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Speed</label>
              <select
                className="bg-slate-800 border border-slate-700 rounded text-white text-sm p-2"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                disabled={isPlaying}
              >
                {speedOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePlayPause}
              className="h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isFinished && isPlaying}
            >
              <Play size={16} />
              <span>{isPlaying ? "Pause" : "Start"}</span>
            </button>

            <button
              onClick={handleReset}
              className="h-10 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={!isPlaying && activeCodeLine === 0 && !isFinished}
            >
              <RefreshCw size={16} />
              <span>Restart</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap">
        {/* Visualization Section (2/3) */}
        <div className="w-full lg:w-2/3 pr-0 lg:pr-6">
          {/* Array visualization */}
          <div className="mb-6 p-4 bg-slate-950 rounded-lg border border-slate-700">
            <div className="flex items-center mb-3">
              <Database size={18} className="text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Sliding Window Visualization (Here we only show the maximux sum not the whole result array)</h3>
            </div>

            <div className="relative py-8 flex items-center justify-center overflow-hidden">
              <div className="absolute w-full h-1 bg-slate-700"></div>
              <div className="flex items-center justify-center gap-1 z-10">
                {array.map((num, idx) => (
                  <motion.div
                    key={idx}
                    className={`
                      w-16 h-16 flex items-center justify-center font-bold text-lg
                      ${idx >= windowStart && idx < windowStart + k
                        ? (activeCodeLine === 4 || activeCodeLine === 5) && windowStart === 0
                          ? "bg-green-500 text-white" // First window calculation phase
                          : "bg-blue-500 text-white"  // Regular sliding window
                        : "bg-slate-800 text-slate-300"
                      }
                      ${(isFinished || windowStart > 0) && idx >= windowStart && idx < windowStart + k && windowSum === maxSum
                        ? "ring-2 ring-yellow-400"
                        : ""
                      }
                    `}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      scale: idx >= windowStart && idx < windowStart + k ? 1.1 : 1,
                      y: idx >= windowStart && idx < windowStart + k ? -5 : 0
                    }}
                    transition={{ duration: getAnimationDuration() }}
                  >
                    {num}
                    {idx === windowStart && (
                      <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="absolute w-6 h-6 bg-green-500 rounded-full top-[-20px] text-xs flex items-center justify-center font-bold"
                      >
                        S
                      </motion.div>
                    )}
                    {idx === windowStart + k - 1 && (
                      <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute w-6 h-6 bg-purple-500 rounded-full bottom-[-20px] text-xs flex items-center justify-center font-bold"
                      >
                        E
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex justify-center items-center mt-4">
              <div className="flex gap-3 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-slate-300">Start</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-slate-300">End</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                  <span className="text-slate-300">Current Window</span>
                </div>
              </div>
            </div>
          </div>

          {/* Window Sum & Max Sum */}
          <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex items-center mb-3">
              <Code size={18} className="text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Window Results</h3>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg">
              {activeCodeLine > 0 ? (
                <motion.div
                  className="flex flex-col items-center gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: getAnimationDuration() * 2 }}
                >
                  {/* Current Window Sum */}
                  <div className="text-center">
                    <div className="mb-2 text-blue-400 font-semibold">Current Window Sum</div>
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className={`
                          w-20 h-20 rounded-lg flex items-center justify-center mb-2 mx-auto
                          ${activeCodeLine === 5 || activeCodeLine === 10 ? "bg-blue-600 border-2 border-yellow-400" : "bg-blue-800 border-2 border-blue-500"}
                        `}>
                          <span className="text-2xl font-bold text-white">{windowSum || 0}</span>
                        </div>
                        <div className="text-sm text-slate-300">
                          {windowStart === 0 && activeCodeLine < 8 ? "Initial Window" :
                            `Window [${windowStart} to ${windowStart + k - 1}]`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Maximum Sum */}
                  <div className="text-center">
                    <div className="mb-2 text-yellow-400 font-semibold">Maximum Sum Found</div>
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className={`
                          bg-yellow-800 border-2 border-yellow-500 w-20 h-20 rounded-lg 
                          flex items-center justify-center mb-2 mx-auto
                          ${windowSum === maxSum && (activeCodeLine === 5 || activeCodeLine === 10) ? "ring-4 ring-green-400" : ""}
                        `}>
                          <span className="text-2xl font-bold text-white">{maxSum !== Number.MIN_SAFE_INTEGER ? maxSum : "-"}</span>
                        </div>
                        <div className="text-sm text-slate-300">{isFinished ? "Final Result" : "So Far"}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center text-slate-400">
                  Start the algorithm to see window sums
                </div>
              )}
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-700 text-center">
            {isPlaying ? (
              <div className="text-yellow-300 font-medium">
                {activeCodeLine === 1 && "Initializing result array..."}
                {activeCodeLine === 2 && "Initializing window sum variable..."}
                {activeCodeLine === 4 && "Starting first window calculation..."}
                {activeCodeLine === 5 && "Adding elements to first window sum..."}
                {activeCodeLine === 7 && "Storing first window sum in result array..."}
                {activeCodeLine === 8 && "Preparing to slide the window..."}
                {activeCodeLine === 9 && "Checking if we can slide further..."}
                {activeCodeLine === 10 && "Updating window sum by adding new element and removing old element..."}
                {activeCodeLine === 11 && "Storing current window sum in result array..."}
                {activeCodeLine === 13 && "Algorithm completed, returning all window sums..."}
              </div>
            ) : isFinished ? (
              <div className="text-green-400 font-medium">
                Algorithm complete: Maximum sliding window sum is {maxSum}
              </div>
            ) : (
              <div className="text-slate-400 font-medium">
                Click &quot;Start&quot; to begin the sliding window algorithm visualization
              </div>
            )}
          </div>
        </div>

        {/* Code Section (1/3) */}
        <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 h-full">
            <div className="flex items-center mb-3">
              <Code size={18} className="text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">
                Code Execution
              </h3>
            </div>

            <div className="overflow-auto h-auto font-mono text-sm rounded-lg bg-slate-950 p-3">
              <div>
                {pseudoCode.map((line, index) => (
                  <motion.div
                    key={index}
                    className={`
                      py-1 px-2 my-1 rounded-sm
                      ${line.active
                        ? "bg-blue-900/40 text-white border-l-2 border-blue-500"
                        : "text-slate-400"}
                    `}
                    animate={{
                      backgroundColor: line.active ? "rgba(30, 58, 138, 0.4)" : "transparent",
                      scale: line.active ? 1.02 : 1,
                    }}
                    transition={{ duration: getAnimationDuration() }}
                  >
                    <span className="mr-2 text-slate-600 select-none">{index + 1}</span>
                    {line.line}
                  </motion.div>
                ))}

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <h4 className="text-md font-semibold text-white mb-3">Current Step Explanation:</h4>
                  <div className="bg-slate-900 p-3 rounded-lg text-sm">
                    {activeCodeLine === 0 && !isPlaying && !isFinished && (
                      <div className="text-slate-400">
                        Ready to visualize the Sliding Window algorithm.
                        Press &quot;Start&quot; to begin.
                      </div>
                    )}
                    {activeCodeLine === 1 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Initialize Result Array:</span> Create an empty vector to store all window sums.
                      </div>
                    )}
                    {activeCodeLine === 2 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Initialize Window Sum:</span> Set initial window sum to zero before calculation.
                      </div>
                    )}
                    {activeCodeLine === 4 && (
                      <div className="text-blue-400">
                        <span className="font-bold">First Window Loop:</span> Loop through first K elements to calculate initial window sum.
                      </div>
                    )}
                    {activeCodeLine === 5 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Sum First Window:</span> Add each element to our window sum.
                        The green highlighted elements in the visualization show this first window.
                      </div>
                    )}
                    {activeCodeLine === 7 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Store First Result:</span> Add the first window sum to our result array.
                      </div>
                    )}
                    {activeCodeLine === 8 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Begin Sliding Process:</span> Now we will slide the window one element at a time.
                      </div>
                    )}
                    {activeCodeLine === 9 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Sliding Loop:</span> Loop through remaining elements to calculate all window sums.
                        The blue highlighted elements show the current window position.
                      </div>
                    )}
                    {activeCodeLine === 10 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Update Window Sum:</span> Add the new element and subtract the element that is no longer in the window.
                        Notice how the window sum is efficiently updated without recalculating the entire sum.
                      </div>
                    )}
                    {activeCodeLine === 11 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Store Window Sum:</span> Add the current window sum to our result array.
                        We were also tracking the maximum sum among all windows.
                      </div>
                    )}
                    {activeCodeLine === 13 && (
                      <div className="text-green-400">
                        <span className="font-bold">Return Result:</span> Return the array of all window sums.
                        In our visualization, we were highlighting the maximum sum found: {maxSum}.
                      </div>
                    )}
                    {activeCodeLine === 0 && isFinished && (
                      <div className="text-green-400">
                        <span className="font-bold">Algorithm complete:</span> Found the maximum window sum
                        of <span className="text-yellow-300">{maxSum}</span>.
                      </div>
                    )}
                  </div>

                  {activeCodeLine > 0 && (
                    <div className="mt-3 p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-500">Time Complexity: O(n)</div>
                      <div className="text-xs text-slate-500">Space Complexity: O(1) for max sum only, O(n-k+1) with all sums</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}