"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code,
  Database,
  RefreshCw,
  Play,
  Pause,
  AlertCircle,
} from "lucide-react";

// Create a linked list with a cycle: 1 -> 2 -> 3 -> 4 -> 5 -> 3 (cycle back to 3)
type ListNode = {
  val: number;
  next: ListNode | null;
};

const createLinkedListWithCycle = (cyclePos = 2): ListNode[] => {
  const nodes: ListNode[] = [1, 2, 3, 4, 5].map((val) => ({ val, next: null }));
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].next = nodes[i + 1];
  }
  // Create a cycle by connecting the last node (5) to the specified node
  nodes[nodes.length - 1].next = nodes[cyclePos];
  return nodes;
};

export default function CycleDetectionVisualizer() {
  const [cyclePosition, setCyclePosition] = useState(2); // Default cycle back to node 3 (index 2)
  const [linkedList, setLinkedList] = useState(() =>
    createLinkedListWithCycle(cyclePosition)
  );

  const [slowIndex, setSlowIndex] = useState(0);
  const [fastIndex, setFastIndex] = useState(0);
  const [hasCycle, setHasCycle] = useState(false);
  const [cycleStart, setCycleStart] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activeCodeLine, setActiveCodeLine] = useState(0);
  const [step, setStep] = useState(0);

  // Speed settings with descriptive labels
  const speedOptions = [
    { label: "Very Slow", value: 2500 },
    { label: "Slow", value: 2000 },
    { label: "Normal", value: 1500 },
    { label: "Fast", value: 800 },
    { label: "Very Fast", value: 500 },
  ];

  const [animationSpeed, setAnimationSpeed] = useState(1500);

  // First phase: detect if there's a cycle
  useEffect(() => {
    if (!running || paused || hasCycle) return;

    const interval = setInterval(() => {
      // First highlight the current code lines
      if (step === 0) {
        setActiveCodeLine(2); // Check for cycle condition
        setStep(1);
        return;
      }

      // Move the pointers in step 1
      if (step === 1) {
        // Move slow pointer one step
        const nextSlow = linkedList[slowIndex].next
          ? linkedList.indexOf(linkedList[slowIndex].next)
          : slowIndex;
        // Move fast pointer two steps
        let nextFast = slowIndex;
        if (linkedList[fastIndex].next) {
          const fastNext = linkedList[fastIndex].next;
          nextFast = linkedList.indexOf(fastNext);
          if (fastNext.next) {
            nextFast = linkedList.indexOf(fastNext.next);
          }
        }

        // Highlight slow movement
        setActiveCodeLine(3);

        // After a short delay, highlight fast movement and perform the movements
        setTimeout(() => {
          setActiveCodeLine(4);

          // Update pointers
          setSlowIndex(nextSlow);
          setFastIndex(nextFast);

          // Check if slow and fast pointers meet
          if (nextSlow === nextFast) {
            setHasCycle(true);
            setActiveCodeLine(6); // Found cycle

            // Start second phase
            setTimeout(() => {
              setActiveCodeLine(8); // Reset slow pointer
              setSlowIndex(0);
              setTimeout(() => {
                setActiveCodeLine(9); // Find cycle starting point
                setCycleStart(nextSlow);
                setRunning(false); // Stop the animation
                setPaused(false);
              }, animationSpeed * 0.5);
            }, animationSpeed);

            clearInterval(interval);
            return;
          }

          // Reset to beginning of while loop for next iteration
          setTimeout(() => {
            setActiveCodeLine(2);
            setStep(0);
          }, animationSpeed * 0.2);
        }, animationSpeed * 0.33);
      }

      setStep((prevStep) => (prevStep + 1) % 2);
    }, animationSpeed);

    return () => clearInterval(interval);
  }, [
    slowIndex,
    fastIndex,
    hasCycle,
    running,
    paused,
    linkedList,
    animationSpeed,
    step,
  ]);

  const startSimulation = () => {
    if (!running) {
      // Starting new simulation
      setSlowIndex(0);
      setFastIndex(0);
      setHasCycle(false);
      setCycleStart(null);
      setActiveCodeLine(1); // initialization line
      setStep(0);
      setRunning(true);
      setPaused(false);
    } else if (paused) {
      // Resuming paused simulation
      setPaused(false);
    } else {
      // Pausing running simulation
      setPaused(true);
    }
  };

  const resetSimulation = () => {
    setLinkedList(createLinkedListWithCycle(cyclePosition));
    setSlowIndex(0);
    setFastIndex(0);
    setHasCycle(false);
    setCycleStart(null);
    setActiveCodeLine(0);
    setStep(0);
    setRunning(false);
    setPaused(false);
  };

  const updateCyclePosition = (newPosition: number) => {
    setCyclePosition(newPosition);
    setLinkedList(createLinkedListWithCycle(newPosition));
    resetSimulation();
  };

  // Pseudo code for the algorithm
  const pseudoCode = [
    { line: "bool hasCycle(ListNode* head) {", active: false },
    {
      line: "    ListNode *slow = head, *fast = head;",
      active: activeCodeLine === 1,
    },
    { line: "    while (fast && fast->next) {", active: activeCodeLine === 2 },
    { line: "        slow = slow->next;", active: activeCodeLine === 3 },
    { line: "        fast = fast->next->next;", active: activeCodeLine === 4 },
    {
      line: "        if (slow == fast) return true; // Cycle found",
      active: activeCodeLine === 6,
    },
    { line: "    }", active: false },
    { line: "    return false;", active: activeCodeLine === 7 },
    {
      line: "    slow = head; // Reset slow to find cycle start",
      active: activeCodeLine === 8,
    },
    {
      line: "    while (slow != fast) { // Move both one step until meet",
      active: activeCodeLine === 9,
    },
    { line: "        slow = slow->next;", active: false },
    { line: "        fast = fast->next;", active: false },
    { line: "    } // slow/fast now points to cycle start", active: false },
    { line: "}", active: false },
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
            <button
              onClick={() => updateCyclePosition(2)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                cyclePosition === 2
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
              disabled={running && !paused}
            >
              Cycle to Node 3
            </button>
            <button
              onClick={() => updateCyclePosition(1)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                cyclePosition === 1
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
              disabled={running && !paused}
            >
              Cycle to Node 2
            </button>
            <button
              onClick={() => updateCyclePosition(0)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                cyclePosition === 0
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
              disabled={running && !paused}
            >
              Cycle to Node 1
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Speed
              </label>
              <select
                className="bg-slate-800 border border-slate-700 rounded text-white text-sm p-2"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                disabled={running && !paused}
              >
                {speedOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={startSimulation}
              className="h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              disabled={hasCycle}
            >
              {running && !paused ? (
                <>
                  <Pause size={16} />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>{paused ? "Resume" : "Start"}</span>
                </>
              )}
            </button>

            <button
              onClick={resetSimulation}
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
          {/* Linked List visualization */}
          <div className="mb-6 p-4 bg-slate-950 rounded-lg border border-slate-700">
            <div className="flex items-center mb-3">
              <Database size={18} className="text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">
                Linked List with Cycle
              </h3>
            </div>

            <div className="relative h-64 flex items-center justify-center overflow-visible">
              {/* Nodes with animated pointers */}
              <div className="flex items-center justify-center gap-1 z-10">
                {linkedList.map((node, index) => (
                  <div key={index} className="flex items-center relative">
                    <motion.div
                      className={`
                        w-16 h-16 flex flex-col items-center justify-center rounded-full
                        ${
                          cycleStart === index
                            ? "bg-violet-600 border-4 border-violet-400 text-white"
                            : hasCycle &&
                              slowIndex === fastIndex &&
                              slowIndex === index
                            ? "bg-purple-600 text-white"
                            : slowIndex === index && fastIndex === index
                            ? "bg-purple-600 text-white"
                            : slowIndex === index
                            ? "bg-green-600 text-white"
                            : fastIndex === index
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-white"
                        }
                      `}
                      initial={{ scale: 1 }}
                      animate={{
                        scale:
                          cycleStart === index ||
                          slowIndex === index ||
                          fastIndex === index
                            ? 1.1
                            : 1,
                        y:
                          cycleStart === index ||
                          slowIndex === index ||
                          fastIndex === index
                            ? -5
                            : 0,
                      }}
                      transition={{ duration: getAnimationDuration() }}
                    >
                      <span className="text-lg font-bold text-white">
                        {node.val}
                      </span>
                      {slowIndex === index && fastIndex === index && (
                        <span className="text-xs text-white bg-purple-700 px-1 rounded">
                          T+H
                        </span>
                      )}
                      {slowIndex === index && fastIndex !== index && (
                        <motion.div
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="absolute w-6 h-6 bg-green-500 rounded-full top-[-10px] text-xs flex items-center justify-center font-bold"
                        >
                          T
                        </motion.div>
                      )}
                      {fastIndex === index && slowIndex !== index && (
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
                    {/* Regular arrows */}
                    {index < linkedList.length - 1 && (
                      <div className="mx-2">
                        <ArrowRight className="text-slate-400" size={24} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Curved arrow for the cycle */}
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                viewBox="0 0 600 250"
                preserveAspectRatio="none"
              >
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                  </marker>
                </defs>

                {/* Dynamic path based on cycle position */}
                {cyclePosition === 2 && (
                  <path
                    d="M500,80 Q550,20 400,20 T250,80"
                    stroke={hasCycle ? "#8b5cf6" : "#94a3b8"}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={hasCycle ? "0" : "5,5"}
                    markerEnd="url(#arrowhead)"
                  />
                )}
                {cyclePosition === 1 && (
                  <path
                    d="M500,80 Q550,20 300,20 T150,80"
                    stroke={hasCycle ? "#8b5cf6" : "#94a3b8"}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={hasCycle ? "0" : "5,5"}
                    markerEnd="url(#arrowhead)"
                  />
                )}
                {cyclePosition === 0 && (
                  <path
                    d="M500,80 Q550,20 200,20 T50,80"
                    stroke={hasCycle ? "#8b5cf6" : "#94a3b8"}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={hasCycle ? "0" : "5,5"}
                    markerEnd="url(#arrowhead)"
                  />
                )}
              </svg>
            </div>
          </div>

          {/* Result Visualization */}
          <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex items-center mb-3">
              <AlertCircle size={18} className="text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">
                Detection Result
              </h3>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg">
              {hasCycle ? (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: getAnimationDuration() * 2 }}
                >
                  <div className="mb-2 text-violet-400 font-semibold">
                    Cycle Detected!
                  </div>
                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                      <div className="bg-purple-800 border-2 border-purple-500 w-20 h-20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                        <span className="text-2xl font-bold text-white">✓</span>
                      </div>
                      <div className="text-sm text-slate-300">Cycle Exists</div>
                    </div>

                    {cycleStart !== null && (
                      <div className="text-center">
                        <div className="bg-violet-800 border-2 border-violet-500 w-20 h-20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                          <span className="text-2xl font-bold text-white">
                            {linkedList[cycleStart].val}
                          </span>
                        </div>
                        <div className="text-sm text-slate-300">
                          Cycle Start Node
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 font-mono text-violet-400">
                    return true; // Cycle starts at node{" "}
                    {cycleStart !== null ? linkedList[cycleStart].val : "?"}
                  </div>
                </motion.div>
              ) : running ? (
                <div className="text-center text-yellow-400">
                  {paused
                    ? "Paused - Click Resume to continue detection"
                    : "Detecting cycle using Floyd's Tortoise and Hare algorithm..."}
                </div>
              ) : (
                <div className="text-center text-slate-400">
                  Click &quot;Start&quot; to begin detecting if there&apos;s a
                  cycle in the linked list
                </div>
              )}
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-700 text-center">
            {running ? (
              <div className="text-yellow-300 font-medium">
                {paused ? (
                  "Algorithm paused - Click Resume to continue"
                ) : (
                  <>
                    {activeCodeLine === 1 &&
                      "Initializing slow and fast pointers at the head..."}
                    {activeCodeLine === 2 &&
                      "Checking if fast and fast->next are not null..."}
                    {activeCodeLine === 3 &&
                      "Moving slow pointer one step forward..."}
                    {activeCodeLine === 4 &&
                      "Moving fast pointer two steps forward..."}
                    {activeCodeLine === 6 &&
                      "Cycle detected! Slow and fast pointers have met."}
                    {activeCodeLine === 8 &&
                      "Resetting slow pointer to head to find cycle start..."}
                    {activeCodeLine === 9 &&
                      "Found cycle starting point where pointers meet again."}
                  </>
                )}
              </div>
            ) : hasCycle ? (
              <div className="text-green-400 font-medium">
                Algorithm complete: Cycle detected with starting point at node{" "}
                {cycleStart !== null ? linkedList[cycleStart].val : "?"}
              </div>
            ) : (
              <div className="text-slate-400 font-medium">
                Click &quot;Start&quot; to begin detecting cycles using
                Floyd&apos;s Tortoise and Hare algorithm
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
                      py-1 px-2 my-1 rounded-sm
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
                    {index === 2 && (
                      <div className="text-xs text-slate-400 pl-6 mt-1">
                        {/* Checks if we can move fast pointer two steps*/}
                      </div>
                    )}
                    {index === 5 && (
                      <div className="text-xs text-slate-400 pl-6 mt-1">
                        {/* If pointers meet, we have a cycle */}
                      </div>
                    )}
                    {index === 8 && (
                      <div className="text-xs text-slate-400 pl-6 mt-1">
                        {/* Extra: Find the start of the cycle  */}
                      </div>
                    )}
                  </motion.div>
                ))}

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <h4 className="text-md font-semibold text-white mb-3">
                    Current Step Explanation:
                  </h4>
                  <div className="bg-slate-900 p-3 rounded-lg text-sm">
                    {activeCodeLine === 0 && !running && !hasCycle && (
                      <div className="text-slate-400">
                        Ready to visualize Floyd&apos;s Cycle Detection
                        algorithm (Tortoise and Hare). Press &quot;Start&quot;
                        to begin.
                      </div>
                    )}
                    {running && paused ? (
                      <div className="text-yellow-400">
                        <span className="font-bold">Algorithm Paused:</span>{" "}
                        Click the Resume button to continue the cycle detection.
                      </div>
                    ) : (
                      <>
                        {activeCodeLine === 1 && (
                          <div className="text-blue-400">
                            <span className="font-bold">
                              Initialize Pointers:
                            </span>{" "}
                            Set both slow (tortoise) and fast (hare) pointers to
                            the head of the list. The slow pointer will move one
                            step at a time, while the fast pointer will move two
                            steps.
                          </div>
                        )}
                        {activeCodeLine === 2 && (
                          <div className="text-blue-400">
                            <span className="font-bold">
                              Check Loop Condition:
                            </span>{" "}
                            We continue as long as the fast pointer and its next
                            node are not null. This ensures we don&apos;t try to
                            move the fast pointer beyond the list.
                          </div>
                        )}
                        {activeCodeLine === 3 && (
                          <div className="text-blue-400">
                            <span className="font-bold">
                              Move Slow Pointer:
                            </span>{" "}
                            Move the slow pointer one step forward. This is the
                            tortoise in our algorithm.
                          </div>
                        )}
                        {activeCodeLine === 4 && (
                          <div className="text-blue-400">
                            <span className="font-bold">
                              Move Fast Pointer:
                            </span>{" "}
                            Move the fast pointer two steps forward. This is the
                            hare in our algorithm. If there&apos;s a cycle, the
                            fast and slow pointers will eventually meet.
                          </div>
                        )}
                        {activeCodeLine === 6 && (
                          <div className="text-violet-400">
                            <span className="font-bold">Cycle Detected:</span>{" "}
                            The slow and fast pointers have met at the same
                            node, which confirms there is a cycle in the linked
                            list!
                          </div>
                        )}
                        {activeCodeLine === 8 && (
                          <div className="text-violet-400">
                            <span className="font-bold">Find Cycle Start:</span>{" "}
                            We reset the slow pointer to the head while keeping
                            the fast pointer at the meeting point. By moving
                            both one step at a time, they will meet at the
                            cycle&apos;s start.
                          </div>
                        )}
                        {activeCodeLine === 9 && (
                          <div className="text-green-400">
                            <span className="font-bold">
                              Found Cycle Start:
                            </span>{" "}
                            The point where slow and fast pointers meet again is
                            the beginning of the cycle. This node is where the
                            loop connects back to the list.
                          </div>
                        )}
                      </>
                    )}
                    {activeCodeLine === 0 && hasCycle && (
                      <div className="text-green-400">
                        <span className="font-bold">Algorithm complete:</span>{" "}
                        Found a cycle that starts at node{" "}
                        <span className="text-yellow-300">
                          {cycleStart !== null
                            ? linkedList[cycleStart].val
                            : "?"}
                        </span>
                        .
                      </div>
                    )}
                  </div>

                  {activeCodeLine > 0 || hasCycle ? (
                    <div className="mt-3 p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-500">
                        Time Complexity: O(n)
                      </div>
                      <div className="text-xs text-slate-500">
                        Space Complexity: O(1)
                      </div>
                      <div className="text-xs text-slate-300 mt-1 pt-1 border-t border-slate-800">
                        Floyd&apos;s Cycle Detection algorithm uses two pointers
                        moving at different speeds to detect cycles in a linked
                        list. If a cycle exists, the pointers will eventually
                        meet within the cycle.
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
