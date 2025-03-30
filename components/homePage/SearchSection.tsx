'use client';

import React, { useState } from 'react';
import { Search, Code2, X } from 'lucide-react';

export function SearchSection() {
    const [searchQuery, setSearchQuery] = useState('');

    const clearSearch = () => {
        setSearchQuery('');
        // Emit search change to parent
        window.dispatchEvent(new CustomEvent('searchChange', { detail: '' }));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        window.dispatchEvent(new CustomEvent('searchChange', { detail: e.target.value }));
    };

    return (
        <div className="bg-gradient-to-r from-blue-950 to-indigo-950 py-16 border-b border-gray-800">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-4">
                    <Code2 className="h-10 w-10 text-blue-400" />
                    <h1 className="text-4xl font-bold text-white">Visualize Data Structures & Algorithm </h1>
                </div>
                <p className="text-blue-300 text-lg mb-8">
                    Master your coding skills with our curated collection of data structures & algorithms.
                </p>

                <div className="relative max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-blue-700 z-50" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-10 py-3 bg-gray-900/50 border border-gray-700 rounded-xl 
                      text-gray-100 placeholder-gray-500 shadow-lg backdrop-blur-sm
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
                      transition-all duration-200"
                        placeholder="Search algorithms, problems.."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
