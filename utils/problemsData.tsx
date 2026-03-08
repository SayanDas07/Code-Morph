export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface ProblemData {
  id: string;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  testCases: TestCase[];
  boilerplate: Record<string, string>;
  visualizationLink?: string;
}

const problems: Record<string, ProblemData> = {
  // ── HashMap ──
  hm1: {
    id: "hm1",
    name: "Frequency of Elements",
    difficulty: "Easy",
    description:
      "Given an array of integers, return a mapping of each element to its frequency (number of occurrences) in the array. Print each element and its count on a separate line in the format `element: count`, sorted by element in ascending order.",
    constraints: [
      "1 <= arr.length <= 10^5",
      "-10^4 <= arr[i] <= 10^4",
    ],
    examples: [
      {
        input: "5\n1 2 2 3 3",
        output: "1: 1\n2: 2\n3: 2",
        explanation: "1 appears once, 2 appears twice, 3 appears twice.",
      },
    ],
    testCases: [
      { id: 1, input: "5\n1 2 2 3 3", expectedOutput: "1: 1\n2: 2\n3: 2" },
      { id: 2, input: "4\n4 4 4 4", expectedOutput: "4: 4" },
      { id: 3, input: "6\n1 1 2 2 3 3", expectedOutput: "1: 2\n2: 2\n3: 2", isHidden: true },
      { id: 4, input: "1\n7", expectedOutput: "7: 1", isHidden: true },
    ],
    boilerplate: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];

    // Write your code here

    return 0;
}`,
      python: `n = int(input())
arr = list(map(int, input().split()))

# Write your code here
`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const n = parseInt(lines[0]);
const arr = lines[1].split(' ').map(Number);

// Write your code here
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();

        // Write your code here
    }
}`,
    },
    visualizationLink: "/Hashmap/frequencymap",
  },

  hm2: {
    id: "hm2",
    name: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`. Print the two indices separated by a space (smaller index first). Each input has exactly one solution.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "Only one valid answer exists.",
    ],
    examples: [
      {
        input: "4 9\n2 7 11 15",
        output: "0 1",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9",
      },
    ],
    testCases: [
      { id: 1, input: "4 9\n2 7 11 15", expectedOutput: "0 1" },
      { id: 2, input: "3 6\n3 2 4", expectedOutput: "1 2" },
      { id: 3, input: "2 6\n3 3", expectedOutput: "0 1", isHidden: true },
      { id: 4, input: "5 10\n1 2 3 4 6", expectedOutput: "3 4", isHidden: true },
    ],
    boilerplate: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, target;
    cin >> n >> target;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // Write your code here

    return 0;
}`,
      python: `line1 = input().split()
n, target = int(line1[0]), int(line1[1])
nums = list(map(int, input().split()))

# Write your code here
`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const [n, target] = lines[0].split(' ').map(Number);
const nums = lines[1].split(' ').map(Number);

// Write your code here
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), target = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();

        // Write your code here
    }
}`,
    },
    visualizationLink: "/Hashmap/twosum",
  },

  // ── Hare and Tortoise ──
  ht1: {
    id: "ht1",
    name: "Find Middle of Linked List",
    difficulty: "Easy",
    description:
      "Given a singly linked list represented as space-separated values, find the middle node's value. If the list has an even number of nodes, return the second middle node.",
    constraints: ["1 <= number of nodes <= 10^5", "1 <= node.val <= 10^5"],
    examples: [
      {
        input: "1 2 3 4 5",
        output: "3",
        explanation: "The middle node of [1,2,3,4,5] is 3.",
      },
      {
        input: "1 2 3 4 5 6",
        output: "4",
        explanation: "For even length, return the second middle node.",
      },
    ],
    testCases: [
      { id: 1, input: "1 2 3 4 5", expectedOutput: "3" },
      { id: 2, input: "1 2 3 4 5 6", expectedOutput: "4" },
      { id: 3, input: "1", expectedOutput: "1", isHidden: true },
      { id: 4, input: "1 2", expectedOutput: "2", isHidden: true },
    ],
    boilerplate: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string line;
    getline(cin, line);
    istringstream iss(line);
    vector<int> nodes;
    int val;
    while (iss >> val) nodes.push_back(val);

    // Find the middle node value and print it
    // Write your code here

    return 0;
}`,
      python: `nodes = list(map(int, input().split()))

# Find the middle node value and print it
# Write your code here
`,
      javascript: `const nodes = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(' ').map(Number);

// Find the middle node value and print it
// Write your code here
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        int[] nodes = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nodes[i] = Integer.parseInt(parts[i]);

        // Find the middle node value and print it
        // Write your code here
    }
}`,
    },
    visualizationLink: "/haretortoisealgo/middleNode",
  },

  ht2: {
    id: "ht2",
    name: "Detect Cycle in Linked List",
    difficulty: "Medium",
    description:
      'Given a linked list represented as space-separated node values and an integer `pos` (0-indexed) indicating which node the tail connects to (-1 if no cycle), determine if the linked list has a cycle. Print "true" or "false".',
    constraints: [
      "1 <= number of nodes <= 10^4",
      "-10^5 <= node.val <= 10^5",
      "-1 <= pos < number of nodes",
    ],
    examples: [
      {
        input: "3 2 0 -4\n1",
        output: "true",
        explanation: "Tail connects to node at index 1, creating a cycle.",
      },
      {
        input: "1 2\n-1",
        output: "false",
        explanation: "No cycle in the linked list.",
      },
    ],
    testCases: [
      { id: 1, input: "3 2 0 -4\n1", expectedOutput: "true" },
      { id: 2, input: "1 2\n-1", expectedOutput: "false" },
      { id: 3, input: "1\n-1", expectedOutput: "false", isHidden: true },
      { id: 4, input: "1 2\n0", expectedOutput: "true", isHidden: true },
    ],
    boilerplate: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string line;
    getline(cin, line);
    istringstream iss(line);
    vector<int> nodes;
    int val;
    while (iss >> val) nodes.push_back(val);
    int pos;
    cin >> pos;

    // Determine if a cycle exists and print "true" or "false"
    // Write your code here

    return 0;
}`,
      python: `nodes = list(map(int, input().split()))
