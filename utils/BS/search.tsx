import React from 'react';
import { useState } from "react";
import { Check, Copy } from 'lucide-react';
import { SiLeetcode } from 'react-icons/si';

export const Theory = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Theory: Binary Search Algorithm</h2>

            <p>
                <strong>Binary search</strong> is a highly efficient search algorithm that finds the position of a target value within a sorted array.
                It works by repeatedly dividing the search range in half, eliminating half of the remaining elements with each iteration.
                This technique works efficiently on any sorted collection that allows random access.
            </p>

            <h3 className="text-xl font-semibold">Key Concepts:</h3>
            <ul className="list-disc list-inside space-y-2">
                <li>
                    <strong>Time Complexity:</strong> O(log n)
                </li>
                <li>
                    <strong>Space Complexity:</strong> O(log n) for recursive, O(1) for iterative
                </li>
                <li>
                    The array must be sorted in ascending or descending order
                </li>
                <li>
                    Random access to elements (like in an array) is required
                </li>
            </ul>

            <h3 className="text-xl font-semibold">Prerequisites:</h3>
            <ol className="list-decimal list-inside space-y-2">
                <li>The array must be sorted in ascending or descending order</li>
                <li>Random access to elements (like in an array) is required</li>
                <li>The comparison operator ({'>'}, &lt;, =) must be defined for the elements</li>
            </ol>

            <h3 className="text-xl font-semibold">Algorithm Steps:</h3>
            <ol className="list-decimal list-inside space-y-2">
                <li>
                    Initialize pointers:
                    <ul className="list-disc ml-8 mt-2">
                        <li>left (l) = start of array</li>
                        <li>right (r) = end of array</li>
                    </ul>
                </li>
                <li>While left ≤ right:
                    <ul className="list-disc ml-8 mt-2">
                        <li>Calculate mid = left + (right - left) / 2</li>
                        <li>If element at mid is target, return mid</li>
                        <li>If target &lt; mid element, set right = mid - 1</li>
                        <li>If target {'>'} mid element, set left = mid + 1</li>
                    </ul>
                </li>
                <li>If element not found, return -1</li>
            </ol>

            <h3 className="text-xl font-semibold">Implementation Details:</h3>
            <p>
                Key points in the implementation:
            </p>
            <ul className="list-disc list-inside space-y-2">
                <li>Base case: if (left {'>'} right) return -1</li>
                <li>Mid calculation: mid = left + (right - left) / 2
                    <ul className="list-disc ml-8 mt-1">
                        <li>We use this instead of (left + right) / 2 to prevent integer overflow</li>
                    </ul>
                </li>
                <li>Recursive approach:
                    <ul className="list-disc ml-8 mt-1">
                        <li>Makes three recursive calls at most</li>
                        <li>Each call reduces search space by half</li>
                    </ul>
                </li>
                <li>Iterative approach:
                    <ul className="list-disc ml-8 mt-1">
                        <li>Uses while loop</li>
                        <li>More space efficient than recursive</li>
                    </ul>
                </li>
            </ul>

            <h3 className="text-xl font-semibold">Real-world Applications:</h3>
            <ul className="list-disc list-inside space-y-2">
                <li>Database Indexing</li>
                <li>Dictionary and Phone Book Implementations</li>
                <li>Finding IP Addresses in Routing Tables</li>
                <li>Computer Graphics (Binary Space Partitioning)</li>
                <li>Machine Learning (Finding Optimal Parameters)</li>
                <li>Version Control Systems (Finding Bugs using Git Bisect)</li>
            </ul>
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

