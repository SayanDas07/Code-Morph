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
  CheckCircle2,
} from "lucide-react";

interface MajorityElementAnimationProps {
  nums?: number[];
  speed?: number;
}

export default function MajorityElementAnimation({
  nums = [2, 2, 1, 1, 1, 2, 2],
  speed = 1500,
}: MajorityElementAnimationProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [count, setCount] = useState<number>(0);
  const [candidate, setCandidate] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [selectedArray, setSelectedArray] = useState<string>("default");
  const [customArray, setCustomArray] = useState<string>("2,2,1,1,1,2,2");
  const [showArrayInput, setShowArrayInput] = useState<boolean>(false);
  const [currentArray, setCurrentArray] = useState<number[]>(nums);
  const [activeCodeLine, setActiveCodeLine] = useState<number>(0);

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
    default: [2, 2, 1, 1, 1, 2, 2],
    balanced: [3, 3, 4, 3, 4, 4, 3, 3],
    noMajority: [1, 2, 3, 4, 5, 6, 7],
    singleElement: [8, 8, 8, 8, 8],
    custom: [],
  };

  const resetAnimation = () => {
    setCurrentIndex(-1);
    setCount(0);
    setCandidate(null);
    setResult(null);
    setIsAnimating(false);
    setIsPaused(false);
    setIsComplete(false);
    setActiveCodeLine(0);
  };

  // Start animation
  const startAnimation = () => {
    if (isAnimating && !isPaused) {
      setIsPaused(true);
    } else if (isAnimating && isPaused) {
      setIsPaused(false);
    } else {
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
        const parsedArray = customArray
          .split(",")
          .map((item) => parseInt(item.trim()));
        if (!parsedArray.some(isNaN)) {
          setCurrentArray(parsedArray);
        }
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
      const parsedArray = customArray
        .split(",")
        .map((item) => parseInt(item.trim()));
      if (parsedArray.some(isNaN)) {
        alert("Invalid array format. Please enter comma-separated numbers.");
        return;
      }
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

    const timer = setTimeout(() => {
      setActiveCodeLine(2); // Process current element

      setTimeout(() => {
        if (nextIndex >= currentArray.length) {
          // Final verification phase
          setActiveCodeLine(6); // Verify candidate
          
          const finalCount = currentArray.filter(
            (num) => num === candidate
          ).length;
          const isMajority = finalCount > currentArray.length / 2;
          
          setTimeout(() => {
            setResult(isMajority ? candidate : null);
            setIsAnimating(false);
            setIsComplete(true);
            setActiveCodeLine(7); // Return result
          }, animationSpeed * 0.5);
          
          return;
        }

        setCurrentIndex(nextIndex);

        setTimeout(() => {
          if (count === 0) {
            setActiveCodeLine(3); // New candidate
            setCount(1);
            setCandidate(currentArray[nextIndex]);
          } else if (currentArray[nextIndex] === candidate) {
            setActiveCodeLine(4); // Increment count
            setCount(count + 1);
          } else {
            setActiveCodeLine(5); // Decrement count
            setCount(count - 1);
          }
        }, animationSpeed * 0.3);
      }, animationSpeed * 0.3);
    }, animationSpeed * 0.4);

    return () => clearTimeout(timer);
  }, [
    currentIndex,
    isAnimating,
    isPaused,
    currentArray,
    count,
    candidate,
    animationSpeed,
    isComplete,
  ]);

  // Calculate animation duration based on speed setting
  const getAnimationDuration = () => {
    return Math.max(0.1, Math.min(0.5, animationSpeed / 2000));
  };

  // Pseudo code for Boyer-Moore Voting Algorithm
  const pseudoCode = [
    { line: "int majorityElement(int[] nums) {", active: false },
    { line: "    int count = 0, candidate = null;", active: activeCodeLine === 1 },
    { line: "    for (int num : nums) {", active: activeCodeLine === 2 },
    { line: "        if (count == 0) candidate = num;", active: activeCodeLine === 3 },
    { line: "        if (num == candidate) count++;", active: activeCodeLine === 4 },
    { line: "        else count--;", active: activeCodeLine === 5 },
    { line: "    }", active: false },
    { line: "    // Verify the candidate is a majority", active: activeCodeLine === 6 },
    { line: "    return candidate; // If verified", active: activeCodeLine === 7 },
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
                onClick={() => handleArrayChange("balanced")}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition ${
                  selectedArray === "balanced"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                disabled={isAnimating && !isPaused}
              >
                Balanced Array
              </button>
              <button
                onClick={() => handleArrayChange("noMajority")}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition ${
                  selectedArray === "noMajority"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                disabled={isAnimating && !isPaused}
              >
                No Majority
              </button>
              <button
                onClick={() => handleArrayChange("singleElement")}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition ${
                  selectedArray === "singleElement"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                disabled={isAnimating && !isPaused}
              >
                Single Element
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
                          : index < currentIndex
                          ? "bg-blue-600 border-blue-400 text-white"
                          : "bg-slate-800 border-slate-700 text-white"
                      }
                      ${
                        isComplete && num === result
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
                {isComplete && result !== null && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-600 rounded-sm mr-1"></div>
                    <span className="text-slate-300">Majority Element</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Candidate and Count visualization */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                <h3 className="text-md font-semibold text-white">
                  Current Candidate
                </h3>
              </div>
              <div className="h-24 p-3 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                {candidate !== null ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center w-16 h-16 bg-blue-800 border border-blue-600 rounded-lg text-white font-medium text-xl"
                  >
                    {candidate}
                  </motion.div>
                ) : (
                  <span className="text-slate-500">No candidate yet</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                <h3 className="text-md font-semibold text-white">
                  Current Count
                </h3>
              </div>
              <div className="h-24 p-3 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                <motion.div
                  key={count}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center w-16 h-16 bg-green-800 border border-green-600 rounded-lg text-white font-medium text-xl"
                >
                  {count}
                </motion.div>
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
                    {result !== null ? (
                      <>
                        <div className="text-center">
                          <div className="bg-green-800 border-2 border-green-500 w-20 h-20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                            <span className="text-2xl font-bold text-white">
                              {result}
                            </span>
                          </div>
                          <div className="text-sm text-slate-300">Majority Element</div>
                        </div>

                        <div className="text-center">
                          <div className="bg-blue-800 border-2 border-blue-500 w-20 h-20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                            <CheckCircle2 size={36} className="text-green-400" />
                          </div>
                          <div className="text-sm text-slate-300">Verified</div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-red-400 font-medium">
                        No majority element found in the array
                      </div>
                    )}
                  </div>
                  <div className="mt-3 font-mono text-green-400">
                    return {result !== null ? result : "null"}; // {result !== null ? "Majority element" : "No majority element"}
                  </div>
                </motion.div>
              ) : isAnimating ? (
                <div className="text-center text-yellow-400">
                  {isPaused
                    ? "Paused - Click Resume to continue algorithm"
                    : "Finding majority element using Boyer-Moore Voting algorithm..."}
                </div>
              ) : (
                <div className="text-center text-slate-400">
                  Click &quot;Start&quot; to begin finding the majority element
                  with Boyer-Moore Voting algorithm
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
                      "Initializing count = 0 and candidate = null..."}
                    {activeCodeLine === 2 &&
                      `Processing array element at index ${
                        currentIndex + 1
                      }...`}
                    {activeCodeLine === 3 &&
                      "Count is 0, setting new candidate..."}
                    {activeCodeLine === 4 &&
                      "Element matches candidate, incrementing count..."}
                    {activeCodeLine === 5 &&
                      "Element doesn't match candidate, decrementing count..."}
                    {activeCodeLine === 6 && 
                      "Verifying if candidate is the majority element..."}
                  </>
                )}
              </div>
            ) : isComplete ? (
              <div className="text-green-400 font-medium">
                {result !== null 
                  ? `Algorithm complete: Majority element is ${result}`
                  : "Algorithm complete: No majority element found"}
              </div>
            ) : (
              <div className="text-slate-400 font-medium">
                Click &quot;Start&quot; to begin finding the majority element
                with Boyer-Moore Voting algorithm
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
                  </motion.div>
                ))}

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <h4 className="text-md font-semibold text-white mb-3">
                    Current Step Explanation:
                  </h4>
                  <div className="bg-slate-900 p-3 rounded-lg text-sm">
                    {activeCodeLine === 0 && !isAnimating && !isComplete && (
                      <div className="text-slate-400">
                        Ready to visualize Boyer-Moore Voting Algorithm for finding
                        the majority element. Press &quot;Start&quot; to begin.
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
                            Set count = 0 to track the frequency of our current candidate,
                            and candidate = null since we haven&apos;t found a potential
                            majority element yet.
                          </div>
                        )}
                        {activeCodeLine === 2 && (
                          <div className="text-blue-400">
                            <span className="font-bold">
                              Process Array Element:
                            </span>{" "}
                            We&apos;re now at index {currentIndex + 1}, checking
                            the current element against our candidate.
                          </div>
                        )}
                        {activeCodeLine === 3 && (
                          <div className="text-blue-400">
                            <span className="font-bold">
                              Set New Candidate:
                            </span>{" "}
                            Count is 0, so we&apos;re setting a new candidate to {currentArray[currentIndex]}.
                          </div>
                        )}
                        {activeCodeLine === 4 && (
                          <div className="text-blue-400">
                            <span className="font-bold">
                              Increment Count:
                            </span>{" "}
                            Current element ({currentArray[currentIndex]}) matches our candidate ({candidate}),
                            so we increment count to {count + 1}.
                          </div>
                        )}
                        {activeCodeLine === 5 && (
                          <div className="text-blue-400">
                            <span className="font-bold">
                              Decrement Count:
                            </span>{" "}
                            Current element ({currentArray[currentIndex]}) doesn&apos;t match our candidate ({candidate}),
                            so we decrement count to {count - 1}.
                          </div>
                        )}
                        {activeCodeLine === 6 && (
                          <div className="text-blue-400">
                            <span className="font-bold">
                              Verify Majority:
                            </span>{" "}
                            Checking if our final candidate ({candidate}) appears more than n/2 times.
                          </div>
                        )}
                        {activeCodeLine === 7 && (
                          <div className="text-green-400">
                            <span className="font-bold">Return Result:</span>{" "}
                            {result !== null 
                              ? `The majority element is ${result}.` 
                              : "No majority element was found."}
                          </div>
                        )}
                      </>
                    )}
                    {activeCodeLine === 0 && isComplete && (
                      <div className="text-green-400">
                        <span className="font-bold">Algorithm complete:</span>{" "}
                        {result !== null 
                          ? `Found majority element ${result}.` 
                          : "No majority element was found."}
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
                        Boyer-Moore Voting Algorithm finds the majority element in linear time
                        using constant space. The algorithm works by selecting a candidate and 
                        keeping a count, which increases when we see the same element and decreases 
                        otherwise. A majority element (if it exists) will always be the final candidate.
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