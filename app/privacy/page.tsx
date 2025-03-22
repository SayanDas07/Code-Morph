/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";

export default function PrivacyPolicyPage() {
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
        { id: "information-collection", title: "Information Collection" },
        { id: "use-of-information", title: "Use of Information" },
        { id: "data-sharing", title: "Data Sharing" },
        { id: "data-security", title: "Data Security" },
        { id: "user-rights", title: "Your Rights" },
        { id: "cookies", title: "Cookies Policy" },
        { id: "children", title: "Children's Privacy" },
        { id: "changes", title: "Changes to Policy" },
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
            {/* Navbar */}
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
                            Privacy Policy
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
                                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mr-4 flex-shrink-0">
                                        <span className="text-xl font-bold">1</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-blue-200">Introduction</h2>
                                </div>
                                <div className="pl-16">
                                    <p className="mb-4 text-lg leading-relaxed">At <Link href="https://code-morph-delta.vercel.app/">
                                        <span className="font-semibold text-blue-300">CodeMorph</span>
                                    </Link>, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
                                    <p className="text-lg leading-relaxed">We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the &quot;Last updated&quot; date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.</p>
                                </div>
                            </section>

                            {/* Information Collection */}
                            <section id="information-collection" className="scroll-mt-24">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mr-4 flex-shrink-0">
                                        <span className="text-xl font-bold">2</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-blue-200">Information Collection</h2>
                                </div>
                                <div className="pl-16">
                                    <p className="mb-4 text-lg leading-relaxed">We may collect information about you in a variety of ways. The information we may collect via the Website includes:</p>

                                    <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-3">Personal Data</h3>
                                    <p className="mb-4 text-lg leading-relaxed">Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the Website or when you choose to participate in various activities related to the Website. You are under no obligation to provide us with personal information of any kind, however your refusal to do so may prevent you from using certain features of the Website.</p>

                                    <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-3">Derivative Data</h3>
                                    <p className="mb-4 text-lg leading-relaxed">Information our servers automatically collect when you access the Website, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Website.</p>

                                    <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-3">Financial Data</h3>
                                    <p className="text-lg leading-relaxed">Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Website. We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor and you are encouraged to review their privacy policy and contact them directly for responses to your questions.</p>
                                </div>
                            </section>

                            {/* Use of Information */}
                            <section id="use-of-information" className="scroll-mt-24">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mr-4 flex-shrink-0">
                                        <span className="text-xl font-bold">3</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-blue-200">Use of Information</h2>
                                </div>
                                <div className="pl-16">
                                    <p className="mb-4 text-lg leading-relaxed">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Website to:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-lg">
                                        <li>Create and manage your account.</li>
                                        <li>Process your transactions and payments.</li>
                                        <li>Send you administrative communications.</li>
                                        <li>Send you email newsletters and updates.</li>
                                        <li>Deliver targeted advertising, newsletters, and other information regarding promotions and the Website to you.</li>
                                        <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Website.</li>
                                        <li>Monitor and analyze usage and trends to improve your experience with the Website.</li>
                                        <li>Notify you of updates to the Website.</li>
                                        <li>Resolve disputes and troubleshoot problems.</li>
                                        <li>Respond to product and customer service requests.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Data Sharing */}
                            <section id="data-sharing" className="scroll-mt-24">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mr-4 flex-shrink-0">
                                        <span className="text-xl font-bold">4</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-blue-200">Data Sharing</h2>
                                </div>
                                <div className="pl-16">
                                    <p className="mb-4 text-lg leading-relaxed">We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>

                                    <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-3">By Law or to Protect Rights</h3>
                                    <p className="mb-4 text-lg leading-relaxed">If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</p>

                                    <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-3">Third-Party Service Providers</h3>
                                    <p className="mb-4 text-lg leading-relaxed">We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</p>

                                    <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-3">Marketing Communications</h3>
                                    <p className="text-lg leading-relaxed">With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.</p>
                                </div>
                            </section>

                            {/* Data Security */}
                            <section id="data-security" className="scroll-mt-24">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mr-4 flex-shrink-0">
                                        <span className="text-xl font-bold">5</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-blue-200">Data Security</h2>
                                </div>
                                <div className="pl-16">
                                    <p className="mb-4 text-lg leading-relaxed">We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
                                    <p className="text-lg leading-relaxed">Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee complete security if you provide personal information.</p>
                                </div>
                            </section>

                            {/* User Rights */}
                            <section id="user-rights" className="scroll-mt-24">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mr-4 flex-shrink-0">
                                        <span className="text-xl font-bold">6</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-blue-200">Your Rights</h2>
                                </div>
                                <div className="pl-16">
                                    <p className="mb-4 text-lg leading-relaxed">You have certain rights regarding the personal information we collect about you. These include:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-lg">
                                        <li>The right to access personal information we hold about you</li>
                                        <li>The right to request that we correct any personal information if it is found to be inaccurate or out of date</li>
                                        <li>The right to request that your personal information is erased where it is no longer necessary for us to retain such data</li>
                                        <li>The right to withdraw your consent to the processing at any time, where consent was the lawful basis for processing the data</li>
                                        <li>The right to request that we provide you with your personal data and where possible, to transmit that data directly to another data controller</li>
                                        <li>The right, where there is a dispute in relation to the accuracy or processing of your personal data, to request a restriction is placed on further processing</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Cookies Policy */}
                            <section id="cookies" className="scroll-mt-24">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mr-4 flex-shrink-0">
                                        <span className="text-xl font-bold">7</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-blue-200">Cookies Policy</h2>
                                </div>
                                <div className="pl-16">
                                    <p className="mb-4 text-lg leading-relaxed">The Website uses cookies to help personalize your online experience. A cookie is a text file that is placed on your hard disk by a web page server. Cookies cannot be used to run programs or deliver viruses to your computer. Cookies are uniquely assigned to you, and can only be read by a web server in the domain that issued the cookie to you.</p>
                                    <p className="mb-4 text-lg leading-relaxed">We may use cookies to collect, store, and track information for statistical purposes to operate our Website. You have the ability to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer.</p>
                                </div>
                            </section>

                            {/* Children's Privacy */}
                            <section id="children" className="scroll-mt-24">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mr-4 flex-shrink-0">
                                        <span className="text-xl font-bold">8</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-blue-200">Children&apos;s Privacy</h2>
                                </div>
                                <div className="pl-16">
                                    <p className="mb-4 text-lg leading-relaxed">We do not knowingly collect personally identifiable information from children under the age of 13. If you are under the age of 13, you must ask your parent or guardian for permission to use this Website. If we learn we have collected or received personal information from a child under 13 without verification of parental consent, we will delete that information.</p>
                                </div>
                            </section>

                            {/* Changes to Policy */}
                            <section id="changes" className="scroll-mt-24">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mr-4 flex-shrink-0">
                                        <span className="text-xl font-bold">9</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-blue-200">Changes to Policy</h2>
                                </div>
                                <div className="pl-16">
                                    <p className="mb-4 text-lg leading-relaxed">We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the &quot;Last updated&quot; date of this Privacy Policy. Any changes or modifications will be effective immediately upon posting the updated Privacy Policy on the Website, and you waive the right to receive specific notice of each such change or modification.</p>
                                    <p className="text-lg leading-relaxed">You are encouraged to periodically review this Privacy Policy to stay informed of updates. You will be deemed to have been made aware of, will be subject to, and will be deemed to have accepted the changes in any revised Privacy Policy by your continued use of the Website after the date such revised Privacy Policy is posted.</p>
                                </div>
                            </section>

                            {/* Contact Us */}
                            <section id="contact" className="scroll-mt-24">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mr-4 flex-shrink-0">
                                        <span className="text-xl font-bold">10</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-blue-200">Contact Us</h2>
                                </div>
                                <div className="pl-16">
                                    <p className="text-lg leading-relaxed">If you have questions or comments about this Privacy Policy, please <Link href="/contact">
                                        <span className="text-blue-300 underline hover:text-blue-200 transition-colors">contact Us</span>.
                                    </Link></p>
                                </div>
                            </section>
                        </div>

                        {/* Mobile back button */}
                        <div className="mt-10 lg:hidden">
                            <Link
                                href="/store-user"
                                className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-medium text-lg"
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