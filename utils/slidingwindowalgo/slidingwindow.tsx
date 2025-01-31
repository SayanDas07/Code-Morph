"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiLeetcode } from "react-icons/si";
import { Check } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("cpp");
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});

  const codeImplementations = {
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

  const copyToClipboard = async (code: string, language: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus({ ...copyStatus, [language]: true });
      setTimeout(() => {
        setCopyStatus({ ...copyStatus, [language]: false });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="w-full rounded-lg border border-slate-700">
      <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
  <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
    <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-700/50 p-1">
      {Object.keys(codeImplementations).map((lang) => (
       <TabsTrigger
       key={lang}
       value={lang}
       className={`ring-offset-slate-800 focus-visible:ring-slate-400 px-3 py-2 text-sm font-medium transition-all hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-lg
         ${activeTab === lang ? 'bg-blue-400 text-white border-2 border-blue-600' : 'bg-slate-700 text-slate-400'}`}
     >
       {lang.toUpperCase()}
     </TabsTrigger>
      ))}
    </TabsList>
  </div>

  <div className="relative max-h-[600px] overflow-y-auto">
    {Object.entries(codeImplementations).map(([lang, code]) => (
      <TabsContent key={lang} value={lang} className="relative m-0">
        <div className="relative bg-slate-900 p-4 rounded-lg">
          {/* Code Block */}
          <pre className="p-4 m-0 overflow-x-auto max-w-full">
            <code className="text-sm font-mono text-slate-50 whitespace-pre-wrap">
              {code}
            </code>
          </pre>


          {/* Copy Button */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={() => copyToClipboard(code, lang)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium shadow-md transition-all duration-300 flex items-center gap-2 text-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              type="button"
              aria-label="Copy code"
            >
              {copyStatus[lang] ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <span className="font-semibold">Copy</span>
              )}
            </button>
          </div>
        </div>
      </TabsContent>
    ))}
  </div>
</Tabs>
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