pos = int(input())

# Determine if a cycle exists and print "true" or "false"
# Write your code here
`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const nodes = lines[0].split(' ').map(Number);
const pos = parseInt(lines[1]);

// Determine if a cycle exists and print "true" or "false"
// Write your code here
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        int[] nodes = new int[parts.length];
        for (int i = 0; i < parts.length; i++) nodes[i] = Integer.parseInt(parts[i]);
        int pos = sc.nextInt();

        // Determine if a cycle exists and print "true" or "false"
        // Write your code here
    }
}`,
    },
    visualizationLink: "/haretortoisealgo/detectCycle",
  },

  // ── Sliding Window ──
  sw1: {
    id: "sw1",
    name: "Maximum Sum Subarray of Size K",
    difficulty: "Medium",
    description:
      "Given an array of integers and a number K, find the maximum sum of a subarray of size K.",
    constraints: [
      "1 <= K <= arr.length <= 10^5",
      "-10^4 <= arr[i] <= 10^4",
    ],
    examples: [
      {
        input: "7 3\n2 1 5 1 3 2 8",
        output: "13",
        explanation: "Subarray [3, 2, 8] has the maximum sum 13.",
      },
    ],
    testCases: [
      { id: 1, input: "7 3\n2 1 5 1 3 2 8", expectedOutput: "13" },
      { id: 2, input: "5 2\n1 2 3 4 5", expectedOutput: "9" },
      { id: 3, input: "4 4\n1 2 3 4", expectedOutput: "10", isHidden: true },
      { id: 4, input: "6 3\n-1 -2 3 4 -5 6", expectedOutput: "5", isHidden: true },
    ],
    boilerplate: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];

    // Find maximum sum subarray of size k
    // Write your code here

    return 0;
}`,
      python: `n, k = map(int, input().split())
arr = list(map(int, input().split()))

