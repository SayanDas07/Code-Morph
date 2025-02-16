"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

const TwoSumVisualizer = () => {
  const [array, setArray] = useState<number[]>([2, 7, 11, 15, 1, 8]);
  const [target, setTarget] = useState<number>(9);
  const [pairs, setPairs] = useState<[number, number][]>([]);
  const [hashMap, setHashMap] = useState<Map<number, number>>(new Map());
  const [inputValue, setInputValue] = useState("");
  const [targetValue, setTargetValue] = useState("9");
  const [error, setError] = useState("");
  const [traversing, setTraversing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const startTraversal = () => {
    setTraversing(true);
    setPairs([]);
    setHashMap(new Map());
    setCurrentIndex(null);

    const numMap = new Map<number, number>();
    let index = 0;

    const interval = setInterval(() => {
      if (index >= array.length) {
        clearInterval(interval);
        setTraversing(false);
        return;
      }

      const num = array[index];
      const complement = target - num;

      setCurrentIndex(index);

      setPairs((prevPairs) => {
        if (numMap.has(complement)) {
          return [...prevPairs, [complement, num]];
        }
        return prevPairs;
      });

      numMap.set(num, index);
      setHashMap(new Map(numMap));
      index += 1;
    }, 800);
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setError("");

    if (value !== "") {
      const newArray = value.split(",").map((item) => parseInt(item.trim(), 10));
      if (newArray.every((num) => !isNaN(num))) {
        setArray(newArray);
      } else {
        setError("Please enter valid numbers separated by commas.");
      }
    }
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTargetValue(value);

    const parsedTarget = parseInt(value, 10);
    if (!isNaN(parsedTarget)) {
      setTarget(parsedTarget);
    }
  };

  return (
    <div className="p-8 bg-slate-900 rounded-lg shadow-xl min-h-[500px]">
      <div className="mb-6 flex justify-between items-center gap-4">
        <div className="flex-1 max-w-xs">
          <Input
            type="text"
            value={inputValue}
            onChange={handleArrayChange}
            placeholder="Enter array (comma separated)"
            className="w-full text-white"
          />
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>

        <div className="flex-1 max-w-xs">
          <Input
            type="text"
            value={targetValue}
            onChange={handleTargetChange}
            placeholder="Target Sum"
            className="w-full text-white"
          />
        </div>

        <button
          onClick={startTraversal}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={traversing || array.length === 0}
        >
          Find Pairs
        </button>
      </div>

      {/* Array Visualization */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {array.map((num, index) => (
          <motion.div
            key={index}
            className={`w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-300 
              ${pairs.some(([a, b]) => a === num || b === num) ? "bg-green-900 border-green-400" 
                : index === currentIndex ? "bg-yellow-700 border-yellow-500" 
                : "bg-slate-800 border-slate-700"}
            `}
            initial={{ scale: 1 }}
            animate={{ scale: traversing ? 1.15 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-white font-semibold">{num}</span>
            <span className="text-xs text-gray-400">Idx {index}</span>
          </motion.div>
        ))}
      </div>

      {/* HashMap Visualization */}
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold text-slate-300">HashMap (Value → Index)</h3>
        <div className="grid grid-cols-2 gap-4 text-slate-300 mt-4">
          {Array.from(hashMap.entries()).map(([num, idx]) => (
            <motion.div
              key={num}
              className="bg-slate-800 p-4 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-xl font-semibold">{num} → {idx}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Found Pairs */}
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold text-slate-300">Pairs Found</h3>
        <div className="grid grid-cols-2 gap-4 text-slate-300 mt-4">
          {pairs.length > 0 ? (
            pairs.map(([a, b], index) => (
              <motion.div
                key={index}
                className="bg-green-800 p-4 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-xl font-semibold">{a} + {b}</div>
                <div className="text-sm">Sum: {target}</div>
              </motion.div>
            ))
          ) : (
            <div className="text-slate-400 col-span-2">No pairs found yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoSumVisualizer;
