"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { ArrowRight, Hash, Code, Play, Database, RefreshCw } from "lucide-react";

const TwoSumVisualizer = () => {
  const [array, setArray] = useState<number[]>([2, 7, 11, 15, 1, 8]);
  const [target, setTarget] = useState<number>(9);
  const [hashMap, setHashMap] = useState<Map<number, number>>(new Map());
  const [inputValue, setInputValue] = useState("2, 7, 11, 15, 1, 8");
  const [targetValue, setTargetValue] = useState("9");
  const [error, setError] = useState("");
  const [traversing, setTraversing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [result, setResult] = useState<[number, number] | null>(null);
  const [currentLine, setCurrentLine] = useState(0);

  // Speed settings with descriptive labels
  const speedOptions = [
    { label: "Very Slow", value: 2500 },
    { label: "Slow", value: 2000 },
    { label: "Normal", value: 800 },
    { label: "Fast", value: 500 },
    { label: "Very Fast", value: 300 }
  ];

  const [animationSpeed, setAnimationSpeed] = useState(800);

  const startTraversal = () => {
    setTraversing(true);
    setHashMap(new Map());
    setCurrentIndex(null);
    setResult(null);
    setCurrentLine(1); // Initialize algorithm

    const stepDelay = animationSpeed;
    const lineChangeDelay = animationSpeed * 0.3;

    setTimeout(() => {
      let index = 0;
      const numMap = new Map<number, number>();

      const traverseInterval = setInterval(() => {
        if (index >= array.length) {
          clearInterval(traverseInterval);
          setCurrentLine(7); // No pairs found
          setTimeout(() => {
            setTraversing(false);
            setCurrentLine(0);
            setCurrentIndex(null);
          }, lineChangeDelay);
          return;
        }

        // Current index
        setCurrentIndex(index);
        setCurrentLine(2); // Starting for loop

        setTimeout(() => {
          const num = array[index];
          const complement = target - num;
          setCurrentLine(3); // Calculate complement

          setTimeout(() => {
            // Check if complement exists in hashMap
            setCurrentLine(4);

            setTimeout(() => {
              if (numMap.has(complement)) {
                setCurrentLine(5); // Found pair
                setResult([numMap.get(complement)!, index]);
                clearInterval(traverseInterval);

                setTimeout(() => {
                  setTraversing(false);
                  setCurrentLine(0);
                }, lineChangeDelay);
              } else {
                setCurrentLine(6); // Add to hashMap
                numMap.set(num, index);
                setHashMap(new Map(numMap));
                index += 1;
              }
            }, lineChangeDelay);
          }, lineChangeDelay);
        }, lineChangeDelay);
      }, stepDelay);
    }, animationSpeed * 0.5);
  };

  const restartVisualization = () => {
    setTraversing(false);
    setHashMap(new Map());
    setCurrentIndex(null);
    setResult(null);
    setCurrentLine(0);

    setTimeout(() => {
      startTraversal();
    }, Math.min(300, animationSpeed * 0.3));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setError("");

    if (value !== "") {
      const newArray = value.split(",").map((item) => parseInt(item.trim(), 10));
      if (newArray.every((num) => !isNaN(num))) {
        setArray(newArray);
      } else {
        setError("Please enter valid numbers separated by commas.");
      }
    }
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTargetValue(value);

    const parsedTarget = parseInt(value, 10);
    if (!isNaN(parsedTarget)) {
      setTarget(parsedTarget);
    }
  };

  const isButtonDisabled = traversing || (!inputValue && array.length === 0);

  // C++ code lines
  const cppCodeLines = [
    { line: 1, code: "vector<int> twoSum(vector<int>& nums, int target) {", indent: 0 },
    { line: 2, code: "    unordered_map<int, int> mp;", indent: 1 },
    { line: 3, code: "    for (int i = 0; i < nums.size(); i++) {", indent: 1 },
    { line: 4, code: "        int complement = target - nums[i];", indent: 2 },
    { line: 5, code: "        if (mp.find(complement) != mp.end()) {", indent: 2 },
    { line: 6, code: "            return {mp[complement], i};", indent: 3 },
    { line: 7, code: "        }", indent: 2 },
    { line: 8, code: "        mp[nums[i]] = i;", indent: 2 },
    { line: 9, code: "    }", indent: 1 },
    { line: 10, code: "    return {};", indent: 1 },
    { line: 11, code: "}", indent: 0 }
  ];

  const mapVisualizerLineToCppLine = () => {
    switch (currentLine) {
      case 1: return 2; // Initialize map
      case 2: return 3; // Start for loop
      case 3: return 4; // Calculate complement
      case 4: return 5; // Check if complement exists
      case 5: return 6; // Return result pair
      case 6: return 8; // Add to hashMap
      case 7: return 10; // Return empty result
      default: return -1;
    }
  };

  // Animation duration for motion components based on speed setting
  const getAnimationDuration = () => {
    return Math.max(0.1, Math.min(0.5, animationSpeed / 2000));
  };

  return (
    <div className="p-6 bg-slate-800 rounded-lg shadow-xl min-h-[600px]">
      {/* Controls section */}
      <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-slate-400 mb-1">Input Array</label>
            <Input
              type="text"
              value={inputValue}
              onChange={handleArrayChange}
              placeholder="Enter numbers (comma separated)"
              className="w-full bg-slate-800 border-slate-700 text-white"
            />
            {error && <div className="text-red-400 text-xs mt-1">{error}</div>}
          </div>

          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-slate-400 mb-1">Target Sum</label>
            <Input
              type="text"
              value={targetValue}
              onChange={handleTargetChange}
              placeholder="Target Sum"
              className="w-full bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Speed</label>
              <select
                className="bg-slate-800 border border-slate-700 rounded text-white text-sm p-2"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                disabled={traversing}
              >
                {speedOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={startTraversal}
              className="h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isButtonDisabled}
            >
              <Play size={16} />
              <span>Start</span>
            </button>

            <button
              onClick={restartVisualization}
              className="h-10 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={!traversing && currentLine === 0}
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
          <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex items-center mb-3">
              <Database size={18} className="text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Input Array (Target Sum: {target})</h3>
            </div>

            <div className="relative h-20 flex items-center justify-center overflow-hidden mb-3">
              <div className="absolute w-full h-1 bg-slate-700"></div>
              <div className="flex items-center justify-center gap-1 z-10">
                {array.map((num, index) => (
                  <motion.div
                    key={index}
                    className={`
                      w-14 h-14 flex flex-col items-center justify-center rounded-lg
                      border-2 transition-all
                      ${result && (index === result[0] || index === result[1])
                        ? "bg-green-700 border-green-400 shadow-lg shadow-green-900/50"
                        : index === currentIndex
                          ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/50"
                          : "bg-slate-800 border-slate-700"}
                    `}
                    initial={{ scale: 1 }}
                    animate={{
                      scale: (index === currentIndex || (result && (index === result[0] || index === result[1]))) ? 1.15 : 1,
                      y: (index === currentIndex || (result && (index === result[0] || index === result[1]))) ? -10 : 0,
                      opacity: index === currentIndex ? 1 : (traversing && currentIndex !== null && index > currentIndex ? 0.5 : 0.9)
                    }}
                    transition={{ duration: getAnimationDuration() }}
                  >
                    <span className="text-lg font-bold text-white">{num}</span>
                    <span className="text-xs text-slate-300">idx: {index}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Array pointer */}
            {traversing && currentIndex !== null && (
              <div className="flex items-center justify-center">
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: getAnimationDuration() }}
                >
                  <ArrowRight className="text-yellow-500" size={20} />
                  <div className="text-xs text-yellow-500 font-mono">
                    {currentLine === 3 && `complement = ${target} - ${array[currentIndex]} = ${target - array[currentIndex]}`}
                    {currentLine !== 3 && `num = ${array[currentIndex]}`}
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          {/* HashMap Visualization */}
          <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex items-center mb-3">
              <Hash size={18} className="text-purple-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">HashMap (Value → Index)</h3>
            </div>

            <div className="overflow-hidden">
              <div className="flex items-center mb-2 px-3 py-2 bg-slate-800 rounded-lg">
                <div className="w-1/2 font-mono text-sm text-slate-400">Key (num)</div>
                <div className="w-1/2 font-mono text-sm text-slate-400">Value (index)</div>
              </div>

              <div className="space-y-2">
                <AnimatePresence>
                  {Array.from(hashMap.entries()).map(([num, idx]) => (
                    <motion.div
                      key={num}
                      className={`
                        flex items-center px-3 py-3 rounded-lg
                        ${currentIndex !== null && target - array[currentIndex] === num && currentLine === 4
                          ? "bg-yellow-900 border border-yellow-500"
                          : result && (idx === result[0] || num === array[result[1]])
                            ? "bg-green-900 border border-green-500"
                            : "bg-slate-800"}
                      `}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: getAnimationDuration() * 1.5 }}
                    >
                      <div className="w-1/2 font-mono text-lg font-semibold text-white">{num}</div>
                      <div className="w-1/2 font-mono text-lg text-purple-400">
                        {idx}
                        {currentIndex !== null && target - array[currentIndex] === num && currentLine === 4 && (
                          <motion.span
                            className="inline-block ml-1 text-yellow-400"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: getAnimationDuration() }}
                          >
                            ← found complement!
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Result Visualization */}
          <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex items-center mb-3">
              <Code size={18} className="text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Result</h3>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg">
              {result ? (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: getAnimationDuration() * 2 }}
                >
                  <div className="mb-2 text-green-400 font-semibold">Found a pair that sums to {target}!</div>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="bg-green-800 border-2 border-green-500 w-20 h-20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                        <span className="text-2xl font-bold text-white">{array[result[0]]}</span>
                      </div>
                      <div className="text-sm text-slate-300">Index: {result[0]}</div>
                    </div>
                    <div className="text-2xl text-white">+</div>
                    <div className="text-center">
                      <div className="bg-green-800 border-2 border-green-500 w-20 h-20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                        <span className="text-2xl font-bold text-white">{array[result[1]]}</span>
                      </div>
                      <div className="text-sm text-slate-300">Index: {result[1]}</div>
                    </div>
                    <div className="text-2xl text-white">=</div>
                    <div className="text-center">
                      <div className="bg-blue-800 border-2 border-blue-500 w-20 h-20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                        <span className="text-2xl font-bold text-white">{target}</span>
                      </div>
                      <div className="text-sm text-slate-300">Target</div>
                    </div>
                  </div>
                  <div className="mt-3 font-mono text-green-400">
                    return [{result[0]}, {result[1]}];
                  </div>
                </motion.div>
              ) : traversing ? (
                <div className="text-center text-yellow-400">
                  Searching for a pair that sums to {target}...
                </div>
              ) : currentLine === 7 ? (
                <div className="text-center text-red-400">
                  No pairs found that sum to {target}
                  <div className="mt-2 font-mono text-slate-400">return [];</div>
                </div>
              ) : (
                <div className="text-center text-slate-400">
                  Start the algorithm to find a pair of numbers that sum to {target}
                </div>
              )}
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-700 text-center">
            {array.length === 0 ? (
              <div className="text-slate-400">Enter an array to find pairs that sum to the target</div>
            ) : traversing ? (
              <div className="text-yellow-300 font-medium">
                {currentLine === 1 && "Initializing hash map..."}
                {currentLine === 2 && `Starting iteration through array at index ${currentIndex}...`}
                {currentLine === 3 && `Calculating complement: ${target} - ${array[currentIndex!]} = ${target - array[currentIndex!]}`}
                {currentLine === 4 && `Checking if complement ${target - array[currentIndex!]} exists in hash map...`}
                {currentLine === 5 && `Found pair! [${result![0]}, ${result![1]}] sums to ${target}`}
                {currentLine === 6 && `Adding ${array[currentIndex!]} at index ${currentIndex} to hash map...`}
                {currentLine === 7 && "No pairs found that sum to the target value."}
              </div>
            ) : result ? (
              <div className="text-green-400 font-medium">
                Found solution: nums[{result[0]}] + nums[{result[1]}] = {array[result[0]]} + {array[result[1]]} = {target}
              </div>
            ) : (
              <div className="text-slate-400 font-medium">
                Click &quot;Start&quot; to begin finding a pair of numbers that sum to {target}
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
                {cppCodeLines.map((codeLine) => (
                  <motion.div
                    key={codeLine.line}
                    className={`
                      py-1 px-2 my-1 rounded-sm
                      ${codeLine.line === mapVisualizerLineToCppLine()
                        ? "bg-blue-900/40 text-white border-l-2 border-blue-500"
                        : "text-slate-400"}
                    `}
                    animate={{
                      backgroundColor: codeLine.line === mapVisualizerLineToCppLine() ? "rgba(30, 58, 138, 0.4)" : "transparent",
                      scale: codeLine.line === mapVisualizerLineToCppLine() ? 1.02 : 1,
                    }}
                    transition={{ duration: getAnimationDuration() }}
                  >
                    <span className="mr-2 text-slate-600 select-none">{codeLine.line}</span>
                    <span style={{ paddingLeft: `${codeLine.indent * 20}px` }}>
                      {codeLine.code}
                    </span>
                  </motion.div>
                ))}

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <h4 className="text-md font-semibold text-white mb-3">Current Step Explanation:</h4>
                  <div className="bg-slate-900 p-3 rounded-lg text-sm">
                    {currentLine === 0 && !traversing && !result && (
                      <div className="text-slate-400">
                        Ready to visualize the Two Sum algorithm using a HashMap approach.
                        Press &quot;Start&quot; to begin.
                      </div>
                    )}
                    {currentLine === 1 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Initialize HashMap:</span> Creating an empty
                        unordered_map to store array values as keys and their indices as values.
                        This allows O(1) lookups when searching for complements.
                      </div>
                    )}
                    {currentLine === 2 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Start loop:</span> Beginning iteration through array
                        elements. Current element is <span className="text-yellow-300">{array[currentIndex!]}</span> at
                        index <span className="text-yellow-300">{currentIndex}</span>.
                      </div>
                    )}
                    {currentLine === 3 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Calculate complement:</span> For each element, we calculate
                        its complement by subtracting it from the target sum.
                        <br />
                        <span className="text-yellow-300">complement = {target} - {array[currentIndex!]} = {target - array[currentIndex!]}</span>
                      </div>
                    )}
                    {currentLine === 4 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Check HashMap:</span> We check if the complement
                        <span className="text-yellow-300"> {target - array[currentIndex!]}</span> exists
                        in our HashMap. If it does, we have found a pair that sums to our target.
                      </div>
                    )}
                    {currentLine === 5 && (
                      <div className="text-green-400">
                        <span className="font-bold">Found a pair!</span> We found the complement
                        <span className="text-yellow-300"> {target - array[currentIndex!]}</span> at index
                        <span className="text-yellow-300"> {result![0]}</span>.
                        Together with the current element at index <span className="text-yellow-300">{result![1]}</span>,
                        they sum to our target <span className="text-yellow-300">{target}</span>.
                      </div>
                    )}
                    {currentLine === 6 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Store element:</span> No complement found yet. Adding current
                        element <span className="text-yellow-300">{array[currentIndex!]}</span> and its index
                        <span className="text-yellow-300"> {currentIndex}</span> to the HashMap for future lookups.
                      </div>
                    )}
                    {currentLine === 7 && (
                      <div className="text-red-400">
                        <span className="font-bold">No solution:</span> We have checked all elements and did not
                        find any pair that sums to <span className="text-yellow-300">{target}</span>.
                        Returning an empty array.
                      </div>
                    )}
                    {currentLine === 0 && result && (
                      <div className="text-green-400">
                        <span className="font-bold">Algorithm complete:</span> Found a solution where
                        <span className="text-yellow-300"> {array[result[0]]}</span> +
                        <span className="text-yellow-300"> {array[result[1]]}</span> =
                        <span className="text-yellow-300"> {target}</span>.
                      </div>
                    )}
                  </div>

                  {currentLine > 0 && (
                    <div className="mt-3 p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-500">Time Complexity: O(n)</div>
                      <div className="text-xs text-slate-500">Space Complexity: O(n)</div>
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
};

export default TwoSumVisualizer;