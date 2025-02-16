import React, { useState } from "react";
import { SiLeetcode } from "react-icons/si";
import { Copy, Check } from "lucide-react";

export const Theory = () => {
    return (
        <div className="space-y-6">
            <p>
                The <strong>Two Sum</strong> problem is one of the most common coding interview questions. The goal is to find two numbers in an array
                that add up to a given target sum.
            </p>

            <h3 className="text-xl font-semibold">Problem Statement:</h3>
            <p>
                Given an array <code>nums</code> of integers and an integer <code>target</code>, return the indices of the two numbers such that they add up to <code>target</code>.
            </p>

            <h3 className="text-xl font-semibold">Approach:</h3>
            <ol className="list-decimal list-inside space-y-2">
                <li>Use a hash map (dictionary) to store the numbers we have seen so far.</li>
                <li>For each number, calculate the complement (target - current number).</li>
                <li>Check if the complement is already in the hash map.</li>
                <li>If found, return the indices of the two numbers.</li>
                <li>If not, add the current number to the hash map.</li>
            </ol>

            <h3 className="text-xl font-semibold">Example:</h3>
            <p>Input: <code>nums = [2, 7, 11, 15], target = 9</code></p>
            <p>Output: <code>[0, 1]</code> (because <code>2 + 7 = 9</code>)</p>
        </div>
    );
};

export const CodeSnippet = () => {
    const [copyStatus, setCopyStatus] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<"cpp" | "python" | "java" | "javascript">("cpp");

    const codeImplementations: { [key in "cpp" | "python" | "java" | "javascript"]: string } = {
        cpp: 
`vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> mp;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (mp.find(complement) != mp.end()) {
            return {mp[complement], i};
        }
        mp[nums[i]] = i;
    }
    return {};
}`,
        python: 
`def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
        java: 
`public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    return new int[0];
}`,
        javascript:
`function twoSum(nums, target) {
    let seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        let complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}`
    };

    const copyToClipboard = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopyStatus(true);
            setTimeout(() => setCopyStatus(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="w-full rounded-lg border border-slate-700 bg-slate-900 overflow-hidden">
            <div className="border-b border-slate-700 p-2 bg-slate-800 flex justify-between items-center">
                <div className="flex gap-2">
                    {Object.keys(codeImplementations).map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setSelectedLanguage(lang as "cpp" | "python" | "java")}
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                                selectedLanguage === lang
                                    ? "bg-slate-900 text-slate-50"
                                    : "text-slate-400 hover:bg-slate-700"
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
                    {copyStatus ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
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

export const Practice = () => (
    <div className="space-y-4">
        <a
            href="https://leetcode.com/problems/two-sum/"
            className="flex items-center space-x-2 text-blue-400 transition duration-200 ease-in-out hover:text-blue-300 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
        >
            <SiLeetcode className="w-5 h-5 text-orange-500 transition duration-200 ease-in-out hover:text-orange-400" />
            <span>Two Sum - LeetCode</span>
        </a>
    </div>
);

export const Complexity = () => (
    <div className="space-y-4">
        <p><strong>Time Complexity:</strong> O(n)</p>
        <p><strong>Space Complexity:</strong> O(n)</p>
    </div>
);
