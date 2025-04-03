export interface DataStructure {
    id: string;
    name: string;
    description: string;
    theory: string;
    Link?: string;
    category: string;
}

export const dataStructures: DataStructure[] = [
    {
        id: "1",
        name: "Array",
        description: "Contiguous memory location storing multiple elements of the same type",
        theory: "Fixed-size collection of elements accessed by indices, allowing random access and efficient iteration",
        "Link": "/ds/array",
        category: "easy"
    },
    {
        id: "2",
        name: "Vector",
        description: "Dynamic array with automatic resizing capability",
        theory: "Templated container from STL that provides dynamic array functionality with automatic memory management",
        "Link": "/ds/vector",
        category: "easy"
    },
    {
        id: "3",
        name: "Single Linked List",
        description: "Linear collection of elements where each element points to the next",
        theory: "Dynamic data structure with nodes containing data and reference to next node",
        "Link": "/ds/ll",
        category: "medium"
    },
    {
        id: "4",
        name: "Doubly Linked List",
        description: "Linked list with nodes pointing to both next and previous elements",
        theory: "Enhanced linked list allowing bidirectional traversal",
        category: "medium"
    },
    {
        id: "5",
        name: "Stack",
        description: "Last-In-First-Out (LIFO) data structure",
        theory: "Linear data structure following LIFO principle, supporting push and pop operations",
        category: "easy"
    },
    {
        id: "6",
        name: "Queue",
        description: "First-In-First-Out (FIFO) data structure",
        theory: "Linear data structure following FIFO principle, supporting enqueue and dequeue operations",
        category: "easy"
    },
    {
        id: "7",
        name: "Priority Queue",
        description: "Queue where elements have associated priority",
        theory: "Container adaptor that provides constant time lookup of highest/lowest priority element",
        category: "medium"
    },
    {
        id: "8",
        name: "Binary Search Tree (BST)",
        description: "Hierarchical data structure with ordered node placement",
        theory: "Tree where left subtree contains smaller values and right subtree contains larger values",
        category: "hard"
    },
    {
        id: "9",
        name: "AVL Tree",
        description: "Self-balancing binary search tree",
        theory: "BST with additional balance factor, ensuring logarithmic time complexity for operations",
        category: "hard"
    },
    {
        id: "10",
        name: "Red-Black Tree",
        description: "Self-balancing binary search tree",
        theory: "Ensures tree remains balanced through color-based rules",
        category: "hard"
    },
    {
        id: "11",
        name: "Hash Table",
        description: "Key-value storage with direct access",
        theory: "Uses hash function to compute index for efficient data retrieval",
        category: "medium"
    },
    {
        id: "12",
        name: "Heap",
        description: "Specialized tree-based data structure",
        theory: "Complete binary tree satisfying heap property (max-heap or min-heap)",
        category: "medium"
    },
    {
        id: "13",
        name: "Graph",
        description: "Collection of nodes (vertices) connected by edges",
        theory: "Non-linear data structure representing relationships between objects",
        category: "hard"
    },
    {
        id: "14",
        name: "Deque",
        description: "Double-ended queue allowing insertion and deletion at both ends",
        theory: "Dynamic array-like container from STL with efficient operations at both ends",
        category: "medium"
    },
    {
        id: "15",
        name: "Set",
        description: "Collection of unique elements in sorted order",
        theory: "Associative container storing unique elements, typically implemented as a balanced tree",
        category: "medium"
    },
    {
        id: "16",
        name: "Map",
        description: "Collection of key-value pairs with unique keys in sorted order",
        theory: "Associative container storing unique key-value pairs, typically implemented as a balanced tree",
        category: "medium"
    },
    {
        id: "17",
        name: "Trie",
        description: "Tree-like data structure for storing strings",
        theory: "Efficient for storing and searching strings, particularly useful for autocomplete and prefix matching",
        category: "hard"
    },
    {
        id: "18",
        name: "Unordered Set",
        description: "Collection of unique elements using hash table",
        theory: "Provides faster operations compared to set, but without ordered storage",
        category: "medium"
    },
    {
        id: "19",
        name: "Unordered Map",
        description: "Collection of key-value pairs using hash table",
        theory: "Provides faster operations compared to map, but without ordered storage",
        category: "medium"
    }
];
