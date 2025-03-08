/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MajorityElementAnimation = () => {
    // Example array
    const [nums, setNums] = useState([2, 2, 1, 1, 1, 2, 2]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [count, setCount] = useState(0);
    const [candidate, setCandidate] = useState<number | null>(null);
    const [result, setResult] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [customArray, setCustomArray] = useState('');
    const [inputError, setInputError] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    // Reset the animation
    const resetAnimation = () => {
        setCurrentIndex(-1);
        setCount(0);
        setCandidate(null);
        setResult(null);
        setIsPlaying(false);
        setIsComplete(false);
    };

    // Handle custom array input
    const handleCustomArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomArray(e.target.value);
    };

    // Apply custom array
    const applyCustomArray = () => {
        try {
            // Parse the input as JSON array, or as comma-separated values
            let newArray;
            try {
                newArray = JSON.parse(customArray);
            } catch {
                newArray = customArray.split(',').map(item => parseInt(item.trim()));
            }

            // Validate that it's an array of numbers
            if (!Array.isArray(newArray) || newArray.some(item => isNaN(item))) {
                setInputError('Please enter a valid array of numbers');
                return;
            }

            setNums(newArray);
            resetAnimation();
            setInputError('');
        } catch (error) {
            setInputError('Invalid input. Try format like: 2,2,1,1,1,2,2');
        }
    };

    // Step through the algorithm
    const step = () => {
        if (currentIndex === nums.length - 1) {
            // Algorithm finished, find the majority element
            const finalCandidate = candidate;
            const count = nums.filter(num => num === finalCandidate).length;
            const majority = nums.length / 2;
            setResult(count > majority ? finalCandidate : -1);
            setIsPlaying(false);
            setIsComplete(true);
            return;
        }

        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        if (count === 0) {
            setCount(1);
            setCandidate(nums[nextIndex]);
        } else if (nums[nextIndex] === candidate) {
            setCount(count + 1);
        } else {
            setCount(count - 1);
        }
    };

    // Auto-play the animation
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying) {
            timer = setTimeout(step, 1000 / speed);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentIndex, speed]);

    // Toggle play/pause
    const togglePlay = () => {
        if (isComplete) {
            resetAnimation();
            setIsPlaying(true);
        } else {
            setIsPlaying(!isPlaying);
        }
    };

    // Handle speed change
    const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpeed(parseInt(e.target.value));
    };

    return (
        <div className="p-6 max-w-auto mx-auto bg-gray-900 rounded-lg shadow-lg text-gray-100">
            <div className="mb-6">
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={customArray}
                        onChange={handleCustomArrayChange}
                        placeholder="Enter numbers: 2,2,1,1,1,2,2 (comma separated)"
                        className="flex-grow p-2 border rounded bg-gray-800 text-gray-200 border-gray-700"
                    />
                    <button
                        onClick={applyCustomArray}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Set Array
                    </button>
                </div>
                {inputError && <p className="text-red-400 text-sm">{inputError}</p>}
            </div>

            <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow">
                <div className="flex justify-center mb-8">
                    {nums.map((num, index) => (
                        <motion.div
                            key={index}
                            className={`w-12 h-12 mx-1 flex items-center justify-center rounded-lg border-2 font-bold
                ${index === currentIndex ? 'border-blue-400 bg-blue-900 text-white' : 'border-gray-600 bg-gray-700 text-gray-300'}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {num}
                        </motion.div>
                    ))}
                </div>

                <div className="p-4 bg-gray-700 rounded mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold">Current Index: <span className="text-blue-300">{currentIndex > -1 ? currentIndex : 'Not started'}</span></p>
                            <p className="font-semibold">Element: <span className="text-blue-300">{candidate !== null ? candidate : 'None'}</span></p>
                        </div>
                        <div>
                            <p className="font-semibold">Count: <span className="text-blue-300">{count}</span></p>
                            <p className="font-semibold">Array Size: <span className="text-blue-300">{nums.length}</span></p>
                        </div>
                    </div>
                </div>

                {result !== null && (
                    <motion.div
                        className={`p-4 rounded-lg text-white text-center font-bold mb-4 
              ${result !== -1 ? 'bg-green-700' : 'bg-red-700'}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        {result !== -1 ?
                            `Result: ${result} is the majority element` :
                            'No majority element found'}
                    </motion.div>
                )}
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <button
                        onClick={togglePlay}
                        className={`px-6 py-2 rounded text-white font-medium
              ${isPlaying ? 'bg-amber-600' : isComplete ? 'bg-green-600' : 'bg-blue-600'} hover:opacity-90`}
                    >
                        {isPlaying ? 'Pause' : isComplete ? 'Play Again' : 'Play'}
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">Speed:</span>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={speed}
                        onChange={handleSpeedChange}
                        className="w-24"
                    />
                    <span className="text-sm text-gray-300">{speed}x</span>
                </div>
            </div>

            
        </div>
    );
};

export default MajorityElementAnimation;