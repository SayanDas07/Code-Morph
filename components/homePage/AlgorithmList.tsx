'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Algorithm } from '@/utils/algorithmData';
import { DataStructure } from '@/utils/dataStructureData';
import { AlgorithmCard } from './AlgorithmCard';
import { DataStructureCard } from './DataStructureCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AlgorithmListProps {
    initialAlgorithms: Algorithm[];
    initialDataStructures: DataStructure[];
}
// console.log("Initial Data Structures:", initialDataStructures);

export function AlgorithmList({ 
    initialAlgorithms , 
    initialDataStructures, 
}: AlgorithmListProps) {
    console.log("Initial Data Structures:", initialDataStructures);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeSection, setActiveSection] = useState<'algorithms' | 'dataStructures'>('algorithms');
    const itemsPerPage = 3;

    useEffect(() => {
        const handleSearch = (e: CustomEvent) => {
            setSearchQuery(e.detail);
            setCurrentPage(1);
        };

        window.addEventListener('searchChange', handleSearch as EventListener);
        return () => window.removeEventListener('searchChange', handleSearch as EventListener);
    }, []);

    // Filtering logic for both algorithms and data structures
    const filteredItems = useMemo(() => {
        // if (!initialAlgorithms || !initialDataStructures) return [];
        const query = searchQuery.toLowerCase().trim();
        const items = activeSection === 'algorithms' ? initialAlgorithms : initialDataStructures;
        if (!items) return [];
        if (!query) return items;

        return items.filter((item) => {
            const matchesItem =
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query);

            const matchesProblems = 'problems' in item && item.problems.some((problem: { name: string; description: string; difficulty?: string }) =>
                problem.name.toLowerCase().includes(query) ||
                problem.description.toLowerCase().includes(query) ||
                (problem.difficulty && problem.difficulty.toLowerCase().includes(query))
            );

            return matchesItem || matchesProblems;
        });
    }, [searchQuery, activeSection, initialAlgorithms, initialDataStructures]);

    // Calculate pagination
    const totalPages = Math.ceil((filteredItems?.length || 0) / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    // Page navigation
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Section Selector */}
            <div className="flex gap-4 mb-8 justify-center">
            <button
                onClick={() => {
                    setActiveSection('dataStructures');
                    setCurrentPage(1);
                }}
                className={`relative px-8 py-3 rounded-lg text-md font-semibold transition-all duration-300
                    shadow-lg border border-transparent overflow-hidden 
                    ${activeSection === 'dataStructures' 
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white shadow-indigo-500/50 ring-2 ring-indigo-400 scale-105'
                        : 'bg-gray-900/70 text-gray-300 border-gray-700 hover:border-gray-500 hover:bg-gray-800/80 hover:shadow-lg hover:scale-105'}`}
            >
                Data Structures
            </button>

            <button
                onClick={() => {
                    setActiveSection('algorithms');
                    setCurrentPage(1);
                }}
                className={`relative px-8 py-3 rounded-lg text-md font-semibold transition-all duration-300
                    shadow-lg border border-transparent overflow-hidden 
                    ${activeSection === 'algorithms' 
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white shadow-indigo-500/50 ring-2 ring-indigo-400 scale-105'
                        : 'bg-gray-900/70 text-gray-300 border-gray-700 hover:border-gray-500 hover:bg-gray-800/80 hover:shadow-lg hover:scale-105'}`}
            >
                Algorithms
            </button>
        </div>

            <div className="space-y-8">
                {currentItems.map((item) => (
                    activeSection === 'algorithms' ? (
                        <AlgorithmCard 
                            key={item.id} 
                            algorithm={item as Algorithm} 
                        />
                    ) : (
                        <DataStructureCard 
                            key={item.id} 
                            dataStructure={item as DataStructure} 
                        />
                    )
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center space-x-4">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white bg-gray-800/70 hover:bg-gray-700/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </button>
                    
                    <span className="text-sm font-medium text-gray-300">
                        Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white bg-gray-800/70 hover:bg-gray-700/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}