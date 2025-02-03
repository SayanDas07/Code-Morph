import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, RotateCcw } from 'lucide-react';

export const BFSgraph = () => {
    const [step, setStep] = useState(0);
    const [queue, setQueue] = useState<number[]>([]);
    const [visited, setVisited] = useState(Array(9).fill(0));
    const [bfsOutput, setBfsOutput] = useState<number[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1500); 

    const nodes = [
        { id: 1, x: 250, y: 50 },
        { id: 2, x: 150, y: 100 },
        { id: 3, x: 350, y: 100 },
        { id: 4, x: 100, y: 175 },
        { id: 5, x: 200, y: 175 },
        { id: 6, x: 300, y: 175 },
        { id: 7, x: 400, y: 175 },
        { id: 8, x: 200, y: 250 },
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

    const bfsSteps = [
        { queue: [1], visited: [0, 1, 0, 0, 0, 0, 0, 0, 0], output: [1] },
        { queue: [2, 3], visited: [0, 1, 1, 1, 0, 0, 0, 0, 0], output: [1, 2, 3] },
        { queue: [3, 4, 5], visited: [0, 1, 1, 1, 1, 1, 0, 0, 0], output: [1, 2, 3, 4, 5] },
        { queue: [4, 5, 6, 7], visited: [0, 1, 1, 1, 1, 1, 1, 1, 0], output: [1, 2, 3, 4, 5, 6, 7] },
        { queue: [5, 6, 7, 8], visited: [0, 1, 1, 1, 1, 1, 1, 1, 1], output: [1, 2, 3, 4, 5, 6, 7, 8] },
        { queue: [], visited: [0, 1, 1, 1, 1, 1, 1, 1, 1], output: [1, 2, 3, 4, 5, 6, 7, 8] },
    ];

    useEffect(() => {
        if (isPlaying && step < bfsSteps.length - 1) {
            const timer = setTimeout(() => {
                setStep(prev => prev + 1);
                setQueue(bfsSteps[step + 1].queue);
                setVisited(bfsSteps[step + 1].visited);
                setBfsOutput(bfsSteps[step + 1].output);
            }, speed);
            return () => clearTimeout(timer);
        } else {
            setIsPlaying(false);
        }
    }, [step, isPlaying, speed]);

    const Edge = ({ from, to }: { from: number; to: number }) => {
        const fromNode = nodes.find(n => n.id === from);
        const toNode = nodes.find(n => n.id === to);

        if (!fromNode || !toNode) return null;

        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

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
                    transform={`translate(${toNode.x - dx / 4},${toNode.y - dy / 4}) rotate(${angle})`}
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
    };

    return (
        <div className="flex flex-col items-center w-full max-w-auto p-4 space-y-8 bg-gray-900 text-white rounded-xl">
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
                                r="20"
                                fill={visited[node.id] ? "#2563EB" : "#1F2937"}
                                stroke={visited[node.id] ? "#60A5FA" : "#4B5563"}
                                strokeWidth="2"
                                animate={{
                                    scale: visited[node.id] ? [1, 1.2, 1] : 1,
                                }}
                                transition={{ duration: 0.3 }}
                            />
                            <text
                                x={node.x}
                                y={node.y}
                                textAnchor="middle"
                                dy="0.3em"
                                fill={visited[node.id] ? "#fff" : "#9CA3AF"}
                                className="text-sm font-bold"
                            >
                                {node.id}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>

            <div className="flex flex-col w-full space-y-4">
                <div className="flex space-x-4">
                    <div className="flex-1 bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
                        <h3 className="text-lg font-bold mb-2 text-blue-300">Queue</h3>
                        <div className="flex space-x-2">
                            <AnimatePresence>
                                {queue.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded"
                                    >
                                        {item}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex-1 bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
                        <h3 className="text-lg font-bold mb-2 text-blue-300">Visited Array</h3>
                        <div className="flex space-x-2">
                            {visited.map((value, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        backgroundColor: value ? '#2563EB' : '#1F2937',
                                        color: value ? '#fff' : '#9CA3AF'
                                    }}
                                    className="w-8 h-8 flex items-center justify-center border border-gray-700 rounded"
                                >
                                    {value}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-bold mb-2 text-blue-300">BFS Output</h3>
                    <div className="flex space-x-2">
                        <AnimatePresence>
                            {bfsOutput.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded"
                                >
                                    {item}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex items-center justify-center space-x-4">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-2"
                    >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        <span>{isPlaying ? 'Pause' : 'Play'}</span>
                    </button>

                    <button
                        onClick={() => {
                            setStep(0);
                            setQueue(bfsSteps[0].queue);
                            setVisited(bfsSteps[0].visited);
                            setBfsOutput(bfsSteps[0].output);
                            setIsPlaying(false);
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center space-x-2"
                    >
                        <RotateCcw size={16} />
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
        </div>
    );
};

