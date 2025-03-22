"use client";
import Form from "@/components/contacts/Form";
import { Mail, Phone, BookOpen } from 'lucide-react';

export default function Contact() {
    const contactMethods = [
        { icon: <Mail className="h-5 w-5" />, text: "sayandasraja0778@gmail.com", label: "Email" },
        { icon: <Phone className="h-5 w-5" />, text: "+91 7003452992", label: "Phone" },
        { icon: <Mail className="h-5 w-5" />, text: "jeetsarkarst353@gmail.com", label: "Email" },
        { icon: <Phone className="h-5 w-5" />, text: "+91 9330352190", label: "Phone" },

    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col">
            {/* Navigation */}
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

                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <span className="text-5xl font-bold text-white mb-4 tracking-tight">
                            Contact Us
                        </span>
                    </div>

                    {/* Empty div to maintain flex spacing */}
                    <div className="w-[150px]"></div>
                </div>
            </nav>
            {/* Main content */}
            <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-8 lg:py-8">
                <div className="relative">

                    {/* Header section */}
                    <div className="text-center mb-16">

                        <p className="text-slate-400 max-w-2xl mx-auto text-xl">
                            Do you have any inquiries or issues?
                            Reach out to us through the form below or use any of our contact channels.
                        </p>


                    </div>

                    {/* Content grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                        {/* Contact form */}
                        <div className="lg:col-span-3">
                            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 sm:p-8 shadow-xl">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold text-white mb-2">Send us a message</h2>
                                    <p className="text-slate-400">We will get back to you as soon as possible.</p>
                                </div>
                                <Form />
                            </div>
                        </div>

                        {/* Contact information */}
                        <div className="lg:col-span-2">
                            <div className="space-y-6">
                                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 sm:p-8 shadow-xl">
                                    <h2 className="text-2xl font-semibold text-white mb-6">Direct Contact Information</h2>
                                    <div className="space-y-4">
                                        {contactMethods.map((method, index) => (
                                            <div key={index} className="flex items-start">
                                                <div className="mt-1 mr-4 p-2 bg-slate-800/50 rounded-lg text-blue-400">
                                                    {method.icon}
                                                </div>
                                                <div>
                                                    <p className="text-slate-400 text-sm">{method.label}</p>
                                                    <p className="text-white font-medium">{method.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 sm:p-8 shadow-xl">
                                    <h2 className="text-2xl font-semibold text-white mb-4">Contact Hours</h2>
                                    <div className="space-y-2">
                                        <p className="text-slate-300">Anytime between MONDAY - FRIDAY</p>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}