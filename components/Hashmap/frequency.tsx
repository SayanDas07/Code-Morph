"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

const HashMapVisualizer = () => {
  const [array, setArray] = useState([5, 2, 9, 5, 5, 8, 9, 3, 2, 1]);
  const [frequencies, setFrequencies] = useState<{ [key: number]: number }>({});
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [traversing, setTraversing] = useState(false);

  const calculateFrequency = (array: number[]) => {
    const frequencyMap: { [key: number]: number } = {};
    array.forEach((num) => {
      frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    });
    return frequencyMap;
  };

  const startTraversal = () => {
    setTraversing(true);
    setFrequencies({});
    let index = 0;

    const interval = setInterval(() => {
      const currentValue = array[index];
      setFrequencies((prev) => {
        const updatedFreq = { ...prev };
        updatedFreq[currentValue] = (updatedFreq[currentValue] || 0) + 1;
        return updatedFreq;
      });

      index += 1;
      if (index === array.length) {
        clearInterval(interval);
        setTraversing(false); // End traversal
      }
    }, 500); // Adjust the speed of traversal animation
  };

  useEffect(() => {
    if (!traversing) {
      const frequencyMap = calculateFrequency(array);
      setFrequencies(frequencyMap);
    }
  }, [array, traversing]);

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

  // Enable button if array exists or if there is valid input
  const isButtonDisabled = traversing || (!inputValue && array.length === 0);

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
        <button
          onClick={startTraversal}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isButtonDisabled}
        >
          Start Traversal
        </button>
        <div className="text-slate-300">Array Length: {array.length}</div>
      </div>

      {/* Array visualization */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {array.map((num, index) => (
          <motion.div
            key={index}
            className={`w-16 h-16 flex flex-col items-center justify-center rounded-lg
              border-2 transition-all duration-300
              ${frequencies[num] ? "bg-green-900 border-green-400" : "bg-slate-800 border-slate-700"}
            `}
            initial={{ scale: 1 }}
            animate={{
              scale: traversing && frequencies[num] ? 1.15 : 1,
              y: traversing && frequencies[num] ? -12 : 0,
              opacity: traversing && frequencies[num] ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-white font-semibold">{num}</span>
          </motion.div>
        ))}
      </div>

      {/* Frequency Table */}
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold text-slate-300">Frequency of Elements</h3>
        <div className="grid grid-cols-3 gap-4 text-slate-300 mt-4">
          {Object.entries(frequencies).map(([key, value]) => (
            <motion.div
              key={key}
              className="bg-slate-800 p-4 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-xl font-semibold">{key}</div>
              <div className="text-sm">Count: {value}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status Message */}
      <div className="mt-6 text-center">
        {array.length === 0 ? (
          <div className="text-slate-400">Enter an array to see the frequency count</div>
        ) : (
          <div className="text-slate-300">
            Visualizing frequency counts for the entered array.
          </div>
        )}
      </div>
    </div>
  );
};

export default HashMapVisualizer;
