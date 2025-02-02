import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { SiLeetcode } from 'react-icons/si';


export const Theory = () => {
    return (
        <div className="space-y-6 p-6 max-w-3xl">
            <h2 className="text-2xl font-semibold">Theory: Postorder Traversal in a Binary Tree</h2>

            <p className="text-gray-700">
                Postorder traversal is a depth-first traversal method where we recursively visit the left subtree,
                then the right subtree, and finally visit the root node. This method is particularly useful
                in scenarios like deleting a tree or evaluating postfix expressions.
            </p>

            <div>
                <h3 className="text-xl font-semibold mb-3">Key Concepts:</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li><span className="font-semibold">Left First:</span> Recursively traverse the left subtree</li>
                    <li><span className="font-semibold">Right Second:</span> Recursively traverse the right subtree</li>
                    <li><span className="font-semibold">Root Last:</span> Visit the root node</li>
                </ul>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-3">Approach:</h3>
                <ol className="list-decimal pl-6 space-y-2">
                    <li>Start at the root node</li>
                    <li>Recursively traverse the left subtree</li>
                    <li>Recursively traverse the right subtree</li>
                    <li>Visit the current node and process its value</li>
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
                        {`Step 1: Start at root (1), traverse left
Step 2: At node 2, traverse left
Step 3: Visit 4 (no children)
Step 4: Visit 5 (right child of 2)
Step 5: Backtrack to 2, visit 2
Step 6: Move to right subtree of 1
Step 7: Visit 6 (right child of 3)
Step 8: Visit 3
Step 9: Finally, visit root (1)`}
                    </pre>
                    <p className="mt-4">
                        <span className="font-semibold">Postorder Traversal Output: </span>
                        <span className="font-mono">4 → 5 → 2 → 6 → 3 → 1</span>
                    </p>
                </div>
            </div>
        </div>
    );
};


export const CodeSnippet = () => {
    const [copyStatus, setCopyStatus] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'python' | 'java'>('cpp');

    const codeImplementations: { [key in 'cpp' | 'python' | 'java' | 'javascript']: string } = {
        cpp: `#include <iostream> 
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

void preorder(TreeNode* root) {
    if (!root) return;
    
    preorder(root->left);
    preorder(root->right);
    cout << root->val << " ";
}

int main() {
    TreeNode* root = new TreeNode(1);
    root->left = new TreeNode(2);
    root->right = new TreeNode(3);
    root->left->left = new TreeNode(4);
    root->left->right = new TreeNode(5);
    root->right->right = new TreeNode(6);
    
    preorder(root);
    return 0;
}`,
        python: `class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

def preorder(root):
    if not root:
        return
    
    preorder(root.left)
    preorder(root.right)
    print(root.val, end=' ')

root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)
root.right.right = TreeNode(6)

preorder(root)`,
        java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; left = null; right = null; }
}

public class PreorderTraversal {
    public static void preorder(TreeNode root) {
        if (root == null) return;
        
        preorder(root.left);
        preorder(root.right);
        System.out.print(root.val + " ");
    }
    
    public static void main(String[] args) {
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.left.left = new TreeNode(4);
        root.left.right = new TreeNode(5);
        root.right.right = new TreeNode(6);
        
        preorder(root);
    }
}`,
        javascript:
        `class TreeNode {
    constructor(x) {
        this.val = x;
        this.left = null;
        this.right = null;
    }
}

function postorder(root) {
    if (!root) return;
    
    postorder(root.left);
    postorder(root.right);
    console.log(root.val);
}

let root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
root.right.right = new TreeNode(6);

postorder(root);
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
                        href="https://leetcode.com/problems/binary-tree-postorder-traversal/description/"
                        className="flex items-center space-x-2 text-blue-400 transition duration-200 ease-in-out hover:text-blue-300 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <SiLeetcode className="w-5 h-5 text-orange-500 transition duration-200 ease-in-out hover:text-orange-400" />
                        <span>Binary Tree Postorder Traversal</span>
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
            <p><strong>O(n)</strong> - Where n is the number of nodes in the binary tree</p>
            <h3 className="font-semibold">Space Complexity</h3>
            <p><strong>O(h)</strong> - h is the height of the tree (O(n) in worst case for skewed trees)</p>
        </div>
    );
};
