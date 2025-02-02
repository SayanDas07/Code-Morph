"use client";
import React, { useState, useRef } from "react";
import WindowAnimationMaxConsecutiveOnes from "@/components/slidingwindowalgo/FlipKZero";
import { Theory, CodeSnippet, Practice, Complexity } from "@/utils/slidingwindowalgo/flipKzero";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BookOpen, Code, Brain, TrendingUp } from "lucide-react";

interface ContentSection {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  type: string;
  description: string;
  ref: React.RefObject<HTMLDivElement | null>;
}

const SlidingWindowPage: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const contentSections: ContentSection[] = [
    {
      title: "Algorithm Theory",
      icon: BookOpen,
      type: "Learn Theory",
      description: "Understanding the fundamental concepts and mechanics",
      ref: useRef<HTMLDivElement | null>(null),
    },
    {
      title: "Implementation",
      icon: Code,
      type: "View Code",
      description: "Step-by-step code implementation with explanations",
      ref: useRef<HTMLDivElement | null>(null),
    },
    {
      title: "Practice Examples",
      icon: Brain,
      type: "Practice Problems",
      description: "Real-world applications and problem sets",
      ref: useRef<HTMLDivElement | null>(null),
    },
    {
      title: "Performance Analysis",
      icon: TrendingUp,
      type: "Analyze Complexity",
      description: "Time and space complexity breakdown",
      ref: useRef<HTMLDivElement | null>(null),
    },
  ];

  const renderContent = (type: string) => {
    switch (type) {
      case "Learn Theory":
        return <Theory />;
      case "Practice Problems":
        return <Practice />;
      case "View Code":
        return <CodeSnippet />;
      case "Analyze Complexity":
        return <Complexity />;
      default:
        return null;
    }
  };
  // Function to handle the click event and scroll to the respective section
  const handleClick = (section: ContentSection) => {
    // Scroll to the section using the ref
    section.ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start", // Ensures the section scrolls to the top of the viewport
    });

    // Toggle the selected content
    setSelectedContent(selectedContent === section.type ? null : section.type);
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
              Maximum Consecutive Ones After Flipping K Zeros
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-300 leading-relaxed"
            >
              The Sliding Window technique optimizes this problem by flipping at most `k` zeros to maximize consecutive 1&apos;s.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Visualization */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="mb-16 bg-slate-900/50 border-slate-800 shadow-2xl backdrop-blur-sm w-auto">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-2xl font-bold text-slate-200">Algorithm Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-950/50 p-8 rounded-lg backdrop-blur-sm">
                <WindowAnimationMaxConsecutiveOnes array={[1, 0, 1, 1, 0, 1, 0, 1, 1, 1]} k={2}/>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contentSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
              >
                <Card
                  className={`cursor-pointer h-full transition-all bg-slate-900/50 border-slate-800
                          backdrop-blur-sm hover:bg-slate-800/50 
                          ${selectedContent === section.type ? "ring-2 ring-violet-500 shadow-lg shadow-violet-500/20" : "hover:ring-1 hover:ring-slate-700"}`}
                  onClick={() => handleClick(section)}
                >
                  <CardContent className="p-8">
                    <section.icon
                      className={`w-10 h-10 mb-6 ${selectedContent === section.type ? "text-violet-400" : "text-slate-400"}`}
                    />
                    <h3 className="text-xl font-bold text-slate-200 mb-3">{section.title}</h3>
                    <p className="text-slate-400">{section.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Section Content Rendered Here */}
          {contentSections.map((section, index) => (
            <div
              key={section.type}
              ref={section.ref}  // Ensure each section has a ref
              className="mt-8"
            >
              {/* Only render the content for the selected section */}
              {selectedContent === section.type && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                >
                  <Card className="bg-slate-900/50 border-slate-800 shadow-2xl backdrop-blur-sm">
                    <CardHeader className="border-b border-slate-800">
                      <CardTitle className="text-2xl font-bold text-slate-200">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 text-slate-300">{renderContent(section.type)}</CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlidingWindowPage;
