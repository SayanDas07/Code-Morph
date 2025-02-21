'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Algorithm } from '@/utils/algorithmData';
import { AlgorithmCard } from './AlgorithmCard';


interface AlgorithmListProps {
    initialAlgorithms: Algorithm[];
}

export function AlgorithmList({ initialAlgorithms }: AlgorithmListProps) {
    const [searchQuery, setSearchQuery] = useState('');
   

    useEffect(() => {
        const handleSearch = (e: CustomEvent) => {
            setSearchQuery(e.detail);
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

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-8">
                {filteredAlgorithms.map((algorithm) => (
                    <AlgorithmCard key={algorithm.id} algorithm={algorithm}/>
                ))}
            </div>
        </div>
    );
}
