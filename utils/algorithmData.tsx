export interface Problem {
    id: string;
    name: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    Link?: string;
    leetcodeLink?: string;
}

export interface Algorithm {
    id: number;
    name: string;
    description: string;
    category: string;
    problems: Problem[];
}


export const algorithms: Algorithm[] = [
    {
        id: 1,
        name: "Hare and Tortoise",
        description: "Floyd's cycle detection algorithm using two pointers moving at different speeds",
        category: "Linked List",
        problems: [
            {
                id: "ht1",
                name: "Find Middle Node",
                difficulty: "Easy",
                description: "Find the middle node of a linked list",
                Link: "/haretortoisealgo/middleNode"
            },
            {
                id: "ht2",
                name: "Detect Cycle",
                difficulty: "Medium",
                description: "Detect if a linked list has a cycle",
                Link: "/haretortoisealgo/detectCycle"
            },
        ]
    },
    {
        id: 2,
        name: "Two Pointers",
        description: "Solving problems using two pointers moving through the data structure",
        category: "Array",
        problems: [
            {
                id: "tp1",
                name: "Two Sum Sorted",
                difficulty: "Easy",
                description: "Find two numbers that add up to target in sorted array",
                Link: "/twopointersalgorithm/twoSumSorted"
            },
            {
                id: "tp2",
                name: "Binary Search",
                difficulty: "Medium",
                description: "Find an element in a sorted array",
                Link: "/twopointersalgorithm/twoSumSorted"
            },

        ]
    },
    {
        id: 3,
        name: "Sliding window technique",
        description: "An efficient technique for solving problems involving subarrays or substrings by dynamically adjusting a window over consecutive elements",
        category: "Array",
        problems: [
            {
                id: "sw1",
                name: "Maximum Sum Subarray",
                difficulty: "Medium",
                description: "Find the maximum sum of a subarray of fixed size k",
                Link: "/slidingwindowalgo/slidingWindow"
            },
            {
                id: "sw2",
                name: "Maximum Consecutive Ones After Flipping K Zeros",
                difficulty: "Medium",
                description: "Check if one string's permutation is a substring of another",
                Link: "/slidingwindowalgo/FlipKzero"
            },
        ]
    },
    {
        id: 4,
        name: "DFS traversals",
        description: "Depth First Search is a graph traversal algorithm that explores as far as possible along each branch before backtracking",
        category: "Tree, Graph",
        problems: [
            {
                id: "dfs1",
                name: "Binary Tree Inorder Traversal",
                difficulty: "Easy",
                description: "Inorder traversal of a binary tree",
                Link: "/DFS/inorderBT"
            },
            {
                id: "dfs2",
                name: "Binary Tree Preorder Traversal",
                difficulty: "Easy",
                description: "Preorder traversal of a binary tree",
                Link: "/DFS/preorderBT"
            },
            {
                id: "dfs3",
                name: "Binary Tree Postorder Traversal",
                difficulty: "Easy",
                description: "Postorder traversal of a binary tree",
                Link: "/DFS/postorderBT"
            },

        ]
    },
    {
        id: 5,
        name: "BFS/Level Order Traversal",
        description: "Breadth First Search is a graph traversal algorithm that explores the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level",
        category: "Tree, Graph",
        problems: [
            {
                id: "bfs1",
                name: "Binary Tree Level Order Traversal",
                difficulty: "Medium",
                description: "Level order traversal of a binary tree",
                Link: "/BFS/levelorderBT"
            },

        ]
    }
];