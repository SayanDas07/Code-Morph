"use client";

import { useState } from "react";
import { SiLeetcode } from "react-icons/si";
import { Check, Copy } from "lucide-react";

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

export const CodeSnippet = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("cpp");
  const [copyStatus, setCopyStatus] = useState(false);

  const codeImplementations: { [Key: string]: string } = {
    cpp: `#include <vector>
    using namespace std;

    vector<int> slidingWindow(vector<int>& arr, int k) {
      vector<int> result;
      int windowSum = 0;

      // Calculate the sum of the first window
      for (int i = 0; i < k; ++i) {
        windowSum += arr[i];
      }
      result.push_back(windowSum);

      // Slide the window and update the sum
      for (int i = k; i < arr.size(); ++i) {
        windowSum += arr[i] - arr[i - k];
        result.push_back(windowSum);
      }

      return result;
    }`,

    python: `def sliding_window(arr, k):
      result = []
      window_sum = sum(arr[:k])
      result.append(window_sum)

      for i in range(k, len(arr)):
          window_sum += arr[i] - arr[i - k]
          result.append(window_sum)

      return result`,

    java: `public class SlidingWindow {
      public int[] slidingWindow(int[] arr, int k) {
          int[] result = new int[arr.length - k + 1];
          int windowSum = 0;
            
            for (int i = 0; i < k; i++) {
                windowSum += arr[i];
            }
            result[0] = windowSum;
            
            for (int i = k; i < arr.length; i++) {
                windowSum += arr[i] - arr[i - k];
                result[i - k + 1] = windowSum;
            }
            return result;
        }
    }`,

    javascript: `function slidingWindow(arr, k) {
      let result = [];
      let sum = 0;

      // Sum the first window
      for (let i = 0; i < k; i++) {
        sum += arr[i];
      }
      result.push(sum);

      // Move the window and calculate the sum for subsequent windows
      for (let i = k; i < arr.length; i++) {
        sum = sum - arr[i - k] + arr[i];
        result.push(sum);
      }

      return result;
    }`,
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

        {/* Copy Button - Now just an icon */}
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
