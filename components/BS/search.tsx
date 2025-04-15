"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Code, Database, RefreshCw, Play } from 'lucide-react';
import { Input } from "@/components/ui/input";

const BinarySearchVisualizer = () => {
    const [array] = useState([2, 5, 8, 12, 16, 23, 38, 42, 56, 72, 85, 91, 96, 103, 111]);
    const [target, setTarget] = useState('');
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(array.length - 1);
    const [mid, setMid] = useState(Math.floor((0 + array.length - 1) / 2));
    const [found, setFound] = useState(false);
    const [searching, setSearching] = useState(false);
    const [steps, setSteps] = useState<{ left: number; right: number; mid: number; comparison: string; activeLineIndex: number; }[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState('');
    const [notFound, setNotFound] = useState(false);
    const [activeLineIndex, setActiveLineIndex] = useState(0);

    // Speed settings with descriptive labels
    const speedOptions = [
        { label: "Very Slow", value: 2500 },
        { label: "Slow", value: 2000 },
        { label: "Normal", value: 1500 },
        { label: "Fast", value: 800 },
        { label: "Very Fast", value: 500 }
    ];

    const [animationSpeed, setAnimationSpeed] = useState(1500);

    // Pseudo code for the algorithm
    const pseudoCode = [
        { line: "function binarySearch(array, target) {", active: false },
        { line: "    let left = 0", active: activeLineIndex === 1 },
        { line: "    let right = array.length - 1", active: activeLineIndex === 2 },
        { line: "    while (left <= right) {", active: activeLineIndex === 3 },
        { line: "        let mid = Math.floor((left + right) / 2)", active: activeLineIndex === 4 },
        { line: "        if (array[mid] === target)", active: activeLineIndex === 5 },
        { line: "            return mid // Element found", active: activeLineIndex === 6 },
        { line: "        else if (array[mid] > target)", active: activeLineIndex === 7 },
        { line: "            right = mid - 1 // Search left half", active: activeLineIndex === 8 },
        { line: "        else", active: activeLineIndex === 9 },
        { line: "            left = mid + 1 // Search right half", active: activeLineIndex === 10 },
        { line: "    }", active: false },
        { line: "    return -1 // Element not found", active: activeLineIndex === 12 },
        { line: "}", active: false },
    ];

    const calculateSteps = (searchTarget: number) => {
        const newSteps = [];
        let l = 0;
        let r = array.length - 1;

        // Initialize with active line indices
        newSteps.push({
            left: l,
            right: r,
            mid: -1,
            comparison: '',
            activeLineIndex: 1 // "left = 0"
        });

        newSteps.push({
            left: l,
            right: r,
            mid: -1,
            comparison: '',
            activeLineIndex: 2 // "right = array.length - 1"
        });

        while (l <= r) {
            newSteps.push({
                left: l,
                right: r,
                mid: -1,
                comparison: '',
                activeLineIndex: 3 // "while (left <= right):"
            });

            const m = Math.floor((l + r) / 2);

            newSteps.push({
                left: l,
                right: r,
                mid: m,
                comparison: '',
                activeLineIndex: 4 // "mid = Math.floor((left + right) / 2)"
            });

            const comparison = array[m] === searchTarget ? 'equal' : array[m] > searchTarget ? 'greater' : 'less';

            // Evaluate the comparison conditions
            newSteps.push({
                left: l,
                right: r,
                mid: m,
                comparison,
                activeLineIndex: 5 // "if (array[mid] === target):"
            });

            if (array[m] === searchTarget) {
                // Found the element
                newSteps.push({
                    left: l,
                    right: r,
                    mid: m,
                    comparison,
                    activeLineIndex: 6 // "return mid // Element found"
                });
                break;
            } else if (array[m] > searchTarget) {
                // Element is in the left half
                newSteps.push({
                    left: l,
                    right: r,
                    mid: m,
                    comparison,
                    activeLineIndex: 7 // "else if (array[mid] > target):"
                });

                r = m - 1;
                newSteps.push({
                    left: l,
                    right: r,
                    mid: m,
                    comparison,
                    activeLineIndex: 8 // "right = mid - 1 // Search left half"
                });
            } else {
                // Element is in the right half
                newSteps.push({
                    left: l,
                    right: r,
                    mid: m,
                    comparison,
                    activeLineIndex: 9 // "else:"
                });

                l = m + 1;
                newSteps.push({
                    left: l,
                    right: r,
                    mid: m,
                    comparison,
                    activeLineIndex: 10 // "left = mid + 1 // Search right half"
                });
            }
        }

        // If we exit the loop without finding the element
        if (l > r) {
            newSteps.push({
                left: l,
                right: r,
                mid: -1,
                comparison: 'not-found',
                activeLineIndex: 12 // "return -1 // Element not found"
            });
        }

        return newSteps;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTarget(e.target.value);
        setError('');
        setNotFound(false);
        setActiveLineIndex(0);
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

    const resetVisualization = () => {
        setLeft(0);
        setRight(array.length - 1);
        setMid(Math.floor((0 + array.length - 1) / 2));
        setFound(false);
        setNotFound(false);
        setCurrentStep(0);
        setActiveLineIndex(0);
        setSearching(false);

        setTimeout(() => {
            startSearch();
        }, Math.min(300, animationSpeed * 0.3));
    };

    useEffect(() => {
        if (searching && currentStep < steps.length) {
            const timer = setTimeout(() => {
                const step = steps[currentStep];
                setLeft(step.left);
                setRight(step.right);
                if (step.mid !== -1) setMid(step.mid);
                setActiveLineIndex(step.activeLineIndex);

                if (step.activeLineIndex === 6) {
                    // Found element
                    setFound(true);
                    setSearching(false);
                } else if (step.activeLineIndex === 12) {
                    // Element not found
                    setNotFound(true);
                    setSearching(false);
                } else if (currentStep === steps.length - 1) {
                    setSearching(false);
                } else {
                    setCurrentStep(currentStep + 1);
                }
            }, animationSpeed);

            return () => clearTimeout(timer);
        }
    }, [searching, currentStep, steps, animationSpeed]);

    // Animation duration for motion components based on speed setting
    const getAnimationDuration = () => {
        return Math.max(0.1, Math.min(0.5, animationSpeed / 2000));
    };

    return (
        <div className="p-6 bg-slate-800 rounded-lg shadow-xl min-h-[600px]">
            {/* Controls section */}
            <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
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
                    </div>

                    <div className="flex items-center gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Speed</label>
                            <select
                                className="bg-slate-800 border border-slate-700 rounded text-white text-sm p-2"
                                value={animationSpeed}
                                onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                                disabled={searching}
                            >
                                {speedOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={startSearch}
                            className="h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            disabled={searching || !target}
                        >
                            <Play size={16} />
                            <span>Start</span>
                        </button>

                        <button
                            onClick={resetVisualization}
                            className="h-10 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            disabled={!target || (!searching && activeLineIndex === 0)}
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
                            <h3 className="text-lg font-semibold text-white">Sorted Array</h3>
                        </div>

                        <div className="relative overflow-hidden">
                            <div className="absolute w-full h-1 bg-slate-700 top-1/2 -translate-y-1/2"></div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {array.map((num, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                        <motion.div
                                            className={`
                                                w-10 h-10 flex flex-col items-center justify-center rounded-lg
                                                ${index >= left && index <= right ? 'bg-slate-800 border-blue-500 border-2' : 'bg-slate-800 border-slate-700 border'}
                                                ${index === mid ? 'bg-blue-900 border-yellow-400 border-2' : ''}
                                                ${found && index === mid ? 'bg-green-900 border-green-400 border-2' : ''}
                                                ${notFound ? 'border-red-500' : ''}
                                            `}
                                            initial={{ scale: 1 }}
                                            animate={{
                                                scale: (index === mid) ? 1.15 : 1,
                                                y: (index === mid) ? -5 : 0
                                            }}
                                            transition={{ duration: getAnimationDuration() }}
                                        >
                                            <span className="text-white font-semibold">{num}</span>
                                            {index === mid && (
                                                <motion.div
                                                    initial={{ scale: 0.5 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="absolute w-6 h-6 bg-yellow-500 rounded-full bottom-[-18px] text-xs flex items-center justify-center font-bold"
                                                >
                                                    M
                                                </motion.div>
                                            )}
                                        </motion.div>
                                        <div className="text-center text-slate-400 text-xs mt-1">{index}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Pointers visualization */}
                    <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
                        <div className="flex items-center mb-3">
                            <Search size={18} className="text-blue-400 mr-2" />
                            <h3 className="text-lg font-semibold text-white">Current Pointers</h3>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 bg-slate-800 rounded-lg border border-green-900">
                                <div className="text-sm text-slate-400 mb-1">Left Pointer</div>
                                <div className="flex items-center">
                                    <motion.div
                                        className="w-10 h-10 flex items-center justify-center bg-green-900 text-green-200 rounded-lg mr-2"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{
                                            duration: 0.5,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            ease: "easeInOut"
                                        }}
                                    >
                                        L
                                    </motion.div>
                                    <div className="flex-1">
                                        <div className="text-green-400 font-mono text-lg">{left}</div>
                                        <div className="text-xs text-slate-500">Index</div>
                                    </div>
                                    <div className="font-mono text-xl text-green-400">
                                        {left < array.length ? array[left] : 'N/A'}
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-slate-800 rounded-lg border border-yellow-900">
                                <div className="text-sm text-slate-400 mb-1">Middle Pointer</div>
                                <div className="flex items-center">
                                    <motion.div
                                        className="w-10 h-10 flex items-center justify-center bg-yellow-900 text-yellow-200 rounded-lg mr-2"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{
                                            duration: 0.5,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            ease: "easeInOut"
                                        }}
                                    >
                                        M
                                    </motion.div>
                                    <div className="flex-1">
                                        <div className="text-yellow-400 font-mono text-lg">{mid}</div>
                                        <div className="text-xs text-slate-500">Index</div>
                                    </div>
                                    <div className="font-mono text-xl text-yellow-400">
                                        {mid >= 0 && mid < array.length ? array[mid] : 'N/A'}
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-slate-800 rounded-lg border border-green-900">
                                <div className="text-sm text-slate-400 mb-1">Right Pointer</div>
                                <div className="flex items-center">
                                    <motion.div
                                        className="w-10 h-10 flex items-center justify-center bg-green-900 text-green-200 rounded-lg mr-2"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{
                                            duration: 0.5,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            ease: "easeInOut"
                                        }}
                                    >
                                        R
                                    </motion.div>
                                    <div className="flex-1">
                                        <div className="text-green-400 font-mono text-lg">{right}</div>
                                        <div className="text-xs text-slate-500">Index</div>
                                    </div>
                                    <div className="font-mono text-xl text-green-400">
                                        {right >= 0 && right < array.length ? array[right] : 'N/A'}
                                    </div>
                                </div>
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
                            {found ? (
                                <motion.div
                                    className="text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: getAnimationDuration() * 2 }}
                                >
                                    <div className="mb-2 text-green-400 font-semibold">Element Found!</div>
                                    <div className="flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="bg-green-800 border-2 border-green-500 w-20 h-20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                                                <span className="text-2xl font-bold text-white">{array[mid]}</span>
                                            </div>
                                            <div className="text-sm text-slate-300">Found at index {mid}</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 font-mono text-green-400">
                                        return {mid};
                                    </div>
                                </motion.div>
                            ) : notFound ? (
                                <motion.div
                                    className="text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: getAnimationDuration() * 2 }}
                                >
                                    <div className="mb-2 text-red-400 font-semibold">Element Not Found!</div>
                                    <div className="flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="bg-red-900 border-2 border-red-500 w-20 h-20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                                                <span className="text-2xl font-bold text-white">-1</span>
                                            </div>
                                            <div className="text-sm text-slate-300">Return value</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 font-mono text-red-400">
                                        return -1; // Element not found
                                    </div>
                                </motion.div>
                            ) : searching ? (
                                <div className="text-center text-yellow-400">
                                    Searching for element {target} using binary search...
                                </div>
                            ) : (
                                <div className="text-center text-slate-400">
                                    Enter a number and click Start to begin searching
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Message */}
                    <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-700 text-center">
                        {searching ? (
                            <div className="text-yellow-300 font-medium">
                                {activeLineIndex === 1 && "Initializing left pointer at index 0..."}
                                {activeLineIndex === 2 && "Initializing right pointer at the last index..."}
                                {activeLineIndex === 3 && "Checking if left <= right to continue search..."}
                                {activeLineIndex === 4 && "Calculating middle index between left and right..."}
                                {activeLineIndex === 5 && `Comparing array[${mid}] = ${array[mid]} with target ${target}...`}
                                {activeLineIndex === 6 && `Found target! Array[${mid}] = ${array[mid]} equals ${target}`}
                                {activeLineIndex === 7 && `Array[${mid}] = ${array[mid]} > ${target}, target may be in left half`}
                                {activeLineIndex === 8 && "Adjusting right pointer to search the left half..."}
                                {activeLineIndex === 9 && `Array[${mid}] = ${array[mid]} < ${target}, target may be in right half`}
                                {activeLineIndex === 10 && "Adjusting left pointer to search the right half..."}
                                {activeLineIndex === 12 && "Search complete. Element not found in array."}
                            </div>
                        ) : found ? (
                            <div className="text-green-400 font-medium">
                                Algorithm complete: Found {target} at index {mid}
                            </div>
                        ) : notFound ? (
                            <div className="text-red-400 font-medium">
                                Algorithm complete: {target} was not found in the array
                            </div>
                        ) : (
                            <div className="text-slate-400 font-medium">
                                Enter a number to search and click &quot;Start&quot; to begin the binary search algorithm
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
                                        {activeLineIndex === 0 && !searching && !found && !notFound && (
                                            <div className="text-slate-400">
                                                Ready to visualize the Binary Search algorithm.
                                                Enter a target value and press &quot;Start&quot; to begin.
                                            </div>
                                        )}
                                        {activeLineIndex === 1 && (
                                            <div className="text-blue-400">
                                                <span className="font-bold">Initialize Left Pointer:</span> Set the left pointer
                                                to the beginning of the array (index 0).
                                            </div>
                                        )}
                                        {activeLineIndex === 2 && (
                                            <div className="text-blue-400">
                                                <span className="font-bold">Initialize Right Pointer:</span> Set the right pointer
                                                to the end of the array (index {array.length - 1}).
                                            </div>
                                        )}
                                        {activeLineIndex === 3 && (
                                            <div className="text-blue-400">
                                                <span className="font-bold">Check Loop Condition:</span> We continue searching
                                                as long as the left pointer is less than or equal to the right pointer.
                                            </div>
                                        )}
                                        {activeLineIndex === 4 && (
                                            <div className="text-blue-400">
                                                <span className="font-bold">Calculate Middle:</span> Find the middle index
                                                between left ({left}) and right ({right}) pointers.
                                            </div>
                                        )}
                                        {activeLineIndex === 5 && (
                                            <div className="text-blue-400">
                                                <span className="font-bold">Compare with Target:</span> Check if the
                                                middle element ({array[mid]}) equals the target ({target}).
                                            </div>
                                        )}
                                        {activeLineIndex === 6 && (
                                            <div className="text-green-400">
                                                <span className="font-bold">Element Found:</span> The middle element equals
                                                the target. Return the middle index ({mid}).
                                            </div>
                                        )}
                                        {activeLineIndex === 7 && (
                                            <div className="text-blue-400">
                                                <span className="font-bold">Middle {'>'} Target:</span> The middle element ({array[mid]})
                                                is greater than the target ({target}). The target must be in the left half.
                                            </div>
                                        )}
                                        {activeLineIndex === 8 && (
                                            <div className="text-blue-400">
                                                <span className="font-bold">Search Left Half:</span> Move the right pointer
                                                to mid - 1 ({mid - 1}) to search the left half of the current range.
                                            </div>
                                        )}
                                        {activeLineIndex === 9 && (
                                            <div className="text-blue-400">
                                                <span className="font-bold">Middle &lt; Target:</span> The middle element ({array[mid]})
                                                is less than the target ({target}). The target must be in the right half.
                                            </div>
                                        )}
                                        {activeLineIndex === 10 && (
                                            <div className="text-blue-400">
                                                <span className="font-bold">Search Right Half:</span> Move the left pointer
                                                to mid + 1 ({mid + 1}) to search the right half of the current range.
                                            </div>
                                        )}
                                        {activeLineIndex === 12 && (
                                            <div className="text-red-400">
                                                <span className="font-bold">Element Not Found:</span> We have searched the entire
                                                array and could not find the target. Return -1.
                                            </div>
                                        )}
                                    </div>

                                    {activeLineIndex > 0 && (
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

export default BinarySearchVisualizer;