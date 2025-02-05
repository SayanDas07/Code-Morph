/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";

const BinarySearchVisualizer = () => {
    const [array, setArray] = useState([2, 5, 8, 12, 16, 23, 38, 42, 56, 72, 85, 91, 96, 103, 111]);
    const [target, setTarget] = useState('');
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(array.length - 1);
    const [mid, setMid] = useState(Math.floor((0 + array.length - 1) / 2));
    const [found, setFound] = useState(false);
    const [searching, setSearching] = useState(false);
    const [steps, setSteps] = useState<{ left: number; right: number; mid: number; comparison: string; }[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState('');
    const [notFound, setNotFound] = useState(false);

    const calculateSteps = (searchTarget: number) => {
        const newSteps = [];
        let l = 0;
        let r = array.length - 1;

        while (l <= r) {
            const m = Math.floor((l + r) / 2);
            newSteps.push({
                left: l,
                right: r,
                mid: m,
                comparison: array[m] === searchTarget ? 'equal' : array[m] > searchTarget ? 'greater' : 'less'
            });

            if (array[m] === searchTarget) {
                break;
            } else if (array[m] > searchTarget) {
                r = m - 1;
            } else {
                l = m + 1;
            }
        }
        return newSteps;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTarget(e.target.value);
        setError('');
        setNotFound(false);
        if (searching) {
            setSearching(false);
            setFound(false);
        }
    };

    const startSearch = () => {
        const searchTarget = parseInt(target);

        // Input validation
        if (!target) {
            setError('Please enter a number to search');
            return;
        }
        if (isNaN(searchTarget)) {
            setError('Please enter a valid number');
            return;
        }

        setSearching(true);
        setFound(false);
        setNotFound(false);
        setCurrentStep(0);
        const newSteps = calculateSteps(searchTarget);
        setSteps(newSteps);
    };

    useEffect(() => {
        if (searching && currentStep < steps.length) {
            const timer = setTimeout(() => {
                const step = steps[currentStep];
                setLeft(step.left);
                setRight(step.right);
                setMid(step.mid);

                if (array[step.mid] === parseInt(target)) {
                    setFound(true);
                    setSearching(false);
                } else if (currentStep === steps.length - 1) {
                    setNotFound(true);
                    setSearching(false);
                } else {
                    setCurrentStep(currentStep + 1);
                }
            }, 1200);

            return () => clearTimeout(timer);
        }
    }, [searching, currentStep, steps, array, target]);

    return (
        <div className="p-8 bg-slate-900 rounded-lg shadow-xl min-h-[500px]">
            <div className="mb-6 flex justify-between items-center gap-4">
                <div className="flex-1 max-w-xs">
                    <Input
                        type="number"
                        value={target}
                        onChange={handleInputChange}
                        placeholder="Enter number to search"
                        className="w-full text-white"
                    />
                    {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
                </div>
                <button
                    onClick={startSearch}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={searching || !target}
                >
                    Start Search
                </button>
                <div className="text-slate-300">
                    Array Length: {array.length}
                </div>
            </div>

            {/* Index ruler */}
            <div className="flex flex-wrap gap-2 justify-center mb-2">
                {array.map((_, index) => (
                    <div key={`index-${index}`} className="w-16 text-center text-slate-400 text-sm">
                        {index}
                    </div>
                ))}
            </div>

            {/* Array visualization */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
                {array.map((num, index) => (
                    <motion.div
                        key={index}
                        className={`
                            w-16 h-16 flex flex-col items-center justify-center rounded-lg
                            border-2 transition-colors duration-300
                            ${index >= left && index <= right ? 'bg-slate-800 border-blue-500' : 'bg-slate-800 border-slate-700'}
                            ${index === mid ? 'bg-blue-900 border-yellow-400' : ''}
                            ${index === left ? 'border-l-green-500' : ''}
                            ${index === right ? 'border-r-green-500' : ''}
                            ${found && index === mid ? 'bg-green-900 border-green-400' : ''}
                            ${notFound ? 'border-red-500' : ''}
                        `}
                        initial={{ scale: 1 }}
                        animate={{
                            scale: index === mid ? 1.15 : 1,
                            y: index === mid ? -12 : 0
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <span className="text-white font-semibold">{num}</span>
                    </motion.div>
                ))}
            </div>

            {/* Pointers visualization */}
            <div className="flex justify-center gap-8 mb-6">
                <motion.div
                    className="px-4 py-2 bg-green-900 text-green-200 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Low: {left}
                </motion.div>
                <motion.div
                    className="px-4 py-2 bg-yellow-900 text-yellow-200 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Mid: {mid}
                </motion.div>
                <motion.div
                    className="px-4 py-2 bg-green-900 text-green-200 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    High: {right}
                </motion.div>
            </div>

            {/* Status message */}
            <div className="mt-6 text-center">
                {found ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-green-400 font-bold text-xl"
                    >
                        Found {target} at index {mid}!
                    </motion.div>
                ) : notFound ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 font-bold text-xl"
                    >
                        Element not found! Return value: -1
                    </motion.div>
                ) : searching ? (
                    <div className="text-blue-400 space-y-2">
                        <div className="text-lg">
                            Searching... Comparing {array[mid]} with target {target}
                        </div>
                        <div className="text-sm text-slate-400">
                            {array[mid] === parseInt(target) ?
                                "Found!" :
                                array[mid] > parseInt(target) ?
                                    `${array[mid]} > ${target}, searching left half` :
                                    `${array[mid]} < ${target}, searching right half`}
                        </div>
                    </div>
                ) : (
                    <div className="text-slate-400">
                        Enter a number and click Start Search
                    </div>
                )}
            </div>
        </div>
    );
};

export default BinarySearchVisualizer;