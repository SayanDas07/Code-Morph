"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Code,
  Database,
  RefreshCw,
  Play,
  Pause,
  AlertCircle,
} from "lucide-react";

interface MaxSubArrayAnimationProps {
  nums?: number[];
  speed?: number;
}

export default function MaxSubArrayAnimation({
  nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4],
  speed = 1500,
}: MaxSubArrayAnimationProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [sum, setSum] = useState<number>(0);
  const [maxi, setMaxi] = useState<number>(Number.MIN_SAFE_INTEGER);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [currentSubarray, setCurrentSubarray] = useState<number[]>([]);
  const [maxSubarray, setMaxSubarray] = useState<number[]>([]);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [activeCodeLine, setActiveCodeLine] = useState<number>(0);
  const [selectedArray, setSelectedArray] = useState<string>("default");
  const [customArray, setCustomArray] = useState<string>(
    "-2, 1, -3, 4, -1, 2, 1, -5, 4"
  );
  const [showArrayInput, setShowArrayInput] = useState<boolean>(false);
  const [currentArray, setCurrentArray] = useState<number[]>(nums);

  // Speed settings with descriptive labels
  const speedOptions = [
    { label: "Very Slow", value: 2500 },
    { label: "Slow", value: 2000 },
    { label: "Normal", value: 1500 },
    { label: "Fast", value: 800 },
    { label: "Very Fast", value: 500 },
  ];

  const [animationSpeed, setAnimationSpeed] = useState<number>(speed);

  // Predefined array options
  const arrayOptions = {
    default: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    alternating: [3, -4, 5, -6, 7, -8, 9, -10],
    allNegative: [-1, -5, -3, -7, -9, -2, -8],
    allPositive: [5, 1, 3, 7, 9, 2, 8],
    custom: [],
  };

  const resetAnimation = () => {
    setCurrentIndex(-1);
    setSum(0);
    setMaxi(Number.MIN_SAFE_INTEGER);
    setIsAnimating(false);
    setIsPaused(false);
    setIsComplete(false);
    setCurrentSubarray([]);
    setMaxSubarray([]);
    setStartIndex(0);
    setActiveCodeLine(0);
  };

  // Start animation
  const startAnimation = () => {
    if (isAnimating && !isPaused) {
      // Pause animation
      setIsPaused(true);
    } else if (isAnimating && isPaused) {
      // Resume animation
      setIsPaused(false);
    } else {
      // Start new animation
      resetAnimation();
      setIsAnimating(true);
      setActiveCodeLine(1); // initialization line
    }
  };

  // Handle array selection
  const handleArrayChange = (option: string) => {
    if (isAnimating && !isPaused) return;

    setSelectedArray(option);

    if (option === "custom") {
      setShowArrayInput(true);
      try {
        const parsedArray = JSON.parse(`[${customArray}]`);
        setCurrentArray(parsedArray);
      } catch {
        // Keep current array if parsing fails
      }
    } else {
      setShowArrayInput(false);
      setCurrentArray(arrayOptions[option as keyof typeof arrayOptions]);
    }

    resetAnimation();
  };

  // Handle custom array input
  const handleCustomArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomArray(e.target.value);
  };

  const applyCustomArray = () => {
    try {
      const parsedArray = JSON.parse(`[${customArray}]`);
      setCurrentArray(parsedArray);
      resetAnimation();
    } catch {
      alert("Invalid array format. Please enter comma-separated numbers.");
    }
  };

  // Animation logic
  useEffect(() => {
    if (!isAnimating || isPaused || isComplete) return;

    const nextIndex = currentIndex + 1;

    if (nextIndex >= currentArray.length) {
      setIsAnimating(false);
      setIsComplete(true);
      setActiveCodeLine(7); // Finished
      return;
    }

    const timer = setTimeout(() => {
      // First highlight the current code line
      setActiveCodeLine(2); // Check array element

      setTimeout(() => {
        // Add current number to sum
        const newSum = sum + currentArray[nextIndex];
        setSum(newSum);
        setActiveCodeLine(3); // Update current sum

        // Update current subarray
        setCurrentSubarray([...currentSubarray, currentArray[nextIndex]]);

        setTimeout(() => {
          // Update maximum sum if needed
          if (newSum > maxi) {
            setMaxi(newSum);
            setMaxSubarray([...currentSubarray, currentArray[nextIndex]]);
            setActiveCodeLine(4); // Update max sum
          }

          setTimeout(() => {
            // Reset sum if it becomes negative
            if (newSum < 0) {
              setSum(0);
              setCurrentSubarray([]);
              setStartIndex(nextIndex + 1);
              setActiveCodeLine(5); // Reset sum
            }

            // Move to next index
            setTimeout(() => {
              setCurrentIndex(nextIndex);
              setActiveCodeLine(6); // Move to next element
            }, animationSpeed * 0.25);
          }, animationSpeed * 0.25);
        }, animationSpeed * 0.25);
      }, animationSpeed * 0.25);
    }, animationSpeed);

    return () => clearTimeout(timer);
  }, [
    currentIndex,
    isAnimating,
    isPaused,
    currentArray,
    sum,
    maxi,
    animationSpeed,
    currentSubarray,
    isComplete,
  ]);

  // Calculate animation duration based on speed setting
  const getAnimationDuration = () => {
    return Math.max(0.1, Math.min(0.5, animationSpeed / 2000));
  };

  // Pseudo code for Kadane's algorithm
  const pseudoCode = [
    { line: "int maxSubArray(int[] nums) {", active: false },
    { line: "    int sum = 0, maxi = INT_MIN;", active: activeCodeLine === 1 },
    {
      line: "    for (int i = 0; i < nums.length; i++) {",
      active: activeCodeLine === 2,
    },
    { line: "        sum += nums[i];", active: activeCodeLine === 3 },
    { line: "        maxi = max(maxi, sum);", active: activeCodeLine === 4 },
    { line: "        if (sum < 0) sum = 0;", active: activeCodeLine === 5 },
    { line: "    }", active: activeCodeLine === 6 },
    { line: "    return maxi;", active: activeCodeLine === 7 },
    { line: "}", active: false },
  ];

  return (
    <div className="p-6 bg-slate-800 rounded-lg shadow-xl min-h-[600px]">
      {/* Controls section */}
      <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-2 w-full lg:w-auto">
            <div className="flex flex-wrap gap-3 mb-2">
              <button
                onClick={() => handleArrayChange("default")}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition ${
                  selectedArray === "default"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                disabled={isAnimating && !isPaused}
              >
                Default Array
              </button>
              <button
                onClick={() => handleArrayChange("alternating")}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition ${
                  selectedArray === "alternating"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                disabled={isAnimating && !isPaused}
              >
                Alternating Array
              </button>
              <button
                onClick={() => handleArrayChange("allPositive")}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition ${
                  selectedArray === "allPositive"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                disabled={isAnimating && !isPaused}
              >
                All Positive
              </button>
              <button
                onClick={() => handleArrayChange("allNegative")}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition ${
                  selectedArray === "allNegative"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                disabled={isAnimating && !isPaused}
              >
                All Negative
              </button>
              <button
                onClick={() => handleArrayChange("custom")}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition ${
                  selectedArray === "custom"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                disabled={isAnimating && !isPaused}
              >
                Custom Array
              </button>
            </div>

            {showArrayInput && (
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  className="flex-grow p-2 bg-slate-800 border border-slate-700 rounded text-white text-sm"
                  value={customArray}
                  onChange={handleCustomArrayChange}
                  placeholder="Enter comma-separated numbers"
                  disabled={isAnimating && !isPaused}
                />
                <button
                  onClick={applyCustomArray}
                  className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm"
                  disabled={isAnimating && !isPaused}
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Speed
              </label>
              <select
                className="bg-slate-800 border border-slate-700 rounded text-white text-sm p-2"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                disabled={isAnimating && !isPaused}
              >
                {speedOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={startAnimation}
              className="h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              disabled={isComplete}
            >
              {isAnimating && !isPaused ? (
                <>
                  <Pause size={16} />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>{isPaused ? "Resume" : "Start"}</span>
                </>
              )}
            </button>

            <button
              onClick={resetAnimation}
              className="h-10 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <RefreshCw size={16} />
              <span>Reset</span>
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
              <h3 className="text-lg font-semibold text-white">
                Array Visualization
              </h3>
            </div>

            <div className="relative h-32 flex items-center justify-center overflow-visible">
              {/* Array elements */}
              <div className="flex flex-wrap items-center justify-center gap-2 z-10">
                {currentArray.map((num, index) => (
                  <motion.div
                    key={index}
                    className={`
                      w-14 h-14 flex items-center justify-center rounded-lg
                      font-mono font-semibold border-2
                      ${
                        index === currentIndex
                          ? "bg-yellow-600 border-yellow-400 text-white"
                          : index < currentIndex && index >= startIndex
                          ? "bg-blue-600 border-blue-400 text-white"
                          : "bg-slate-800 border-slate-700 text-white"
                      }
                      ${
                        maxSubarray.includes(num) &&
                        maxSubarray.indexOf(num) ===
                          index - (startIndex - maxSubarray.indexOf(num))
                          ? "ring-2 ring-green-500"
                          : ""
                      }
                    `}
                    initial={{ scale: 1 }}
                    animate={{
                      scale: index === currentIndex ? [1, 1.1, 1] : 1,
                      y: index === currentIndex ? [0, -10, 0] : 0,
                    }}
                    transition={{ duration: getAnimationDuration() }}
                  >
                    {num}
                  </motion.div>
                ))}
              </div>

              {/* Legend */}
              <div className="absolute bottom-0 right-0 flex items-center gap-3 text-xs p-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-600 rounded-sm mr-1"></div>
                  <span className="text-slate-300">Current</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-sm mr-1"></div>
                  <span className="text-slate-300">Processed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-sm mr-1"></div>
                  <span className="text-slate-300">Max Subarray</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subarrays visualization */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                <h3 className="text-md font-semibold text-white">
                  Current Subarray
                </h3>
              </div>
              <div className="min-h-16 p-3 rounded-lg bg-slate-800 border border-slate-700 flex flex-wrap gap-2 items-center">
                {currentSubarray.length > 0 ? (
                  currentSubarray.map((num, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center w-12 h-12 bg-blue-800 border border-blue-600 rounded-lg text-white font-medium"
                    >
                      {num}
                    </motion.div>
                  ))
                ) : (
                  <span className="text-slate-500">Empty subarray</span>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-slate-300">
                  Elements: {currentSubarray.length}
                </span>
                <span className="font-mono text-blue-400">sum = {sum}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                <h3 className="text-md font-semibold text-white">
                  Maximum Subarray
                </h3>
              </div>
              <div className="min-h-16 p-3 rounded-lg bg-slate-800 border border-slate-700 flex flex-wrap gap-2 items-center">
                {maxSubarray.length > 0 ? (
                  maxSubarray.map((num, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center w-12 h-12 bg-green-800 border border-green-600 rounded-lg text-white font-medium"
                    >
                      {num}
                    </motion.div>
                  ))
                ) : (
                  <span className="text-slate-500">
                    No maximum subarray yet
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-slate-300">
                  Elements: {maxSubarray.length}
                </span>
                <span className="font-mono text-green-400">
                  maxi = {maxi === Number.MIN_SAFE_INTEGER ? "INT_MIN" : maxi}
                </span>
              </div>
            </div>
          </div>

          {/* Result Visualization */}
          <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex items-center mb-3">
              <AlertCircle size={18} className="text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">
                Algorithm Status
              </h3>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg">
              {isComplete ? (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: getAnimationDuration() * 2 }}
                >
                  <div className="mb-2 text-green-400 font-semibold">
                    Algorithm Complete!
                  </div>
                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                      <div className="bg-green-800 border-2 border-green-500 w-20 h-20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                        <span className="text-2xl font-bold text-white">
                          {maxi}
                        </span>
                      </div>
                      <div className="text-sm text-slate-300">Maximum Sum</div>
                    </div>

                    <div className="text-center">
                      <div className="bg-blue-800 border-2 border-blue-500 w-20 h-20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                        <span className="text-2xl font-bold text-white">
                          {maxSubarray.length}
                        </span>
                      </div>
                      <div className="text-sm text-slate-300">Length</div>
                    </div>
                  </div>
                  <div className="mt-3 font-mono text-green-400">
                    return {maxi}; // Maximum subarray sum
                  </div>
                </motion.div>
              ) : isAnimating ? (
                <div className="text-center text-yellow-400">
                  {isPaused
                    ? "Paused - Click Resume to continue algorithm"
                    : "Finding maximum subarray using Kadane's algorithm..."}
                </div>
              ) : (
                <div className="text-center text-slate-400">
                  Click &quot;Start&quot; to begin finding the maximum subarray
                  sum with Kadane&apos;s algorithm
                </div>
              )}
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-700 text-center">
            {isAnimating ? (
              <div className="text-yellow-300 font-medium">
                {isPaused ? (
                  "Algorithm paused - Click Resume to continue"
                ) : (
                  <>
                    {activeCodeLine === 1 &&
                      "Initializing sum = 0 and maxi = INT_MIN..."}
                    {activeCodeLine === 2 &&
                      `Processing array element at index ${
                        currentIndex + 1
                      }...`}
                    {activeCodeLine === 3 &&
                      `Adding ${currentArray[currentIndex]} to current sum...`}
                    {activeCodeLine === 4 &&
                      "Updating maximum sum with current sum value..."}
                    {activeCodeLine === 5 &&
                      "Current sum is negative, resetting to 0..."}
                    {activeCodeLine === 6 && "Moving to next array element..."}
                  </>
                )}
              </div>
            ) : isComplete ? (
              <div className="text-green-400 font-medium">
                Algorithm complete: Maximum subarray sum is {maxi}
              </div>
            ) : (
              <div className="text-slate-400 font-medium">
                Click &quot;Start&quot; to begin finding the maximum subarray
                sum with Kadane&apos;s algorithm
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
                Algorithm Execution
              </h3>
            </div>

            <div className="overflow-auto h-auto font-mono text-sm rounded-lg bg-slate-950 p-3">
              <div>
                {pseudoCode.map((line, index) => (
                  <motion.div
                    key={index}
                    className={`
                      py-1 px-2 my-1 rounded-sm whitespace-pre
                      ${
                        line.active
                          ? "bg-blue-900/40 text-white border-l-2 border-blue-500"
                          : "text-slate-400"
                      }
                    `}
                    animate={{
                      backgroundColor: line.active
                        ? "rgba(30, 58, 138, 0.4)"
                        : "transparent",
                      scale: line.active ? 1.02 : 1,
                    }}
                    transition={{ duration: getAnimationDuration() }}
                  >
                    <span className="mr-2 text-slate-600 select-none">
                      {index + 1}
                    </span>
                    {line.line}
                    {index === 4 && (
                      <div className="text-xs text-slate-400 pl-6 mt-1"></div>
                    )}
                    {index === 5 && (
                      <div className="text-xs text-slate-400 pl-6 mt-1"></div>
                    )}
                  </motion.div>
                ))}

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <h4 className="text-md font-semibold text-white mb-3">
                    Current Step Explanation:
                  </h4>
                  <div className="bg-slate-900 p-3 rounded-lg text-sm">
                    {activeCodeLine === 0 && !isAnimating && !isComplete && (
                      <div className="text-slate-400">
                        Ready to visualize Kadane&apos;s Algorithm for finding
                        the maximum subarray sum. Press &quot;Start&quot; to
                        begin.
                      </div>
                    )}
                    {isAnimating && isPaused ? (
                      <div className="text-yellow-400">
                        <span className="font-bold">Algorithm Paused:</span>{" "}
                        Click the Resume button to continue the algorithm
                        execution.
                      </div>
                    ) : (
                      <>
                        {activeCodeLine === 1 && (
                          <div className="text-blue-400">
                            <span className="font-bold">
                              Initialize Variables:
                            </span>{" "}
                            Set sum = 0 to track the current subarray sum, and
                            maxi = INT_MIN to store the maximum subarray sum
                            found so far.
                          </div>
                        )}
                        {activeCodeLine === 2 && (
                          <div className="text-blue-400">
                            <span className="font-bold">
                              Process Array Element:
                            </span>{" "}
                            We&apos;re now at index {currentIndex + 1}, checking
                            if the element can be added to our current subarray.
                          </div>
                        )}
                        {activeCodeLine === 3 && (
                          <div className="text-blue-400">
                            <span className="font-bold">
                              Update Current Sum:
                            </span>{" "}
                            Add the current element {currentArray[currentIndex]}{" "}
                            to our running sum, which becomes{" "}
                            {sum + currentArray[currentIndex]}.
                          </div>
                        )}
                        {activeCodeLine === 4 && (
                          <div className="text-blue-400">
                            <span className="font-bold">
                              Update Maximum Sum:
                            </span>{" "}
                            Compare the current sum ({sum}) with the maximum sum
                            so far ({maxi}), and update maximum if the current
                            sum is larger.
                          </div>
                        )}
                        {activeCodeLine === 5 && (
                          <div className="text-blue-400">
                            <span className="font-bold">
                              Reset If Negative:
                            </span>{" "}
                            If the current sum ({sum}) becomes negative, we
                            reset it to 0. This is the key insight of
                            Kadane&apos;s algorithm - a negative sum can never
                            contribute to a maximum subarray going forward.
                          </div>
                        )}
                        {activeCodeLine === 6 && (
                          <div className="text-blue-400">
                            <span className="font-bold">
                              Move to Next Element:
                            </span>{" "}
                            Continue to the next array element to process.
                          </div>
                        )}
                        {activeCodeLine === 7 && (
                          <div className="text-green-400">
                            <span className="font-bold">Return Result:</span>{" "}
                            The algorithm has completed! The maximum subarray
                            sum is {maxi}.
                          </div>
                        )}
                      </>
                    )}
                    {activeCodeLine === 0 && isComplete && (
                      <div className="text-green-400">
                        <span className="font-bold">Algorithm complete:</span>{" "}
                        Found maximum subarray sum of{" "}
                        <span className="text-yellow-300">{maxi}</span>.
                      </div>
                    )}
                  </div>

                  {activeCodeLine > 0 || isComplete ? (
                    <div className="mt-3 p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-500">
                        Time Complexity: O(n)
                      </div>
                      <div className="text-xs text-slate-500">
                        Space Complexity: O(1)
                      </div>
                      <div className="text-xs text-slate-300 mt-1 pt-1 border-t border-slate-800">
                        Kadane&apos;s Algorithm finds the maximum subarray sum
                        in linear time by using dynamic programming principles.
                        At each step, we decide whether to extend the current
                        subarray or start a new one.
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
