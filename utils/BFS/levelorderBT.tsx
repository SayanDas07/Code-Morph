import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { SiLeetcode } from 'react-icons/si';


export const Theory = () => {
    return (
        <div className="space-y-6 p-6 max-w-3xl">
            <h2 className="text-2xl font-semibold">Theory: Level Order Traversal in a Binary Tree</h2>

            <p className="text-gray-700">
                Level order traversal, also known as breadth-first traversal, visits nodes level by level
                from left to right. This method uses a queue to keep track of nodes and their children,
                making it useful for tasks like finding the minimum depth of a tree or serializing it.
            </p>

            <div>
                <h3 className="text-xl font-semibold mb-3">Key Concepts:</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li><span className="font-semibold">Queue Usage:</span> Utilize a queue to track nodes to visit</li>
                    <li><span className="font-semibold">Level Processing:</span> Process all nodes at current level</li>
                    <li><span className="font-semibold">Child Queueing:</span> Add left and right children to queue</li>
                </ul>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-3">Approach:</h3>
                <ol className="list-decimal pl-6 space-y-2">
                    <li>Create a queue and add root node</li>
                    <li>While queue is not empty:</li>
                    <li>Remove front node and process it</li>
                    <li>Add left child to queue if exists</li>
                    <li>Add right child to queue if exists</li>
                </ol>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Example:</h3>
                <div className="space-y-2">
                    <h4 className="text-lg font-semibold">Binary Tree:</h4>
                    <pre className="bg-gray-800 text-white p-4 rounded-lg font-mono leading-relaxed">
                        {`    1
   / \\
  2   3
 / \\   \\
4   5   6`}</pre>

                    <h3 className="text-xl font-semibold">Dry Run:</h3>
                    <pre className="p-3 bg-gray-800 text-white rounded-md">
                        {`Step 1: Visit 1, add 2,3 to queue
Step 2: Visit 2, add 4,5 to queue
Step 3: Visit 3, add 6 to queue
Step 4: Visit 4
Step 5: Visit 5
Step 6: Visit 6`}
                    </pre>
                    <p className="mt-4">
                        <span className="font-semibold">Level Order Traversal Output: </span>
                        <span className="font-mono">1 → 2 → 3 → 4 → 5 → 6</span>
                    </p>
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
#include <vector>
#include <queue>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> ans;
        if (root == NULL) return ans;

        queue<TreeNode*> q;
        q.push(root);

        while (!q.empty()) {
            vector<int> l;
            int size = q.size();

            for (int i = 0; i < size; i++) {
                TreeNode* node = q.front();
                q.pop();

                if (node->left != NULL) q.push(node->left);
                if (node->right != NULL) q.push(node->right);

                l.push_back(node->val);
            }
            ans.push_back(l);
        }

        return ans;
    }
};

int main() {
    // Creating the binary tree
    TreeNode* root = new TreeNode(1);
    root->left = new TreeNode(2);
    root->right = new TreeNode(3);
    root->left->left = new TreeNode(4);
    root->left->right = new TreeNode(5);
    root->right->right = new TreeNode(6);

    Solution solution;
    vector<vector<int>> result = solution.levelOrder(root);

    // Print the result
    for (const auto& level : result) {
        for (int val : level) {
            cout << val << " ";
        }
        cout << endl;
    }

    return 0;
}
`,
        python: `from collections import deque

class TreeNode:
    def __init__(self, x=0, left=None, right=None):
        self.val = x
        self.left = left
        self.right = right

class Solution:
    def levelOrder(self, root: TreeNode):
        ans = []
        if not root:
            return ans

        q = deque([root])

        while q:
            level = []
            size = len(q)

            for _ in range(size):
                node = q.popleft()

                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)

                level.append(node.val)

            ans.append(level)

        return ans

# Example usage:
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)
root.right.right = TreeNode(6)

solution = Solution()
result = solution.levelOrder(root)

# Print the result
for level in result:
    print(level)
`,
        java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode() { this.val = 0; this.left = this.right = null; }
    TreeNode(int x) { this.val = x; this.left = this.right = null; }
    TreeNode(int x, TreeNode left, TreeNode right) { this.val = x; this.left = left; this.right = right; }
}

public class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> ans = new ArrayList<>();
        if (root == null) return ans;

        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);

        while (!q.isEmpty()) {
            List<Integer> level = new ArrayList<>();
            int size = q.size();

            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();

                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);

                level.add(node.val);
            }
            ans.add(level);
        }

        return ans;
    }

    public static void main(String[] args) {
        // Creating the binary tree
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.left.left = new TreeNode(4);
        root.left.right = new TreeNode(5);
        root.right.right = new TreeNode(6);

        Solution solution = new Solution();
        List<List<Integer>> result = solution.levelOrder(root);

        // Print the result
        for (List<Integer> level : result) {
            for (int val : level) {
                System.out.print(val + " ");
            }
            System.out.println();
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
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${selectedLanguage === lang ? 'bg-slate-900 text-slate-50' : 'text-slate-400 hover:bg-slate-700'}`}
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
                    {copyStatus ? (<Check className="w-5 h-5 text-green-400" />) : (<Copy className="w-5 h-5" />)}
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
                        href="https://leetcode.com/problems/binary-tree-level-order-traversal/description/"
                        className="flex items-center space-x-2 text-blue-400 transition duration-200 ease-in-out hover:text-blue-300 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <SiLeetcode className="w-5 h-5 text-orange-500 transition duration-200 ease-in-out hover:text-orange-400" />
                        <span>Binary Tree Levelorder Traversal</span>
                    </a>
                </li>
            </ul>
        </div>
    );
};

export const Complexity = () => {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold">Time Complexity</h3>
            <p><strong>O(n)</strong> - Where n is the number of nodes in the binary tree. Each node is visited once in the level order traversal.</p>
            <h3 className="font-semibold">Space Complexity</h3>
            <p><strong>O(n)</strong> - The space complexity is O(n) because in the worst case, all the nodes could be stored in the queue (for example, at the last level of a complete binary tree).</p>
        </div>
    );
};
