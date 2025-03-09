"use client";

import { useState } from "react";
import { SiLeetcode } from "react-icons/si";
import { Check, Copy } from "lucide-react";

// Theory Component
export const Theory = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Theory: Moore&apos;s Voting Algorithm</h2>
            <p>
                Moore&apos;s Voting Algorithm is an efficient algorithm for finding the majority element in an array.
                A majority element appears more than n/2 times in an array of size n.
                The algorithm works in two phases: voting phase and verification phase.
            </p>
            <h3 className="text-xl font-semibold">Example array:</h3>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
                <code className="font-mono">[2, 2, 1, 1, 1, 2, 2]</code>
            </div>
            <h3 className="text-xl font-semibold">Key Concepts:</h3>
            <ul className="list-disc list-inside space-y-2">
                <li>
                    <strong>Candidate:</strong> The current potential majority element.
                </li>
                <li>
                    <strong>Count:</strong> Counter that tracks the frequency of the candidate.
                </li>
            </ul>
            <h3 className="text-xl font-semibold">Approach:</h3>
            <ol className="list-decimal list-inside space-y-2">
                <li>Initialize a candidate element and a count.</li>
                <li>Iterate through the array. For each element:
                    <ul className="list-disc list-inside ml-8 space-y-1 mt-1">
                        <li>If count is 0, set current element as the new candidate.</li>
                        <li>If current element equals candidate, increment count.</li>
                        <li>If current element differs from candidate, decrement count.</li>
                    </ul>
                </li>
                <li>Verify if the candidate is the majority element by counting its occurrences.</li>
            </ol>
            <h3 className="text-xl font-semibold">Walkthrough with example:</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-200 dark:bg-slate-700">
                            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2">Position</th>
                            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2">Element</th>
                            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2">Candidate</th>
                            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2">Count</th>
                            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">0</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Initialize candidate as 2, count as 1</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Element matches candidate, increment count</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Element differs from candidate, decrement count</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">3</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">0</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Element differs from candidate, decrement count</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">4</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Count is 0, set new candidate as 1, count as 1</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">5</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">0</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Element differs from candidate, decrement count</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">6</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Count is 0, set new candidate as 2, count as 1</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h3 className="text-xl font-semibold">Verification Phase:</h3>
            <p>
                After finding the candidate (2), we count its occurrences in the array.
                Since 2 appears 4 times in an array of size 7 (more than 7/2), it is confirmed as the majority element.
            </p>
            <p className="font-medium">Result: The majority element is 2, appearing 4 times in the array of size 7.</p>
        </div>
    );
};

// CodeSnippet Component
export const CodeSnippet = () => {
    const [selectedLanguage, setSelectedLanguage] = useState<string>("cpp");
    const [copyStatus, setCopyStatus] = useState(false);

    const codeImplementations: { [Key: string]: string } = {
        cpp:
            `class Solution {
public:
    int majorityElement(vector<int>& nums) {

        int n = nums.size();
        int cnt = 0; 
        int el; 

    
        for (int i = 0; i < n; i++) {
            if (cnt == 0) {
                cnt = 1;
                el = nums[i];
            }
            else if (el == nums[i]) cnt++;
            else cnt--;
        }

        int cnt1 = 0;
        for (int i = 0; i < n; i++) {
            if (nums[i] == el) cnt1++;
        }

        if (cnt1 > (n / 2)) return el;
        return -1;

    }
};
`,

        python:
            `def majority_element(nums):
    # Voting phase
    candidate = nums[0]
    count = 1
    
    for i in range(1, len(nums)):
        if count == 0:
            candidate = nums[i]
            count = 1
        elif candidate == nums[i]:
            count += 1
        else:
            count -= 1
    
    # Verification phase
    count = 0
    for num in nums:
        if num == candidate:
            count += 1
    
    if count > len(nums) // 2:
        return candidate
    else:
        # No majority element exists
        return -1
`,

        java:
            `public class Solution {
    public int majorityElement(int[] nums) {
        // Voting phase
        int candidate = nums[0];
        int count = 1;
        
        for (int i = 1; i < nums.length; i++) {
            if (count == 0) {
                candidate = nums[i];
                count = 1;
            } else if (candidate == nums[i]) {
                count++;
            } else {
                count--;
            }
        }
        
        // Verification phase
        count = 0;
        for (int num : nums) {
            if (num == candidate) {
                count++;
            }
        }
        
        if (count > nums.length / 2) {
            return candidate;
        } else {
            // No majority element exists
            return -1;
        }
    }
}
`,

        javascript:
            `function majorityElement(nums) {
  // Voting phase
  let candidate = nums[0];
  let count = 1;
  
  for (let i = 1; i < nums.length; i++) {
    if (count === 0) {
      candidate = nums[i];
      count = 1;
    } else if (candidate === nums[i]) {
      count++;
    } else {
      count--;
    }
  }
  
  // Verification phase
  count = 0;
  for (let num of nums) {
    if (num === candidate) {
      count++;
    }
  }
  
  if (count > nums.length / 2) {
    return candidate;
  } else {
    // No majority element exists
    return -1;
  }
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
            <p>Practice these problems to master Moore&apos;s Voting Algorithm:</p>
            <ul className="space-y-2">
                <li>
                    <a
                        href="https://leetcode.com/problems/majority-element/description/"
                        className="flex items-center space-x-2 text-blue-400 transition duration-200 ease-in-out hover:text-blue-300 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <SiLeetcode className="w-5 h-5 text-orange-500 transition duration-200 ease-in-out hover:text-orange-400" />
                        <span>Majority Element</span>
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
                <p><strong>O(n)</strong> - Two passes through the array: one for finding the candidate and one for verification.</p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">Space Complexity</h3>
                <p><strong>O(1)</strong> - Only constant extra space is used regardless of input size.</p>
            </div>


        </div>
    );
};