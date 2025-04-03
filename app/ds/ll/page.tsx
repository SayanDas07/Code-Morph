'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw } from 'lucide-react';

const LinkedListPage = () => {
  const [language, setLanguage] = useState('cpp');
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed] = useState(1000); // in ms
  const [nodeValues, setNodeValues] = useState([10, 20, 30]);
  const [operation, setOperation] = useState('traverse');
  const [insertValue, setInsertValue] = useState(15);
  const [insertPosition, setInsertPosition] = useState(1);
  
  // Use ref for interval to avoid dependency issues
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get max steps for current operation
  const getMaxSteps = () => {
    if (operation === 'traverse') return nodeValues.length + 1;
    if (operation === 'insert') return 4;
    if (operation === 'delete') return 3;
    return 0;
  };

  // Reset animation when operation changes
  useEffect(() => {
    setAnimationStep(0);
    stopAnimation();
    return () => stopAnimation();
  }, [operation]);

  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, []);

  const startAnimation = () => {
    if (isAnimating) return;
    
    if (animationStep >= getMaxSteps()) {
      resetAnimationStepOnly(); 
    }
    
    stopAnimation();
    setIsAnimating(true);
    
    animationIntervalRef.current = setInterval(() => {
      setAnimationStep(prev => {
        const next = prev + 1;
        
        // Handle the completion of operations
        if (next >= getMaxSteps()) {
          stopAnimation();
          
          // When an operation completes, update the nodeValues state
          if (operation === 'insert' && next === 4) {
            // Apply insertion
            const newArray = [...nodeValues];
            newArray.splice(insertPosition, 0, insertValue);
            setNodeValues(newArray);
          } else if (operation === 'delete' && next === 3) {
            // Apply deletion
            const newArray = [...nodeValues];
            newArray.splice(insertPosition, 1);
            setNodeValues(newArray);
          }
          
          return next; // Keep the last step visible
        }
        return next;
      });
    }, animationSpeed);
  };

  const stopAnimation = () => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
    setIsAnimating(false);
  };

  const resetAnimationStepOnly = () => {
    stopAnimation();
    setAnimationStep(0);
  };

  const resetAnimation = () => {
    stopAnimation();
    setAnimationStep(0);
    setNodeValues([10, 20, 30]); // Reset to original values
  };

  // Code examples
  const cppCode = `
// C++ implementation of Singly Linked List
#include <iostream>
using namespace std;

// Node structure
class Node {
public:
    int data;
    Node* next;
    
    // Constructor
    Node(int value) {
        data = value;
        next = NULL;
    }
};

class LinkedList {
private:
    Node* head;
    
public:
    // Constructor
    LinkedList() {
        head = NULL;
    }
    
    // Insert a new node at the beginning
    void insertAtHead(int value) {
        Node* newNode = new Node(value);
        newNode->next = head;
        head = newNode;
    }
    
    // Insert at a given position (0-based index)
    void insertAt(int position, int value) {
        if (position < 0) {
            cout << "Invalid position" << endl;
            return;
        }
        
        if (position == 0) {
            insertAtHead(value);
            return;
        }
        
        Node* temp = head;
        for (int i = 0; i < position - 1 && temp != NULL; i++) {
            temp = temp->next;
        }
        
        if (temp == NULL) {
            cout << "Position out of bounds" << endl;
            return;
        }
        
        Node* newNode = new Node(value);
        newNode->next = temp->next;
        temp->next = newNode;
    }
    
    // Delete node at a given position
    void deleteAt(int position) {
        if (head == NULL) {
            cout << "List is empty" << endl;
            return;
        }
        
        Node* temp = head;
        
        if (position == 0) {
            head = head->next;
            delete temp;
            return;
        }
        
        for (int i = 0; i < position - 1 && temp != NULL; i++) {
            temp = temp->next;
        }
        
        if (temp == NULL || temp->next == NULL) {
            cout << "Position out of bounds" << endl;
            return;
        }
        
        Node* toDelete = temp->next;
        temp->next = temp->next->next;
        delete toDelete;
    }
    
    // Display the linked list
    void display() {
        Node* temp = head;
        while (temp != NULL) {
            cout << temp->data << " -> ";
            temp = temp->next;
        }
        cout << "NULL" << endl;
    }
};
`;

  const javaCode = `
// Java implementation of Singly Linked List
public class LinkedList {
    // Node class
    static class Node {
        int data;
        Node next;
        
        // Constructor
        Node(int value) {
            data = value;
            next = null;
        }
    }
    
    private Node head;
    
    // Constructor
    public LinkedList() {
        head = null;
    }
    
    // Insert a new node at the beginning
    public void insertAtHead(int value) {
        Node newNode = new Node(value);
        newNode.next = head;
        head = newNode;
    }
    
    // Insert at a given position (0-based index)
    public void insertAt(int position, int value) {
        if (position < 0) {
            System.out.println("Invalid position");
            return;
        }
        
        if (position == 0) {
            insertAtHead(value);
            return;
        }
        
        Node temp = head;
        for (int i = 0; i < position - 1 && temp != null; i++) {
            temp = temp.next;
        }
        
        if (temp == null) {
            System.out.println("Position out of bounds");
            return;
        }
        
        Node newNode = new Node(value);
        newNode.next = temp.next;
        temp.next = newNode;
    }
    
    // Delete node at a given position
    public void deleteAt(int position) {
        if (head == null) {
            System.out.println("List is empty");
            return;
        }
        
        Node temp = head;
        
        if (position == 0) {
            head = head.next;
            return;
        }
        
        for (int i = 0; i < position - 1 && temp != null; i++) {
            temp = temp.next;
        }
        
        if (temp == null || temp.next == null) {
            System.out.println("Position out of bounds");
            return;
        }
        
        temp.next = temp.next.next;
    }
    
    // Display the linked list
    public void display() {
        Node temp = head;
        while (temp != null) {
            System.out.print(temp.data + " -> ");
            temp = temp.next;
        }
        System.out.println("null");
    }
}
`;

  // SVG Visualizations for linked list structure
  const ListStructureSVG = () => (
    <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
      {/* Node 1 */}
      <rect x="50" y="50" width="100" height="100" fill="#f0f4f8" stroke="#333" strokeWidth="2" />
      <line x1="150" y1="100" x2="200" y2="100" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="100" y="90" textAnchor="middle" fill="#333" fontSize="16">Data: 10</text>
      <text x="100" y="120" textAnchor="middle" fill="#333" fontSize="16">Next</text>
      
      {/* Node 2 */}
      <rect x="200" y="50" width="100" height="100" fill="#f0f4f8" stroke="#333" strokeWidth="2" />
      <line x1="300" y1="100" x2="350" y2="100" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="250" y="90" textAnchor="middle" fill="#333" fontSize="16">Data: 20</text>
      <text x="250" y="120" textAnchor="middle" fill="#333" fontSize="16">Next</text>
      
      {/* Node 3 */}
      <rect x="350" y="50" width="100" height="100" fill="#f0f4f8" stroke="#333" strokeWidth="2" />
      <line x1="450" y1="100" x2="500" y2="100" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="400" y="90" textAnchor="middle" fill="#333" fontSize="16">Data: 30</text>
      <text x="400" y="120" textAnchor="middle" fill="#333" fontSize="16">Next</text>
      
      {/* NULL */}
      <text x="520" y="105" textAnchor="middle" fill="#333" fontSize="16">NULL</text>
      
      {/* Arrow definition */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
        </marker>
      </defs>
    </svg>
  );

  const renderNodes = () => {
    let currentValues = [...nodeValues];
    
    if (operation === 'insert' && animationStep >= 3 && animationStep < 4) {
      const newArray = [...currentValues];
      newArray.splice(insertPosition, 0, insertValue);
      currentValues = newArray;
    } else if (operation === 'delete' && animationStep >= 2 && animationStep < 3) {
      if (insertPosition < currentValues.length) {
        const newArray = [...currentValues];
        newArray.splice(insertPosition, 1);
        currentValues = newArray;
      }
    }
    
    // Create a row of nodes with better arrow positioning
    const nodeRow = (
      <div className="flex items-center justify-start overflow-x-auto pb-4">
        {currentValues.map((value, i) => {
          const isHighlighted = 
            (operation === 'traverse' && i === animationStep - 1) ||
            (operation === 'insert' && ((animationStep === 2 && i === insertPosition - 1) || 
                                    (animationStep === 3 && i === insertPosition))) ||
            (operation === 'delete' && ((animationStep === 2 && i === insertPosition - 1) || 
                                    (animationStep === 2 && i === insertPosition)));
          
          return (
            <div key={i} className="flex items-center">
              {/* Node */}
              <div className={`flex flex-col items-center justify-center rounded-lg ${isHighlighted ? 'bg-blue-200' : 'bg-gray-100'} p-4 w-24 h-24 transition-colors duration-300`}>
                <div className="text-lg font-bold">{value}</div>
                <div className="text-xs text-gray-500">Node {i}</div>
              </div>
              
              {/* Arrow to next node */}
              {i < currentValues.length - 1 && (
                <div className="mx-2 flex items-center">
                  <div className={`w-12 h-2 ${animationStep === i + 1 && operation === 'traverse' ? 'bg-blue-500' : 'bg-gray-400'} rounded-sm`}></div>
                  <div className={`w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 ${animationStep === i + 1 && operation === 'traverse' ? 'border-l-blue-500' : 'border-l-gray-400'}`}></div>
                </div>
              )}
            </div>
          );
        })}
        
        {/* NULL node */}
        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-200 p-4 w-24 h-24">
          <div className="text-lg font-bold">NULL</div>
        </div>
      </div>
    );
    
    // Add new node visualization for insert operation
    if (operation === 'insert' && animationStep === 1) {
      return (
        <div className="flex flex-col mb-8">
          <div className="flex items-center mb-6">
            <div className="flex flex-col items-center justify-center rounded-lg bg-green-200 p-4 w-24 h-24 mr-4">
              <div className="text-lg font-bold">{insertValue}</div>
              <div className="text-xs text-gray-500">New Node</div>
            </div>
            <div className="flex items-center">
              <div className="text-lg font-semibold px-4">→</div>
              <div className="text-lg font-semibold">Ready to be inserted</div>
            </div>
          </div>
          {nodeRow}
        </div>
      );
    }
    
    return <div className="mb-8">{nodeRow}</div>;
  };
  
  const getAnimationDescription = () => {
    if (operation === 'traverse') {
      if (animationStep === 0) return "Starting traversal from head";
      if (animationStep <= nodeValues.length) {
        return `Visiting node at position ${animationStep - 1} with value ${nodeValues[animationStep - 1]}`;
      }
      return "Traversal complete";
    } else if (operation === 'insert') {
      const steps = [
        "Preparing to insert new node with value " + insertValue,
        "Creating new node with value " + insertValue,
        `Finding position ${insertPosition} for insertion`,
        `Inserting new node at position ${insertPosition}`,
        "Insertion complete"
      ];
      return steps[Math.min(animationStep, steps.length - 1)];
    } else if (operation === 'delete') {
      const steps = [
        `Preparing to delete node at position ${insertPosition}`,
        `Finding position ${insertPosition} for deletion`,
        `Updating references to skip node at position ${insertPosition}`,
        "Deletion complete"
      ];
      return steps[Math.min(animationStep, steps.length - 1)];
    }
    return "";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Singly Linked List</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>What is a Linked List?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              A singly linked list is a data structure that consists of nodes where each node contains data and a reference (or pointer) to the next node in the sequence.
            </p>
            <p className="mb-4">
              Unlike arrays, linked lists don&apos;t require contiguous memory allocation, making insertions and deletions more efficient.
            </p>
            <p>
              Key operations include:
            </p>
            <ul className="list-disc ml-6 mt-2">
              <li>Traversal - Moving through the list</li>
              <li>Insertion - Adding a new node</li>
              <li>Deletion - Removing a node</li>
            </ul>
          </CardContent>
        </Card>
      
        <Card>
          <CardHeader>
            <CardTitle>Linked List Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ListStructureSVG />
            </div>
            <p className="mt-4">
              Each node contains:
            </p>
            <ul className="list-disc ml-6 mt-2">
              <li><strong>Data:</strong> The value stored in the node</li>
              <li><strong>Next pointer:</strong> Reference to the next node</li>
            </ul>
            <p className="mt-4">
              The last node points to NULL, indicating the end of the list.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Interactive Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <Button 
                variant={operation === 'traverse' ? 'default' : 'outline'} 
                onClick={() => setOperation('traverse')}
              >
                Traverse
              </Button>
              <Button 
                variant={operation === 'insert' ? 'default' : 'outline'} 
                onClick={() => setOperation('insert')}
              >
                Insert
              </Button>
              <Button 
                variant={operation === 'delete' ? 'default' : 'outline'} 
                onClick={() => setOperation('delete')}
              >
                Delete
              </Button>
            </div>
            
            {(operation === 'insert' || operation === 'delete') && (
              <div className="flex items-center gap-4 mb-4">
                {operation === 'insert' && (
                  <div className="flex items-center gap-2">
                    <label htmlFor="insertValue">Value:</label>
                    <input
                      id="insertValue"
                      type="number"
                      className="border rounded p-1 w-16"
                      value={insertValue}
                      onChange={(e) => setInsertValue(parseInt(e.target.value) || 0)}
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <label htmlFor="insertPosition">Position:</label>
                  <input
                    id="insertPosition"
                    type="number"
                    className="border rounded p-1 w-16"
                    value={insertPosition}
                    onChange={(e) => setInsertPosition(parseInt(e.target.value) || 0)}
                    min={0}
                    max={nodeValues.length}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            {renderNodes()}
          </div>
          
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
            <p className="font-semibold">{getAnimationDescription()}</p>
          </div>
          
          <div className="flex justify-center gap-4 mt-6">
            <Button 
              onClick={startAnimation} 
              disabled={isAnimating}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" /> Start
            </Button>
            <Button 
              onClick={stopAnimation} 
              disabled={!isAnimating}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Pause className="h-4 w-4" /> Pause
            </Button>
            <Button 
              onClick={resetAnimation} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Implementation</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cpp" value={language} onValueChange={setLanguage}>
            <TabsList className="mb-4">
              <TabsTrigger value="cpp">C++</TabsTrigger>
              <TabsTrigger value="java">Java</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cpp">
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">
                  {cppCode}
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="java">
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">
                  {javaCode}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Common Operations Time Complexity</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left">Operation</th>
                <th className="border p-2 text-left">Time Complexity</th>
                <th className="border p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Access by Index</td>
                <td className="border p-2">O(n)</td>
                <td className="border p-2">Need to traverse from head to reach a specific position</td>
              </tr>
              <tr>
                <td className="border p-2">Insert at Beginning</td>
                <td className="border p-2">O(1)</td>
                <td className="border p-2">Constant time operation</td>
              </tr>
              <tr>
                <td className="border p-2">Insert at End</td>
                <td className="border p-2">O(n)</td>
                <td className="border p-2">Need to traverse to the end first</td>
              </tr>
              <tr>
                <td className="border p-2">Insert at Position</td>
                <td className="border p-2">O(n)</td>
                <td className="border p-2">Need to traverse to the position first</td>
              </tr>
              <tr>
                <td className="border p-2">Delete at Beginning</td>
                <td className="border p-2">O(1)</td>
                <td className="border p-2">Constant time operation</td>
              </tr>
              <tr>
                <td className="border p-2">Delete at End</td>
                <td className="border p-2">O(n)</td>
                <td className="border p-2">Need to traverse to find the second-last node</td>
              </tr>
              <tr>
                <td className="border p-2">Delete at Position</td>
                <td className="border p-2">O(n)</td>
                <td className="border p-2">Need to traverse to the position first</td>
              </tr>
              <tr>
                <td className="border p-2">Search</td>
                <td className="border p-2">O(n)</td>
                <td className="border p-2">May need to traverse the entire list</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedListPage;