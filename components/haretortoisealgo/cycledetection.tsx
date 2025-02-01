"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Create a linked list with a cycle: 1 -> 2 -> 3 -> 4 -> 5 -> 3 (cycle back to 3)
type ListNode = {
    val: number;
    next: ListNode | null;
};

const createLinkedListWithCycle = (): ListNode[] => {
    const nodes: ListNode[] = [1, 2, 3, 4, 5].map((val) => ({ val, next: null }));
    for (let i = 0; i < nodes.length - 1; i++) {
        nodes[i].next = nodes[i + 1];
    }
    // Create a cycle by connecting the last node (5) to the third node (3)
    nodes[nodes.length - 1].next = nodes[2];
    return nodes;
};

const linkedList = createLinkedListWithCycle();

export default function CycleDetectionVisualizer() {
    const [slowIndex, setSlowIndex] = useState(0);
    const [fastIndex, setFastIndex] = useState(0);
    const [hasCycle, setHasCycle] = useState(false);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        if (!running || hasCycle) return;

        const interval = setInterval(() => {
            // Move slow pointer one step
            const nextSlow = linkedList[slowIndex].next ? linkedList.indexOf(linkedList[slowIndex].next) : slowIndex;
            // Move fast pointer two steps
            const nextFast = linkedList[fastIndex].next?.next ? linkedList.indexOf(linkedList[fastIndex].next.next) : fastIndex;

            // Update pointers
            setSlowIndex(nextSlow);
            setFastIndex(nextFast);

            // Check if slow and fast pointers meet
            if (nextSlow === nextFast) {
                setHasCycle(true);
                setRunning(false);
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [slowIndex, fastIndex, hasCycle, running]);

    const resetSimulation = () => {
        setSlowIndex(0);
        setFastIndex(0);
        setHasCycle(false);
        setRunning(true);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6">
            <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Detect Cycle in Linked List
            </h1>

            <div className="flex items-center p-4 relative">
                {linkedList.map((node, index) => (
                    <div key={index} className="flex items-center">
                        <div
                            className={`relative w-16 h-16 flex items-center justify-center rounded-full text-lg font-bold border-2 
                              ${hasCycle && slowIndex === fastIndex && slowIndex === index
                                    ? 'bg-violet-900 border-violet-400'
                                    : 'bg-slate-800 border-slate-600'}`}
                        >
                            {node.val}
                            {slowIndex === index && (
                                <motion.div
                                    initial={{ y: -10, scale: 0.5 }}
                                    animate={{ y: 0, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute w-6 h-6 bg-green-500 rounded-full top-[-20px] text-xs flex items-center justify-center font-bold"
                                >
                                    T
                                </motion.div>
                            )}
                            {fastIndex === index && (
                                <motion.div
                                    initial={{ y: 10, scale: 0.5 }}
                                    animate={{ y: 0, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute w-6 h-6 bg-blue-500 rounded-full bottom-[-20px] text-xs flex items-center justify-center font-bold"
                                >
                                    H
                                </motion.div>
                            )}
                        </div>
                        {/* Add arrow after each node except the last one */}
                        {index < linkedList.length && (
                            <div className="mx-2">
                                <ArrowRight className="text-slate-400" size={24} />
                            </div>
                        )}
                    </div>
                ))}

                {/* Curved arrow from node 5 to node 3 using SVG */}
                <svg
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    viewBox="0 0 600 400"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M500,200 Q550,100 400,50 T250,100"
                        stroke="#94a3b8"
                        strokeWidth="3"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                    />
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
                </svg>

            </div>

            {hasCycle && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1 }}
                    className="mt-6 text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent"
                >
                    Cycle Detected at Node {linkedList[slowIndex].val}! and loop presnt between {linkedList[slowIndex].val + 1} and {linkedList[fastIndex].val - 1}
                </motion.div>
            )}

            <button
                onClick={resetSimulation}
                className="mt-6 px-6 py-2 bg-violet-600 hover:bg-violet-500 transition rounded-lg text-white font-semibold"
            >
                {!running && !hasCycle ? "Start Simulation" : "Restart Simulation"}
            </button>
        </div>
    );
}