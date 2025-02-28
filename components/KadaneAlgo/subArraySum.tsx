import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MaxSubArrayAnimationProps {
    nums: number[];
    speed?: number;
}

const MaxSubArrayAnimation: React.FC<MaxSubArrayAnimationProps> = ({
    nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    speed = 1000
}) => {
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [sum, setSum] = useState<number>(0);
    const [maxi, setMaxi] = useState<number>(Number.MIN_SAFE_INTEGER);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [currentSubarray, setCurrentSubarray] = useState<number[]>([]);
    const [maxSubarray, setMaxSubarray] = useState<number[]>([]);
    const [startIndex, setStartIndex] = useState<number>(0);


    const resetAnimation = () => {
        setCurrentIndex(-1);
        setSum(0);
        setMaxi(Number.MIN_SAFE_INTEGER);
        setIsAnimating(false);
        setIsComplete(false);
        setCurrentSubarray([]);
        setMaxSubarray([]);
        setStartIndex(0);
    };

    // Start animation
    const startAnimation = () => {
        resetAnimation();
        setIsAnimating(true);
    };

    // Animation logic
    useEffect(() => {
        if (!isAnimating || isComplete) return;

        const nextIndex = currentIndex + 1;

        if (nextIndex >= nums.length) {
            setIsAnimating(false);
            setIsComplete(true);
            return;
        }

        const timer = setTimeout(() => {
            // Add current number to sum
            const newSum = sum + nums[nextIndex];
            setSum(newSum);

            // Update current subarray
            setCurrentSubarray([...currentSubarray, nums[nextIndex]]);

            // Update maximum sum if needed
            if (newSum > maxi) {
                setMaxi(newSum);
                setMaxSubarray([...currentSubarray, nums[nextIndex]]);
            }

            // Reset sum if it becomes negative
            if (newSum < 0) {
                setSum(0);
                setCurrentSubarray([]);
                setStartIndex(nextIndex + 1);
            }

            // Move to next index
            setCurrentIndex(nextIndex);
        }, speed);

        return () => clearTimeout(timer);
    }, [currentIndex, isAnimating, nums, sum, maxi, speed, currentSubarray, isComplete]);

    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow-md max-w-auto mx-auto">
            <h2 className="text-2xl font-bold mb-4">Kadane&apos;s Algorithm: Maximum Subarray Animation</h2>

            <div className="flex justify-between mb-6">
                <button
                    onClick={startAnimation}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={isAnimating}
                >
                    {isComplete ? "Restart Animation" : "Start Animation"}
                </button>

                <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded">
                        <span className="font-semibold">Current Sum:</span> {sum}
                    </div>
                    <div className="bg-green-100 p-2 rounded">
                        <span className="font-semibold">Max Sum:</span> {maxi === Number.MIN_SAFE_INTEGER ? "INT_MIN" : maxi}
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Array Visualization:</h3>
                <div className="flex flex-wrap gap-2">
                    {nums.map((num, index) => (
                        <motion.div
                            key={index}
                            className={`
                flex items-center justify-center w-12 h-12 rounded
                ${index === currentIndex ? 'bg-yellow-300 border-2 border-yellow-500' :
                                    index < currentIndex && index >= startIndex ? 'bg-blue-200' : 'bg-gray-200'}
                ${maxSubarray.includes(num) && maxSubarray.indexOf(num) === index - (startIndex - maxSubarray.indexOf(num)) ? 'ring-2 ring-green-500' : ''}
              `}
                            animate={{
                                scale: index === currentIndex ? [1, 1.1, 1] : 1,
                                y: index === currentIndex ? [0, -10, 0] : 0
                            }}
                            transition={{ duration: 0.5 }}
                        >
                            {num}
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Current Subarray:</h3>
                    <div className="flex flex-wrap gap-2 min-h-12 p-2 bg-blue-50 rounded">
                        {currentSubarray.map((num, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-center w-10 h-10 bg-blue-200 rounded"
                            >
                                {num}
                            </motion.div>
                        ))}
                        {currentSubarray.length === 0 && <span className="text-gray-500">Empty</span>}
                    </div>
                    <div className="mt-2">Sum: {sum}</div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Maximum Subarray:</h3>
                    <div className="flex flex-wrap gap-2 min-h-12 p-2 bg-green-50 rounded">
                        {maxSubarray.map((num, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-center w-10 h-10 bg-green-200 rounded"
                            >
                                {num}
                            </motion.div>
                        ))}
                        {maxSubarray.length === 0 && <span className="text-gray-500">Empty</span>}
                    </div>
                    <div className="mt-2">Max Sum: {maxi === Number.MIN_SAFE_INTEGER ? "INT_MIN" : maxi}</div>
                </div>
            </div>

            {isComplete && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 bg-green-100 rounded text-center"
                >
                    <h3 className="text-xl font-bold">Animation Complete!</h3>
                    <p className="text-lg">Maximum Subarray Sum: {maxi}</p>
                </motion.div>
            )}

            <div className="mt-6 border-t pt-4 text-sm">
                <h3 className="font-semibold mb-2">Algorithm Explanation:</h3>

            </div>
        </div>
    );
};

export default MaxSubArrayAnimation;