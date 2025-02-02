"use client";

import React from 'react';
import CycleDetection from "@/components/haretortoisealgo/cycledetection";
import { Theory, CodeSnippet, Practice, Complexity } from "@/utils/haretortoisealgo/cycleDetection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BookOpen, Code, Brain, TrendingUp } from 'lucide-react';

const CycleDetectionPage = () => {

    const contentSections = [
        {
            title: "Algorithm Theory",
            icon: BookOpen,
            type: "Learn Theory",
            description: "Understanding Floyd's Cycle Detection Algorithm",
            component: Theory,
            id: "theory-section"
        },
        {
            title: "Implementation",
            icon: Code,
            type: "View Code",
            description: "Implementing cycle detection with examples",
            component: CodeSnippet,
            id: "implementation-section"

        },
        {
            title: "Practice Examples",
            icon: Brain,
            type: "Practice Problems",
            description: "LeetCode problems and real-world applications",
            component: Practice,
            id: "practice-section"
            
        },
        {
            title: "Performance Analysis",
            icon: TrendingUp,
            type: "Analyze Complexity",
            description: "Time and space complexity analysis",
            component: Complexity,
            id: "complexity-section"
            
        }
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
            {/* Header Section */}
            <div className="relative bg-slate-900 border-b border-slate-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10" />
                <div className="relative container mx-auto px-6 py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent"
                        >
                            Cycle Detection in Linked Lists 
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-300 leading-relaxed"
                        >
                            Floyd&apos;s Cycle Detection Algorithm, also known as the &quot;tortoise and hare&quot; algorithm,
                            is an elegant solution for detecting cycles in linked lists. By using two pointers
                            moving at different speeds, the algorithm can determine whether a linked list contains
                            a cycle and find the start of the cycle if one exists.
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
                                Cycle Detection Visualization
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-950/50 p-8 rounded-lg backdrop-blur-sm">
                                <CycleDetection />
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
                                                 <section.component />
                                             </CardContent>
                                         </Card>
                                     </motion.div>
                                 ))}
                             </div>
                         </div>
                     </div>
                 );
             };
             
export default CycleDetectionPage;