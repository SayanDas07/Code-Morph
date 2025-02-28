"use client";

import { useState } from "react";
import { SiLeetcode } from "react-icons/si";
import { Check, Copy } from "lucide-react";

// Theory Component
export const Theory = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Theory: Kadane&apos;s Algorithm</h2>
            <p>
                Kadane&apos;s Algorithm is an efficient technique for solving the maximum subarray problem.
                It finds the contiguous subarray within a one-dimensional array of numbers that has the largest sum.
                The algorithm uses dynamic programming to efficiently track the maximum sum.
            </p>
            <h3 className="text-xl font-semibold">Example array:</h3>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
                <code className="font-mono">[-2, 1, -3, 4, -1, 2, 1, -5, 4]</code>
            </div>
            <h3 className="text-xl font-semibold">Key Concepts:</h3>
            <ul className="list-disc list-inside space-y-2">
                <li>
                    <strong>Local Maximum:</strong> The maximum sum ending at the current position.
                </li>
                <li>
                    <strong>Global Maximum:</strong> The maximum sum found so far in any subarray.
                </li>
            </ul>
            <h3 className="text-xl font-semibold">Approach:</h3>
            <ol className="list-decimal list-inside space-y-2">
                <li>Initialize variables for tracking current sum (local max) and maximum sum (global max).</li>
                <li>Iterate through the array, adding each element to the current sum.</li>
                <li>If current sum becomes negative, reset it to zero (a new subarray will yield better results).</li>
                <li>Update the maximum sum whenever the current sum exceeds it.</li>
            </ol>
            <h3 className="text-xl font-semibold">Walkthrough with example:</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-200 dark:bg-slate-700">
                            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2">Position</th>
                            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2">Element</th>
                            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2">Current Sum</th>
                            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2">Max Sum</th>
                            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">0</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">-2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">-2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">-2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Initialize</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">-1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">-1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Update current sum and max sum</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">0</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">-1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Reset current sum (negative)</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Start new subarray, update max</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">-3</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">-2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Update current sum</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">-3</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">0</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Reset current sum (negative)</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">3</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">4</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">4</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">4</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Start new subarray, update max</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">4</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">-1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">3</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">4</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Update current sum</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">5</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">5</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">5</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Update current sum and max sum</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">6</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">6</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">6</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Update current sum and max sum</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">7</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">-5</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">6</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Update current sum</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">8</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">4</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">5</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">6</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Update current sum</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p className="font-medium">Result: Maximum subarray sum is 6, from subarray [4, -1, 2, 1]</p>
        </div>
    );
};

