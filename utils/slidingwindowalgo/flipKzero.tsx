"use client";

import { useState } from "react";
import { SiLeetcode } from "react-icons/si";
import { Check, Copy } from "lucide-react";

// Theory Component
export const Theory = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Theory: Sliding Window Algorithm</h2>
      <p>
        The Sliding Window technique is useful in solving problems related to arrays and sequences.
        By dynamically adjusting the window size, it can optimize problems involving subarrays and substrings.
        It is particularly useful in problems that require a series of consecutive elements.
      </p>
      <h3 className="text-xl font-semibold">Key Concepts:</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>Sliding Window:</strong> A fixed-size window that slides over a sequence of elements.
        </li>
        <li>
          <strong>Efficiency:</strong> Reduces unnecessary calculations by reusing previously computed results.
        </li>
      </ul>
      <h3 className="text-xl font-semibold">Approach:</h3>
      <ol className="list-decimal list-inside space-y-2">
        <li>Initialize the window with the first &quot;k&quot; elements.</li>
        <li>Move the window one element at a time while adjusting calculations for the new window.</li>
        <li>Repeat the process for all windows and store or return the results.</li>
      </ol>
    </div>
  );
};

// CodeSnippet Component
export const CodeSnippet = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("cpp");
  const [copyStatus, setCopyStatus] = useState(false);

  const codeImplementations: { [Key: string]: string } = {
    cpp: `// C++ Code: Sliding Window for longest 1s after flipping k zeros
#include <vector>
#include <algorithm>
using namespace std;

int longestOnes(vector<int>& nums, int k) {
    int left = 0, right = 0;
    int zeroCount = 0;  
    int maxLen = 0;

    while (right < nums.size()) {
        if (nums[right] == 0) {
            zeroCount++;
        }

        while (zeroCount > k) {
            if (nums[left] == 0) {
                zeroCount--;
            }
            left++;
        }

        maxLen = max(maxLen, right - left + 1);

        right++;
    }

    return maxLen;
}
`,

    python: `# Python Code: Sliding Window for longest 1s after flipping k zeros
def longestOnes(nums, k):
    left = 0
    right = 0
    zero_count = 0
    max_len = 0

    while right < len(nums):
        if nums[right] == 0:
            zero_count += 1
        
        while zero_count > k:
            if nums[left] == 0:
                zero_count -= 1
            left += 1
        
        max_len = max(max_len, right - left + 1)

        right += 1

    return max_len
`,

    java: `// Java Code: Sliding Window for longest 1s after flipping k zeros
public class Solution {
    public int longestOnes(int[] nums, int k) {
        int left = 0;
        int right = 0;
        int zeroCount = 0;
        int maxLen = 0;

        while (right < nums.length) {
            if (nums[right] == 0) {
                zeroCount++;
            }

            while (zeroCount > k) {
                if (nums[left] == 0) {
                    zeroCount--;
                }
                left++;
            }

            maxLen = Math.max(maxLen, right - left + 1);

            right++;
        }

        return maxLen;
    }
}
`,

    javascript: `// JavaScript Code: Sliding Window for longest 1s after flipping k zeros
function longestOnes(nums, k) {
  let left = 0;
  let right = 0;
  let zeroCount = 0;
  let maxLen = 0;

  while (right < nums.length) {
    if (nums[right] === 0) {
      zeroCount++;
    }

    while (zeroCount > k) {
      if (nums[left] === 0) {
        zeroCount--;
      }
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);

    right++;
  }

  return maxLen;
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
      <p>Practice these problems to master the Sliding Window algorithm:</p>
      <ul className="space-y-2">
        <li>
          <a
            href="https://leetcode.com/problems/sliding-window-maximum/"
            className="flex items-center space-x-2 text-blue-400 transition duration-200 ease-in-out hover:text-blue-300 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiLeetcode className="w-5 h-5 text-orange-500 transition duration-200 ease-in-out hover:text-orange-400" />
            <span>Sliding Window Maximum</span>
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
        <p><strong>O(n)</strong> - Each element is processed once during the sliding window calculation.</p>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">Space Complexity</h3>
        <p><strong>O(k)</strong> - The space complexity is proportional to the window size.</p>
      </div>
    </div>
  );
};
