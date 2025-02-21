/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, User, Settings } from "lucide-react";
import { algorithms } from "@/utils/algorithmData";
import { SearchSection } from "@/components/homePage/SearchSection";
import { AlgorithmList } from "@/components/homePage/AlgorithmList";




const  UserProfileSection: React.FC = () => {
    const { signOut } = useClerk();
    const { user } = useUser();
 
    const handleSignOut = async () => {
        await signOut();
    };

    if (!user) return null;

    return (
        <div className="bg-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                    <img
                        src={user.imageUrl}
                        alt={user.fullName || "User Profile"}
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-600 shadow-md transition-transform hover:scale-105"
                    />
                    <div className="absolute bottom-1 right-1 bg-blue-600 p-1.5 rounded-full shadow-md">
                        <User className="w-5 h-5 text-white" />
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-xl font-bold text-white truncate max-w-[240px]">
                        {user.fullName}
                    </h2>
                    <p className="text-sm text-gray-300 mt-1">
                        {user.username || user.emailAddresses[0].emailAddress}
                    </p>
                </div>

                <div className="flex space-x-4 w-full">
                    <button
                        onClick={handleSignOut}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-semibold text-red-500 hover:text-white border-2 border-red-500 hover:border-red-600 rounded-lg transition-all duration-300 ease-in-out hover:bg-red-600"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                    </button>
                    <Link
                        href="/Dashboard"
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-semibold text-gray-300 hover:text-white border-2 border-gray-600 hover:border-gray-500 rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-700"
                    >
                        <Settings className="h-5 w-5" />
                        <span>DashBoard</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const HomePage: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-gray-950 text-gray-100">
            {/* Sidebar */}
            <aside className="w-96 bg-gray-900 border-r border-gray-800 shadow-2xl">
                <div className="p-6 h-full">
                    <UserProfileSection />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-auto">
                <div className="container mx-auto px-10 py-12 max-w-7xl">
                    <header className="mb-12 text-center">
                        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-6 leading-normal">
                            Code Morph
                        </h1>
                        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                            Explore and understand complex algorithmic concepts through interactive, intuitive visualizations that bring computational thinking to life.
                        </p>
                    </header>

                    <div className="space-y-10">
                        <SearchSection />
                        <AlgorithmList initialAlgorithms={algorithms} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;