// CodeSnippet Component
export const CodeSnippet = () => {
    const [selectedLanguage, setSelectedLanguage] = useState<string>("cpp");
    const [copyStatus, setCopyStatus] = useState(false);

    const codeImplementations: { [Key: string]: string } = {
        cpp:
            `#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

int maxSubArray(vector<int>& nums) {
    int currentSum = 0;
    int maxSum = INT_MIN;
    
    for(int i = 0; i < nums.size(); i++) {
        currentSum += nums[i];
        
        maxSum = max(maxSum, currentSum);
        
        // If current sum becomes negative, reset it to 0
        if(currentSum < 0) {
            currentSum = 0;
        }
    }
    
    return maxSum;
}
`,

        python:
            `def max_sub_array(nums):
    current_sum = 0
    max_sum = float('-inf')
    
    for num in nums:
        current_sum += num
        
        max_sum = max(max_sum, current_sum)
        
        # If current sum becomes negative, reset it to 0
        if current_sum < 0:
            current_sum = 0
    
    return max_sum
`,

        java:
            `public class Solution {
    public int maxSubArray(int[] nums) {
        int currentSum = 0;
        int maxSum = Integer.MIN_VALUE;
        
        for (int i = 0; i < nums.length; i++) {
            currentSum += nums[i];
            
            maxSum = Math.max(maxSum, currentSum);
            
            // If current sum becomes negative, reset it to 0
            if (currentSum < 0) {
                currentSum = 0;
            }
        }
        
        return maxSum;
    }
}
`,

        javascript:
            `function maxSubArray(nums) {
  let currentSum = 0;
  let maxSum = Number.MIN_SAFE_INTEGER;
  
  for (let i = 0; i < nums.length; i++) {
    currentSum += nums[i];
    
    maxSum = Math.max(maxSum, currentSum);
    
    // If current sum becomes negative, reset it to 0
    if (currentSum < 0) {
      currentSum = 0;
    }
  }
  
  return maxSum;
}
`
    };

    const copyToClipboard = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopyStatus(true);
            setTimeout(() => setCopyStatus(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const languages = Object.keys(codeImplementations);
    return (
        <div className="w-full rounded-lg border border-slate-700 bg-slate-900 overflow-hidden">
            {/* Header with Language Selector and Copy Button */}
            <div className="border-b border-slate-700 p-2 bg-slate-800 flex justify-between items-center">
                <div className="flex gap-2">
                    {languages.map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setSelectedLanguage(lang)}
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${selectedLanguage === lang
                                ? 'bg-slate-900 text-slate-50'
                                : 'text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Copy Button */}
                <button
                    onClick={() => copyToClipboard(codeImplementations[selectedLanguage])}
                    className="p-2 rounded-lg hover:bg-slate-700 transition-all duration-200 text-slate-400 hover:text-slate-200"
                    title="Copy code"
                >
                    {copyStatus ? (
                        <Check className="w-5 h-5 text-green-400" />
                    ) : (
                        <Copy className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Code Display */}
            <div className="relative">
                <pre className="p-4 m-0 overflow-x-auto">
                    <code className="text-sm font-mono text-slate-50 whitespace-pre">
                        {codeImplementations[selectedLanguage]}
                    </code>
                </pre>
            </div>
        </div>
    );
};

// Practice Component
export const Practice = () => {
    return (
        <div className="space-y-4">
            <p>Practice these problems to master Kadane&apos;s Algorithm:</p>
            <ul className="space-y-2">
                <li>
                    <a
                        href="https://leetcode.com/problems/maximum-subarray/description"
                        className="flex items-center space-x-2 text-blue-400 transition duration-200 ease-in-out hover:text-blue-300 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <SiLeetcode className="w-5 h-5 text-orange-500 transition duration-200 ease-in-out hover:text-orange-400" />
                        <span>Maximum Subarray Sum</span>
                    </a>
                </li>
                <li>
                    <a
                        href="https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
                        className="flex items-center space-x-2 text-blue-400 transition duration-200 ease-in-out hover:text-blue-300 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <SiLeetcode className="w-5 h-5 text-orange-500 transition duration-200 ease-in-out hover:text-orange-400" />
                        <span>Best Time to Buy and Sell Stock</span>
                    </a>
                </li>
                <li>
                    <a
                        href="https://leetcode.com/problems/maximum-product-subarray/"
                        className="flex items-center space-x-2 text-blue-400 transition duration-200 ease-in-out hover:text-blue-300 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <SiLeetcode className="w-5 h-5 text-orange-500 transition duration-200 ease-in-out hover:text-orange-400" />
                        <span>Maximum Product Subarray</span>
                    </a>
                </li>
            </ul>
        </div>
    );
};

// Complexity Component
export const Complexity = () => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h3 className="font-semibold">Time Complexity</h3>
                <p><strong>O(n)</strong> - Each element in the array is processed exactly once.</p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">Space Complexity</h3>
                <p><strong>O(1)</strong> - Only a constant amount of extra space is used regardless of input size.</p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">Advantages</h3>
                <ul className="list-disc list-inside">
                    <li>Simple to implement</li>
                    <li>Highly efficient for large arrays</li>
                    <li>Works with both positive and negative numbers</li>
                </ul>
            </div>
        </div>
    );
};