import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DutchNationalFlagAnimationsortarray = () => {
    
    const [array, setArray] = useState([2, 0, 2, 1, 1, 0, 0, 2, 1, 0]);
    const [low, setLow] = useState(0);
    const [mid, setMid] = useState(0);
    const [high, setHigh] = useState(array.length - 1);
    const [step, setStep] = useState(0);
    const [swapping, setSwapping] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [speed, setSpeed] = useState(1.5); 
    const colors: { [key: number]: string } = {
        0: "#ff5252", // Red
        1: "#66bb6a", // Green
        2: "#42a5f5", // Blue
    };

    const reset = () => {
        setArray([2, 0, 2, 1, 1, 0, 0, 2, 1, 0]);
        setLow(0);
        setMid(0);
        setHigh(array.length - 1);
        setStep(0);
        setSwapping(false);
        setCompleted(false);
    };

    
    const executeStep = () => {
        if (mid > high || completed) {
            setCompleted(true);
            return;
        }

        setSwapping(true);

        
        setTimeout(() => {
            const newArray = [...array];

            if (array[mid] === 0) {
                // Swap low and mid
                [newArray[low], newArray[mid]] = [newArray[mid], newArray[low]];
                setArray(newArray);

                setTimeout(() => {
                    setLow(low + 1);
                    setMid(mid + 1);
                    setSwapping(false);
                    setStep(step + 1);
                }, 500 / speed);
            }
            else if (array[mid] === 1) {
                
                setMid(mid + 1);
                setSwapping(false);
                setStep(step + 1);
            }
            else { 
                [newArray[mid], newArray[high]] = [newArray[high], newArray[mid]];
                setArray(newArray);

                setTimeout(() => {
                    setHigh(high - 1);
                    setSwapping(false);
                    setStep(step + 1);
                }, 500 / speed);
            }
        }, 500 / speed);
    };

    // Play/pause auto-execution
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (playing && !completed && !swapping) {
            timer = setTimeout(executeStep, 1000 / speed);
        }
        return () => clearTimeout(timer);
    }, [playing, swapping, completed, step]);

    return (
        <div className="flex flex-col items-center p-4 max-w-auto">
            

            <div className="flex justify-center mb-6 w-full">
                <div className="w-full flex flex-wrap gap-1 justify-center">
                    {array.map((value, index) => (
                        <motion.div
                            key={index}
                            className="relative w-12 h-12 flex items-center justify-center text-white font-bold rounded"
                            style={{ backgroundColor: colors[value] }}
                            initial={{ scale: 1 }}
                            animate={{
                                scale: swapping && (index === mid || index === low || index === high) ? [1, 1.2, 1] : 1,
                                y: swapping && (index === mid || index === low || index === high) ? [0, -10, 0] : 0
                            }}
                            transition={{ duration: 0.5 / speed }}
                        >
                            {value}
                            <div className="absolute -top-6 flex justify-center w-full">
                                {index === low && <div className="px-1 bg-purple-500 text-white text-xs">low</div>}
                                {index === mid && <div className="px-1 bg-yellow-500 text-white text-xs">mid</div>}
                                {index === high && <div className="px-1 bg-orange-500 text-white text-xs">high</div>}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => setPlaying(!playing)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    disabled={completed}
                >
                    {playing ? "Pause" : "Play"}
                </button>
                <button
                    onClick={executeStep}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    disabled={playing || completed || swapping}
                >
                    Step
                </button>
                <button
                    onClick={reset}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                >
                    Reset
                </button>
            </div>

            <div className="mb-4">
                <label className="mr-2">Speed:</label>
                <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.5"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-32"
                />
                <span className="ml-2">{speed}x</span>
            </div>

            <div className="border p-4 bg-white text-black rounded w-full">
                <h2 className="font-bold mb-2">Algorithm Steps</h2>
                <ul className="list-disc pl-6">
                    <li>Red elements (0) should be to the left of low pointer</li>
                    <li>Green elements (1) should be between low and mid pointers</li>
                    <li>Blue elements (2) should be to the right of high pointer</li>
                    <li>Elements between mid and high are yet to be sorted</li>
                </ul>

                <h3 className="font-bold mt-4 mb-2">Current Action (Step {step}):</h3>
                <p>
                    {completed ? "Sort complete!" : swapping ? "Swapping..." :
                        array[mid] === 0 ? "Found 0 at mid: Will swap with low, then increment both low and mid" :
                            array[mid] === 1 ? "Found 1 at mid: Will just increment mid" :
                                "Found 2 at mid: Will swap with high, then decrement high"}
                </p>
            </div>
        </div>
    );
};

export default DutchNationalFlagAnimationsortarray;