# Find maximum sum subarray of size k
# Write your code here
`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const [n, k] = lines[0].split(' ').map(Number);
const arr = lines[1].split(' ').map(Number);

// Find maximum sum subarray of size k
// Write your code here
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();

        // Find maximum sum subarray of size k
        // Write your code here
    }
}`,
    },
    visualizationLink: "/slidingwindowalgo/slidingWindow",
  },

  sw2: {
    id: "sw2",
    name: "Max Consecutive Ones After Flipping K Zeros",
    difficulty: "Medium",
    description:
      "Given a binary array and an integer K, find the maximum number of consecutive 1s in the array if you can flip at most K zeros.",
    constraints: [
      "1 <= arr.length <= 10^5",
      "arr[i] is 0 or 1",
      "0 <= K <= arr.length",
    ],
    examples: [
      {
        input: "10 2\n1 1 0 0 1 1 1 0 1 1",
        output: "7",
        explanation: "Flip zeros at index 6,7 → window of 7 consecutive ones.",
      },
    ],
    testCases: [
      { id: 1, input: "10 2\n1 1 0 0 1 1 1 0 1 1", expectedOutput: "7" },
      { id: 2, input: "5 1\n0 0 1 1 1", expectedOutput: "4" },
      { id: 3, input: "6 0\n1 1 1 0 1 1", expectedOutput: "3", isHidden: true },
      { id: 4, input: "5 5\n0 0 0 0 0", expectedOutput: "5", isHidden: true },
    ],
    boilerplate: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];

    // Find max consecutive ones after flipping at most k zeros
    // Write your code here

    return 0;
}`,
      python: `n, k = map(int, input().split())
arr = list(map(int, input().split()))

# Find max consecutive ones after flipping at most k zeros
# Write your code here
`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const [n, k] = lines[0].split(' ').map(Number);
const arr = lines[1].split(' ').map(Number);

// Find max consecutive ones after flipping at most k zeros
// Write your code here
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();

        // Find max consecutive ones after flipping at most k zeros
        // Write your code here
    }
}`,
    },
    visualizationLink: "/slidingwindowalgo/FlipKzero",
  },

  // ── DFS Traversals ──
  dfs1: {
    id: "dfs1",
    name: "Binary Tree Inorder Traversal",
    difficulty: "Easy",
    description:
      'Given a binary tree represented as a level-order array (use "null" for missing nodes), return its inorder traversal as space-separated values.',
    constraints: [
      "0 <= number of nodes <= 100",
      "-100 <= node.val <= 100",
    ],
    examples: [
      {
        input: "1 null 2 3",
        output: "1 3 2",
        explanation: "Inorder: left → root → right.",
      },
    ],
    testCases: [
      { id: 1, input: "1 null 2 3", expectedOutput: "1 3 2" },
      { id: 2, input: "1 2 3", expectedOutput: "2 1 3" },
      { id: 3, input: "1", expectedOutput: "1", isHidden: true },
      { id: 4, input: "1 2 3 4 5", expectedOutput: "4 2 5 1 3", isHidden: true },
    ],
    boilerplate: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

// Build tree from level-order input and print inorder traversal
int main() {
    string line;
    getline(cin, line);
    // Parse the level-order array and perform inorder traversal
    // Write your code here

    return 0;
}`,
      python: `nodes = input().split()

# Build tree from level-order input and print inorder traversal
# Write your code here
`,
      javascript: `const nodes = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(' ');

// Build tree from level-order input and print inorder traversal
// Write your code here
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] nodes = sc.nextLine().trim().split(" ");

        // Build tree from level-order input and print inorder traversal
        // Write your code here
    }
}`,
    },
    visualizationLink: "/DFS/inorderBT",
  },

  dfs2: {
    id: "dfs2",
    name: "Binary Tree Preorder Traversal",
    difficulty: "Easy",
    description:
      'Given a binary tree represented as a level-order array (use "null" for missing nodes), return its preorder traversal as space-separated values.',
    constraints: [
      "0 <= number of nodes <= 100",
      "-100 <= node.val <= 100",
    ],
    examples: [
      {
        input: "1 null 2 3",
        output: "1 2 3",
        explanation: "Preorder: root → left → right.",
      },
    ],
    testCases: [
      { id: 1, input: "1 null 2 3", expectedOutput: "1 2 3" },
      { id: 2, input: "1 2 3", expectedOutput: "1 2 3" },
      { id: 3, input: "1", expectedOutput: "1", isHidden: true },
      { id: 4, input: "1 2 3 4 5", expectedOutput: "1 2 4 5 3", isHidden: true },
    ],
    boilerplate: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string line;
    getline(cin, line);
    // Parse the level-order array and perform preorder traversal
    // Write your code here

    return 0;
}`,
      python: `nodes = input().split()

# Build tree from level-order input and print preorder traversal
# Write your code here
`,
      javascript: `const nodes = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(' ');

// Build tree from level-order input and print preorder traversal
// Write your code here
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] nodes = sc.nextLine().trim().split(" ");

        // Build tree from level-order input and print preorder traversal
        // Write your code here
    }
}`,
    },
    visualizationLink: "/DFS/preorderBT",
  },

  dfs3: {
    id: "dfs3",
    name: "Binary Tree Postorder Traversal",
    difficulty: "Easy",
    description:
      'Given a binary tree represented as a level-order array (use "null" for missing nodes), return its postorder traversal as space-separated values.',
    constraints: [
      "0 <= number of nodes <= 100",
      "-100 <= node.val <= 100",
    ],
    examples: [
      {
        input: "1 null 2 3",
        output: "3 2 1",
        explanation: "Postorder: left → right → root.",
      },
    ],
    testCases: [
      { id: 1, input: "1 null 2 3", expectedOutput: "3 2 1" },
      { id: 2, input: "1 2 3", expectedOutput: "2 3 1" },
      { id: 3, input: "1", expectedOutput: "1", isHidden: true },
      { id: 4, input: "1 2 3 4 5", expectedOutput: "4 5 2 3 1", isHidden: true },
    ],
    boilerplate: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string line;
    getline(cin, line);
    // Parse the level-order array and perform postorder traversal
    // Write your code here

    return 0;
}`,
      python: `nodes = input().split()

