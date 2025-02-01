import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    x: number;
    y: number;
    isVisited: boolean;
    isActive: boolean;
}

const InorderTraversalVisualization = () => {
    const [tree, setTree] = useState<TreeNode | null>(null);
    const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const root: TreeNode = {
            val: 1,
            left: {
                val: 2,
                left: {
                    val: 4,
                    left: null,
                    right: null,
                    x: 200,
                    y: 300,
                    isVisited: false,
                    isActive: false
                },
                right: {
                    val: 5,
                    left: null,
                    right: null,
                    x: 300,
                    y: 300,
                    isVisited: false,
                    isActive: false
                },
                x: 250,
                y: 200,
                isVisited: false,
                isActive: false
            },
            right: {
                val: 3,
                left: {
                    val: 6,
                    left: null,
                    right: null,
                    x: 400,
                    y: 300,
                    isVisited: false,
                    isActive: false
                },
                right: {
                    val: 7,
                    left: null,
                    right: null,
                    x: 500,
                    y: 300,
                    isVisited: false,
                    isActive: false
                },
                x: 450,
                y: 200,
                isVisited: false,
                isActive: false
            },
            x: 350,
            y: 100,
            isVisited: false,
            isActive: false
        };
        setTree(root);
    }, []);

    const resetTree = (node: TreeNode | null) => {
        if (!node) return;
        node.isVisited = false;
        node.isActive = false;
        resetTree(node.left);
        resetTree(node.right);
    };

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms / 1));

    const animateInorder = async (node: TreeNode | null) => {
        if (!node) return;

        // First highlight current node
        node.isActive = true;
        setTree({ ...tree! });
        await delay(1000);

        // Traverse left subtree
        await animateInorder(node.left);

        // Visit current node
        node.isVisited = true;
        node.isActive = false;
        setVisitedNodes(prev => [...prev, node.val]);
        setTree({ ...tree! });
        await delay(500);

        // Traverse right subtree
        await animateInorder(node.right);
    };

    const startAnimation = async () => {
        if (!tree || isAnimating) return;
        setIsAnimating(true);
        setVisitedNodes([]);
        resetTree(tree);
        setTree({ ...tree });
        await animateInorder(tree);
        setIsAnimating(false);
    };

    const renderNode = (node: TreeNode) => {
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
                    className={`${node.isActive ? 'fill-yellow-400' :
                        node.isVisited ? 'fill-green-400' : 'fill-blue-500'
                        } stroke-2 stroke-blue-300`}
                    initial={{ scale: 0 }}
                    animate={{
                        scale: 1,
                        fill: node.isActive ? '#facc15' : node.isVisited ? '#4ade80' : '#3b82f6'
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
    };

    const renderTree = (node: TreeNode | null): React.ReactNode => {
        if (!node) return null;
        return (
            <>
                {renderNode(node)}
                {node.left && renderTree(node.left)}
                {node.right && renderTree(node.right)}
            </>
        );
    };

    return (
        <Card className="w-full max-w-auto bg-slate-900 text-white">
            <CardHeader className="border-b border-slate-800">
                <CardTitle className="text-blue-400">Binary Tree Inorder Traversal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="flex items-center justify-between space-x-4">
                    <Button
                        onClick={startAnimation}
                        disabled={isAnimating}
                        className="w-40 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isAnimating ? 'Animating...' : 'Start Traversal'}
                    </Button>
                </div>

                <div className="w-full bg-slate-800 rounded-lg shadow-inner h-96 p-4">
                    <svg width="100%" height="100%" viewBox="0 0 700 400">
                        {tree && renderTree(tree)}
                    </svg>
                </div>

                <motion.div
                    className="text-lg p-4 bg-slate-800 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="font-semibold text-blue-400">Visited nodes:</span>{" "}
                    <motion.span layout className="text-slate-300">
                        [{visitedNodes.join(', ')}]
                    </motion.span>
                </motion.div>
            </CardContent>
        </Card>
    );
};

export default InorderTraversalVisualization;