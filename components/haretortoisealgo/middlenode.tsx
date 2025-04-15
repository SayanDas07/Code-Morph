"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Code, Database, RefreshCw, Play } from "lucide-react";

const oddList = [1, 2, 3, 4, 5, 6, 7];
const evenList = [1, 2, 3, 4, 5, 6];

export default function MiddleNodeFinder() {
  const [isOddArray, setIsOddArray] = useState(true);
  const [tortoiseIndex, setTortoiseIndex] = useState(0);
  const [hareIndex, setHareIndex] = useState(0);
  const [middleNode, setMiddleNode] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [activeCodeLine, setActiveCodeLine] = useState(0);

  // Speed settings with descriptive labels
  const speedOptions = [
    { label: "Very Slow", value: 2500 },
    { label: "Slow", value: 2000 },
    { label: "Normal", value: 1500 },
    { label: "Fast", value: 800 },
    { label: "Very Fast", value: 500 }
  ];

  const [animationSpeed, setAnimationSpeed] = useState(1500);

  const currentList = isOddArray ? oddList : evenList;

  useEffect(() => {
    if (!running || middleNode !== null) return;

    const interval = setInterval(() => {
      const nextHareIndex = hareIndex + 2;

      const shouldStop = isOddArray
        ? nextHareIndex >= currentList.length
        : nextHareIndex > currentList.length;

      if (shouldStop) {
        setMiddleNode(currentList[tortoiseIndex]);
        setActiveCodeLine(6); // Return slow line (now line 6)
        setRunning(false);
        clearInterval(interval);
        return;
      }

      // First highlight slow = slow->next
      setActiveCodeLine(3);

      // After a short delay, highlight fast = fast->next->next and perform the movements
      setTimeout(() => {
        setActiveCodeLine(4);
        setTortoiseIndex(prevTortoise => prevTortoise + 1);
        setHareIndex(nextHareIndex);

        // Then go back to the while condition for the next iteration
        setTimeout(() => {
          setActiveCodeLine(2);
        }, animationSpeed * 0.2);
      }, animationSpeed * 0.33);

    }, animationSpeed);

    return () => clearInterval(interval);
  }, [tortoiseIndex, hareIndex, middleNode, running, isOddArray, currentList, animationSpeed]);

  const resetSimulation = () => {
    setTortoiseIndex(0);
    setHareIndex(0);
    setMiddleNode(null);
    setActiveCodeLine(1); // initialization line
    setRunning(true);
  };

  const restartVisualization = () => {
    setTortoiseIndex(0);
    setHareIndex(0);
    setMiddleNode(null);
    setActiveCodeLine(0);
    setRunning(false);

    setTimeout(() => {
      resetSimulation();
    }, Math.min(300, animationSpeed * 0.3));
  };

  // Pseudo code for the algorithm
  const pseudoCode = [
    { line: "ListNode* middleNode(ListNode* head) {", active: false },
    { line: "    ListNode *hare = head; ListNode *tortoise = head;", active: activeCodeLine === 1 },
    { line: `    while (tortoise != nullptr && tortoise->next != nullptr) {`, active: activeCodeLine === 2 },
    { line: "        hare = hare->next;", active: activeCodeLine === 3 },
    { line: "        tortoise = tortoise->next->next;", active: activeCodeLine === 4 },
    { line: "    }", active: false },
    { line: "    return hare;", active: activeCodeLine === 6 },
    { line: "}", active: false },
  ];

  useEffect(() => {
    if (running && activeCodeLine === 1) {
      // Move to while condition after initialization
      const timeout = setTimeout(() => {
        setActiveCodeLine(2);
      }, animationSpeed * 0.33);

      return () => clearTimeout(timeout);
    }
  }, [running, activeCodeLine, animationSpeed]);

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
            <button
              onClick={() => {
                setIsOddArray(true);
                setTortoiseIndex(0);
                setHareIndex(0);
                setMiddleNode(null);
                setActiveCodeLine(0);
                setRunning(false);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition ${isOddArray
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
            >
              Odd Array [1-7]
            </button>
            <button
              onClick={() => {
                setIsOddArray(false);
                setTortoiseIndex(0);
                setHareIndex(0);
                setMiddleNode(null);
                setActiveCodeLine(0);
                setRunning(false);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition ${!isOddArray
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
            >
              Even Array [1-6]
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Speed</label>
              <select
                className="bg-slate-800 border border-slate-700 rounded text-white text-sm p-2"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                disabled={running}
              >
                {speedOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={resetSimulation}
              className="h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={running}
            >
              <Play size={16} />
              <span>Start</span>
            </button>

            <button
              onClick={restartVisualization}
              className="h-10 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={!running && activeCodeLine === 0}
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
              <h3 className="text-lg font-semibold text-white">Linked List Nodes</h3>
            </div>

            <div className="relative h-24 flex items-center justify-center overflow-hidden">
              <div className="absolute w-full h-1 bg-slate-700"></div>
              <div className="flex items-center justify-center gap-1 z-10">
                {currentList.map((value, index) => (
                  <div key={index} className="flex items-center">
                    <motion.div
                      className={`
                        w-16 h-16 flex flex-col items-center justify-center
                        ${middleNode === value
                          ? "bg-green-700 text-white"
                          : tortoiseIndex === index && hareIndex === index
                            ? "bg-purple-600 text-white"
                            : tortoiseIndex === index
                              ? "bg-green-600 text-white"
                              : hareIndex === index
                                ? "bg-blue-600 text-white"
                                : "bg-slate-800 text-white"}
                      `}
                      initial={{ scale: 1 }}
                      animate={{
                        scale: (middleNode === value || tortoiseIndex === index || hareIndex === index) ? 1.1 : 1,
                        y: (middleNode === value || tortoiseIndex === index || hareIndex === index) ? -5 : 0,
                      }}
                      transition={{ duration: getAnimationDuration() }}
                    >
                      <span className="text-lg font-bold text-white">{value}</span>
                      {tortoiseIndex === index && hareIndex === index && (
                        <span className="text-xs text-white bg-purple-700 px-1 rounded">T+H</span>
                      )}
                      {tortoiseIndex === index && hareIndex !== index && (
                        <motion.div
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="absolute w-6 h-6 bg-green-500 rounded-full top-[-10px] text-xs flex items-center justify-center font-bold"
                        >
                          T
                        </motion.div>
                      )}
                      {hareIndex === index && tortoiseIndex !== index && (
                        <motion.div
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="absolute w-6 h-6 bg-blue-500 rounded-full bottom-[-10px] text-xs flex items-center justify-center font-bold"
                        >
                          H
                        </motion.div>
                      )}
                    </motion.div>
                    {/* Add arrow after each node except the last one */}
                    {index < currentList.length - 1 && (
                      <div className="mx-2">
                        <ArrowRight className="text-slate-400" size={24} />
                      </div>
                    )}
                  </div>
                ))}
                {/* NULL node for even-sized array with arrow */}
                {!isOddArray && (
                  <>
                    <div className="mx-2">
                      <ArrowRight className="text-slate-400" size={24} />
                    </div>
                    <div className="relative w-16 h-16 flex items-center justify-center text-lg font-bold bg-slate-800 text-slate-400 opacity-50">
                      NULL
                      {hareIndex === currentList.length && (
                        <motion.div
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="absolute w-6 h-6 bg-blue-500 rounded-full bottom-[-10px] text-xs flex items-center justify-center font-bold"
                        >
                          H
                        </motion.div>
                      )}
                    </div>
                  </>
                )}
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
              {middleNode !== null ? (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: getAnimationDuration() * 2 }}
                >
                  <div className="mb-2 text-green-400 font-semibold">Found the middle node!</div>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-green-800 border-2 border-green-500 w-20 h-20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                        <span className="text-2xl font-bold text-white">{middleNode}</span>
                      </div>
                      <div className="text-sm text-slate-300">Middle Node Value</div>
                    </div>
                  </div>
                  <div className="mt-3 font-mono text-green-400">
                    return {middleNode};
                  </div>
                </motion.div>
              ) : running ? (
                <div className="text-center text-yellow-400">
                  Finding the middle node using fast and slow pointers...
                </div>
              ) : (
                <div className="text-center text-slate-400">
                  Start the algorithm to find the middle node of the linked list
                </div>
              )}
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-700 text-center">
            {running ? (
              <div className="text-yellow-300 font-medium">
                {activeCodeLine === 1 && "Initializing slow and fast pointers at the head..."}
                {activeCodeLine === 2 && "Checking if fast and fast->next are not null..."}
                {activeCodeLine === 3 && "Moving slow pointer one step forward..."}
                {activeCodeLine === 4 && "Moving fast pointer two steps forward..."}
                {activeCodeLine === 6 && "Returning slow pointer as the middle node..."}
              </div>
            ) : middleNode ? (
              <div className="text-green-400 font-medium">
                Algorithm complete: Middle node found at value {middleNode}
              </div>
            ) : (
              <div className="text-slate-400 font-medium">
                Click &quot;Start&quot; to begin finding the middle node using the two-pointer technique
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
                    {index === 2 && (
                      <div className="text-xs text-slate-400 pl-6 mt-1">
                        {/* Condition explanation based on array type */}
                        {isOddArray ?
                          "// Checks if we reached the end (odd list)" :
                          "// Checks if we can move two steps (even list)"}
                      </div>
                    )}
                  </motion.div>
                ))}

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <h4 className="text-md font-semibold text-white mb-3">Current Step Explanation:</h4>
                  <div className="bg-slate-900 p-3 rounded-lg text-sm">
                    {activeCodeLine === 0 && !running && !middleNode && (
                      <div className="text-slate-400">
                        Ready to visualize the Middle Node algorithm using a two-pointer approach.
                        Press &quot;Start&quot; to begin.
                      </div>
                    )}
                    {activeCodeLine === 1 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Initialize Pointers:</span> Set both hare and tortoise pointers
                        to the head of the list. They will move at different speeds to find the middle.
                      </div>
                    )}
                    {activeCodeLine === 2 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Check Loop Condition:</span> We continue as long as the tortoise pointer
                        and its next node are not null. This ensures we do not go past the end of the list.
                      </div>
                    )}
                    {activeCodeLine === 3 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Move Hare Pointer:</span> Move the Hare pointer one step forward.
                        The Hare pointer will end up at the middle of the list.
                      </div>
                    )}
                    {activeCodeLine === 4 && (
                      <div className="text-blue-400">
                        <span className="font-bold">Move Tortoise Pointer:</span> Move the Tortoise pointer two steps forward.
                        When the Tortoise pointer reaches the end, the slow pointer will be at the middle.
                      </div>
                    )}
                    {activeCodeLine === 6 && (
                      <div className="text-green-400">
                        <span className="font-bold">Return Middle Node:</span> When the Tortoise pointer reaches the end,
                        the Hare pointer is at the middle node. We return it as our result.
                      </div>
                    )}
                    {activeCodeLine === 0 && middleNode && (
                      <div className="text-green-400">
                        <span className="font-bold">Algorithm complete:</span> Found the middle node with
                        value <span className="text-yellow-300">{middleNode}</span>.
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