# Build tree from level-order input and print postorder traversal
# Write your code here
`,
      javascript: `const nodes = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(' ');

// Build tree from level-order input and print postorder traversal
// Write your code here
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] nodes = sc.nextLine().trim().split(" ");

        // Build tree from level-order input and print postorder traversal
        // Write your code here
    }
}`,
    },
    visualizationLink: "/DFS/postorderBT",
  },

  dfs4: {
    id: "dfs4",
    name: "DFS in Graph",
    difficulty: "Medium",
    description:
      "Given an undirected graph with V vertices (0-indexed) and E edges, perform DFS starting from vertex 0. Print the DFS traversal as space-separated values.",
    constraints: [
      "1 <= V <= 10^4",
      "0 <= E <= V*(V-1)/2",
    ],
    examples: [
      {
        input: "5 4\n0 1\n0 2\n1 3\n1 4",
        output: "0 1 3 4 2",
        explanation: "DFS from 0: visit 0→1→3→4→2",
      },
    ],
    testCases: [
      { id: 1, input: "5 4\n0 1\n0 2\n1 3\n1 4", expectedOutput: "0 1 3 4 2" },
      { id: 2, input: "3 2\n0 1\n1 2", expectedOutput: "0 1 2" },
      { id: 3, input: "4 3\n0 1\n0 2\n0 3", expectedOutput: "0 1 2 3", isHidden: true },
      { id: 4, input: "1 0", expectedOutput: "0", isHidden: true },
    ],
    boilerplate: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int v, e;
    cin >> v >> e;
    vector<vector<int>> adj(v);
    for (int i = 0; i < e; i++) {
        int u, w;
        cin >> u >> w;
        adj[u].push_back(w);
        adj[w].push_back(u);
    }

    // Perform DFS from vertex 0 and print traversal
    // Write your code here

    return 0;
}`,
      python: `v, e = map(int, input().split())
adj = [[] for _ in range(v)]
for _ in range(e):
    u, w = map(int, input().split())
    adj[u].append(w)
    adj[w].append(u)

# Perform DFS from vertex 0 and print traversal
# Write your code here
`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const [v, e] = lines[0].split(' ').map(Number);
const adj = Array.from({length: v}, () => []);
for (let i = 1; i <= e; i++) {
    const [u, w] = lines[i].split(' ').map(Number);
    adj[u].push(w);
    adj[w].push(u);
}

