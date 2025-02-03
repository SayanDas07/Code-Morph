import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

const DFSAnimation = () => {
    const [step, setStep] = useState(-1); // Start at -1 to represent initial null state
    const [visited, setVisited] = useState(Array(9).fill(0));
    const [dfsOutput, setDfsOutput] = useState<number[]>([]);
    const [stack, setStack] = useState<number[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1500);

    const nodes = [
        { id: 1, x: 250, y: 50 },   // Root
        { id: 2, x: 150, y: 125 },  // Left child
        { id: 3, x: 350, y: 125 },  // Right child
        { id: 4, x: 75, y: 200 },   // Left grandchild 1
        { id: 5, x: 175, y: 200 },  // Left grandchild 2
        { id: 6, x: 275, y: 200 },  // Right grandchild 1
        { id: 7, x: 425, y: 200 },  // Right grandchild 2
        { id: 8, x: 175, y: 275 },  // Great-grandchild
    ];

    const edges = [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
        { from: 3, to: 6 },
        { from: 3, to: 7 },
        { from: 5, to: 8 },
        { from: 6, to: 8 },
    ];

    const dfsSteps = [
        { stack: [], visited: Array(9).fill(0), output: [] }, // Initial null state
        { stack: [1], visited: [0, 1, 0, 0, 0, 0, 0, 0, 0], output: [1] },
        { stack: [1, 2], visited: [0, 1, 1, 0, 0, 0, 0, 0, 0], output: [1, 2] },
        { stack: [1, 2, 4], visited: [0, 1, 1, 0, 1, 0, 0, 0, 0], output: [1, 2, 4] },
        { stack: [1, 2, 5], visited: [0, 1, 1, 1, 1, 0, 0, 0, 0], output: [1, 2, 4, 5] },
        { stack: [1, 2, 5, 8], visited: [0, 1, 1, 1, 1, 0, 0, 0, 1], output: [1, 2, 4, 5, 8] },
        { stack: [1, 3], visited: [0, 1, 1, 1, 1, 1, 0, 0, 1], output: [1, 2, 4, 5, 8, 3] },
        { stack: [1, 3, 6], visited: [0, 1, 1, 1, 1, 1, 1, 0, 1], output: [1, 2, 4, 5, 8, 3, 6] },
        { stack: [1, 3, 7], visited: [0, 1, 1, 1, 1, 1, 1, 1, 1], output: [1, 2, 4, 5, 8, 3, 6, 7] },
        { stack: [], visited: [0, 1, 1, 1, 1, 1, 1, 1, 1], output: [1, 2, 4, 5, 8, 3, 6, 7] },
    ];

    useEffect(() => {
        if (isPlaying && step < dfsSteps.length - 1) {
            const timer = setTimeout(() => {
                setStep(prev => prev + 1);
                setStack(dfsSteps[step + 1].stack);
                setVisited(dfsSteps[step + 1].visited);
                setDfsOutput(dfsSteps[step + 1].output);
            }, speed);
            return () => clearTimeout(timer);
        } else {
            setIsPlaying(false);
        }
    }, [step, isPlaying, speed]);

    const Edge = ({ from, to }: { from: number, to: number }) => {
        const fromNode = nodes.find(n => n.id === from);
        const toNode = nodes.find(n => n.id === to);

        if (!fromNode || !toNode) return null;

        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const angle = Math.atan2(dy, dx);

        const nodeRadius = 25;
        const arrowLength = 15;


        const startX = fromNode.x + (nodeRadius * Math.cos(angle));
        const startY = fromNode.y + (nodeRadius * Math.sin(angle));
        const endX = toNode.x - (nodeRadius * Math.cos(angle));
        const endY = toNode.y - (nodeRadius * Math.sin(angle));

        const arrowPoint1X = endX - arrowLength * Math.cos(angle - Math.PI / 6);
        const arrowPoint1Y = endY - arrowLength * Math.sin(angle - Math.PI / 6);
        const arrowPoint2X = endX - arrowLength * Math.cos(angle + Math.PI / 6);
        const arrowPoint2Y = endY - arrowLength * Math.sin(angle + Math.PI / 6);

        return (
            <g>
                <motion.line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke={visited[from] && visited[to] ? "#60A5FA" : "#4B5563"}
                    strokeWidth="2"
                    animate={{
                        stroke: visited[from] && visited[to] ? "#60A5FA" : "#4B5563"
                    }}
                    transition={{ duration: 0.5 }}
                />
                <motion.path
                    d={`M ${endX} ${endY} L ${arrowPoint1X} ${arrowPoint1Y} L ${arrowPoint2X} ${arrowPoint2Y} Z`}
                    fill={visited[from] && visited[to] ? "#60A5FA" : "#4B5563"}
                    animate={{
                        fill: visited[from] && visited[to] ? "#60A5FA" : "#4B5563"
                    }}
                    transition={{ duration: 0.5 }}
                />
            </g>
        );
    };

    return (
        <div className="flex flex-col items-center w-full max-w-auto p-6 space-y-8 bg-gray-900 rounded-xl">
            <h2 className="text-2xl font-bold text-blue-300">DFS Traversal Animation</h2>

            <div className="w-full bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <svg width="500" height="300" className="w-full">
                    {edges.map((edge, i) => (
                        <Edge key={i} from={edge.from} to={edge.to} />
                    ))}

                    {nodes.map((node) => (
                        <g key={node.id}>
                            <motion.circle
                                cx={node.x}
                                cy={node.y}
                                r="25"
                                fill={visited[node.id] ? "#2563EB" : "#1F2937"}
                                stroke={stack.includes(node.id) ? "#F59E0B" : "#4B5563"}
                                strokeWidth="3"
                                animate={{
                                    scale: visited[node.id] ? [1, 1.2, 1] : 1,
                                    strokeWidth: stack.includes(node.id) ? 4 : 2
                                }}
                                transition={{ duration: 0.3 }}
                            />
                            <text
                                x={node.x}
                                y={node.y}
                                textAnchor="middle"
                                dy="0.3em"
                                fill={visited[node.id] ? "#fff" : "#9CA3AF"}
                                className="text-lg font-bold"
                            >
                                {node.id}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>

            <div className="w-full grid grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-bold mb-2 text-blue-300">Recursive Stack</h3>
                    <div className="flex flex-col-reverse space-y-2 space-y-reverse min-h-[100px]">
                        <AnimatePresence>
                            {stack.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="w-12 h-12 flex items-center justify-center bg-amber-500 text-white rounded-lg shadow-md"
                                >
                                    {item}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-bold mb-2 text-blue-300">Visited Array</h3>
                    <div className="flex flex-wrap gap-2">
                        <AnimatePresence>
                            {visited.map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-12 h-12 flex flex-col items-center justify-center bg-green-600 text-white rounded-lg shadow-md"
                                >
                                    <span className="text-xs text-gray-200">{index}</span>
                                    <span className="text-lg font-bold">{value}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-bold mb-2 text-blue-300">DFS Output</h3>
                    <div className="flex flex-wrap gap-2">
                        <AnimatePresence>
                            {dfsOutput.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-lg shadow-md"
                                >
                                    {item}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>


            </div>

            <div className="flex items-center justify-center space-x-6">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 shadow-md"
                >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                    onClick={() => {
                        setStep(-1);
                        setStack([]);
                        setVisited(Array(9).fill(0));
                        setDfsOutput([]);
                        setIsPlaying(false);
                    }}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2 shadow-md"
                >
                    <RotateCcw className="w-5 h-5" />
                    <span>Reset</span>
                </button>

                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-300">Speed:</span>
                    <input
                        type="range"
                        min="500"
                        max="3000"
                        step="500"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-32"
                    />
                    <span className="text-sm text-gray-300">{speed}ms</span>
                </div>
            </div>
        </div>
    );
};

export default DFSAnimation;