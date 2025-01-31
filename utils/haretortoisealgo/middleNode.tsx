"use client";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Check } from 'lucide-react';

import { SiLeetcode } from 'react-icons/si';


export function Theory() {
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
    </div>
  );
}

export function CodeSnippet() {
  const [activeTab, setActiveTab] = useState("cpp");
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});

  const codeImplementations = {
    cpp: `#include <iostream>
          using namespace std;

          struct ListNode {
              int val;
              ListNode *next;
              ListNode() : val(0), next(nullptr) {}
              ListNode(int x) : val(x), next(nullptr) {}
              ListNode(int x, ListNode *next) : val(x), next(next) {}
          };

          class Solution {
          public:
              // Finds middle node of the linked list
              ListNode* middleNode(ListNode* head) {
                  ListNode *slow = head;
                  ListNode *fast = head;
                  while (fast != nullptr && fast->next != nullptr) {
                      slow = slow->next;
                      fast = fast->next->next;
                  }
                  return slow;
              }
              
              // Detects if there's a cycle in the linked list
              bool hasCycle(ListNode* head) {
                  ListNode *slow = head;
                  ListNode *fast = head;
                  while (fast != nullptr && fast->next != nullptr) {
                      slow = slow->next;
                      fast = fast->next->next;
                      if (slow == fast) return true;
                  }
                  return false;
              }
          };`,
    python: `class ListNode:
              def __init__(self, val=0, next=None):
                  self.val = val
                  self.next = next

          class Solution:
              def middleNode(self, head: ListNode) -> ListNode:
                  """
                  Finds the middle node of the linked list
                  Time Complexity: O(n)
                  Space Complexity: O(1)
                  """
                  slow = fast = head
                  while fast and fast.next:
                      slow = slow.next
                      fast = fast.next.next
                  return slow
              
              def hasCycle(self, head: ListNode) -> bool:
                  """
                  Detects if there's a cycle in the linked list
                  Time Complexity: O(n)
                  Space Complexity: O(1)
                  """
                  if not head or not head.next:
                      return False
                  
                  slow = fast = head
                  while fast and fast.next:
                      slow = slow.next
                      fast = fast.next.next
                      if slow == fast:
                          return True
                  return False`,
    java: `public class ListNode {
              int val;
              ListNode next;
              ListNode() {}
              ListNode(int val) { this.val = val; }
              ListNode(int val, ListNode next) { 
                  this.val = val; 
                  this.next = next;
              }
          }

          class Solution {
              /**
               * Finds the middle node of the linked list
               * Time Complexity: O(n)
               * Space Complexity: O(1)
               */
              public ListNode middleNode(ListNode head) {
                  ListNode slow = head;
                  ListNode fast = head;
                  while (fast != null && fast.next != null) {
                      slow = slow.next;
                      fast = fast.next.next;
                  }
                  return slow;
              }
              
              /**
               * Detects if there's a cycle in the linked list
               * Time Complexity: O(n)
               * Space Complexity: O(1)
               */
              public boolean hasCycle(ListNode head) {
                  if (head == null || head.next == null) {
                      return false;
                  }
                  
                  ListNode slow = head;
                  ListNode fast = head;
                  while (fast != null && fast.next != null) {
                      slow = slow.next;
                      fast = fast.next.next;
                      if (slow == fast) {
                          return true;
                      }
                  }
                  return false;
              }
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
      console.error('Failed to copy:', err);
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
                className="ring-offset-slate-800 focus-visible:ring-slate-400 data-[state=active]:bg-slate-900 data-[state=active]:text-slate-50 px-3 py-1.5 text-sm font-medium transition-all hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm"
              >
                {lang.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="relative max-h-[600px] overflow-y-auto">
          {Object.entries(codeImplementations).map(([lang, code]) => (
            <TabsContent key={lang} value={lang} className="relative m-0">
              <div className="relative bg-slate-900 p-4">

                {/* Code Block */}
                <pre className="p-4 m-0 overflow-x-auto">
                  <code className="text-sm font-mono text-slate-50 whitespace-pre">
                    {code}
                  </code>
                </pre>

                {/* Copy Button at Bottom Center */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <button
                    onClick={() => copyToClipboard(code, lang)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium shadow-md transition-all duration-300 flex items-center gap-2 text-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                    type="button"
                    aria-label="Copy code"
                  >
                    {copyStatus[lang] ? (
                      <>
                        <Check className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                        <span className="font-semibold">Copy</span>
                      </>
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
}


export function Practice() {
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




export function Complexity() {
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
          <li>Simple implementation</li>
          <li>Handles both cycle detection and middle finding</li>
        </ul>
      </div>
    </div>
  );
}