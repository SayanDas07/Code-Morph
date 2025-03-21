/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";

export default function TermsAndConditionsPage() {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    // Format current date as Month DD, YYYY
    const formatDate = () => {
        const date = new Date();
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Handle scrolling effects
    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Table of contents sections
    const sections = [
        { id: "introduction", title: "Introduction" },
        { id: "user-accounts", title: "User Accounts" },
        { id: "intellectual-property", title: "Intellectual Property" },
        { id: "termination", title: "Termination" },
        { id: "limitation", title: "Limitation of Liability" },
        { id: "changes", title: "Changes" },
        { id: "contact", title: "Contact Us" },
    ];

    // Scroll to section
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100,
                behavior: 'smooth'
            });
            setActiveSection(id);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col">
            {/* Navbar - Added from StoreUserPage */}
            <nav className="w-full px-6 py-4 border-b border-white/10 backdrop-blur-md bg-slate-950/80">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="relative w-10 h-10">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-sm"></div>
                            <div className="absolute inset-0 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
                                <BookOpen className="h-5 w-5 text-blue-400" />
                            </div>
                        </div>
                        <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Code Morph
                        </span>
                    </div>

                    <div className="text-center">
                        <span className="text-5xl font-bold text-white mb-4 tracking-tight">
                            Terms & Conditions
                        </span>
                    </div>

                    <span className="text-sm text-white/70">
                        Last updated: {formatDate()}
                    </span>
                </div>
            </nav>


            <div className="container mx-auto px-4 lg:px-0 pb-20">
                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    {/* Sticky sidebar navigation */}
                    <div className="hidden lg:block">
                        <div className="sticky top-10 bg-white/10 backdrop-blur-md rounded-xl p-6 mt-8 border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4">Contents</h3>
                            <ul className="space-y-3">
                                {sections.map((section) => (
                                    <li key={section.id}>
                                        <button
                                            onClick={() => scrollToSection(section.id)}
                                            className={`text-left w-full py-2 px-3 rounded-lg transition-all ${activeSection === section.id
                                                ? 'bg-white/20 text-white font-medium'
                                                : 'text-blue-200 hover:bg-white/10'
                                                }`}
                                        >
                                            {section.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <Link
                                    href="/continue"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all font-medium"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                    Back to Complete Your Profile
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="lg:col-span-3 mt-8">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/10 space-y-12 text-white">
                            {/* Introduction */}
                            <section id="introduction" className="scroll-mt-24">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4 flex-shrink-0">
                                        <span className="text-xl font-bold">1</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-blue-200">Introduction</h2>
                                </div>
                                <div className="pl-16">
                                    <p className="mb-4 text-lg leading-relaxed">Welcome to <Link href="https://code-morph-delta.vercel.app/">
                                        <span className="font-semibold text-blue-300">CodeMorph</span>
                                    </Link>. These Terms and Conditions govern your use of our website and services.</p>
                                    <p className="text-lg leading-relaxed">By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>
                                </div>
                            </section>

                            {/* User Accounts */}
                            <section id="user-accounts" className="scroll-mt-24">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4 flex-shrink-0">
                                        <span className="text-xl font-bold">2</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-blue-200">User Accounts</h2>
                                </div>
                                <div className="pl-16">
                                    <p className="mb-4 text-lg leading-relaxed">When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</p>
                                    <p className="mb-4 text-lg leading-relaxed">You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.</p>
                                    <p className="text-lg leading-relaxed">You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
                                </div>
                            </section>

                            {/* Intellectual Property */}
                            <section id="intellectual-property" className="scroll-mt-24">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4 flex-shrink-0">
                                        <span className="text-xl font-bold">3</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-blue-200">Intellectual Property</h2>
                                </div>
                                <div className="pl-16">
                                    <p className="mb-4 text-lg leading-relaxed">The service and its original content, features, and functionality are and will remain the exclusive property of our company and its licensors.</p>
                                    <p className="text-lg leading-relaxed">Our service may contain links to third-party websites or services that are not owned or controlled by our company. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.</p>
                                </div>
                            </section>

                            {/* Termination */}
                            <section id="termination" className="scroll-mt-24">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4 flex-shrink-0">
                                        <span className="text-xl font-bold">4</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-blue-200">Termination</h2>
                                </div>
                                <div className="pl-16">
                                    <p className="mb-4 text-lg leading-relaxed">We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                                    <p className="text-lg leading-relaxed">Upon termination, your right to use the service will immediately cease. If you wish to terminate your account, you may simply discontinue using the service.</p>
                                </div>
                            </section>

                            {/* Limitation of Liability */}
                            <section id="limitation" className="scroll-mt-24">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4 flex-shrink-0">
                                        <span className="text-xl font-bold">5</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-blue-200">Limitation of Liability</h2>
                                </div>
                                <div className="pl-16">
                                    <p className="mb-4 text-lg leading-relaxed">In no event shall our company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
                                </div>
                            </section>

                            {/* Changes */}
                            <section id="changes" className="scroll-mt-24">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4 flex-shrink-0">
                                        <span className="text-xl font-bold">6</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-blue-200">Changes</h2>
                                </div>
                                <div className="pl-16">
                                    <p className="mb-4 text-lg leading-relaxed">We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days&apos; notice prior to any new terms taking effect.</p>
                                    <p className="text-lg leading-relaxed">By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the service.</p>
                                </div>
                            </section>

                            {/* Contact Us */}
                            <section id="contact" className="scroll-mt-24">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4 flex-shrink-0">
                                        <span className="text-xl font-bold">7</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-blue-200">Contact Us</h2>
                                </div>
                                <div className="pl-16">
                                    <p className="text-lg leading-relaxed">If you have any questions about these Terms, please contact us at <a href="mailto:support@example.com" className="text-blue-300 underline hover:text-blue-200 transition-colors">support@example.com</a>.</p>
                                </div>
                            </section>
                        </div>

                        {/* Mobile back button */}
                        <div className="mt-10 lg:hidden">
                            <Link
                                href="/store-user"
                                className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium text-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Return to Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}