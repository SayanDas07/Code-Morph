export interface DataStructure {
    id: string;
    name: string;
    description: string;
    theory: string;
    algoLink?: string;
    category: string;
}

// Sample Data (Modify as needed)
export const dataStructures: DataStructure[] = [
    {
        id: "1",
        name: "Array",
        description: "hello",
        theory: "hello",
        algoLink: "/",
        category:"easy"
    },
    {
        id: "2",
        name: "String",
        description: "hello",
        theory: "hello",
        category: "easy"
    },
];
