'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Algorithm } from '@/utils/algorithmData';
import { AlgorithmCard } from './AlgorithmCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AlgorithmListProps {
    initialAlgorithms: Algorithm[];
}

export function AlgorithmList({ initialAlgorithms }: AlgorithmListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const algorithmsPerPage = 3;

    useEffect(() => {
        const handleSearch = (e: CustomEvent) => {
            setSearchQuery(e.detail);
            setCurrentPage(1); // Reset to first page when search changes
        };

        window.addEventListener('searchChange', handleSearch as EventListener);
        return () => window.removeEventListener('searchChange', handleSearch as EventListener);
    }, []);

    const filteredAlgorithms = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return initialAlgorithms;

        return initialAlgorithms.filter((algo) => {
            const matchesAlgo =
                algo.name.toLowerCase().includes(query) ||
                algo.description.toLowerCase().includes(query) ||
                algo.category.toLowerCase().includes(query);

            const matchesProblems = algo.problems.some((problem) =>
                problem.name.toLowerCase().includes(query) ||
                problem.description.toLowerCase().includes(query) ||
                problem.difficulty.toLowerCase().includes(query)
            );

            return matchesAlgo || matchesProblems;
        });
    }, [searchQuery, initialAlgorithms]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredAlgorithms.length / algorithmsPerPage);
    const indexOfLastAlgorithm = currentPage * algorithmsPerPage;
    const indexOfFirstAlgorithm = indexOfLastAlgorithm - algorithmsPerPage;
    const currentAlgorithms = filteredAlgorithms.slice(indexOfFirstAlgorithm, indexOfLastAlgorithm);

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
            <div className="space-y-8">
                {currentAlgorithms.map((algorithm) => (
                    <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
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