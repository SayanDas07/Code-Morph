import React from 'react';
import { useState } from "react";
import { Check, Copy } from 'lucide-react';
import { SiLeetcode } from 'react-icons/si';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const Theory = () => {
    const [expandedSection, setExpandedSection] = useState<string | null>('overview');

    const sections = {
        overview: {
            title: "Overview of Binary Search",
            content: `Binary search is a highly efficient search algorithm that finds the position of a target value within a sorted array. 
      It works by repeatedly dividing the search range in half, eliminating half of the remaining elements with each iteration.
      
      Time Complexity: O(log n)
      Space Complexity: O(log n) for recursive, O(1) for iterative`
        },
        prerequisites: {
            title: "Prerequisites",
            content: `1. The array must be sorted in ascending or descending order
2. Random access to elements (like in an array) is required
3. The comparison operator (>, <, =) must be defined for the elements`
        },
        algorithm: {
            title: "Algorithm Steps",
            content: `1. Initialize pointers:
   - left (l) = start of array
   - right (r) = end of array

2. While left ≤ right:
   - Calculate mid = left + (right - left) / 2
   - If element at mid is target, return mid
   - If target < mid element, set right = mid - 1
   - If target > mid element, set left = mid + 1

3. If element not found, return -1`
        },
        implementation: {
            title: "Code Implementation",
            content: `Key points in the implementation:

1. Base case: if (left > right) return -1
2. Mid calculation: mid = left + (right - left) / 2
   - We use this instead of (left + right) / 2 to prevent integer overflow
3. Recursive approach:
   - Makes three recursive calls at most
   - Each call reduces search space by half
4. Iterative approach:
   - Uses while loop
   - More space efficient than recursive`
        },
        applications: {
            title: "Real-world Applications",
            content: `1. Database Indexing
2. Dictionary and Phone Book Implementations
3. Finding IP Addresses in Routing Tables
4. Computer Graphics (Binary Space Partitioning)
5. Machine Learning (Finding Optimal Parameters)
6. Version Control Systems (Finding Bugs using Git Bisect)`
        }
    };

    interface TheorySectionProps {
        id: string;
        title: string;
        content: string;
    }

    const TheorySection = ({ id, title, content }: TheorySectionProps) => (
        <div className="mb-4">
            <button
                onClick={() => setExpandedSection(expandedSection === id ? null : id)}
                className="w-full flex justify-between items-center p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            >
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                {expandedSection === id ?
                    <ChevronUp className="text-slate-400" /> :
                    <ChevronDown className="text-slate-400" />
                }
            </button>
            {expandedSection === id && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 p-4 bg-slate-800 rounded-lg"
                >
                    <div className="text-slate-300 whitespace-pre-line">
                        {content}
                    </div>
                </motion.div>
            )}
        </div>
    );

    return (
        <div className="p-6 bg-slate-900 rounded-lg shadow-xl max-w-auto mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Binary Search Algorithm Theory</h1>

            {Object.entries(sections).map(([id, section]) => (
                <TheorySection
                    key={id}
                    id={id}
                    title={section.title}
                    content={section.content}
                />
            ))}

            <div className="mt-6 p-4 bg-blue-900/30 rounded-lg">
                <h3 className="text-blue-300 font-semibold mb-2">Key Takeaways:</h3>
                <ul className="list-disc list-inside text-blue-200 space-y-2">
                    <li>Binary search requires a sorted array</li>
                    <li>Reduces search space by half in each step</li>
                    <li>Logarithmic time complexity makes it extremely efficient</li>
                    <li>Best used when data is sorted and random access is available</li>
                </ul>
            </div>
        </div>
    );
};




export const CodeSnippet = () => {
    const [copyStatus, setCopyStatus] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'python' | 'java'>('cpp');

    const codeImplementations: { [key in 'cpp' | 'python' | 'java' | 'javascript']: string } = {
        cpp: `class Solution {
private : 
    int bs(vector<int>& a , int l , int h , int t){
            if(l > h) return  -1;

            int mid = l + ((h - l)/2);

            if(a[mid] == t) return mid;

            else if(a[mid] > t) return bs(a , l , mid - 1 , t);

            else return bs(a , mid + 1 , h , t);
    }
public:
    
    int search(vector<int>& nums, int target) {
        int n = nums.size();
        int l = 0;
        int h = n - 1;


        int ans = bs(nums , l , h , target);

        return ans;
        
    }
};
`,
        python: `class Solution:
    def bs(self, a, l, h, t):
        if l > h:
            return -1
        
        mid = l + (h - l) // 2
        
        if a[mid] == t:
            return mid
        elif a[mid] > t:
            return self.bs(a, l, mid - 1, t)
        else:
            return self.bs(a, mid + 1, h, t)

    def search(self, nums, target):
        n = len(nums)
        l = 0
        h = n - 1
        return self.bs(nums, l, h, target)

`,
        java: `class Solution {
    private int bs(int[] a, int l, int h, int t) {
        if (l > h) return -1;

        int mid = l + (h - l) / 2;

        if (a[mid] == t) return mid;
        else if (a[mid] > t) return bs(a, l, mid - 1, t);
        else return bs(a, mid + 1, h, t);
    }

    public int search(int[] nums, int target) {
        int n = nums.length;
        int l = 0;
        int h = n - 1;
        return bs(nums, l, h, target);
    }
}

`,
        javascript:
        `class Solution {
    constructor() {}

    binarySearch(arr, l, h, target) {
        if (l > h) return -1;

        let mid = l + Math.floor((h - l) / 2);

        if (arr[mid] === target) return mid;
        else if (arr[mid] > target) return this.binarySearch(arr, l, mid - 1, target);
        else return this.binarySearch(arr, mid + 1, h, target);
    }

    search(nums, target) {
        let n = nums.length;
        return this.binarySearch(nums, 0, n - 1, target);
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

    return (
        <div className="w-full rounded-lg border border-slate-700 bg-slate-900 overflow-hidden">
            <div className="border-b border-slate-700 p-2 bg-slate-800 flex justify-between items-center">
                <div className="flex gap-2">
                    {Object.keys(codeImplementations).map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setSelectedLanguage(lang as 'cpp' | 'python' | 'java')}
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${selectedLanguage === lang
                                ? 'bg-slate-900 text-slate-50'
                                : 'text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>
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

export const Practice = () => {
    return (
        <div className="space-y-4">
            <p>Practice these problems to master the algorithm:</p>
            <ul className="space-y-2">
                <li>
                    <a
                        href="https://leetcode.com/problems/binary-search/"
                        className="flex items-center space-x-2 text-blue-400 transition duration-200 ease-in-out hover:text-blue-300 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <SiLeetcode className="w-5 h-5 text-orange-500 transition duration-200 ease-in-out hover:text-orange-400" />
                        <span>Binary Search</span>
                    </a>
                </li>
            </ul>
        </div>
    );
};

export const Complexity = () => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h3 className="font-semibold">Time Complexity</h3>
                <p><strong>- Each step divides problem size by 2
                    - Takes log₂(n) steps to reach size 1
                    - Therefore, O(log n) time complexity
                </strong></p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">Space Complexity</h3>
                <p><strong>- Recursive: O(log n) due to call stack
                    - Iterative: O(1) constant space</strong></p>
            </div>

        </div>
    );
};

