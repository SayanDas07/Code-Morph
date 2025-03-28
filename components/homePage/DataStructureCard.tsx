'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, ChevronRight, MonitorPlay } from 'lucide-react';
import { DataStructure } from '@/utils/dataStructureData';

interface DataStructureCardProps {
    dataStructure: DataStructure;
}

export function DataStructureCard({ dataStructure }: DataStructureCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();

    const handleVisualizationClick = (link: string | undefined) => {
        if (link) {
            router.push(link);
        }
    };

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
                            {dataStructure.name}
                        </h2>
                    </div>
                    <ChevronRight
                        className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                </div>
                <p className="mt-4 text-gray-400 leading-relaxed">{dataStructure.description}</p>
            </div>

            {isExpanded && (
                <div className="p-6 bg-gray-800/40">
                    <h3 className="text-lg font-semibold text-gray-300 mb-3">Theory & Explanation</h3>
                    <p className="text-gray-400 leading-relaxed">{dataStructure.theory}</p>

                    {dataStructure.Link && (
                        <button
                            onClick={() => handleVisualizationClick(dataStructure.Link)}
                            className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg 
                                bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-all duration-300"
                        >
                            <MonitorPlay className="h-5 w-5" />
                            Visualize {dataStructure.name}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
