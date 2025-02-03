import { Check, Copy } from 'lucide-react';
import React from 'react';
import { useState } from 'react';
import { SiLeetcode } from 'react-icons/si';


export const Theory = () => {
    const nodes = [
        { id: 1, x: 250, y: 50 },
        { id: 2, x: 150, y: 100 },
        { id: 3, x: 350, y: 100 },
        { id: 4, x: 100, y: 175 },
        { id: 5, x: 200, y: 175 },
        { id: 6, x: 300, y: 175 },
        { id: 7, x: 400, y: 175 },
        { id: 8, x: 200, y: 250 },
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
            <h2 className="text-2xl font-bold">Theory: Breadth First Search (BFS) in Graphs</h2>

            <div>
                <p className="mb-4">
                    Breadth First Search (BFS) is a graph traversal algorithm that explores all vertices at the present depth
                    before moving on to vertices at the next depth level. Like level order traversal in trees, it uses a queue
                    to keep track of nodes to visit, but also needs to track visited nodes to prevent cycles.
                </p>

                <h3 className="text-xl font-semibold mb-2">Key Concepts:</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Queue Management: Uses a queue to track vertices to visit next</li>
                    <li>Visited Set: Maintains a set of visited vertices to avoid cycles</li>
                    <li>Layer Exploration: Explores all neighbors before moving to next depth</li>
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

                <h3 className="text-xl font-semibold mb-2">BFS Traversal Steps (starting from node 1):</h3>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>Visit node 1</li>
                    <li>Add neighbors 2 and 3 to queue</li>
                    <li>Visit node 2, add neighbors 4 and 5 to queue</li>
                    <li>Visit node 3, add neighbors 6 and 7 to queue</li>
                    <li>Visit node 4</li>
                    <li>Visit node 5, add neighbor 8 to queue</li>
                    <li>Visit node 6, add neighbor 8 to queue (8 already in queue, so skip)</li>
                    <li>Visit node 7</li>
                    <li>Visit node 8</li>
                </ol>

                <div className="p-4 rounded-md mb-4">
                    <p className="font-semibold">BFS Level-by-Level Traversal:</p>
                    <p>Level 0: 1</p>
                    <p>Level 1: 2 → 3</p>
                    <p>Level 2: 4 → 5 → 6 → 7</p>
                    <p>Level 3: 8</p>
                </div>

                <p className="font-semibold">Final BFS Traversal Output: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8</p>

                <h3 className="text-xl font-semibold mt-4 mb-2">Implementation Notes:</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Each node has at most two children, similar to a binary tree, but the graph structure is more flexible</li>
                    <li>Node 8 has multiple parents (nodes 5 and 6), showing the graph nature of the structure</li>
                    <li>The traversal ensures we visit all nodes at one level before moving to the next level</li>
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
  #include <queue>
  using namespace std;
  
  class Solution {
  public:
      vector<int> bfsOfGraph(int V, vector<int> adj[]) {
          vector<int> bfs;
          vector<int> vis(V, 0);
  
          queue<int> q;
          q.push(0); // Start BFS from node 0
          vis[0] = 1;
  
          while (!q.empty()) {
              int node = q.front();
              q.pop();
              bfs.push_back(node);
  
              for (auto it : adj[node]) {
                  if (!vis[it]) {
                      vis[it] = 1;
                      q.push(it);
                  }
              }
          }
          return bfs;
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
      vector<int> result = obj.bfsOfGraph(V, adj);
  
      for (int node : result) {
          cout << node << " ";
      }
      return 0;
  }
  `,

        python: `from collections import deque
  
  class Solution:
      def bfsOfGraph(self, V, adj):
          bfs = []
          visited = [0] * V
          queue = deque([0])  # Start BFS from node 0
          visited[0] = 1
  
          while queue:
              node = queue.popleft()
              bfs.append(node)
  
              for neighbor in adj[node]:
                  if not visited[neighbor]:
                      visited[neighbor] = 1
                      queue.append(neighbor)
  
          return bfs
  
  # Example Usage
  V = 5
  adj = {0: [1, 4], 1: [0, 2, 3, 4], 2: [1, 3], 3: [1, 2, 4], 4: [0, 1, 3]}
  
  solution = Solution()
  print(solution.bfsOfGraph(V, adj))
  `,

        java: `import java.util.*;
  
  class Solution {
      public List<Integer> bfsOfGraph(int V, List<List<Integer>> adj) {
          List<Integer> bfs = new ArrayList<>();
          boolean[] visited = new boolean[V];
          Queue<Integer> queue = new LinkedList<>();
  
          queue.offer(0); // Start BFS from node 0
          visited[0] = true;
  
          while (!queue.isEmpty()) {
              int node = queue.poll();
              bfs.add(node);
  
              for (int neighbor : adj.get(node)) {
                  if (!visited[neighbor]) {
                      visited[neighbor] = true;
                      queue.offer(neighbor);
                  }
              }
          }
          return bfs;
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
          System.out.println(solution.bfsOfGraph(V, adj));
      }
  }
  `,

        javascript: `class Solution {
      bfsOfGraph(V, adj) {
          let bfs = [];
          let visited = new Array(V).fill(false);
          let queue = [0]; // Start BFS from node 0
          visited[0] = true;
  
          while (queue.length > 0) {
              let node = queue.shift();
              bfs.push(node);
  
              for (let neighbor of adj[node]) {
                  if (!visited[neighbor]) {
                      visited[neighbor] = true;
                      queue.push(neighbor);
                  }
              }
          }
          return bfs;
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
  console.log(solution.bfsOfGraph(V, adj));
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
                        href="https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1"
                        className="flex items-center space-x-2 text-blue-400 transition duration-200 ease-in-out hover:text-blue-300 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <SiLeetcode className="w-5 h-5 text-orange-500 transition duration-200 ease-in-out hover:text-orange-400" />
                        <span>BFS in Graphs </span>
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
            <p><strong>O(n) + O(2E)</strong> Where n = Nodes, 2E is for total degrees as we traverse all adjacent nodes.</p>
            <h3 className="font-semibold">Space Complexity</h3>
            <p><strong>O(3n) ~ O(n)</strong></p>
        </div>
    );
};
