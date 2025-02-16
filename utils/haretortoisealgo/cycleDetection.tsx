import React from 'react';
import { useState } from "react";
import { Check, Copy } from 'lucide-react';
import { SiLeetcode } from 'react-icons/si';

export const Theory = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Theory: Detecting a Cycle in a Linked List</h2>

            <p>
                The <strong>Floyd&apos;s Cycle-Finding Algorithm</strong> (also known as Tortoise and Hare) is an elegant solution
                for detecting cycles in a linked list. The algorithm uses two pointers moving at different speeds - if they ever
                meet, it proves the existence of a cycle.
            </p>

            <h3 className="text-xl font-semibold">Key Concepts:</h3>
            <ul className="list-disc list-inside space-y-2">
                <li>
                    <strong>Slow Pointer (Tortoise):</strong> Moves <em>one step</em> at a time
                </li>
                <li>
                    <strong>Fast Pointer (Hare):</strong> Moves <em>two steps</em> at a time
                </li>
                <li>
                    If the pointers meet at any point, there is a cycle in the list
                </li>
                <li>
                    If the fast pointer reaches NULL, there is no cycle
                </li>
            </ul>

            <h3 className="text-xl font-semibold">How it Works:</h3>
            <p>
                If there&apos;s a cycle, the fast pointer will eventually catch up to the slow pointer from behind.
                This is because the fast pointer moves one step closer to the slow pointer in each iteration.
            </p>

            <h3 className="text-xl font-semibold">Approach:</h3>
            <ol className="list-decimal list-inside space-y-2">
                <li>Initialize two pointers: <strong>slow</strong> and <strong>fast</strong> at the head</li>
                <li>Move <strong>slow</strong> one step and <strong>fast</strong> two steps at a time</li>
                <li>If the pointers meet, return <strong>true</strong> (cycle exists)</li>
                <li>If fast reaches NULL, return <strong>false</strong> (no cycle)</li>
            </ol>

            <h3 className="text-xl font-semibold">Examples:</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="text-lg font-semibold">Example 1: List with Cycle</h4>
                    <p>List: 1 → 2 → 3 → 4 → 5 → 3 (cycles back)</p>
                    <div className="space-y-2">
                        <p>- Start: both pointers at node <strong>1</strong></p>
                        <p>- Step 1: slow at <strong>2</strong>, fast at <strong>3</strong></p>
                        <p>- Step 2: slow at <strong>3</strong>, fast at <strong>5</strong></p>
                        <p>- Step 3: slow at <strong>4</strong>, fast at <strong>4</strong></p>
                        <p className="p-3 rounded-md">
                            <strong>Result:</strong> Pointers meet at node <strong>4</strong> → Cycle detected!
                        </p>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-semibold">Example 2: List without Cycle</h4>
                    <p>List: 1 → 2 → 3 → 4 → null</p>
                    <div className="space-y-2">
                        <p>- Start: both pointers at node <strong>1</strong></p>
                        <p>- Step 1: slow at <strong>2</strong>, fast at <strong>3</strong></p>
                        <p>- Step 2: slow at <strong>3</strong>, fast reaches <strong>null</strong></p>
                        <p className=" p-3 rounded-md">
                            <strong>Result:</strong> Fast pointer reached null → No cycle!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const CodeSnippet = () => {
    const [copyStatus, setCopyStatus] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'python' | 'java'>('cpp');

    const codeImplementations: { [key in 'cpp' | 'python' | 'java']: string } = {
        cpp: `#include <iostream>
using namespace std;

/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

class Solution {
public:
    bool hasCycle(ListNode *head) {
        ListNode *slow = head;
        ListNode *fast = head;

        while (fast != NULL && fast->next != NULL) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true; // Cycle detected
        }

        return false; // No cycle
    }
};

int main() {
    // Example linked list: 1 -> 2 -> 3 -> 4 -> 5
    ListNode *head = new ListNode(1);
    head->next = new ListNode(2);
    head->next->next = new ListNode(3);
    head->next->next->next = new ListNode(4);
    head->next->next->next->next = new ListNode(5);

    // Creating a cycle: 5 -> 3
    head->next->next->next->next->next = head->next->next;

    Solution solution;
    if (solution.hasCycle(head)) {
        cout << "Cycle detected!" << endl;
    } else {
        cout << "No cycle!" << endl;
    }

    return 0;
}
`,
        python: `# Definition for singly-linked list.
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def hasCycle(self, head: ListNode) -> bool:
        slow = head
        fast = head

        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow == fast:  # Cycle detected
                return True
        
        return False  # No cycle

def main():
    # Example linked list: 1 -> 2 -> 3 -> 4 -> 5
    head = ListNode(1)
    head.next = ListNode(2)
    head.next.next = ListNode(3)
    head.next.next.next = ListNode(4)
    head.next.next.next.next = ListNode(5)

    # Creating a cycle: 5 -> 3
    head.next.next.next.next.next = head.next.next

    solution = Solution()
    if solution.hasCycle(head):
        print("Cycle detected!")
    else:
        print("No cycle!")

if __name__ == "__main__":
    main()
`,
        java: `// Definition for singly-linked list.
class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; next = null; }
}

public class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) { // Cycle detected
                return true;
            }
        }

        return false; // No cycle
    }

    public static void main(String[] args) {
        // Example linked list: 1 -> 2 -> 3 -> 4 -> 5
        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        head.next.next = new ListNode(3);
        head.next.next.next = new ListNode(4);
        head.next.next.next.next = new ListNode(5);

        // Creating a cycle: 5 -> 3
        head.next.next.next.next.next = head.next.next;

        Solution solution = new Solution();
        if (solution.hasCycle(head)) {
            System.out.println("Cycle detected!");
        } else {
            System.out.println("No cycle!");
        }
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
                        href="https://leetcode.com/problems/linked-list-cycle/"
                        className="flex items-center space-x-2 text-blue-400 transition duration-200 ease-in-out hover:text-blue-300 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <SiLeetcode className="w-5 h-5 text-orange-500 transition duration-200 ease-in-out hover:text-orange-400" />
                        <span>Linked List Cycle</span>
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
                <p><strong>O(n)</strong> - Where n is the number of nodes in the linked list</p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">Space Complexity</h3>
                <p><strong>O(1)</strong> - Only two pointers are used regardless of input size</p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">Advantages</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>Constant extra space</li>
                    <li>Simple implementation</li>
                    <li>Works with any cycle position</li>
                </ul>
            </div>
        </div>
    );
};

