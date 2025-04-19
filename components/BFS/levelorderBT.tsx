"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RefreshCw,
  Code,
  Database,
  TreeDeciduous,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x: number;
  y: number;
  isVisited: boolean;
  isActive: boolean;
  isInQueue: boolean;
}

interface LevelOrderTraversalVisualizationProps {
  speed?: number;
}

export default function LevelOrderTraversalVisualization({
  speed = 1500,
}: LevelOrderTraversalVisualizationProps) {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [queue, setQueue] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(speed);
  const [activeCodeLine, setActiveCodeLine] = useState<number>(0);
  const [selectedTree, setSelectedTree] = useState<string>("balanced");
  const [customTreeInput, setCustomTreeInput] =
    useState<string>("1,2,3,4,5,6,7");
  const [showTreeInput, setShowTreeInput] = useState<boolean>(false);

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

  // Move buildTreeFromArray outside of render to prevent recreation on each render
  const buildTreeFromArray = useCallback(
    (array: (number | null)[]): TreeNode | null => {
      if (!array.length || array[0] === null) return null;

      // Create nodes
      const nodes: (TreeNode | null)[] = array.map((val) => {
        if (val === null) return null;
        return {
          val,
          left: null,
          right: null,
          x: 0,
          y: 0,
          isVisited: false,
          isActive: false,
          isInQueue: false,
        };
      });

      // Connect nodes
      for (let i = 0; i < array.length; i++) {
        if (nodes[i]) {
          const leftIndex = 2 * i + 1;
          const rightIndex = 2 * i + 2;

          if (leftIndex < array.length) {
            (nodes[i] as TreeNode).left = nodes[leftIndex];
          }

          if (rightIndex < array.length) {
            (nodes[i] as TreeNode).right = nodes[rightIndex];
          }
        }
      }

      // Calculate tree dimensions
      const getTreeHeight = (node: TreeNode | null, depth = 0): number => {
        if (!node) return depth;
        return Math.max(
          getTreeHeight(node.left, depth + 1),
          getTreeHeight(node.right, depth + 1)
        );
      };

      const height = getTreeHeight(nodes[0] as TreeNode);
      const totalWidth = 500;
      const totalHeight = 300;
      const levelHeight = totalHeight / height;

      // Improved position calculator
      const calculatePositions = (
        node: TreeNode | null,
        level = 0,
        leftBound = 0,
        rightBound = totalWidth
      ) => {
        if (!node) return;

        // Calculate horizontal position (centered in its space)
        const width = rightBound - leftBound;
        node.x = leftBound + width / 2;

        // Calculate vertical position
        node.y = level * levelHeight + 40;

        // Calculate bounds for children
        const mid = (leftBound + rightBound) / 2;

        // Recursively position children
        if (node.left) {
          calculatePositions(node.left, level + 1, leftBound, mid);
        }

        if (node.right) {
          calculatePositions(node.right, level + 1, mid, rightBound);
        }
      };

      calculatePositions(nodes[0] as TreeNode);

      return nodes[0] as TreeNode;
    },
    []
  );

  // Define treeOptions using useMemo to prevent recreation on every render
  const treeOptions = useMemo(
    () => ({
      balanced: buildTreeFromArray([1, 2, 3, 4, 5, 6, 7]),
      unbalanced: buildTreeFromArray([
        1,
        2,
        3,
        null,
        4,
        null,
        null,
        null,
        null,
        5,
        6,
      ]),
      custom: null,
    }),
    [buildTreeFromArray]
  );

  // Initialize tree only once on component mount
  useEffect(() => {
    setTree(treeOptions.balanced);
  }, [treeOptions.balanced]);

  const resetTree = useCallback((node: TreeNode | null) => {
    if (!node) return;
    node.isVisited = false;
    node.isActive = false;
    node.isInQueue = false;
    resetTree(node.left);
    resetTree(node.right);
  }, []);

  const resetAnimation = useCallback(() => {
    // Set the stopping flag to true
    isStoppingRef.current = true;

    if (!tree) return;

    // Create a deep copy of the tree for resetting
    const newTree = { ...tree };
    resetTree(newTree);

    setVisitedNodes([]);
    setQueue([]);
    setTree(newTree);
    setIsAnimating(false);
    setIsPaused(false);
    setIsComplete(false);
    setActiveCodeLine(0);

    // Reset stopping flag after a short delay
    setTimeout(() => {
      isStoppingRef.current = false;
    }, 100);
  }, [tree, resetTree]);

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

  // Find node in tree by value and position (for updating state)
  const findNodeInTree = useCallback(
    (
      tree: TreeNode | null,
      val: number,
      x: number,
      y: number
    ): TreeNode | null => {
      if (!tree) return null;
      if (
        tree.val === val &&
        Math.abs(tree.x - x) < 1 &&
        Math.abs(tree.y - y) < 1
      ) {
        return tree;
      }

      const leftResult = findNodeInTree(tree.left, val, x, y);
      if (leftResult) return leftResult;

      return findNodeInTree(tree.right, val, x, y);
    },
    []
  );

  // AnimateLevelOrder function
  const animateLevelOrder = useCallback(
    async (root: TreeNode | null) => {
      if (!root) return;

      // Create a working copy of the current tree state that we'll update throughout
      const currentTreeState = { ...tree! };

      setActiveCodeLine(1); // Initialization
      await delay(animationSpeed / 2);

      // Create a working copy of the queue for BFS
      const bfsQueue: TreeNode[] = [root];

      // Update root node status in our working tree
      const rootNode = findNodeInTree(
        currentTreeState,
        root.val,
        root.x,
        root.y
      );
      if (rootNode) {
        rootNode.isInQueue = true;
      }

      setQueue([root.val]);
      setTree(currentTreeState); // Update UI with current tree state

      await delay(animationSpeed / 2);

      // BFS Loop
      while (bfsQueue.length > 0 && !isStoppingRef.current) {
        setActiveCodeLine(2); // Process queue
        await delay(animationSpeed / 2);

        // Get current node from queue
        const currentNode = bfsQueue.shift()!;
        setQueue((prevQueue) => prevQueue.slice(1));

        // Find the node in our working tree state
        const stateNode = findNodeInTree(
          currentTreeState,
          currentNode.val,
          currentNode.x,
          currentNode.y
        );

        if (stateNode) {
          // Update node status
          stateNode.isActive = true;
          stateNode.isInQueue = false;
          // No need to create a new tree object - just update our working copy
          setTree({ ...currentTreeState }); // Update UI with current state
        }

        setActiveCodeLine(3); // Process current node
        await delay(animationSpeed);

        // Find the node again in our working tree state
        const visitedNode = findNodeInTree(
          currentTreeState,
          currentNode.val,
          currentNode.x,
          currentNode.y
        );

        if (visitedNode) {
          visitedNode.isVisited = true;
          visitedNode.isActive = false;
          // Update UI with the current state
          setTree({ ...currentTreeState });
        }

        setVisitedNodes((prev) => [...prev, currentNode.val]);

        setActiveCodeLine(4); // Add children to queue
        await delay(animationSpeed / 2);

        // Process children and update queue
        if (!isStoppingRef.current) {
          const queueUpdates: number[] = [];

          // Process left child
          if (currentNode.left) {
            const leftChild = findNodeInTree(
              currentTreeState,
              currentNode.left.val,
              currentNode.left.x,
              currentNode.left.y
            );
            if (leftChild) {
              leftChild.isInQueue = true;
              bfsQueue.push(currentNode.left);
              queueUpdates.push(currentNode.left.val);
            }
          }

          // Process right child
          if (currentNode.right) {
            const rightChild = findNodeInTree(
              currentTreeState,
              currentNode.right.val,
              currentNode.right.x,
              currentNode.right.y
            );
            if (rightChild) {
              rightChild.isInQueue = true;
              bfsQueue.push(currentNode.right);
              queueUpdates.push(currentNode.right.val);
            }
          }

          // Update UI state with our current working tree
          setTree({ ...currentTreeState });
          setQueue((prevQueue) => [...prevQueue, ...queueUpdates]);

          await delay(animationSpeed / 2);
        }
      }

      // Finish only if not manually stopped
      if (!isStoppingRef.current) {
        setActiveCodeLine(5); // Complete
        setIsComplete(true);
      }
    },
    [delay, animationSpeed, tree, findNodeInTree]
  );

  const startAnimation = useCallback(async () => {
    if (!tree) return;

    if (isAnimating && !isPaused) {
      setIsPaused(true);
    } else if (isAnimating && isPaused) {
      setIsPaused(false);
    } else {
      resetAnimation();
      setIsAnimating(true);
      animateLevelOrder(tree);
    }
  }, [tree, isAnimating, isPaused, resetAnimation, animateLevelOrder]);

  const handleTreeChange = useCallback(
    (option: string) => {
      if (isAnimating && !isPaused) return;

      setSelectedTree(option);

      if (option === "custom") {
        setShowTreeInput(true);
        try {
          const parsedArray = customTreeInput.split(",").map((item) => {
            const trimmed = item.trim();
            return trimmed === "null" ? null : parseInt(trimmed);
          });

          if (
            !parsedArray.some((val) => val !== null && isNaN(val as number))
          ) {
            const newTree = buildTreeFromArray(parsedArray);
            setTree(newTree);
          }
        } catch {
          // Keep current tree if parsing fails
        }
      } else {
        setShowTreeInput(false);
        setTree(treeOptions[option as keyof typeof treeOptions]);
      }

      // Reset animation state
      setVisitedNodes([]);
      setQueue([]);
      setIsAnimating(false);
      setIsPaused(false);
      setIsComplete(false);
      setActiveCodeLine(0);
    },
    [isAnimating, isPaused, customTreeInput, buildTreeFromArray, treeOptions]
  );

  const handleCustomTreeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCustomTreeInput(e.target.value);
    },
    []
  );

  const applyCustomTree = useCallback(() => {
    try {
      const parsedArray = customTreeInput.split(",").map((item) => {
        const trimmed = item.trim();
        return trimmed === "null" ? null : parseInt(trimmed);
      });

      if (parsedArray.some((val) => val !== null && isNaN(val as number))) {
        alert(
          "Invalid tree format. Please enter comma-separated numbers or 'null'."
        );
        return;
      }

      const newTree = buildTreeFromArray(parsedArray);
      setTree(newTree);

      // Reset animation state
      setVisitedNodes([]);
      setQueue([]);
      setIsAnimating(false);
      setIsPaused(false);
      setIsComplete(false);
      setActiveCodeLine(0);
    } catch {
      alert(
        "Invalid tree format. Please enter comma-separated numbers or 'null'."
      );
    }
  }, [customTreeInput, buildTreeFromArray]);

  const renderNode = useCallback((node: TreeNode) => {
    return (
      <g key={node.val}>
        {node.left && (
          <motion.line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            stroke="#4A90E2"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
        )}
        {node.right && (
          <motion.line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            stroke="#4A90E2"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
        )}
        <motion.circle
          cx={node.x}
          cy={node.y}
          r="20"
          className={`
            ${
              node.isActive
                ? "fill-yellow-400"
                : node.isVisited
                ? "fill-green-400"
                : node.isInQueue
                ? "fill-purple-400"
                : "fill-blue-500"
            } stroke-2 stroke-blue-300
          `}
          initial={{ scale: 0 }}
          animate={{
            scale: 1,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        />
        <motion.text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-lg font-bold fill-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {node.val}
        </motion.text>
      </g>
    );
  }, []);

  const renderTree = useCallback(
    (node: TreeNode | null): React.ReactNode => {
      if (!node) return null;
      return (
        <>
          {renderNode(node)}
          {node.left && renderTree(node.left)}
          {node.right && renderTree(node.right)}
        </>
      );
    },
    [renderNode]
  );

  // Pseudo code for Level Order Traversal
  const pseudoCode = useMemo(
    () => [
      { line: "levelOrder(root) {", active: false },
      {
        line: "    if (root == null) return [];",
        active: activeCodeLine === 1,
      },
      {
        line: "    queue = [root]; result = [];",
        active: activeCodeLine === 1,
      },
      {
        line: "    while (queue is not empty) {",
        active: activeCodeLine === 2,
      },
      { line: "        node = queue.shift();", active: activeCodeLine === 3 },
      { line: "        result.push(node.val);", active: activeCodeLine === 3 },
      {
        line: "        if (node.left) queue.push(node.left);",
        active: activeCodeLine === 4,
      },
      {
        line: "        if (node.right) queue.push(node.right);",
        active: activeCodeLine === 4,
      },
      { line: "    }", active: false },
      { line: "    return result;", active: activeCodeLine === 5 },
      { line: "}", active: false },
    ],
    [activeCodeLine]
  );

  // Calculate animation duration based on speed setting
  const getAnimationDuration = useCallback(() => {
    return Math.max(0.1, Math.min(0.5, animationSpeed / 2000));
  }, [animationSpeed]);

  return (
    <div className="p-6 bg-slate-800 rounded-lg shadow-xl min-h-[600px]">
      {/* Controls section */}
      <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-2 w-full lg:w-auto">
            <div className="flex flex-wrap gap-3 mb-2">
              <button
                onClick={() => handleTreeChange("balanced")}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition ${
                  selectedTree === "balanced"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                disabled={isAnimating && !isPaused}
              >
                Balanced Tree
              </button>
              <button
                onClick={() => handleTreeChange("unbalanced")}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition ${
                  selectedTree === "unbalanced"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                disabled={isAnimating && !isPaused}
              >
                Unbalanced Tree
              </button>
              <button
                onClick={() => handleTreeChange("custom")}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition ${
                  selectedTree === "custom"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                disabled={isAnimating && !isPaused}
              >
                Custom Tree
              </button>
            </div>

            {showTreeInput && (
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  className="flex-grow p-2 bg-slate-800 border border-slate-700 rounded text-white text-sm"
                  value={customTreeInput}
                  onChange={handleCustomTreeChange}
                  placeholder="Enter comma-separated values (use 'null' for empty nodes)"
                  disabled={isAnimating && !isPaused}
                />
                <button
                  onClick={applyCustomTree}
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
              disabled={isComplete || !tree}
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
          {/* Tree visualization */}
          <div className="mb-6 p-4 bg-slate-950 rounded-lg border border-slate-700">
            <div className="flex items-center mb-3">
              <TreeDeciduous size={18} className="text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">
                Binary Tree Visualization
              </h3>
            </div>

            <div className="relative h-64 flex items-center justify-center">
              {tree ? (
                <svg width="100%" height="100%" viewBox="0 0 500 300">
                  {renderTree(tree)}
                </svg>
              ) : (
                <div className="text-center text-slate-400">No tree loaded</div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs p-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
                <span className="text-slate-300">Unvisited</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-400 rounded-sm mr-1"></div>
                <span className="text-slate-300">In Queue</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-sm mr-1"></div>
                <span className="text-slate-300">Current</span>
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
              <h3 className="text-lg font-semibold text-white">
                Traversal Result
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
                  <div className="mb-3 text-green-400 font-semibold flex items-center justify-center gap-2">
                    <CheckCircle2 size={18} />
                    <span>Level Order Traversal Complete!</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {visitedNodes.map((nodeVal, index) => (
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
                    return [{visitedNodes.join(", ")}]; // Level Order Result
                  </div>
                </motion.div>
              ) : isAnimating ? (
                <div className="text-center text-yellow-400">
                  {isPaused
                    ? "Paused - Click Resume to continue traversal"
                    : "Performing Level Order Traversal..."}
                </div>
              ) : (
                <div className="text-center text-slate-400">
                  Click &quot;Start&quot; to begin Level Order Traversal
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

            <div className="overflow-auto h-auto font-mono text-sm rounded-lg bg-slate-950 p-3">
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
                        Ready to visualize Level Order Traversal (BFS) of a
                        binary tree. Press &quot;Start&quot; to begin.
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
                            start by checking if the tree is empty. If not, we
                            initialize our queue with the root node and prepare
                            to track our traversal results.
                          </div>
                        )}
                        {activeCodeLine === 2 && (
                          <div className="text-blue-400">
                            <span className="font-bold">Process Queue:</span> We
                            check if our queue has any nodes to process. As long
                            as there are nodes, we continue traversing.
                          </div>
                        )}
                        {activeCodeLine === 3 && (
                          <div className="text-blue-400">
                            <span className="font-bold">Visit Node:</span> We
                            remove the first node from the queue (FIFO) and add
                            its value to our result array. This is the current
                            node we&apos;re processing.
                          </div>
                        )}
                        {activeCodeLine === 4 && (
                          <div className="text-blue-400">
                            <span className="font-bold">Add Children:</span> We
                            add the current node&apos;s left and right children
                            (if they exist) to the queue. This ensures we
                            process nodes level by level, from left to right.
                          </div>
                        )}
                        {activeCodeLine === 5 && (
                          <div className="text-green-400">
                            <span className="font-bold">Return Result:</span>{" "}
                            The queue is empty, so we&apos;ve processed all
                            nodes. We return the result array containing the
                            level order traversal.
                          </div>
                        )}
                      </>
                    )}
                    {activeCodeLine === 0 && isComplete && (
                      <div className="text-green-400">
                        <span className="font-bold">Algorithm complete:</span>{" "}
                        Level order traversal has been completed for all nodes
                        in the tree.
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
                        {visitedNodes.length > 0
                          ? `[${visitedNodes.join(", ")}]`
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
          About Level Order Traversal
        </h2>
        <div className="text-slate-300 space-y-2">
          <p>
            Level Order Traversal (also known as Breadth-First Search or BFS) is
            a tree traversal algorithm that visits nodes level by level, from
            left to right.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              It uses a queue data structure (FIFO - First In, First Out) to
              track which nodes to process next.
            </li>
            <li>
              Starting with the root node, we visit each node and then add its
              children to the queue.
            </li>
            <li>
              This ensures we process all nodes at the current level before
              moving to the next level.
            </li>
            <li>
              Time Complexity: O(n) where n is the number of nodes in the tree.
            </li>
            <li>
              Space Complexity: O(n) in the worst case when the tree is a
              complete binary tree.
            </li>
          </ul>
          <p className="mt-2">
            Level Order Traversal is commonly used in scenarios where you need
            to process a tree in a level-by-level manner, such as finding the
            shortest path, finding the minimum depth of a tree, or connecting
            nodes at the same level.
          </p>
        </div>
      </div>
    </div>
  );
}
