import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { SiLeetcode } from 'react-icons/si';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const Theory = () => {
    const [expandedSection, setExpandedSection] = useState<string | null>('overview');

    const sections = {
        overview: {
            title: "Overview",
            content: `The HashMap approach for counting the frequency of elements in an array is highly efficient. By using a HashMap (or Hash Table), we can store the frequency of each unique element while traversing the array once. The time complexity for inserting and updating elements in a HashMap is generally O(1), making this approach much faster than brute force methods.

Time Complexity: O(n)
Space Complexity: O(n)`
        },
        prerequisites: {
            title: "Prerequisites",
            content: `1. Understanding of HashMaps (or Hash Tables)
2. Basic knowledge of arrays
3. Familiarity with key-value pairs and their usage`
        },
        algorithm: {
            title: "Algorithm Steps",
            content: `1. Initialize an empty HashMap (or object in JavaScript).
2. Traverse the array and for each element:
   - Check if the element is already present in the HashMap.
   - If it is, increment its value by 1.
   - If it is not, add the element to the HashMap with a value of 1.
3. At the end of the iteration, the HashMap will contain the frequency of all elements.`
        },
        implementation: {
            title: "Code Implementation",
            content: `Key points in the implementation:

1. We use a HashMap (or object) to store the frequencies.
2. The array is iterated once, and each element's count is updated in constant time.
3. The algorithm works in O(n) time, where n is the size of the array.`
        },
        applications: {
            title: "Real-world Applications",
            content: `1. Counting word frequencies in text processing.
2. Finding the most common elements in large datasets.
3. Data analytics and visualization, such as word clouds.
4. Frequency-based sorting algorithms.
5. Database indexing and optimizations.`
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
                   <div className="text-slate-300 space-y-1">
                    {content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                    ))}
                    </div>
                </motion.div>
            )}
        </div>
    );

    return (
        <div className="p-6 bg-slate-900 rounded-lg shadow-xl max-w-auto mx-auto">
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
                    <li>HashMap allows us to efficiently count element frequencies.</li>
                    <li>Works in linear time, O(n), where n is the array size.</li>
                    <li>Excellent for large datasets due to its constant-time lookups.</li>
                    <li>Great for applications in text processing, data analysis, and more.</li>
                </ul>
            </div>
        </div>
    );
};

export const CodeSnippet = () => {
    const [copyStatus, setCopyStatus] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'python' | 'java'>('cpp');

    const codeImplementations: { [key in 'cpp' | 'python' | 'java' | 'javascript']: string } = {
        cpp: `#include <iostream>
#include <unordered_map>
#include <vector>
using namespace std;

class Solution {
public:
    unordered_map<int, int> countFrequency(const vector<int>& nums) {
        unordered_map<int, int> frequencyMap;
        for (int num : nums) {
            frequencyMap[num]++;
        }
        return frequencyMap;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {1, 2, 2, 3, 3, 3, 4};
    unordered_map<int, int> result = sol.countFrequency(nums);
    
    for (const auto& pair : result) {
        cout << pair.first << ": " << pair.second << endl;
    }
}
`,
        python: `class Solution:
    def countFrequency(self, nums):
        frequency_map = {}
        for num in nums:
            if num in frequency_map:
                frequency_map[num] += 1
            else:
                frequency_map[num] = 1
        return frequency_map

# Example usage:
sol = Solution()
nums = [1, 2, 2, 3, 3, 3, 4]
result = sol.countFrequency(nums)

for key, value in result.items():
    print(f"{key}: {value}")
`,
        java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public Map<Integer, Integer> countFrequency(int[] nums) {
        Map<Integer, Integer> frequencyMap = new HashMap<>();
        for (int num : nums) {
            frequencyMap.put(num, frequencyMap.getOrDefault(num, 0) + 1);
        }
        return frequencyMap;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] nums = {1, 2, 2, 3, 3, 3, 4};
        Map<Integer, Integer> result = sol.countFrequency(nums);

        for (Map.Entry<Integer, Integer> entry : result.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}
`,
        javascript: `class Solution {
    countFrequency(nums) {
        const frequencyMap = {};
        for (let num of nums) {
            frequencyMap[num] = (frequencyMap[num] || 0) + 1;
        }
        return frequencyMap;
    }
}

// Example usage:
const sol = new Solution();
const nums = [1, 2, 2, 3, 3, 3, 4];
const result = sol.countFrequency(nums);

for (const [key, value] of Object.entries(result)) {
    console.log(\`\${key}: \${value}\`);
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
                        href="https://leetcode.com/problems/top-k-frequent-elements/"
                        className="flex items-center space-x-2 text-blue-400 transition duration-200 ease-in-out hover:text-blue-300 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <SiLeetcode className="w-5 h-5 text-orange-500 transition duration-200 ease-in-out hover:text-orange-400" />
                        <span>Top K Frequent Elements</span>
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
                <p><strong>- O(n) where n is the number of elements in the array.</strong></p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">Space Complexity</h3>
                <p><strong>- O(n) due to the HashMap storing the frequencies of all elements.</strong></p>
            </div>
        </div>
    );
};
