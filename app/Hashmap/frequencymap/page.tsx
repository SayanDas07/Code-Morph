"use client";

import React from 'react';
import { Theory, CodeSnippet, Practice, Complexity } from "@/utils/Hashmap/frequencyMap"; // Ensure Theory is exported from this path
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { motion } from "framer-motion";
import { BookOpen, Code, Brain, TrendingUp } from 'lucide-react';

import HashMapVisualizer from '@/components/Hashmap/frequency';
import Link from 'next/link';

const HashMapPage = () => {

    const contentSections = [
        {
            title: "Algorithm Theory",
            icon: BookOpen,
            type: "Learn Theory",
            description: "Understanding the fundamental concepts and mechanics of HashMap Frequency Counting.",
            component: Theory,
            id: "theory-section"
        },
        {
            title: "Implementation",
            icon: Code,
            type: "View Code",
            description: "Step-by-step code implementation of the frequency counting algorithm.",
            component: CodeSnippet,
            id: "implementation-section"
        },
        {
            title: "Practice Examples",
            icon: Brain,
            type: "Practice Problems",
            description: "Real-world applications and problem sets to solidify understanding.",
            component: Practice,
            id: "practice-problem"
        },
        {
            title: "Performance Analysis",
            icon: TrendingUp,
            type: "Analyze Complexity",
            description: "Time and space complexity breakdown for HashMap frequency counting.",
            component: Complexity,
            id: "complexity-section"
        },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
            <nav className="sticky top-0 z-50 w-full px-6 py-4 border-b border-white/10 backdrop-blur-lg bg-slate-950/90">
                <div className="w-full flex items-center justify-between">
                    <Link href="/home">
                        <div className="flex items-center gap-3 group">
                            <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-600 rounded-lg blur-sm opacity-80 group-hover:opacity-100"></div>
                                <div className="absolute inset-0 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700/50">
                                    <BookOpen className="h-5 w-5 text-blue-400 group-hover:text-violet-300 transition-colors" />
                                </div>
                            </div>
                            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 transition-all group-hover:from-blue-300 group-hover:to-violet-300">
                                Code Morph
                            </span>
                        </div>
                    </Link>


                    <div className="flex items-center gap-3">
                        <span className="text-sm text-white/60 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/30">
                            Version 2.0
                        </span>

                    </div>
                </div>
            </nav>
            {/* Header Section */}
            <div className="relative bg-slate-900 border-b border-slate-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10" />
                <div className="relative container mx-auto px-6 py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent leading-normal"
                        >
                            HashMap Frequency Algorithm
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-300 leading-relaxed"
                        >
                            Learn how to count the frequency of elements in an array using HashMap. This efficient
                            algorithm helps you manage large datasets and find element frequencies in O(n) time complexity.
                        </motion.p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-16">
                {/* Interactive Visualization */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="mb-16 bg-slate-900/50 border-slate-800 shadow-2xl backdrop-blur-sm">
                        <CardHeader className="border-b border-slate-800">
                            <CardTitle className="text-2xl font-bold text-slate-200">
                                Algorithm Visualization
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-950/50 p-8 rounded-lg backdrop-blur-sm">
                                <HashMapVisualizer />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Navigation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {contentSections.map((section, index) => (
                        <motion.div
                            key={section.type}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 * index }}
                        >
                            <Card
                                className="cursor-pointer transition-all bg-slate-900/50 border-slate-800
                  backdrop-blur-sm hover:bg-slate-800/50 hover:ring-1 hover:ring-violet-500"
                                onClick={() => scrollToSection(section.id)}
                            >
                                <CardContent className="p-8">
                                    <section.icon className="w-10 h-10 mb-6 text-violet-400" />
                                    <h3 className="text-xl font-bold text-slate-200 mb-3">
                                        {section.title}
                                    </h3>
                                    <p className="text-slate-400">
                                        {section.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Content Sections */}
                <div className="space-y-16">
                    {contentSections.map((section, index) => (
                        <motion.div
                            key={section.type}
                            id={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 * index }}
                        >
                            <Card className="bg-slate-900/50 border-slate-800 shadow-2xl backdrop-blur-sm">
                                <CardHeader className="border-b border-slate-800">
                                    <div className="flex items-center space-x-4">
                                        <section.icon className="w-8 h-8 text-violet-400" />
                                        <CardTitle className="text-2xl font-bold text-slate-200">
                                            {section.title}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 text-slate-300">
                                    {/* Custom Layout Check */}
                                    {section.id === "theory-section" ? (
                                        <div className="p-6 bg-slate-900 rounded-lg shadow-xl max-w-auto mx-auto">
                                            <h1 className="text-2xl font-bold text-white mb-6">HashMap Frequency Counting Algorithm Theory</h1>
                                            <Theory />
                                        </div>
                                    ) : (
                                        <section.component />
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
            <footer className="w-full bg-gray-900/80 backdrop-blur-md border-t border-gray-800/50 py-6">
                <div className="container mx-auto px-8 max-w-7xl">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-400">
                            © 2025 CodeMorph. All rights reserved.
                        </div>
                        <div className="flex items-center space-x-6">
                            <Link
                                href="/contact"
                                className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300"
                            >
                                Contact Us
                            </Link>
                            <Link
                                href="/terms&cons"
                                className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300"
                            >
                                Terms & Conditions
                            </Link>
                            <Link
                                href="/privacy"
                                className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/creators"
                                className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300"
                            >
                                Creators
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HashMapPage;
