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
        "id": 0,
        "name": "HashMap",
        "description": "A data structure that stores key-value pairs for fast lookups, insertion, and deletion operations.",
        "category": "Data Structures",
        "problems": [
            {
                "id": "hm1",
                "name": "Frequency of elements",
                "difficulty": "Easy",
                "description": "Given an array of integers. Count the frequency of each elements.",
                "Link": "/Hashmap/frequencymap"
            },
            {
                "id": "hm2",
                "name": "Two Sum",
                "difficulty": "Easy",
                "description": "Given an array of integers and a target, find two numbers that add up to the target.",
                "Link": "/Hashmap/twosum"
            },
        ]
    }
    ,
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
            {
                id: "dfs4",
                name: "DFS in Graph",
                difficulty: "Medium",
                description: "Depth First Search in a graph",
                Link: "/DFS/dfsGraph"
            }

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
            {
                id: "bfs2",
                name: "BFS in Graph",
                difficulty: "Medium",
                description: "Breadth First Search in a graph",
                Link: "/BFS/bfsGraph"

            },
            {
                id: "bfs3",
                name: "Rotten Oranges",
                difficulty: "Hard",
                description: "Min time to rot all oranges",
                Link: "/BFS/rottenOranges"
            }

        ]
    },
    {
        id: 6,
        name: "Binary Search",
        description: "Binary search is a search algorithm that finds the position of a target value within a sorted array",
        category: "Array",
        problems: [
            {
                id: "bs1",
                name: "Binary Search",
                difficulty: "Easy",
                description: "Find an element in a sorted array",
                Link: "/BS/search"
            }
        ]
    },
    {
        id: 7,
        name: "Kadane's Algorithm",
        description: "Kadane's algorithm is a dynamic programming algorithm that finds the maximum sum of a contiguous subarray in an array of numbers",
        category: "Array",
        problems: [
            {
                id: "kd1",
                name: "Maximum Subarray Sum",
                difficulty: "Medium",
                description: "Find the maximum sum of a subarray",
                Link: "/KadanesAlgo"

            }
        ]
    },
    {
        id: 8,
        name: "Dutch National Flag",
        description: "Dutch National Flag algorithm is used to sort an array of 0s, 1s, and 2s in linear time complexity",
        category: "Array",
        problems: [
            {
                id: "dnf1",
                name: "Sort 0s, 1s, 2s",
                difficulty: "Medium",
                description: "Sort an array of 0s, 1s, and 2s",
                Link: "/DutchNationalFlag"

            }
        ]
    },
    {
        id: 9,
        name: "Moore's Voting Algorithm",
        description: "Moore's Voting Algorithm is used to find the majority element in an array",
        category: "Array",
        problems: [
            {
                id: "moore1",
                name: "Majority Element more than N/2",
                difficulty: "Medium",
                description: "Find the majority element in an array where the majority element appears more than n/2 times",
                Link: "/MooresVotingAlgorithm"

            }
        ]
    },

];