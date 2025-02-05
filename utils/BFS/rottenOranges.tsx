import { Check, Copy } from 'lucide-react';
import React from 'react';
import { useState } from 'react';
import { SiLeetcode } from 'react-icons/si';


export const Theory = () => {
    return (
        <div className="space-y-6 bg-navy-900 text-white p-6 rounded-lg">
            <div className="bg-navy-800 rounded-lg p-6">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-white">Problem: Rotting Oranges</h1>
                </div>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-blue-300">Problem Description</h3>
                        <p className="text-gray-300">
                            You are given an m x n grid where each cell contains one of three values:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-300">
                            <li>0 representing an empty cell</li>
                            <li>1 representing a fresh orange</li>
                            <li>2 representing a rotten orange</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-blue-300">Rules</h3>
                        <ul className="list-disc pl-6 space-y-1 text-gray-300">
                            <li>Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten</li>
                            <li>Return the minimum number of minutes that must elapse until no cell has a fresh orange</li>
                            <li>If this is impossible, return -1</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-blue-300">Solution Approach: BFS (Breadth-First Search)</h3>
                        <div className="space-y-2">
                            <p className="text-gray-300">
                                The solution uses BFS to simulate the rotting process level by level (minute by minute).
                                Here is how it works:
                            </p>

                            <h4 className="text-lg font-medium mt-4 text-blue-200">1. Initialization</h4>
                            <ul className="list-disc pl-6 space-y-1 text-gray-300">
                                <li>Create a queue to store positions of rotten oranges and their time</li>
                                <li>Count initial fresh oranges</li>
                                <li>Add all initial rotten oranges to queue with time 0</li>
                            </ul>

                            <h4 className="text-lg font-medium mt-4 text-blue-200">2. BFS Process</h4>
                            <ul className="list-disc pl-6 space-y-1 text-gray-300">
                                <li>Process oranges level by level using queue</li>
                                <li>For each rotten orange, check all 4 directions</li>
                                <li>If fresh orange found, make it rotten and add to queue</li>
                                <li>Track maximum time seen during process</li>
                            </ul>

                            <h4 className="text-lg font-medium mt-4 text-blue-200">3. Key Variables</h4>
                            <div className="bg-navy-700 p-4 rounded-md">
                                <pre className="whitespace-pre-wrap text-gray-300">
                                    {`queue<pair<pair<int, int>, int>> q;  // Stores ((row, col), time)
    int freshCount;     // Count of fresh oranges
    int rottenCount;    // Count of oranges turned rotten
    int time;          // Maximum time taken
    int dx[4], dy[4];  // Direction arrays for 4-directional movement`}
                                </pre>
                            </div>

                            <h4 className="text-lg font-medium mt-4 text-blue-200">4. Time Complexity</h4>
                            <ul className="list-disc pl-6 space-y-1 text-gray-300">
                                <li>Time Complexity: O(M × N) where M and N are grid dimensions</li>
                                <li>Space Complexity: O(M × N) for the queue in worst case</li>
                            </ul>

                            <h4 className="text-lg font-medium mt-4 text-blue-200">5. Return Value Logic</h4>
                            <ul className="list-disc pl-6 space-y-1 text-gray-300">
                                <li>If any fresh orange remains at end: return -1 (impossible)</li>
                                <li>Otherwise: return maximum time tracked during BFS</li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-blue-300">Code Breakdown</h3>
                        <div className="space-y-2">
                            <p className="text-gray-300">Key steps in the implementation:</p>
                            <ol className="list-decimal pl-6 space-y-1 text-gray-300">
                                <li>Initialize grid dimensions and queue</li>
                                <li>First pass: count fresh oranges and add rotten ones to queue</li>
                                <li>BFS: process queue, updating time and making oranges rotten</li>
                                <li>Final check: verify no fresh oranges remain</li>
                                <li>Return maximum time taken or -1 if impossible</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CodeSnippet = () => {
    const [copyStatus, setCopyStatus] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<
        "cpp" | "python" | "java"
    >("cpp");

    const codeImplementations: {
        [key in "cpp" | "python" | "java"]: string;
    } = {
        cpp: `class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        int row = grid.size();
        int col = grid[0].size();

        queue<pair<pair<int, int>, int>> q;
        vector<vector<int>> vis(row, vector<int>(col, 0)); 
        int freshCount = 0;

        for (int i = 0; i < row; i++) {
            for (int j = 0; j < col; j++) {
                if (grid[i][j] == 2) {
                    q.push({{i, j}, 0});
                    vis[i][j] = 2;
                } else if (grid[i][j] == 1) {
                    freshCount++; 
                }
            }
        }

        int time = 0;
        int dx[4] = {-1, 0, 1, 0};
        int dy[4] = {0, 1, 0, -1};

        int rottenCount = 0;

        while (!q.empty()) {
            int r = q.front().first.first;
            int c = q.front().first.second;
            int t = q.front().second;

            time = max(time, t);
            q.pop();

            for (int i = 0; i < 4; i++) {
                int nr = r + dx[i];
                int nc = c + dy[i];

                if (nr >= 0 && nr < row && nc >= 0 && nc < col && grid[nr][nc] == 1) {
                    q.push({{nr, nc}, t + 1});
                    grid[nr][nc] = 2;  
                    rottenCount++;  
                }
            }
        }

        
        for (int i = 0; i < row; i++) {
            for (int j = 0; j < col; j++) {
                if (grid[i][j] == 1) {
                    return -1;
                }
            }
        }

        return time;
    }
};
  `,

        python: `from collections import deque

class Solution:
    def orangesRotting(self, grid):
        row = len(grid)
        col = len(grid[0])

        q = deque()
        fresh_count = 0

        for i in range(row):
            for j in range(col):
                if grid[i][j] == 2:
                    q.append((i, j, 0))  # store (row, col, time)
                elif grid[i][j] == 1:
                    fresh_count += 1

        time = 0
        dx = [-1, 0, 1, 0]
        dy = [0, 1, 0, -1]
        rotten_count = 0

        while q:
            r, c, t = q.popleft()
            time = max(time, t)

            for i in range(4):
                nr, nc = r + dx[i], c + dy[i]

                if 0 <= nr < row and 0 <= nc < col and grid[nr][nc] == 1:
                    q.append((nr, nc, t + 1))
                    grid[nr][nc] = 2  # Mark as rotten
                    rotten_count += 1

        # If there are any fresh oranges left, return -1
        for i in range(row):
            for j in range(col):
                if grid[i][j] == 1:
                    return -1

        return time

  `,

        java: `import java.util.*;

class Solution {
    public int orangesRotting(int[][] grid) {
        int row = grid.length;
        int col = grid[0].length;

        Queue<int[]> q = new LinkedList<>();
        int freshCount = 0;

        for (int i = 0; i < row; i++) {
            for (int j = 0; j < col; j++) {
                if (grid[i][j] == 2) {
                    q.add(new int[]{i, j, 0});  // store {row, col, time}
                } else if (grid[i][j] == 1) {
                    freshCount++;
                }
            }
        }

        int time = 0;
        int[] dx = {-1, 0, 1, 0};
        int[] dy = {0, 1, 0, -1};
        int rottenCount = 0;

        while (!q.isEmpty()) {
            int[] curr = q.poll();
            int r = curr[0];
            int c = curr[1];
            int t = curr[2];
            time = Math.max(time, t);

            for (int i = 0; i < 4; i++) {
                int nr = r + dx[i];
                int nc = c + dy[i];

                if (nr >= 0 && nr < row && nc >= 0 && nc < col && grid[nr][nc] == 1) {
                    q.add(new int[]{nr, nc, t + 1});
                    grid[nr][nc] = 2;  // Mark as rotten
                    rottenCount++;
                }
            }
        }

        // If there are any fresh oranges left, return -1
        for (int i = 0; i < row; i++) {
            for (int j = 0; j < col; j++) {
                if (grid[i][j] == 1) {
                    return -1;
                }
            }
        }

        return time;
    }
}

  `,


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
                                setSelectedLanguage(lang as "cpp" | "python" | "java")
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
                        href="https://leetcode.com/problems/rotting-oranges/"
                        className="flex items-center space-x-2 text-blue-400 transition duration-200 ease-in-out hover:text-blue-300 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <SiLeetcode className="w-5 h-5 text-orange-500 transition duration-200 ease-in-out hover:text-orange-400" />
                        <span>Rotten Oranges</span>
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
            <p><strong>O ( n x n ) x 4   </strong> </p>
            <h3 className="font-semibold">Space Complexity</h3>
            <p><strong>O ( n x n )</strong></p>
        </div>
    );
};