// Perform DFS from vertex 0 and print traversal
// Write your code here
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int v = sc.nextInt(), e = sc.nextInt();
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < v; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < e; i++) {
            int u = sc.nextInt(), w = sc.nextInt();
            adj.get(u).add(w);
            adj.get(w).add(u);
        }

        // Perform DFS from vertex 0 and print traversal
        // Write your code here
    }
}`,
    },
    visualizationLink: "/DFS/dfsGraph",
  },

  // ── BFS ──
  bfs1: {
    id: "bfs1",
    name: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    description:
      'Given a binary tree as a level-order array (use "null" for missing nodes), return the level order traversal. Print each level on a new line with space-separated values.',
    constraints: [
      "0 <= number of nodes <= 2000",
      "-1000 <= node.val <= 1000",
    ],
    examples: [
      {
        input: "3 9 20 null null 15 7",
        output: "3\n9 20\n15 7",
      },
    ],
    testCases: [
      { id: 1, input: "3 9 20 null null 15 7", expectedOutput: "3\n9 20\n15 7" },
      { id: 2, input: "1", expectedOutput: "1" },
      { id: 3, input: "1 2 3 4 5 6 7", expectedOutput: "1\n2 3\n4 5 6 7", isHidden: true },
    ],
    boilerplate: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string line;
    getline(cin, line);
    // Build tree and print level order traversal
    // Write your code here

    return 0;
}`,
      python: `nodes = input().split()

# Build tree and print level order traversal
# Write your code here
`,
      javascript: `const nodes = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split(' ');

// Build tree and print level order traversal
// Write your code here
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] nodes = sc.nextLine().trim().split(" ");

        // Build tree and print level order traversal
        // Write your code here
    }
}`,
    },
    visualizationLink: "/BFS/levelorderBT",
  },

  bfs2: {
    id: "bfs2",
    name: "BFS in Graph",
    difficulty: "Medium",
    description:
      "Given an undirected graph with V vertices (0-indexed) and E edges, perform BFS starting from vertex 0. Print the BFS traversal as space-separated values.",
    constraints: ["1 <= V <= 10^4", "0 <= E <= V*(V-1)/2"],
    examples: [
      {
        input: "5 4\n0 1\n0 2\n1 3\n1 4",
        output: "0 1 2 3 4",
      },
    ],
    testCases: [
      { id: 1, input: "5 4\n0 1\n0 2\n1 3\n1 4", expectedOutput: "0 1 2 3 4" },
      { id: 2, input: "3 2\n0 1\n1 2", expectedOutput: "0 1 2" },
      { id: 3, input: "4 3\n0 1\n0 2\n0 3", expectedOutput: "0 1 2 3", isHidden: true },
      { id: 4, input: "1 0", expectedOutput: "0", isHidden: true },
    ],
    boilerplate: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int v, e;
    cin >> v >> e;
    vector<vector<int>> adj(v);
    for (int i = 0; i < e; i++) {
        int u, w;
        cin >> u >> w;
        adj[u].push_back(w);
        adj[w].push_back(u);
    }

    // Perform BFS from vertex 0 and print traversal
    // Write your code here

    return 0;
}`,
      python: `v, e = map(int, input().split())
adj = [[] for _ in range(v)]
for _ in range(e):
    u, w = map(int, input().split())
    adj[u].append(w)
    adj[w].append(u)

