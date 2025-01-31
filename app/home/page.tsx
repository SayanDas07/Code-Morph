/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";
import { algorithms } from "@/utils/algorithmData";
import { SearchSection } from "@/components/homePage/SearchSection";
import { AlgorithmList } from "@/components/homePage/AlgorithmList";

const HomePage = () => {
    const { signOut } = useClerk();
    const { user } = useUser();

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <div className="flex min-h-screen bg-gray-950 text-gray-100">
            {/* Sidebar */}
            <aside className="w-72 bg-gray-900 border-r border-gray-800 shadow-xl">
                <div className="p-6 flex flex-col h-full">
                    {/* User Profile Section */}
                    {user && (
                        <div className="flex flex-col items-center space-y-4 mb-8">
                            <div className="avatar border-4 border-gray-700 p-1 rounded-full transition-transform hover:scale-105">
                                <img
                                    src={user.imageUrl}
                                    alt={user.username || user.emailAddresses[0].emailAddress}
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            </div>
                            <span className="text-gray-200 text-lg font-semibold text-center truncate max-w-full">
                                {user.username || user.emailAddresses[0].emailAddress}
                            </span>
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-red-500 hover:text-white border border-red-500 hover:border-white rounded-lg transition-all duration-300 ease-in-out hover:bg-red-600 shadow-md"
                            >
                                <LogOutIcon className="h-5 w-5" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
                <div className="container mx-auto px-8 py-10">
                    <h1 className="text-3xl font-bold text-white text-center mb-6">
                        Algorithm Visualizer
                    </h1>
                    <SearchSection />
                    <AlgorithmList initialAlgorithms={algorithms} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
