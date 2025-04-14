"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { ArrowRight, Hash, Code, Play, Database, RefreshCw } from "lucide-react";

const HashMapVisualizer = () => {
  const [array, setArray] = useState([1, 2, 2, 3, 3, 3, 4]);
  const [frequencies, setFrequencies] = useState<{ [key: number]: number }>({});
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [traversing, setTraversing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [currentLine, setCurrentLine] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(800);

  
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
    setCurrentStep(-1);
    setCurrentLine(1); 


    setTimeout(() => {
      let index = 0;
      const traverseInterval = setInterval(() => {
        if (index < array.length) {
         
          setCurrentStep(index);
          setCurrentLine(2); 
          
          setTimeout(() => {
            const currentValue = array[index];
            setCurrentLine(3); 

            
            setTimeout(() => {
              setFrequencies((prev) => {
                const updatedFreq = { ...prev };
                updatedFreq[currentValue] = (updatedFreq[currentValue] || 0) + 1;
                return updatedFreq;
              });
              
              setCurrentLine(4); 

              index += 1;
            }, animationSpeed * 0.3);
          }, animationSpeed * 0.3);
        } else {
          clearInterval(traverseInterval);
          setCurrentLine(5); 
          setTimeout(() => {
            setTraversing(false);
            setCurrentLine(0);
            setCurrentStep(-1);
          }, animationSpeed * 0.5);
        }
      }, animationSpeed);
    }, 500);
  };

  const restartVisualization = () => {
    // Reset the state for visualization restart
    setTraversing(false);
    setFrequencies({});
    setCurrentStep(-1);
    setCurrentLine(0);
    
    // Wait a brief moment before starting again to ensure clean state
    setTimeout(() => {
      startTraversal();
    }, 300);
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

  const isButtonDisabled = traversing || (!inputValue && array.length === 0);

  // C++ code lines
  const cppCodeLines = [
    { line: 1, code: "unordered_map<int, int> countFrequency(const vector<int>& nums) {", indent: 0 },
    { line: 2, code: "    unordered_map<int, int> frequencyMap;", indent: 1 },
    { line: 3, code: "    for (int num : nums) {", indent: 1 },
    { line: 4, code: "        frequencyMap[num]++;", indent: 2 },
    { line: 5, code: "    }", indent: 1 },
    { line: 6, code: "    return frequencyMap;", indent: 1 },
    { line: 7, code: "}", indent: 0 }
  ];



  const mapVisualizerLineToCppLine = () => {
    switch (currentLine) {
      case 1: return 2; // Initializing map
      case 2: return 3; // Starting for loop
      case 3: 
      case 4: return 4; // Updating frequency counter
      case 5: return 6; // Return result
      default: return -1;
    }
  };

  return (
    <div className="p-6 bg-slate-800 rounded-lg shadow-xl min-h-[600px]">
      {/* Controls section */}
      <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-slate-400 mb-1">Input Array</label>
            <Input
              type="text"
              value={inputValue}
              onChange={handleArrayChange}
              placeholder="Enter numbers (comma separated)"
              className="w-full bg-slate-800 border-slate-700 text-white"
            />
            {error && <div className="text-red-400 text-xs mt-1">{error}</div>}
          </div>
          
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Speed</label>
              <select 
                className="bg-slate-800 border border-slate-700 rounded text-white text-sm p-2"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                disabled={traversing}
              >
                <option value="2500">Slow</option>
                <option value="1500">Normal</option>
                <option value="1000">Fast</option>
              </select>
            </div>
            
            <button
              onClick={startTraversal}
              className="h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isButtonDisabled}
            >
              <Play size={16} />
              <span>Start</span>
            </button>
            
            <button
              onClick={restartVisualization}
              className="h-10 px-4 bg-red-800 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={!traversing && currentLine === 0}
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
          <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex items-center mb-3">
              <Database size={18} className="text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Input Array</h3>
            </div>
            
            <div className="relative h-20 flex items-center justify-center overflow-hidden mb-3">
              <div className="absolute w-full h-1 bg-slate-700"></div>
              <div className="flex items-center justify-center gap-1 z-10">
                {array.map((num, index) => (
                  <motion.div
                    key={index}
                    className={`
                      w-14 h-14 flex flex-col items-center justify-center rounded-lg
                      border-2 transition-all duration-300
                      ${index === currentStep ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/50" : 
                        frequencies[num] && !traversing ? "bg-green-800 border-green-500" : "bg-slate-800 border-slate-700"}
                    `}
                    initial={{ scale: 1 }}
                    animate={{
                      scale: index === currentStep ? 1.15 : 1,
                      y: index === currentStep ? -10 : 0,
                      opacity: index === currentStep ? 1 : (traversing && index > currentStep ? 0.5 : 0.9)
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-lg font-bold text-white">{num}</span>
                    <span className="text-xs text-slate-300">idx: {index}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Array pointer */}
            {traversing && currentStep >= 0 && (
              <div className="flex items-center justify-center">
                <motion.div 
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="text-yellow-500" size={20} />
                  <div className="text-xs text-yellow-500 font-mono">num = {array[currentStep]}</div>
                </motion.div>
              </div>
            )}
          </div>

          {/* Frequency Table */}
          <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex items-center mb-3">
              <Hash size={18} className="text-purple-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Frequency Map</h3>
            </div>
            
            <div className="overflow-hidden">
              <div className="flex items-center mb-2 px-3 py-2 bg-slate-800 rounded-lg">
                <div className="w-1/2 font-mono text-sm text-slate-400">Key (num)</div>
                <div className="w-1/2 font-mono text-sm text-slate-400">Value (count)</div>
              </div>
              
              <div className="space-y-2">
                <AnimatePresence>
                  {Object.entries(frequencies).map(([key, value]) => (
                    <motion.div
                      key={key}
                      className={`
                        flex items-center px-3 py-3 rounded-lg
                        ${currentStep >= 0 && array[currentStep] === parseInt(key) && currentLine === 4 
                          ? "bg-yellow-900 border border-yellow-500" 
                          : "bg-slate-800"}
                      `}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-1/2 font-mono text-lg font-semibold text-white">{key}</div>
                      <div className="w-1/2 font-mono text-lg text-green-400">
                        {value}
                        {currentStep >= 0 && array[currentStep] === parseInt(key) && currentLine === 4 && (
                          <motion.span 
                            className="inline-block ml-1 text-yellow-400"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            ↑
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-700 text-center">
            {array.length === 0 ? (
              <div className="text-slate-400">Enter an array to see the frequency count</div>
            ) : traversing ? (
              <div className="text-yellow-300 font-medium">
                {currentLine === 1 && "Initializing frequency map..."}
                {currentLine === 2 && `Starting iteration through array at index ${currentStep}...`}
                {currentLine === 3 && `Processing element ${array[currentStep]} at index ${currentStep}...`}
                {currentLine === 4 && `Updated frequency of ${array[currentStep]} to ${frequencies[array[currentStep]]}...`}
                {currentLine === 5 && "Frequency calculation complete! Returning result..."}
              </div>
            ) : (
              <div className="text-green-400 font-medium">
                Frequency counts for the array calculated successfully.
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
                  {cppCodeLines.map((codeLine) => (
                    <motion.div
                      key={codeLine.line}
                      className={`
                        py-1 px-2 my-1 rounded-sm
                        ${codeLine.line === mapVisualizerLineToCppLine() 
                          ? "bg-blue-900/40 text-white border-l-2 border-blue-500" 
                          : "text-slate-400"}
                      `}
                      animate={{
                        backgroundColor: codeLine.line === mapVisualizerLineToCppLine() ? "rgba(30, 58, 138, 0.4)" : "transparent",
                        scale: codeLine.line === mapVisualizerLineToCppLine() ? 1.02 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="mr-2 text-slate-600 select-none">{codeLine.line}</span>
                      <span style={{ paddingLeft: `${codeLine.indent * 20}px` }}>
                        {codeLine.code}
                      </span>
                    </motion.div>
                  ))}
                  
                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <h4 className="text-md font-semibold text-white mb-3">Current Step Explanation:</h4>
                    <div className="bg-slate-900 p-3 rounded-lg text-sm">
                      {currentLine === 0 && !traversing && (
                        <div className="text-slate-400">
                          Ready to visualize how a HashMap/unordered_map counts element frequencies.
                          Press &quot;Start&quot; to begin.
                        </div>
                      )}
                      {currentLine === 1 && (
                        <div className="text-blue-400">
                          <span className="font-bold">Initialize frequencyMap:</span> Creating an empty 
                          unordered_map to store element counts. Each key will be an array element,
                          and its value will be the frequency count.
                        </div>
                      )}
                      {currentLine === 2 && (
                        <div className="text-blue-400">
                          <span className="font-bold">Start loop:</span> Beginning iteration through array 
                          elements. Current element is <span className="text-yellow-300">{array[currentStep]}</span> at 
                          index <span className="text-yellow-300">{currentStep}</span>.
                        </div>
                      )}
                      {currentLine === 3 && (
                        <div className="text-blue-400">
                          <span className="font-bold">Update frequency:</span> Incrementing the count for 
                          element <span className="text-yellow-300">{array[currentStep]}</span> in our 
                          frequency map. If this element has not been seen before, it will start at 1.
                        </div>
                      )}
                      {currentLine === 4 && (
                        <div className="text-blue-400">
                          <span className="font-bold">Increment complete:</span> Successfully updated 
                          frequency of <span className="text-yellow-300">{array[currentStep]}</span> to 
                          <span className="text-yellow-300"> {frequencies[array[currentStep]]}</span>. 
                          Moving to next array element.
                        </div>
                      )}
                      {currentLine === 5 && (
                        <div className="text-green-400">
                          <span className="font-bold">Return result:</span> Iteration complete! The 
                          frequencyMap now contains the count of each unique element in the array.
                        </div>
                      )}
                    </div>
                    
                    {currentLine > 0 && (
                      <div className="mt-3 p-2 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="text-xs text-slate-500">Time Complexity: O(n)</div>
                        <div className="text-xs text-slate-500">Space Complexity: O(k) where k is unique elements</div>
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
};

export default HashMapVisualizer;