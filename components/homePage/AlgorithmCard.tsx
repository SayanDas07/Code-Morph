'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, ChevronRight, Tag, Loader2 } from 'lucide-react';
import { Algorithm, Problem } from '@/utils/algorithmData';
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from '@clerk/nextjs';

interface AlgorithmCardProps {
    algorithm: Algorithm;
}

export function AlgorithmCard({ algorithm }: AlgorithmCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const { user } = useUser();
    const userId = user?.id;

    // Fetch solved problems for this user
    useEffect(() => {
        const fetchSolvedProblems = async () => {
            if (!userId) return;

            setIsLoading(true);
            try {
                const response = await fetch('/api/getSolvedProblems', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }),
                });
                const data = await response.json();
                setSolvedProblems(new Set(data.solvedProblemIds));
            } catch (error) {
                console.error('Error fetching solved problems:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSolvedProblems();
    }, [userId]);

    const handleProblemSolved = async (e: React.MouseEvent, problemId: string, problemName: string, difficulty: string) => {
        e.stopPropagation(); // Prevent triggering the parent div's click
        if (isUpdating) return;
        setIsUpdating(problemId);

        try {
            const isSolved = solvedProblems.has(problemId);
            const endpoint = isSolved ? '/api/unmarkProblemSolved' : '/api/markProblemSolved';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    problemId,
                    problemName,
                    difficulty
                }),
            });

            if (response.ok) {
                const newSolvedProblems = new Set(solvedProblems);
                if (isSolved) {
                    newSolvedProblems.delete(problemId);
                } else {
                    newSolvedProblems.add(problemId);
                }
                setSolvedProblems(newSolvedProblems);

                console.log(`Problem ${isSolved ? 'unmarked' : 'marked'} as solved:`, problemName);
            }

        
        } catch (error) {
            console.error('Error updating problem status:', error);
        } finally {
            setIsUpdating(null);
        }
    };

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

    if (isLoading) {
        return (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 shadow-lg p-6">
                <div className="flex flex-col items-center justify-center h-40">
                    <Loader2 className="h-10 w-10 text-blue-400 animate-spin mb-4" />
                    <p className="text-gray-400">Loading algorithm data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 
                    shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
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
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400">
                                {Array.from(solvedProblems).filter(id =>
                                    algorithm.problems.some(p => p.id === id)
                                ).length}
                                /
                                {algorithm.problems.length}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                               bg-blue-900/30 text-blue-400 border border-blue-800">
                                Problems Solved
                            </span>
                        </div>
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
                            className="p-6 hover:bg-gray-800/50 transition-all duration-200 group cursor-pointer"
                            onClick={() => handleProblemClick(problem.Link)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4">
                                        {isUpdating === problem.id ? (
                                            <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                                        ) : (
                                            <div onClick={(e) => handleProblemSolved(e, problem.id, problem.name, problem.difficulty)}>
                                                <Checkbox
                                                    checked={solvedProblems.has(problem.id)}
                                                    className="border-gray-600"
                                                    disabled={isUpdating === problem.id}
                                                />
                                            </div>
                                        )}
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