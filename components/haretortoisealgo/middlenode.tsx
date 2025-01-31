"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const oddList = [1, 2, 3, 4, 5, 6, 7];
const evenList = [1, 2, 3, 4, 5, 6];

export default function MiddleNodeFinder() {
  const [isOddArray, setIsOddArray] = useState(true);
  const [tortoiseIndex, setTortoiseIndex] = useState(0);
  const [hareIndex, setHareIndex] = useState(0);
  const [middleNode, setMiddleNode] = useState<number | null>(null);
  const [running, setRunning] = useState(true);

  const currentList = isOddArray ? oddList : evenList;

  useEffect(() => {
    if (!running || middleNode !== null) return;

    const interval = setInterval(() => {
     
      const nextHareIndex = hareIndex + 2;

      
      const shouldStop = isOddArray
        ? nextHareIndex >= currentList.length
        : nextHareIndex > currentList.length;

      if (shouldStop) {
        setMiddleNode(currentList[tortoiseIndex]);
        setRunning(false);
        clearInterval(interval);
        return;
      }

   
      setTortoiseIndex(prevTortoise => prevTortoise + 1);
      setHareIndex(nextHareIndex);
    }, 1000);

    return () => clearInterval(interval);
  }, [tortoiseIndex, hareIndex, middleNode, running, isOddArray, currentList]);

  const resetSimulation = () => {
    setTortoiseIndex(0);
    setHareIndex(0);
    setMiddleNode(null);
    setRunning(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
        Find Middle Node
      </h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setIsOddArray(true);
            resetSimulation();
          }}
          className={`px-4 py-2 rounded-lg font-semibold transition
                        ${isOddArray
              ? 'bg-violet-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
        >
          Odd Array [1-7]
        </button>
        <button
          onClick={() => {
            setIsOddArray(false);
            resetSimulation();
          }}
          className={`px-4 py-2 rounded-lg font-semibold transition
                        ${!isOddArray
              ? 'bg-violet-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
        >
          Even Array [1-6]
        </button>
      </div>

      <div className="flex items-center space-x-4 p-4">
        {currentList.map((value, index) => (
          <div
            key={index}
            className={`relative w-16 h-16 flex items-center justify-center rounded-full text-lg font-bold border-2 
                            ${middleNode === value
                ? 'bg-violet-900 border-violet-400'
                : 'bg-slate-800 border-slate-600'}`}
          >
            {value}
            {tortoiseIndex === index && (
              <motion.div
                initial={{ y: -10, scale: 0.5 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute w-6 h-6 bg-green-500 rounded-full top-[-20px] text-xs flex items-center justify-center font-bold"
              >
                T
              </motion.div>
            )}
            {hareIndex === index && (
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
        ))}
        {/* NULL node for even-sized array */}
        {!isOddArray && (
          <div className="relative w-16 h-16 flex items-center justify-center rounded-full text-lg font-bold border-2 border-slate-600 bg-slate-800 opacity-50">
            NULL
            {hareIndex === currentList.length && (
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
        )}
      </div>

      {middleNode !== null && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          className="mt-6 text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent"
        >
          Middle Node: {middleNode}
        </motion.div>
      )}

      <button
        onClick={resetSimulation}
        className="mt-6 px-6 py-2 bg-violet-600 hover:bg-violet-500 transition rounded-lg text-white font-semibold"
      >
        Restart Simulation
      </button>
    </div>
  );
}