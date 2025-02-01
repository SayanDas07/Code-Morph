'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, ChevronRight, Tag } from 'lucide-react';
import { Algorithm, Problem } from '@/utils/algorithmData';

interface AlgorithmCardProps {
    algorithm: Algorithm;
}

export function AlgorithmCard({ algorithm }: AlgorithmCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();

    const getDifficultyColor = (difficulty: Problem['difficulty']): string => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'bg-green-900/30 text-green-400 border-green-800';
            case 'medium':
                return 'bg-yellow-900/30 text-yellow-400 border-yellow-800';
            case 'hard':
                return 'bg-red-900/30 text-red-400 border-red-800';
            default:
                return 'bg-gray-800/30 text-gray-400 border-gray-700';
        }
    };

    const handleProblemClick = (link: string | undefined) => {
        if (link) {
            router.push(link);
        }
    };

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 
                    shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
            {/* Make the entire header section clickable for expanding */}
            <div
                className="p-6 border-b border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-all duration-200"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-blue-400" />
                            {algorithm.name}
                        </h2>
                        <div className="mt-2 flex items-center gap-2">
                            <Tag className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-400">{algorithm.category}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                           bg-blue-900/30 text-blue-400 border border-blue-800">
                            {algorithm.problems.length} Problems
                        </span>
                        <ChevronRight
                            className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                    </div>
                </div>
                <p className="mt-4 text-gray-400 leading-relaxed">{algorithm.description}</p>
            </div>

            {isExpanded && (
                <div className="divide-y divide-gray-800">
                    {algorithm.problems.map((problem) => (
                        <div
                            key={problem.id}
                            onClick={() => handleProblemClick(problem.leetcodeLink || problem.Link)}
                            className="p-6 hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-lg font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">
                                            {problem.name}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                                            problem.difficulty
                                        )}`}>
                                            {problem.difficulty}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-gray-400">{problem.description}</p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-blue-400 
                                     group-hover:transform group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}