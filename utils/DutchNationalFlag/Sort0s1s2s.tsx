"use client";

import { useState } from "react";
import { SiLeetcode } from "react-icons/si";
import { Check, Copy } from "lucide-react";

// Theory Component
export const Theory = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Theory: Dutch National Flag Algorithm</h2>
            <p>
                The Dutch National Flag (DNF) algorithm is an efficient technique for sorting an array containing
                only three distinct values. Named after the Dutch flag&apos;s three colors, it was designed by Edsger W. Dijkstra.
                The algorithm partitions the array into three sections, each containing one type of element.
                It uses the three-way partitioning approach to sort in a single pass.
            </p>
            <h3 className="text-xl font-semibold">Example array:</h3>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
                <code className="font-mono">[2, 0, 2, 1, 1, 0, 0, 2, 1, 0]</code>
            </div>
            <h3 className="text-xl font-semibold">Key Concepts:</h3>
            <ul className="list-disc list-inside space-y-2">
                <li>
                    <strong>Three Pointers:</strong> low, mid, and high to partition the array.
                </li>
                <li>
                    <strong>Three Sections:</strong> Elements 0 (before low), 1 (between low and high), and 2 (after high).
                </li>
            </ul>
            <h3 className="text-xl font-semibold">Approach:</h3>
            <ol className="list-decimal list-inside space-y-2">
                <li>Initialize three pointers: low = 0, mid = 0, high = array.length - 1.</li>
                <li>Iterate with the mid pointer as long as mid ≤ high.</li>
                <li>If arr[mid] == 0, swap arr[low] and arr[mid], then increment both low and mid.</li>
                <li>If arr[mid] == 1, simply increment mid.</li>
                <li>If arr[mid] == 2, swap arr[mid] and arr[high], then decrement high.</li>
            </ol>
            <h3 className="text-xl font-semibold">Walkthrough with example:</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-200 dark:bg-slate-700">
                            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2">Step</th>
                            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2">Array</th>
                            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2">Low</th>
                            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2">Mid</th>
                            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2">High</th>
                            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">0</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">[2, 0, 2, 1, 1, 0, 0, 2, 1, 0]</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">0</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">0</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">9</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Initialize</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">[0, 2, 2, 1, 1, 0, 0, 2, 1, 2]</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">0</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">0</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">8</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Swap a[mid]=2 with a[high]=0, decrement high</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">[0, 2, 2, 1, 1, 0, 0, 2, 1, 2]</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">8</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">a[mid]=0, swap with a[low], increment low & mid</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">3</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">[0, 1, 2, 2, 1, 0, 0, 2, 1, 2]</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">1</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">7</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Swap a[mid]=2 with a[high]=1, decrement high</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">4</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">[0, 1, 2, 2, 1, 0, 0, 2, 1, 2]</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">7</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">a[mid]=1, increment mid only</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">5</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">[0, 1, 0, 2, 1, 2, 0, 2, 1, 2]</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">2</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">6</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Swap a[mid]=2 with a[high]=0, decrement high</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">6</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">[0, 1, 0, 2, 1, 2, 0, 2, 1, 2]</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">3</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">3</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">6</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">a[mid]=0, swap with a[low], increment low & mid</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">7</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">[0, 1, 0, 0, 1, 2, 2, 2, 1, 2]</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">3</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">3</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">5</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Swap a[mid]=2 with a[high]=0, decrement high</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">8</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">[0, 1, 0, 0, 1, 2, 2, 2, 1, 2]</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">4</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">4</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">5</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">a[mid]=0, swap with a[low], increment low & mid</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">9</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">[0, 1, 0, 0, 1, 2, 2, 2, 1, 2]</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">5</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">5</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">5</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">a[mid]=1, increment mid only</td>
                        </tr>
                        <tr>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">10</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">[0, 0, 0, 0, 1, 1, 2, 2, 2, 2]</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">5</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">6</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">5</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Complete: mid {'>'} high, algorithm terminates</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p className="font-medium">Result: Sorted array [0, 0, 0, 0, 1, 1, 2, 2, 2, 2]</p>
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
using namespace std;

void sortColors(vector<int>& nums) {
    int n = nums.size();
    int low = 0, mid = 0, high = n - 1;
    
    while(mid <= high) {
        if(nums[mid] == 0) {
            swap(nums[low], nums[mid]);
            low++;
            mid++;
        }
        else if(nums[mid] == 1) {
            mid++;
        }
        else { // nums[mid] == 2
            swap(nums[high], nums[mid]);
            high--;
        }
    }
}
`,

        python:
            `def sort_colors(nums):
    low, mid, high = 0, 0, len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
    
    return nums
`,

        java:
            `public class Solution {
    public void sortColors(int[] nums) {
        int low = 0;
        int mid = 0;
        int high = nums.length - 1;
        
        while (mid <= high) {
            if (nums[mid] == 0) {
                swap(nums, low, mid);
                low++;
                mid++;
            } else if (nums[mid] == 1) {
                mid++;
            } else { // nums[mid] == 2
                swap(nums, mid, high);
                high--;
            }
        }
    }
    
    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
`,

        javascript:
            `function sortColors(nums) {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;
  
  while (mid <= high) {
    if (nums[mid] === 0) {
      // Swap nums[low] and nums[mid]
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else { // nums[mid] === 2
      // Swap nums[mid] and nums[high]
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
  
  return nums;
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
            <p>Practice these problems to master the Dutch National Flag Algorithm:</p>
            <ul className="space-y-2">
                <li>
                    <a
                        href="https://leetcode.com/problems/sort-colors/"
                        className="flex items-center space-x-2 text-blue-400 transition duration-200 ease-in-out hover:text-blue-300 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <SiLeetcode className="w-5 h-5 text-orange-500 transition duration-200 ease-in-out hover:text-orange-400" />
                        <span>Sort Colors</span>
                    </a>
                </li>
                <li>
                    <a
                        href="https://leetcode.com/problems/move-zeroes/"
                        className="flex items-center space-x-2 text-blue-400 transition duration-200 ease-in-out hover:text-blue-300 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <SiLeetcode className="w-5 h-5 text-orange-500 transition duration-200 ease-in-out hover:text-orange-400" />
                        <span>Move Zeroes</span>
                    </a>
                </li>
                <li>
                    <a
                        href="https://leetcode.com/problems/partition-array-according-to-given-pivot/"
                        className="flex items-center space-x-2 text-blue-400 transition duration-200 ease-in-out hover:text-blue-300 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <SiLeetcode className="w-5 h-5 text-orange-500 transition duration-200 ease-in-out hover:text-orange-400" />
                        <span>Partition Array According to Given Pivot</span>
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
                <p><strong>O(n)</strong> - The algorithm traverses the array only once.</p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">Space Complexity</h3>
                <p><strong>O(1)</strong> - Only a constant amount of extra space is used regardless of input size.</p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">Advantages</h3>
                <ul className="list-disc list-inside">
                    <li>Single pass algorithm</li>
                    <li>In-place sorting (no extra space required)</li>
                    <li>Stable with respect to elements of same value</li>
                    <li>Linear time complexity</li>
                </ul>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">Applications</h3>
                <ul className="list-disc list-inside">
                    <li>Sorting arrays with small number of distinct values</li>
                    <li>Used in quicksort implementation (three-way partitioning)</li>
                    <li>Organizing data by categories</li>
                    <li>Segregating different types of elements in an array</li>
                </ul>
            </div>
        </div>
    );
};