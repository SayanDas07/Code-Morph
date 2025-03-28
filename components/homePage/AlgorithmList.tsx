'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Algorithm } from '@/utils/algorithmData';
import { DataStructure } from '@/utils/dataStructureData';
import { AlgorithmCard } from './AlgorithmCard';
import { DataStructureCard } from './DataStructureCard';
import { ChevronLeft, ChevronRight, Info, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface AlgorithmListProps {
    initialAlgorithms: Algorithm[];
    initialDataStructures: DataStructure[];
}

export function AlgorithmList({
    initialAlgorithms,
    initialDataStructures,
}: AlgorithmListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeSection, setActiveSection] = useState<'algorithms' | 'dataStructures'>('algorithms');
    const [showAll, setShowAll] = useState(false);
    const itemsPerPage = 3;

    useEffect(() => {
        const handleSearch = (e: CustomEvent) => {
            setSearchQuery(e.detail);
            setCurrentPage(1);
            setShowAll(false);
        };

        window.addEventListener('searchChange', handleSearch as EventListener);
        return () => window.removeEventListener('searchChange', handleSearch as EventListener);
    }, []);

    // Filtering logic for both algorithms and data structures
    const filteredItems = useMemo(() => {
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

    // Calculate pagination or show all items
    const currentItems = showAll 
        ? filteredItems 
        : filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Calculate total pages
    const totalPages = Math.ceil((filteredItems?.length || 0) / itemsPerPage);

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

    // Toggle show all
    const toggleShowAll = () => {
        setShowAll(!showAll);
        setCurrentPage(1);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Section Selector */}
            <div className="flex gap-4 mb-8 justify-center">
                <button
                    onClick={() => {
                        setActiveSection('dataStructures');
                        setCurrentPage(1);
                        setShowAll(false);
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
                        setShowAll(false);
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
            {/* remove this later */}
            {activeSection === 'dataStructures' && (
                <Alert>
                    <Info className="h-6 w-6" />
                    <AlertTitle>Work in Progress</AlertTitle>
                    <AlertDescription>
                        This Data Structures section is currently under progress. Meanwhile, boost your algorithms using our Algorithms section!
                    </AlertDescription>
                </Alert>
            )}

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
            {filteredItems.length > itemsPerPage && (
                <div className="mt-10 flex items-center justify-center space-x-4">
                    {!showAll && (
                        <>
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
                        </>
                    )}

                    {/* Show All / Paginate Button */}
                    <button
                        onClick={toggleShowAll}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white bg-gray-800/70 hover:bg-gray-700/70 transition-all duration-300"
                    >
                        {showAll ? (
                            <>
                                <EyeOff size={16} />
                                Hide
                            </>
                        ) : (
                            <>
                                <Eye size={16} />
                                Show All
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}