"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RefreshCw,
  Code,
  Database,
  Network,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export const BFSgraph = () => {
  const [, setStep] = useState(0);
  const [queue, setQueue] = useState<number[]>([]);
  const [visited, setVisited] = useState(Array(9).fill(0));
  const [bfsOutput, setBfsOutput] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1500);
  const [activeCodeLine, setActiveCodeLine] = useState<number>(0);
  const [selectedGraph, setSelectedGraph] = useState<string>("default");

  // Add a ref to track if animation should stop
  const isStoppingRef = useRef(false);

  // Speed settings with descriptive labels
  const speedOptions = useMemo(
    () => [
      { label: "Slow", value: 2000 },
      { label: "Normal", value: 1500 },
      { label: "Fast", value: 800 },
    ],
    []
  );

  // Define graph nodes
  const graphOptions = useMemo(
    () => ({
      default: {
        nodes: [
          { id: 1, x: 250, y: 50 },
          { id: 2, x: 150, y: 100 },
          { id: 3, x: 350, y: 100 },
          { id: 4, x: 100, y: 175 },
          { id: 5, x: 200, y: 175 },
          { id: 6, x: 300, y: 175 },
          { id: 7, x: 400, y: 175 },
          { id: 8, x: 200, y: 250 },
        ],
        edges: [
          { from: 1, to: 2 },
          { from: 1, to: 3 },
          { from: 2, to: 4 },
          { from: 2, to: 5 },
          { from: 3, to: 6 },
          { from: 3, to: 7 },
          { from: 5, to: 8 },
          { from: 6, to: 8 },
        ],
        steps: [
          { queue: [1], visited: [0, 1, 0, 0, 0, 0, 0, 0, 0], output: [1] },
          {
            queue: [2, 3],
            visited: [0, 1, 1, 1, 0, 0, 0, 0, 0],
            output: [1, 2, 3],
          },
          {
            queue: [3, 4, 5],
            visited: [0, 1, 1, 1, 1, 1, 0, 0, 0],
            output: [1, 2, 3, 4, 5],
          },
          {
            queue: [4, 5, 6, 7],
            visited: [0, 1, 1, 1, 1, 1, 1, 1, 0],
            output: [1, 2, 3, 4, 5, 6, 7],
          },
          {
            queue: [5, 6, 7, 8],
            visited: [0, 1, 1, 1, 1, 1, 1, 1, 1],
            output: [1, 2, 3, 4, 5, 6, 7, 8],
          },
          {
            queue: [],
            visited: [0, 1, 1, 1, 1, 1, 1, 1, 1],
            output: [1, 2, 3, 4, 5, 6, 7, 8],
          },
        ],
      },
      cycle: {
        nodes: [
          { id: 1, x: 250, y: 50 },
          { id: 2, x: 150, y: 150 },
          { id: 3, x: 250, y: 250 },
          { id: 4, x: 350, y: 150 },
        ],
        edges: [
          { from: 1, to: 2 },
          { from: 2, to: 3 },
          { from: 3, to: 4 },
          { from: 4, to: 1 },
        ],
        steps: [
          { queue: [1], visited: [0, 1, 0, 0, 0], output: [1] },
          { queue: [2, 4], visited: [0, 1, 1, 0, 1], output: [1, 2, 4] },
          { queue: [4, 3], visited: [0, 1, 1, 1, 1], output: [1, 2, 4, 3] },
          { queue: [], visited: [0, 1, 1, 1, 1], output: [1, 2, 4, 3] },
        ],
      },
      disconnected: {
        nodes: [
          { id: 1, x: 150, y: 75 },
          { id: 2, x: 250, y: 75 },
          { id: 3, x: 350, y: 75 },
          { id: 4, x: 150, y: 200 },
          { id: 5, x: 250, y: 200 },
          { id: 6, x: 350, y: 200 },
        ],
        edges: [
          { from: 1, to: 2 },
          { from: 2, to: 3 },
          { from: 4, to: 5 },
          { from: 5, to: 6 },
        ],
        steps: [
          { queue: [1], visited: [0, 1, 0, 0, 0, 0, 0], output: [1] },
          { queue: [2], visited: [0, 1, 1, 0, 0, 0, 0], output: [1, 2] },
          { queue: [3], visited: [0, 1, 1, 1, 0, 0, 0], output: [1, 2, 3] },
          { queue: [], visited: [0, 1, 1, 1, 0, 0, 0], output: [1, 2, 3] },
          // Would need to manually restart at node 4
        ],
      },
    }),
    []
  );

  const [nodes, setNodes] = useState(graphOptions.default.nodes);
  const [edges, setEdges] = useState(graphOptions.default.edges);
  const [bfsSteps, setBfsSteps] = useState(graphOptions.default.steps);

  // Fixed delay function that properly handles pausing
  const delay = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        const checkPause = () => {
          if (!isPaused) {
            setTimeout(resolve, ms);
          } else {
            // Check again after a short interval
            setTimeout(checkPause, 100);
          }
        };
        checkPause();
      }),
    [isPaused]
  );

  // AnimateBFS function
  const animateBFS = useCallback(async () => {
    setActiveCodeLine(1); // Initialization
    await delay(animationSpeed / 2);

    for (let i = 0; i < bfsSteps.length && !isStoppingRef.current; i++) {
      setActiveCodeLine(
        i === 0 ? 2 : i === bfsSteps.length - 1 ? 5 : i % 2 === 0 ? 3 : 4
      );
      setStep(i);
      setQueue(bfsSteps[i].queue);
      setVisited(bfsSteps[i].visited);
      setBfsOutput(bfsSteps[i].output);

      if (i === bfsSteps.length - 1) {
        setIsComplete(true);
      }

      if (i < bfsSteps.length - 1) {
        await delay(animationSpeed);
      }
    }
  }, [delay, animationSpeed, bfsSteps]);

  const resetAnimation = useCallback(() => {
    // Set the stopping flag to true
    isStoppingRef.current = true;

    setStep(0);
    setQueue(bfsSteps[0].queue);
    setVisited(bfsSteps[0].visited);
    setBfsOutput(bfsSteps[0].output);
    setIsAnimating(false);
    setIsPaused(false);
    setIsComplete(false);
    setActiveCodeLine(0);

    // Reset stopping flag after a short delay
    setTimeout(() => {
      isStoppingRef.current = false;
    }, 100);
  }, [bfsSteps]);

  const startAnimation = useCallback(async () => {
    if (isAnimating && !isPaused) {
      setIsPaused(true);
    } else if (isAnimating && isPaused) {
      setIsPaused(false);
    } else {
      resetAnimation();
      setIsAnimating(true);
      animateBFS();
    }
  }, [isAnimating, isPaused, resetAnimation, animateBFS]);

  const handleGraphChange = useCallback(
    (option: string) => {
      if (isAnimating && !isPaused) return;

      setSelectedGraph(option);
      setNodes(graphOptions[option as keyof typeof graphOptions].nodes);
      setEdges(graphOptions[option as keyof typeof graphOptions].edges);
      setBfsSteps(graphOptions[option as keyof typeof graphOptions].steps);

      // Reset animation state
      setStep(0);
      setQueue(
        graphOptions[option as keyof typeof graphOptions].steps[0].queue
      );
      setVisited(
        graphOptions[option as keyof typeof graphOptions].steps[0].visited
      );
      setBfsOutput(
        graphOptions[option as keyof typeof graphOptions].steps[0].output
      );
      setIsAnimating(false);
      setIsPaused(false);
      setIsComplete(false);
      setActiveCodeLine(0);
    },
    [isAnimating, isPaused, graphOptions]
  );

  // Calculate animation duration based on speed setting
  const getAnimationDuration = useCallback(() => {
    return Math.max(0.1, Math.min(0.5, animationSpeed / 2000));
  }, [animationSpeed]);

  // Pseudo code for BFS
  const pseudoCode = useMemo(
    () => [
      { line: "BFS(graph, startNode) {", active: false },
      {
        line: "    queue = [startNode]; visited[startNode] = true;",
        active: activeCodeLine === 1,
      },
      {
        line: "    while (!queue.isEmpty()) {",
        active: activeCodeLine === 2,
      },
      {
        line: "        currentNode = queue.shift();",
        active: activeCodeLine === 3,
      },
      {
        line: "        result.push(currentNode);",
        active: activeCodeLine === 3,
      },
      {
        line: "        for (neighbor of graph.getNeighbors(currentNode)) {",
        active: activeCodeLine === 4,
      },
      {
        line: "            if (!visited[neighbor]) {",
        active: activeCodeLine === 4,
      },
      {
        line: "                visited[neighbor] = true;",
        active: activeCodeLine === 4,
      },
      {
        line: "                queue.push(neighbor);",
        active: activeCodeLine === 4,
      },
      { line: "            }", active: false },
      { line: "        }", active: false },
      { line: "    }", active: false },
      { line: "    return result;", active: activeCodeLine === 5 },
      { line: "}", active: false },
    ],
    [activeCodeLine]
  );

  const Edge = useCallback(
    ({ from, to }: { from: number; to: number }) => {
      const fromNode = nodes.find((n) => n.id === from);
      const toNode = nodes.find((n) => n.id === to);

      if (!fromNode || !toNode) return null;

      const dx = toNode.x - fromNode.x;
      const dy = toNode.y - fromNode.y;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      return (
        <>
          <motion.line
            x1={fromNode.x}
            y1={fromNode.y}
            x2={toNode.x}
            y2={toNode.y}
            stroke={visited[from] && visited[to] ? "#60A5FA" : "#4B5563"}
            strokeWidth="2"
          />
          <motion.g
            transform={`translate(${toNode.x - dx / 4},${
              toNode.y - dy / 4
            }) rotate(${angle})`}
          >
            <motion.path
              d="M-10,-5 L0,0 L-10,5"
              fill="none"
              stroke={visited[from] && visited[to] ? "#60A5FA" : "#4B5563"}
              strokeWidth="2"
            />
          </motion.g>
        </>
      );
    },
    [nodes, visited]
  );

  return (
    <div className="p-6 bg-slate-800 rounded-lg shadow-xl min-h-[600px]">
      {/* Controls section */}
      <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-2 w-full lg:w-auto">
            <div className="flex flex-wrap gap-3 mb-2">
              <button
                onClick={() => handleGraphChange("default")}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition ${
                  selectedGraph === "default"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                disabled={isAnimating && !isPaused}
              >
                Default Graph
              </button>
              <button
                onClick={() => handleGraphChange("cycle")}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition ${
                  selectedGraph === "cycle"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                disabled={isAnimating && !isPaused}
              >
                Cycle Graph
              </button>
              <button
                onClick={() => handleGraphChange("disconnected")}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition ${
                  selectedGraph === "disconnected"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                disabled={isAnimating && !isPaused}
              >
                Disconnected Graph
              </button>
            </div>
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
              disabled={isComplete || !nodes.length}
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
          {/* Graph visualization */}
          <div className="mb-6 p-4 bg-slate-950 rounded-lg border border-slate-700">
            <div className="flex items-center mb-3">
              <Network size={18} className="text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">
                Graph Visualization
              </h3>
            </div>

            <div className="relative h-64 flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 500 300">
                {edges.map((edge, i) => (
                  <Edge key={i} from={edge.from} to={edge.to} />
                ))}
                {nodes.map((node) => (
                  <g key={node.id}>
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r="20"
                      className={`
                        ${
                          queue.includes(node.id)
                            ? "fill-purple-400"
                            : visited[node.id]
                            ? "fill-green-400"
                            : "fill-slate-700"
                        } stroke-2 ${
                        visited[node.id]
                          ? "stroke-blue-300"
                          : "stroke-slate-600"
                      }
                      `}
                      animate={{
                        scale: queue.includes(node.id) ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-lg font-bold ${
                        visited[node.id] ? "fill-white" : "fill-slate-400"
                      }`}
                    >
                      {node.id}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs p-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-slate-700 rounded-sm mr-1"></div>
                <span className="text-slate-300">Unvisited</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-400 rounded-sm mr-1"></div>
                <span className="text-slate-300">In Queue</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-sm mr-1"></div>
                <span className="text-slate-300">Visited</span>
              </div>
            </div>
          </div>

          {/* Queue visualization */}
          <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex items-center mb-3">
              <Database size={18} className="text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Queue</h3>
            </div>

            <div className="bg-slate-800 p-3 rounded-lg min-h-16 flex items-center">
              {queue.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto py-2 items-center">
                  <AnimatePresence>
                    {queue.map((nodeVal, index) => (
                      <motion.div
                        key={`${nodeVal}-${index}`}
                        className="min-w-10 h-10 bg-purple-500 border border-purple-400 rounded-lg flex items-center justify-center text-white font-medium"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {nodeVal}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {queue.length > 0 && (
                    <div className="text-slate-500 ml-2">← Front of Queue</div>
                  )}
                </div>
              ) : (
                <div className="text-slate-500">Queue is empty</div>
              )}
            </div>
          </div>

          {/* Result Visualization */}
          <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex items-center mb-3">
              <AlertCircle size={18} className="text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">BFS Result</h3>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg">
              {isComplete ? (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: getAnimationDuration() * 2 }}
                >
                  <div className="mb-3 text-green-400 font-semibold flex items-center justify-center gap-2">
                    <CheckCircle2 size={18} />
                    <span>BFS Traversal Complete!</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {bfsOutput.map((nodeVal, index) => (
                      <motion.div
                        key={`result-${nodeVal}-${index}`}
                        className="w-10 h-10 bg-green-600 border border-green-400 rounded-lg flex items-center justify-center text-white font-medium"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        {nodeVal}
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-3 font-mono text-green-400">
                    return [{bfsOutput.join(", ")}]; // BFS Result
                  </div>
                </motion.div>
              ) : isAnimating ? (
                <div className="text-center text-yellow-400">
                  {isPaused
                    ? "Paused - Click Resume to continue traversal"
                    : "Performing BFS Traversal..."}
                </div>
              ) : (
                <div className="text-center text-slate-400">
                  Click &quot;Start&quot; to begin BFS Traversal
                </div>
              )}
            </div>
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

            <div className="overflow-auto max-h-96 font-mono text-sm rounded-lg bg-slate-950 p-3">
              <div>
                {pseudoCode.map((line, index) => (
                  <div
                    key={index}
                    className={`
                      py-1 px-2 my-1 rounded-sm whitespace-pre
                      ${
                        line.active
                          ? "bg-blue-900/40 text-white border-l-2 border-blue-500"
                          : "text-slate-400"
                      }
                    `}
                  >
                    <span className="mr-2 text-slate-600 select-none">
                      {index + 1}
                    </span>
                    {line.line}
                  </div>
                ))}

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <h4 className="text-md font-semibold text-white mb-3">
                    Current Step Explanation:
                  </h4>
                  <div className="bg-slate-900 p-3 rounded-lg text-sm">
                    {activeCodeLine === 0 && !isAnimating && !isComplete && (
                      <div className="text-slate-400">
                        Ready to visualize Breadth-First Search (BFS) on a
                        graph. Press &quot;Start&quot; to begin.
                      </div>
                    )}
                    {isAnimating && isPaused ? (
                      <div className="text-yellow-400">
                        <span className="font-bold">Algorithm Paused:</span>{" "}
                        Click the Resume button to continue the traversal.
                      </div>
                    ) : (
                      <>
                        {activeCodeLine === 1 && (
                          <div className="text-blue-400">
                            <span className="font-bold">Initialize:</span> We
                            start by adding the starting node to our queue and
                            marking it as visited. The queue will help us keep
                            track of which nodes to explore next.
                          </div>
                        )}
                        {activeCodeLine === 2 && (
                          <div className="text-blue-400">
                            <span className="font-bold">Process Queue:</span> We
                            continue processing nodes as long as there are nodes
                            in the queue. This ensures we visit all accessible
                            nodes in the graph.
                          </div>
                        )}
                        {activeCodeLine === 3 && (
                          <div className="text-blue-400">
                            <span className="font-bold">Visit Node:</span> We
                            remove the first node from the queue (FIFO) and add
                            it to our result array. This is the current node
                            we&apos;re processing.
                          </div>
                        )}
                        {activeCodeLine === 4 && (
                          <div className="text-blue-400">
                            <span className="font-bold">Add Neighbors:</span>{" "}
                            For each unvisited neighbor of the current node, we
                            mark it as visited and add it to the queue. This
                            ensures we explore all possible paths in
                            breadth-first order.
                          </div>
                        )}
                        {activeCodeLine === 5 && (
                          <div className="text-green-400">
                            <span className="font-bold">Return Result:</span>{" "}
                            The queue is empty, so we&apos;ve processed all
                            accessible nodes. We return the result array
                            containing the BFS traversal path.
                          </div>
                        )}
                      </>
                    )}
                    {activeCodeLine === 0 && isComplete && (
                      <div className="text-green-400">
                        <span className="font-bold">Algorithm complete:</span>{" "}
                        BFS traversal has been completed for all accessible
                        nodes in the graph.
                      </div>
                    )}
                  </div>

                  {activeCodeLine > 0 || isComplete ? (
                    <div className="mt-4">
                      <div className="text-sm text-slate-400">
                        <span className="font-bold text-slate-300">
                          Current Queue:
                        </span>{" "}
                        {queue.length > 0 ? `[${queue.join(", ")}]` : "empty"}
                      </div>
                      <div className="text-sm text-slate-400 mt-2">
                        <span className="font-bold text-slate-300">
                          Visited Nodes:
                        </span>{" "}
                        {bfsOutput.length > 0
                          ? `[${bfsOutput.join(", ")}]`
                          : "none"}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational info */}
      <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-3">
          About Breadth-First Search (BFS)
        </h2>
        <div className="text-slate-300 space-y-2">
          <p>
            Breadth-First Search (BFS) is a graph traversal algorithm that
            explores all vertices of a graph at the present depth before moving
            on to vertices at the next depth level.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              It uses a queue data structure (FIFO - First In, First Out) to
              track which vertices to process next.
            </li>
            <li>
              Starting with a source vertex, BFS visits all its neighbors before
              moving to neighbors of those neighbors.
            </li>
            <li>
              BFS guarantees the shortest path in an unweighted graph, making it
              useful for shortest path problems.
            </li>
            <li>
              Time Complexity: O(V+E) where V is the number of vertices and E is
              the number of edges in the graph.
            </li>
            <li>
              Space Complexity: O(V) for storing the queue and visited array.
            </li>
          </ul>
          <p className="mt-2">
            BFS is commonly used in social networking applications (finding
            connections), web crawlers, GPS navigation systems, network
            broadcasting, and solving puzzles like mazes or sliding puzzles.
            It&apos;s also fundamental in algorithms like shortest path finding
            and connected component analysis.
          </p>
        </div>
      </div>
    </div>
  );
};
