import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, RefreshCw, Code, Database, AlertCircle } from "lucide-react";

export default function MaxConsecutiveOnesAnimation({ array = [1, 1, 0, 0, 1, 1, 1, 0, 1, 1], k = 2 }) {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [zeroCount, setZeroCount] = useState(0);
  const [maxLen, setMaxLen] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [activeCodeLine, setActiveCodeLine] = useState(0);
  const [isProcessingShrink, setIsProcessingShrink] = useState(false);

  // Store current state values in refs to avoid stale closures in async functions
  const leftRef = useRef(left);
  leftRef.current = left;

  const rightRef = useRef(right);
  rightRef.current = right;

  const zeroCountRef = useRef(zeroCount);
  zeroCountRef.current = zeroCount;

  const maxLenRef = useRef(maxLen);
  maxLenRef.current = maxLen;

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const isFinishedRef = useRef(isFinished);
  isFinishedRef.current = isFinished;

  const isProcessingShrinkRef = useRef(isProcessingShrink);
  isProcessingShrinkRef.current = isProcessingShrink;

  // Speed settings with descriptive labels
  const speedOptions = [
    { label: "Very Slow", value: 3000 },
    { label: "Slow", value: 2000 },
    { label: "Normal", value: 1500 },
    { label: "Fast", value: 800 },
    { label: "Very Fast", value: 400 }
  ];

  const [animationSpeed, setAnimationSpeed] = useState(1500);
  const animationSpeedRef = useRef(animationSpeed);
  animationSpeedRef.current = animationSpeed;

  // Main animation controller
  useEffect(() => {
    if (!isPlaying || isFinished) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const runAlgorithm = async () => {
      // Initialize the algorithm when starting fresh
      if (rightRef.current === 0 && leftRef.current === 0 && activeCodeLine === 0) {
        setActiveCodeLine(1); // Initialize pointers
        await new Promise(resolve => setTimeout(resolve, animationSpeedRef.current * 0.3));

        setActiveCodeLine(2); // Initialize zero count
        await new Promise(resolve => setTimeout(resolve, animationSpeedRef.current * 0.3));

        setActiveCodeLine(3); // Initialize max length
        await new Promise(resolve => setTimeout(resolve, animationSpeedRef.current * 0.3));
      }

      // Main algorithm loop
      const processNextStep = async () => {
        // Check if we're still running
        if (!isPlayingRef.current || isFinishedRef.current) return;

        // Check if we're done
        if (rightRef.current >= array.length) {
          setActiveCodeLine(19);
          setIsFinished(true);
          return;
        }

        // Main while loop condition
        setActiveCodeLine(4);
        await new Promise(resolve => setTimeout(resolve, animationSpeedRef.current * 0.3));

        // Check if current element is 0
        setActiveCodeLine(5);
        const isCurrentZero = array[rightRef.current] === 0;
        await new Promise(resolve => setTimeout(resolve, animationSpeedRef.current * 0.3));

        // Increment zero count if needed
        if (isCurrentZero) {
          setActiveCodeLine(6);
          setZeroCount(prev => prev + 1);
          await new Promise(resolve => setTimeout(resolve, animationSpeedRef.current * 0.3));
        }

        // Process the nested while loop for shrinking window
        const processShrinkWindow = async () => {
          // Check if shrinking is needed
          setActiveCodeLine(8);
          await new Promise(resolve => setTimeout(resolve, animationSpeedRef.current * 0.3));

          if (zeroCountRef.current > k) {
            setIsProcessingShrink(true);

            // Check if left element is zero
            setActiveCodeLine(9);
            const isLeftZero = array[leftRef.current] === 0;
            await new Promise(resolve => setTimeout(resolve, animationSpeedRef.current * 0.3));

            // Decrement zero count if needed
            if (isLeftZero) {
              setActiveCodeLine(10);
              setZeroCount(prev => prev - 1);
              await new Promise(resolve => setTimeout(resolve, animationSpeedRef.current * 0.3));
            }

            // Increment left pointer
            setActiveCodeLine(12);
            setLeft(prev => prev + 1);
            await new Promise(resolve => setTimeout(resolve, animationSpeedRef.current * 0.4));

            // Check if we need to shrink more
            if (zeroCountRef.current > k) {
              // Schedule another shrink operation
              if (isPlayingRef.current && !isFinishedRef.current) {
                await processShrinkWindow();
              }
            } else {
              setIsProcessingShrink(false);
            }
          } else {
            setIsProcessingShrink(false);
          }
        };

        // Process shrinking if needed
        await processShrinkWindow();

        // Make sure we only continue if still playing
        if (!isPlayingRef.current || isFinishedRef.current) return;

        // Update max length - FIX: Calculate current length correctly
        setActiveCodeLine(14);
        const currentLen = rightRef.current - leftRef.current + 1;
        setMaxLen(prev => Math.max(prev, currentLen));
        await new Promise(resolve => setTimeout(resolve, animationSpeedRef.current * 0.4));

        // Move right pointer
        setActiveCodeLine(16);
        setRight(prev => prev + 1);
        await new Promise(resolve => setTimeout(resolve, animationSpeedRef.current * 0.4));

        // Schedule next step if we're still playing
        if (isPlayingRef.current && !isFinishedRef.current) {
          timeoutId = setTimeout(processNextStep, animationSpeedRef.current * 0.2);
        }
      };

      // Start processing steps
      await processNextStep();
    };

    // Kick off the algorithm
    runAlgorithm();

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPlaying, array, k]);

  const handlePlayPause = () => {
    if (isFinished) {
      // Reset everything if finished
      setIsFinished(false);
      setLeft(0);
      setRight(0);
      setZeroCount(0);
      setMaxLen(0);
      setActiveCodeLine(0);
      setIsProcessingShrink(false);
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
    setActiveCodeLine(0);
    setIsProcessingShrink(false);
  };

  // Pseudocode for the algorithm
  const pseudoCode = [
    { line: "int longestOnes(vector<int>& nums, int k) {", active: activeCodeLine === 0 },
    { line: "  int left = 0, right = 0;", active: activeCodeLine === 1 },
    { line: "  int zeroCount = 0;", active: activeCodeLine === 2 },
    { line: "  int maxLen = 0;", active: activeCodeLine === 3 },
    { line: "  while (right < nums.size()) {", active: activeCodeLine === 4 },
    { line: "    if (nums[right] == 0) {", active: activeCodeLine === 5 },
    { line: "      zeroCount++;", active: activeCodeLine === 6 },
    { line: "    }", active: activeCodeLine === 7 },
    { line: "    while (zeroCount > k) {", active: activeCodeLine === 8 },
    { line: "      if (nums[left] == 0) {", active: activeCodeLine === 9 },
    { line: "        zeroCount--;", active: activeCodeLine === 10 },
    { line: "      }", active: activeCodeLine === 11 },
    { line: "      left++;", active: activeCodeLine === 12 },
    { line: "    }", active: activeCodeLine === 13 },
    { line: "    maxLen = max(maxLen, right - left + 1);", active: activeCodeLine === 14 },
    { line: "", active: activeCodeLine === 15 },
    { line: "    right++;", active: activeCodeLine === 16 },
    { line: "  }", active: activeCodeLine === 17 },
    { line: "", active: activeCodeLine === 18 },
    { line: "  return maxLen;", active: activeCodeLine === 19 },
    { line: "}", active: activeCodeLine === 20 }
  ];

  // Animation duration for motion components
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
              Max Flips Allowed (k): {k}
            </div>
            <div className="px-4 py-2 rounded-lg font-semibold bg-slate-800 text-slate-300 overflow-x-auto">
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
              <h3 className="text-lg font-semibold text-white">Algorithm Visualization</h3>
            </div>

            <div className="relative py-8 overflow-hidden">

              <div className="flex items-center justify-center gap-1 z-10">
                {array.map((num, idx) => (
                  <motion.div
                    key={idx}
                    className={`
                      w-16 h-16 flex items-center justify-center font-bold text-lg
                      ${idx >= left && idx <= right
                        ? num === 0
                          ? 'bg-green-500 text-white'  // Flipped zero in current window
                          : 'bg-blue-500 text-white'   // One in current window
                        : 'bg-slate-800 text-slate-300' // Outside current window
                      }
                      ${activeCodeLine === 5 && idx === right
                        ? 'ring-2 ring-yellow-400' // Highlight current element being checked
                        : ''}
                      ${activeCodeLine === 9 && idx === left
                        ? 'ring-2 ring-yellow-400' // Highlight current left element when shrinking
                        : ''}
                    `}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      scale: idx >= left && idx <= right ? 1.1 : 1,
                      y: idx >= left && idx <= right ? -5 : 0
                    }}
                    transition={{ duration: getAnimationDuration() }}
                  >
                    {num}
                    {idx === left && (
                      <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="absolute w-6 h-6 bg-red-500 rounded-full top-[-20px] text-xs flex items-center justify-center font-bold"
                      >
                        L
                      </motion.div>
                    )}
                    {idx === right && (
                      <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute w-6 h-6 bg-blue-500 rounded-full bottom-[-20px] text-xs flex items-center justify-center font-bold"
                      >
                        R
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex justify-center items-center mt-4">
              <div className="flex gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-slate-300">Left Pointer</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-slate-300">Right Pointer</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 mr-2"></div>
                  <span className="text-slate-300">Flipped Zero</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                  <span className="text-slate-300">One in Window</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Display */}
          <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex items-center mb-3">
              <AlertCircle size={18} className="text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Algorithm Stats</h3>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg">
              {activeCodeLine > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: getAnimationDuration() * 2 }}
                >
                  {/* Current Window Length */}
                  <div className="text-center">
                    <div className="mb-2 text-blue-400 font-semibold">Current Window Length</div>
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className={`
                          w-20 h-20 rounded-lg flex items-center justify-center mb-2 mx-auto
                          ${activeCodeLine === 14 ? "bg-blue-600 border-2 border-yellow-400" : "bg-blue-800 border-2 border-blue-500"}
                        `}>
                          <span className="text-2xl font-bold text-white">{right - left + 1}</span>
                        </div>
                        <div className="text-sm text-slate-300">
                          {`Window [${left} to ${right}]`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Zero Count */}
                  <div className="text-center">
                    <div className="mb-2 text-green-400 font-semibold">Zeros in Window (Flips)</div>
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className={`
                          w-20 h-20 rounded-lg flex items-center justify-center mb-2 mx-auto
                          ${(activeCodeLine === 5 && array[right] === 0) || (activeCodeLine === 9 && array[left] === 0)
                            ? "bg-green-600 border-2 border-yellow-400"
                            : "bg-green-800 border-2 border-green-500"}
                        `}>
                          <span className="text-2xl font-bold text-white">{zeroCount}</span>
                        </div>
                        <div className="text-sm text-slate-300">
                          <span className={zeroCount > k ? "text-red-400 font-bold" : ""}>
                            {zeroCount > k ? "Exceeds k!" : (zeroCount === k ? "At limit" : `${k - zeroCount} more allowed`)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Maximum Length */}
                  <div className="text-center">
                    <div className="mb-2 text-yellow-400 font-semibold">Maximum Length Found</div>
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className={`
                          bg-yellow-800 border-2 border-yellow-500 w-20 h-20 rounded-lg 
                          flex items-center justify-center mb-2 mx-auto
                          ${right - left + 1 === maxLen && activeCodeLine === 14 ? "ring-4 ring-green-400" : ""}
                        `}>
                          <span className="text-2xl font-bold text-white">{maxLen}</span>
                        </div>
                        <div className="text-sm text-slate-300">{isFinished ? "Final Result" : "So Far"}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center text-slate-400">
                  Start the algorithm to see window stats
                </div>
              )}
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-700 text-center">
            {isPlaying ? (
              <div className="text-yellow-300 font-medium">
                {activeCodeLine === 1 && "Initializing left and right pointers..."}
                {activeCodeLine === 2 && "Initializing zero count..."}
                {activeCodeLine === 3 && "Initializing maximum length..."}
                {activeCodeLine === 4 && "Checking if right pointer is within array bounds..."}
                {activeCodeLine === 5 && "Checking if current element is a zero..."}
                {activeCodeLine === 6 && array[right] === 0 && "Incrementing zero count..."}
                {activeCodeLine === 8 && "Checking if zero count exceeds allowed flips (k)..."}
                {activeCodeLine === 9 && zeroCount > k && "Checking if element at left pointer is a zero..."}
                {activeCodeLine === 10 && zeroCount > k && array[left] === 0 && "Decrementing zero count as we're removing a zero..."}
                {activeCodeLine === 12 && zeroCount > k && "Moving left pointer to shrink window..."}
                {activeCodeLine === 14 && "Updating maximum length with current window size..."}
                {activeCodeLine === 16 && "Moving right pointer to expand window..."}
                {activeCodeLine === 19 && "Algorithm completed, returning max consecutive ones..."}
              </div>
            ) : isFinished ? (
              <div className="text-green-400 font-medium">
                Algorithm complete: Maximum consecutive ones (with at most {k} flips) is {maxLen}
              </div>
            ) : (
              <div className="text-slate-400 font-medium">
                Click &quot;Start&quot; to begin the max consecutive ones algorithm visualization
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
                        Ready to visualize the Max Consecutive Ones algorithm.
                        Press &quot;Start&quot; to begin.
                      </div>
                    )}
                    {activeCodeLine === 1 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Initialize Pointers:</span> Set left and right pointers to the beginning of the array.
                      </div>
                    )}
                    {activeCodeLine === 2 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Initialize Zero Count:</span> We will count zeros in our window to track how many flips we have done.
                      </div>
                    )}
                    {activeCodeLine === 3 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Initialize Max Length:</span> This will track our longest consecutive ones sequence.
                      </div>
                    )}
                    {activeCodeLine === 4 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Main Loop:</span> We will process array elements one by one with the right pointer.
                      </div>
                    )}
                    {activeCodeLine === 5 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Check for Zero:</span> If the current element is 0, we need to count it for our flip limit.
                        {right < array.length && array[right] === 0 && <span className="text-yellow-300"> Current element is 0.</span>}
                      </div>
                    )}
                    {activeCodeLine === 8 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Check Flip Limit:</span> If we have more zeros than allowed flips (k={k}), we need to shrink the window.
                        {zeroCount > k ? (
                          <span className="text-red-400"> Flip limit exceeded ({zeroCount} {'>'} {k})! Need to shrink window.</span>
                        ) : (
                          <span className="text-green-400"> Flip count ({zeroCount}) is within limit ({k}).</span>
                        )}
                      </div>
                    )}
                    {activeCodeLine === 9 && zeroCount > k && (
                      <div className="text-blue-400">
                        <span className="font-bold">Shrink Window:</span> Check if the element we were removing from the window is a zero.
                        {array[left] === 0
                          ? <span className="text-yellow-300"> Left element is 0, will decrement zero count.</span>
                          : <span className="text-slate-300"> Left element is not 0, zero count stays the same.</span>
                        }
                      </div>
                    )}
                    {activeCodeLine === 12 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Move Left Pointer:</span> Shrink window by moving left pointer forward.
                      </div>
                    )}
                    {activeCodeLine === 14 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Update Max Length:</span> Check if current window length ({right - left + 1}) is longer than our previous maximum ({maxLen}).
                        {right - left + 1 > maxLen
                          ? <span className="text-green-400"> Found a new maximum!</span>
                          : <span className="text-slate-300"> Current length is not greater than maximum.</span>
                        }
                      </div>
                    )}
                    {activeCodeLine === 16 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Expand Window:</span> Move right pointer forward to include the next element.
                      </div>
                    )}
                    {activeCodeLine === 19 && (
                      <div className="text-green-400">
                        <span className="font-bold">Return Result:</span> Return the maximum consecutive ones found: {maxLen}.
                      </div>
                    )}
                    {activeCodeLine === 0 && isFinished && (
                      <div className="text-green-400">
                        <span className="font-bold">Algorithm complete:</span> Found the maximum consecutive ones
                        of <span className="text-yellow-300">{maxLen}</span> with at most {k} flips.
                      </div>
                    )}
                  </div>

                  {activeCodeLine > 0 && (
                    <div className="mt-3 p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-500">Time Complexity: O(n)</div>
                      <div className="text-xs text-slate-500">Space Complexity: O(1)</div>
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