# Perform BFS from vertex 0 and print traversal
# Write your code here
`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const [v, e] = lines[0].split(' ').map(Number);
const adj = Array.from({length: v}, () => []);
for (let i = 1; i <= e; i++) {
    const [u, w] = lines[i].split(' ').map(Number);
    adj[u].push(w);
    adj[w].push(u);
}

// Perform BFS from vertex 0 and print traversal
// Write your code here
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int v = sc.nextInt(), e = sc.nextInt();
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < v; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < e; i++) {
            int u = sc.nextInt(), w = sc.nextInt();
            adj.get(u).add(w);
            adj.get(w).add(u);
        }

        // Perform BFS from vertex 0 and print traversal
        // Write your code here
    }
}`,
    },
    visualizationLink: "/BFS/bfsGraph",
  },

  bfs3: {
    id: "bfs3",
    name: "Rotten Oranges",
    difficulty: "Hard",
    description:
      "Given a grid of size M x N where each cell can have: 0 (empty), 1 (fresh orange), 2 (rotten orange). Every minute, a rotten orange rots all adjacent fresh oranges (4-directional). Return the minimum minutes until no fresh orange remains. Return -1 if impossible.",
    constraints: [
      "1 <= M, N <= 10",
      "grid[i][j] is 0, 1, or 2",
    ],
    examples: [
      {
        input: "3 3\n2 1 1\n1 1 0\n0 1 1",
        output: "4",
        explanation: "It takes 4 minutes for all oranges to rot.",
      },
    ],
    testCases: [
      { id: 1, input: "3 3\n2 1 1\n1 1 0\n0 1 1", expectedOutput: "4" },
      { id: 2, input: "3 3\n2 1 1\n0 1 1\n1 0 1", expectedOutput: "-1" },
      { id: 3, input: "1 2\n0 2", expectedOutput: "0", isHidden: true },
      { id: 4, input: "3 3\n2 1 0\n0 1 1\n0 1 2", expectedOutput: "2", isHidden: true },
    ],
    boilerplate: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int m, n;
    cin >> m >> n;
    vector<vector<int>> grid(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> grid[i][j];

    // Find min time to rot all oranges, print -1 if impossible
    // Write your code here

    return 0;
}`,
      python: `m, n = map(int, input().split())
grid = []
for _ in range(m):
    grid.append(list(map(int, input().split())))

# Find min time to rot all oranges, print -1 if impossible
# Write your code here
`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const [m, n] = lines[0].split(' ').map(Number);
const grid = [];
for (let i = 1; i <= m; i++) {
    grid.push(lines[i].split(' ').map(Number));
}

// Find min time to rot all oranges, print -1 if impossible
// Write your code here
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt();
        int[][] grid = new int[m][n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                grid[i][j] = sc.nextInt();

        // Find min time to rot all oranges, print -1 if impossible
        // Write your code here
    }
}`,
    },
    visualizationLink: "/BFS/rottenOranges",
  },

  // ── Binary Search ──
  bs1: {
    id: "bs1",
    name: "Binary Search",
    difficulty: "Easy",
    description:
      "Given a sorted array of integers and a target value, return the index of the target if found, otherwise return -1.",
    constraints: [
      "1 <= arr.length <= 10^4",
      "-10^4 <= arr[i], target <= 10^4",
      "Array is sorted in ascending order.",
    ],
    examples: [
      {
        input: "6 9\n-1 0 3 5 9 12",
        output: "4",
        explanation: "9 is at index 4.",
      },
      {
        input: "6 2\n-1 0 3 5 9 12",
        output: "-1",
        explanation: "2 is not in the array.",
      },
    ],
    testCases: [
      { id: 1, input: "6 9\n-1 0 3 5 9 12", expectedOutput: "4" },
      { id: 2, input: "6 2\n-1 0 3 5 9 12", expectedOutput: "-1" },
      { id: 3, input: "1 5\n5", expectedOutput: "0", isHidden: true },
      { id: 4, input: "5 1\n1 2 3 4 5", expectedOutput: "0", isHidden: true },
    ],
    boilerplate: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, target;
    cin >> n >> target;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];

    // Perform binary search and print the index or -1
    // Write your code here

    return 0;
}`,
      python: `n, target = map(int, input().split())
arr = list(map(int, input().split()))

# Perform binary search and print the index or -1
# Write your code here
`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const [n, target] = lines[0].split(' ').map(Number);
const arr = lines[1].split(' ').map(Number);

// Perform binary search and print the index or -1
// Write your code here
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), target = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();

        // Perform binary search and print the index or -1
        // Write your code here
    }
}`,
    },
    visualizationLink: "/BS/search",
  },

  // ── Kadane's Algorithm ──
  kd1: {
    id: "kd1",
    name: "Maximum Subarray Sum",
    difficulty: "Medium",
    description:
      "Given an integer array, find the contiguous subarray (containing at least one number) which has the largest sum and print its sum.",
    constraints: [
      "1 <= arr.length <= 10^5",
      "-10^4 <= arr[i] <= 10^4",
    ],
    examples: [
      {
        input: "9\n-2 1 -3 4 -1 2 1 -5 4",
        output: "6",
        explanation: "Subarray [4,-1,2,1] has the largest sum = 6.",
      },
    ],
    testCases: [
      { id: 1, input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
      { id: 2, input: "1\n1", expectedOutput: "1" },
      { id: 3, input: "5\n5 4 -1 7 8", expectedOutput: "23", isHidden: true },
      { id: 4, input: "3\n-1 -2 -3", expectedOutput: "-1", isHidden: true },
    ],
    boilerplate: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];

    // Find maximum subarray sum using Kadane's algorithm
    // Write your code here

    return 0;
}`,
      python: `n = int(input())
