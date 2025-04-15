"use client";
import { useState } from "react";
import { Check, Copy } from 'lucide-react';

import { SiLeetcode } from 'react-icons/si';


export const Theory = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Theory: Finding the Middle Node in a Linked List</h2>

      <p>
        The <strong>Tortoise and Hare Algorithm</strong> is a powerful and efficient method for finding the middle node of a singly linked list.
        This algorithm uses two pointers, one moving slowly and the other moving quickly through the list. By the time the fast pointer reaches the end, the slow pointer will be at the middle node.
        This technique works for both <strong>odd</strong> and <strong>even</strong> sized lists.
      </p>

      <h3 className="text-xl font-semibold">Key Concepts:</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>Slow Pointer (Tortoise):</strong> Moves <em>one step</em> at a time.
        </li>
        <li>
          <strong>Fast Pointer (Hare):</strong> Moves <em>two steps</em> at a time.
        </li>
        <li>
          If there is a cycle in the list, the two pointers will eventually meet.
        </li>
        <li>
          When the fast pointer reaches the end of the list, the slow pointer will be at the middle node.
        </li>
      </ul>

      <h3 className="text-xl font-semibold">How it Works:</h3>
      <p>
        - In an <strong>odd-sized list</strong>, the slow pointer will stop at the exact middle node. For example, in a list of length 5, the middle node is the 3rd node.
      </p>
      <p>
        - In an <strong>even-sized list</strong>, the slow pointer will point to the second middle node. For example, in a list of length 6, the middle nodes are the 3rd and 4th nodes. The slow pointer will end up at the 4th node.
      </p>

      <h3 className="text-xl font-semibold">Approach:</h3>
      <ol className="list-decimal list-inside space-y-2">
        <li>Initialize two pointers: <strong>slow</strong> and <strong>fast</strong>, both starting at the head of the linked list.</li>
        <li>The <strong>slow</strong> pointer moves one step at a time, while the <strong>fast</strong> pointer moves two steps at a time.</li>
        <li>Continue moving the pointers until the <strong>fast</strong> pointer reaches the end of the list.</li>
        <li>At this point, the <strong>slow</strong> pointer will be at the middle of the list, regardless of whether the list size is even or odd.</li>
      </ol>

      <h3 className="text-xl font-semibold">Examples:</h3>

      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold">Example 1: Odd-Sized Linked List (1 → 2 → 3 → 4 → 5 → 6 → 7)</h4>
          <p>
            - Start with both <strong>slow</strong> and <strong>fast</strong> pointers at node <strong>1</strong>.
          </p>
          <p>
            - Move <strong>slow</strong> to node <strong>2</strong> and <strong>fast</strong> to node <strong>3</strong>.
          </p>
          <p>
            - Move <strong>slow</strong> to node <strong>3</strong> and <strong>fast</strong> to node <strong>5</strong>.
          </p>
          <p>
            - Move <strong>slow</strong> to node <strong>4</strong> and <strong>fast</strong> to node <strong>7</strong>.
          </p>
          <p>
            - The <strong>fast</strong> pointer has reached the end of the list, so the <strong>slow</strong> pointer stops at node <strong>4</strong>, which is the middle node.
          </p>
          <p className="p-3 rounded-md">
            <strong>Result:</strong> The middle node is <strong>4</strong>.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold">Example 2: Even-Sized Linked List (1 → 2 → 3 → 4 → 5 → 6)</h4>
          <p>
            - Start with both <strong>slow</strong> and <strong>fast</strong> pointers at node <strong>1</strong>.
          </p>
          <p>
            - Move <strong>slow</strong> to node <strong>2</strong> and <strong>fast</strong> to node <strong>3</strong>.
          </p>
          <p>
            - Move <strong>slow</strong> to node <strong>3</strong> and <strong>fast</strong> to node <strong>5</strong>.
          </p>
          <p>
            - Move <strong>slow</strong> to node <strong>4</strong> and <strong>fast</strong> to <strong>null</strong> (end of the list).
          </p>
          <p>
            - The <strong>fast</strong> pointer has reached the end of the list, so the <strong>slow</strong> pointer stops at node <strong>4</strong>, which is the second middle node.
          </p>
          <p className="p-3 rounded-md">
            <strong>Result:</strong> The middle node is <strong>4</strong> (second middle node in an even-sized list).
          </p>
        </div>
      </div>
    </div>
  );
};



export const CodeSnippet = () => {
  const [copyStatus, setCopyStatus] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('cpp');

  const codeImplementations: { [key: string]: string } = {
    cpp: `#include <iostream>
using namespace std;

// Definition for singly-linked list.
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* middleNode(ListNode* head) {
        ListNode *slow = head;
        ListNode *fast = head;

        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
        }

        return slow;
    }
};

// Utility function to create and print a linked list
void printList(ListNode* head) {
    while (head) {
        cout << head->val << " -> ";
        head = head->next;
    }
    cout << "NULL\n";
}

int main() {
    // Example: 1 -> 2 -> 3 -> 4 -> 5
    ListNode* head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));
    
    Solution sol;
    ListNode* middle = sol.middleNode(head);

    cout << "Middle Node: " << middle->val << endl;
    return 0;
}
`,
    python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def middleNode(self, head: ListNode) -> ListNode:
        slow = fast = head

        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next

        return slow

# Utility function to print linked list
def printList(head):
    while head:
        print(head.val, end=" -> ")
        head = head.next
    print("NULL")

# Example: 1 -> 2 -> 3 -> 4 -> 5
head = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))

sol = Solution()
middle = sol.middleNode(head)

print("Middle Node:", middle.val)
`,
    java: `// Definition for singly-linked list.
class ListNode {
    int val;
    ListNode next;
    ListNode() { this.val = 0; this.next = null; }
    ListNode(int val) { this.val = val; this.next = null; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode middleNode(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        return slow;
    }

    // Utility function to print linked list
    public static void printList(ListNode head) {
        while (head != null) {
            System.out.print(head.val + " -> ");
            head = head.next;
        }
        System.out.println("NULL");
    }

    public static void main(String[] args) {
        // Example: 1 -> 2 -> 3 -> 4 -> 5
        ListNode head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));

        Solution sol = new Solution();
        ListNode middle = sol.middleNode(head);

        System.out.println("Middle Node: " + middle.val);
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
      <p>Practice these problems to master the algorithm:</p>
      <ul className="space-y-2">
        <li>
          <a
            href="https://leetcode.com/problems/middle-of-the-linked-list/"
            className="flex items-center space-x-2 text-blue-400 transition duration-200 ease-in-out hover:text-blue-300 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiLeetcode className="w-5 h-5 text-orange-500 transition duration-200 ease-in-out hover:text-orange-400" />
            <span>Middle of the Linked List</span>
          </a>
        </li>
      </ul>
    </div>
  );

}




export const Complexity = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-semibold">Time Complexity</h3>
        <p><strong>O(n)</strong> - Each node is visited at most twice.</p>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">Space Complexity</h3>
        <p><strong>O(1)</strong> - Uses only two pointers regardless of input size.</p>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">Advantages</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Constant extra space</li>


        </ul>
      </div>
    </div>
  );
}