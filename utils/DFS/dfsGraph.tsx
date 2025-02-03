import { Check, Copy } from 'lucide-react';
import React from 'react';
import { useState } from 'react';
import { SiLeetcode } from 'react-icons/si';


export const Theory = () => {
    const nodes = [
        { id: 1, x: 250, y: 50 },   // Root
        { id: 2, x: 150, y: 125 },  // Left child
        { id: 3, x: 350, y: 125 },  // Right child
        { id: 4, x: 75, y: 200 },   // Left grandchild 1
        { id: 5, x: 175, y: 200 },  // Left grandchild 2
        { id: 6, x: 275, y: 200 },  // Right grandchild 1
        { id: 7, x: 425, y: 200 },  // Right grandchild 2
        { id: 8, x: 175, y: 275 },  // Great-grandchild
    ];

    const edges = [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
        { from: 3, to: 6 },
        { from: 3, to: 7 },
        { from: 5, to: 8 },
        { from: 6, to: 8 },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Theory: Depth First Search (DFS) in Graphs</h2>

            <div>
                <p className="mb-4">
                    Depth First Search (DFS) is a graph traversal algorithm that explores as far as possible along each branch
                    before backtracking. Unlike BFS, it uses a stack (or recursion) to track nodes to visit, prioritizing
                    depth over breadth. DFS also requires tracking visited nodes to prevent cycles in the graph.
                </p>

                <h3 className="text-xl font-semibold mb-2">Key Concepts:</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Stack/Recursion: Uses a stack or recursive calls to track the path of exploration</li>
                    <li>Visited Set: Maintains a set of visited vertices to avoid cycles</li>
                    <li>Backtracking: When reaching a dead end, backtracks to the most recent node with unexplored paths</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2">Example Graph Structure:</h3>
                <svg viewBox="0 0 500 300" className="w-full h-64 bg-gray-50">
                    {edges.map(edge => (
                        <line
                            key={`${edge.from}-${edge.to}`}
                            x1={nodes.find(n => n.id === edge.from)?.x ?? 0}
                            y1={nodes.find(n => n.id === edge.from)?.y ?? 0}
                            x2={nodes.find(n => n.id === edge.to)?.x ?? 0}
                            y2={nodes.find(n => n.id === edge.to)?.y ?? 0}
                            stroke="gray"
                            strokeWidth="2"
                        />
                    ))}
                    {nodes.map(node => (
                        <g key={node.id}>
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r="20"
                                fill="white"
                                stroke="blue"
                                strokeWidth="2"
                            />
                            <text
                                x={node.x}
                                y={node.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="black"
                                fontSize="14"
                            >
                                {node.id}
                            </text>
                        </g>
                    ))}
                </svg>

                <h3 className="text-xl font-semibold mb-2">DFS Traversal Steps (starting from node 1):</h3>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>Visit node 1</li>
                    <li>Visit node 2 (first child)</li>
                    <li>Visit node 4 (left path to completion)</li>
                    <li>Backtrack to 2, visit node 5</li>
                    <li>Visit node 8 (complete left subtree)</li>
                    <li>Backtrack to 1, visit node 3</li>
                    <li>Visit node 6 (skip node 8 as already visited)</li>
                    <li>Visit node 7 (complete right subtree)</li>
                </ol>

                <div className="p-4 rounded-md mb-4">
                    <p className="font-semibold">DFS Path Exploration:</p>
                    <p>Path 1: 1 → 2 → 4 (backtrack)</p>
                    <p>Path 2: 2 → 5 → 8 (backtrack to 1)</p>
                    <p>Path 3: 1 → 3 → 6 (skip 8, already visited)</p>
                    <p>Path 4: 3 → 7</p>
                </div>

                <p className="font-semibold">Final DFS Traversal Output: 1 → 2 → 4 → 5 → 8 → 3 → 6 → 7</p>

                <h3 className="text-xl font-semibold mt-4 mb-2">Implementation Notes:</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li>DFS can be implemented recursively or iteratively using a stack</li>
                    <li>The traversal explores one complete path before moving to siblings</li>
                    <li>Node 8 is only visited once despite having two parents (5 and 6)</li>
                    <li>The order of traversal depends on which neighbor is chosen first (left or right)</li>
                </ul>
            </div>
        </div>
    );
};

export const CodeSnippet = () => {
    const [copyStatus, setCopyStatus] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<
        "cpp" | "python" | "java" | "javascript"
    >("cpp");

    const codeImplementations: {
        [key in "cpp" | "python" | "java" | "javascript"]: string;
    } = {
        cpp: `#include <iostream>
  #include <vector>
  #include <stack>
  using namespace std;
  
  class Solution {
  public:
      vector<int> dfsOfGraph(int V, vector<int> adj[]) {
          vector<int> dfs;
          vector<int> vis(V, 0);
          stack<int> s;
          s.push(0); // Start DFS from node 0
          vis[0] = 1;
  
          while (!s.empty()) {
              int node = s.top();
              s.pop();
              dfs.push_back(node);
  
              for (auto it : adj[node]) {
                  if (!vis[it]) {
                      vis[it] = 1;
                      s.push(it);
                  }
              }
          }
          return dfs;
      }
  };
  
  void addEdge(vector<int> adj[], int u, int v) {
      adj[u].push_back(v);
      adj[v].push_back(u); // Undirected graph
  }
  
  int main() {
      int V = 5;
      vector<int> adj[V];
  
      // 0 based indexing
      addEdge(adj, 0, 1);
      addEdge(adj, 0, 4);
      addEdge(adj, 1, 2);
      addEdge(adj, 1, 3);
      addEdge(adj, 1, 4);
      addEdge(adj, 2, 3);
      addEdge(adj, 3, 4);
  
      Solution obj;
      vector<int> result = obj.dfsOfGraph(V, adj);
  
      for (int node : result) {
          cout << node << " ";
      }
      return 0;
  }
  `,

        python: `from collections import deque
  
  class Solution:
      def dfsOfGraph(self, V, adj):
          dfs = []
          visited = [0] * V
          stack = [0]  # Start DFS from node 0
          visited[0] = 1
  
          while stack:
              node = stack.pop()
              dfs.append(node)
  
              for neighbor in adj[node]:
                  if not visited[neighbor]:
                      visited[neighbor] = 1
                      stack.append(neighbor)
  
          return dfs
  
  # Example Usage
  V = 5
  adj = {0: [1, 4], 1: [0, 2, 3, 4], 2: [1, 3], 3: [1, 2, 4], 4: [0, 1, 3]}
  
  solution = Solution()
  print(solution.dfsOfGraph(V, adj))
  `,

        java: `import java.util.*;
  
  class Solution {
      public List<Integer> dfsOfGraph(int V, List<List<Integer>> adj) {
          List<Integer> dfs = new ArrayList<>();
          boolean[] visited = new boolean[V];
          Stack<Integer> stack = new Stack<>();
  
          stack.push(0); // Start DFS from node 0
          visited[0] = true;
  
          while (!stack.isEmpty()) {
              int node = stack.pop();
              dfs.add(node);
  
              for (int neighbor : adj.get(node)) {
                  if (!visited[neighbor]) {
                      visited[neighbor] = true;
                      stack.push(neighbor);
                  }
              }
          }
          return dfs;
      }
  
      public static void main(String[] args) {
          int V = 5;
          List<List<Integer>> adj = new ArrayList<>();
          for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
  
          adj.get(0).addAll(Arrays.asList(1, 4));
          adj.get(1).addAll(Arrays.asList(0, 2, 3, 4));
          adj.get(2).addAll(Arrays.asList(1, 3));
          adj.get(3).addAll(Arrays.asList(1, 2, 4));
          adj.get(4).addAll(Arrays.asList(0, 1, 3));
  
          Solution solution = new Solution();
          System.out.println(solution.dfsOfGraph(V, adj));
      }
  }
  `,

        javascript: `class Solution {
      dfsOfGraph(V, adj) {
          let dfs = [];
          let visited = new Array(V).fill(false);
          let stack = [0]; // Start DFS from node 0
          visited[0] = true;
  
          while (stack.length > 0) {
              let node = stack.pop();
              dfs.push(node);
  
              for (let neighbor of adj[node]) {
                  if (!visited[neighbor]) {
                      visited[neighbor] = true;
                      stack.push(neighbor);
                  }
              }
          }
          return dfs;
      }
  }
  
  // Example Usage
  const V = 5;
  const adj = {
      0: [1, 4],
      1: [0, 2, 3, 4],
      2: [1, 3],
      3: [1, 2, 4],
      4: [0, 1, 3]
  };
  
  const solution = new Solution();
  console.log(solution.dfsOfGraph(V, adj));
  `
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
                            onClick={() =>
                                setSelectedLanguage(lang as "cpp" | "python" | "java" | "javascript")
                            }
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${selectedLanguage === lang
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
                        href="https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1"
                        className="flex items-center space-x-2 text-blue-400 transition duration-200 ease-in-out hover:text-blue-300 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <SiLeetcode className="w-5 h-5 text-orange-500 transition duration-200 ease-in-out hover:text-orange-400" />
                        <span>DFS in Graphs </span>
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
            <p><strong> For an undirected graph, O(N) + O(2E), For a directed graph, O(N) + O(E)</strong> Where n = Nodes, E is the edges. Because for every node we are calling the recursive function once, the time taken is O(N).</p>
            <h3 className="font-semibold">Space Complexity</h3>
            <p><strong>O(3n) ~ O(n)</strong></p>
        </div>
    );
};