arr = list(map(int, input().split()))

# Find maximum subarray sum using Kadane's algorithm
# Write your code here
`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const n = parseInt(lines[0]);
const arr = lines[1].split(' ').map(Number);

// Find maximum subarray sum using Kadane's algorithm
// Write your code here
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();

        // Find maximum subarray sum using Kadane's algorithm
        // Write your code here
    }
}`,
    },
    visualizationLink: "/KadanesAlgo",
  },

  // ── Dutch National Flag ──
  dnf1: {
    id: "dnf1",
    name: "Sort 0s, 1s, 2s",
    difficulty: "Medium",
    description:
      "Given an array containing only 0s, 1s, and 2s, sort the array in-place and print the sorted array as space-separated values.",
    constraints: [
      "1 <= arr.length <= 10^5",
      "arr[i] is 0, 1, or 2",
    ],
    examples: [
      {
        input: "6\n2 0 2 1 1 0",
        output: "0 0 1 1 2 2",
      },
    ],
    testCases: [
      { id: 1, input: "6\n2 0 2 1 1 0", expectedOutput: "0 0 1 1 2 2" },
      { id: 2, input: "3\n0 1 2", expectedOutput: "0 1 2" },
      { id: 3, input: "5\n2 2 2 1 0", expectedOutput: "0 1 2 2 2", isHidden: true },
      { id: 4, input: "1\n1", expectedOutput: "1", isHidden: true },
    ],
    boilerplate: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];

    // Sort array of 0s, 1s, 2s using Dutch National Flag algorithm
    // Write your code here

    return 0;
}`,
      python: `n = int(input())
arr = list(map(int, input().split()))

# Sort array of 0s, 1s, 2s using Dutch National Flag algorithm
# Write your code here
`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const n = parseInt(lines[0]);
const arr = lines[1].split(' ').map(Number);

// Sort array of 0s, 1s, 2s using Dutch National Flag algorithm
// Write your code here
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();

        // Sort array of 0s, 1s, 2s using Dutch National Flag algorithm
        // Write your code here
    }
}`,
    },
    visualizationLink: "/DutchNationalFlag",
  },

  // ── Moore's Voting Algorithm ──
  moore1: {
    id: "moore1",
    name: "Majority Element (> N/2)",
    difficulty: "Medium",
    description:
      "Given an array of size N, find the element that appears more than N/2 times. It is guaranteed that such an element always exists.",
    constraints: [
      "1 <= N <= 5 * 10^4",
      "-10^9 <= arr[i] <= 10^9",
      "The majority element always exists.",
    ],
    examples: [
      {
        input: "7\n2 2 1 1 1 2 2",
        output: "2",
        explanation: "2 appears 4 times (> 7/2 = 3.5).",
      },
    ],
    testCases: [
      { id: 1, input: "7\n2 2 1 1 1 2 2", expectedOutput: "2" },
      { id: 2, input: "3\n3 2 3", expectedOutput: "3" },
      { id: 3, input: "1\n1", expectedOutput: "1", isHidden: true },
      { id: 4, input: "5\n5 5 5 1 2", expectedOutput: "5", isHidden: true },
    ],
    boilerplate: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];

    // Find majority element using Moore's Voting Algorithm
    // Write your code here

    return 0;
}`,
      python: `n = int(input())
arr = list(map(int, input().split()))

# Find majority element using Moore's Voting Algorithm
# Write your code here
`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const n = parseInt(lines[0]);
const arr = lines[1].split(' ').map(Number);

// Find majority element using Moore's Voting Algorithm
// Write your code here
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();

        // Find majority element using Moore's Voting Algorithm
        // Write your code here
    }
}`,
    },
    visualizationLink: "/MooresVotingAlgorithm",
  },
};

export function getProblemById(id: string): ProblemData | undefined {
  return problems[id];
}

export function getAllProblems(): ProblemData[] {
  return Object.values(problems);
}

export default problems;
