/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, User, Settings, Github, Linkedin, Code, BookOpen, Award } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import { SearchSection } from "@/components/homePage/SearchSection";
import { AlgorithmList } from "@/components/homePage/AlgorithmList";
import { algorithms } from "@/utils/algorithmData";

interface UserDetails {
  id: string;
  clerkId: string;
  firstName: string;
  lastName: string | null;
  email: string;
  image: string | null;
  githubLink: string | null;
  linkedinLink: string | null;
  leetcodeLink: string | null;
  solvedProblems: {
    problemId: string;
    problemName: string;
    difficulty: string;
    solvedAt: Date;
  }[];
}

const UserProfileSection: React.FC = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await fetch('/api/getUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        setUserDetails(data.currentUser);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load your profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserDetails();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      // Wait briefly to show loading animation
      await new Promise(resolve => setTimeout(resolve, 1000));
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      setSigningOut(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 border-t-2 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <div className="text-center text-red-400">
          <p>{error || "User profile not found"}</p>
          <Link href="/continue">
            <button
              className="mt-4 px-2 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 text-sm"
            >
              Complete Your Profile by clicking here
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const fullName = `${userDetails.firstName} ${userDetails.lastName || ''}`.trim();
  const displayImage = userDetails.image || user.imageUrl;
  const displayUsername = user.username || userDetails.email;

  // Check if user has any social links
  const hasSocialLinks = userDetails.githubLink || userDetails.linkedinLink || userDetails.leetcodeLink;

  const formatLink = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return url;
    }
  };

  return (
    <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50">
      {signingOut && (
        <div className="mb-6 p-3 bg-gray-900/80 rounded-xl flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400 border-t-2 border-t-transparent"></div>
          <span className="text-blue-400 text-sm font-medium">Signing you out securely...</span>
        </div>
      )}

      <div className="flex flex-col items-center space-y-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Link href="/Dashboard">
            <img
              src={displayImage}
              alt={fullName || "User Profile"}
              className="relative w-32 h-32 rounded-full object-cover border-4 border-gray-700 shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          <div className="absolute bottom-1 right-1 bg-gradient-to-r from-blue-500 to-purple-600 p-1.5 rounded-full shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 truncate max-w-[240px]">
            {fullName}
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            {displayUsername}
          </p>
          {userDetails.solvedProblems && (
            <Link href="/Dashboard" legacyBehavior>
              <a className="mt-3 inline-flex items-center px-3 py-1 space-x-2 bg-green-500/20 rounded-full text-green-400 border border-green-500/30 hover:bg-green-500/30 transition">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">{userDetails.solvedProblems.length} Problems Solved</span>
              </a>
            </Link>
          )}
        </div>

        {hasSocialLinks && (
          <div className="w-full space-y-3 bg-gray-900/80 p-5 rounded-xl border border-gray-700/50 backdrop-blur-sm">
            <h3 className="text-md font-medium text-blue-400 border-b border-gray-700 pb-2 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Social Links</span>
            </h3>

            {userDetails.githubLink && (
              <a
                href={userDetails.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 p-3 rounded-lg transition-all duration-300 group"
              >
                <Github size={18} className="flex-shrink-0 text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span className="truncate">{formatLink(userDetails.githubLink)}</span>
              </a>
            )}

            {userDetails.linkedinLink && (
              <a
                href={userDetails.linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 p-3 rounded-lg transition-all duration-300 group"
              >
                <Linkedin size={18} className="flex-shrink-0 text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span className="truncate">{formatLink(userDetails.linkedinLink)}</span>
              </a>
            )}

            {userDetails.leetcodeLink && (
              <a
                href={userDetails.leetcodeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 p-3 rounded-lg transition-all duration-300 group"
              >
                <Code size={18} className="flex-shrink-0 text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span className="truncate">{formatLink(userDetails.leetcodeLink)}</span>
              </a>
            )}
          </div>
        )}

        <div className="flex space-x-4 w-full">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold text-red-400 hover:text-white border-2 border-red-500/50 hover:border-red-500 rounded-xl transition-all duration-300 ease-in-out hover:bg-red-500/20 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
          <Link
            href="/Dashboard"
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold text-gray-300 hover:text-white border-2 border-gray-700 hover:border-blue-500 rounded-xl transition-all duration-300 ease-in-out hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-purple-500/20 backdrop-blur-sm"
          >
            <Settings className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Added Globe component for social links section
const Globe: React.FC<{ className: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// Footer component
const Footer: React.FC = () => {
  return (
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
  );
};

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100 bg-[url('/assets/grid-pattern.svg')] bg-fixed">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-max-auto bg-gray-900/80 backdrop-blur-md shadow-2xl relative z-10 border-r border-gray-800/50">
          <div className="p-6 h-full flex flex-col">
            <div className="mb-8 flex items-center justify-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-sm"></div>
                  <div className="absolute inset-0 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Code Morph
                </span>
              </Link>
            </div>

            <UserProfileSection />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900 overflow-auto">
          <div className="container mx-auto px-8 py-12 max-w-7xl relative z-0">
            <div className="space-y-10">
              <SearchSection />
              <AlgorithmList initialAlgorithms={algorithms} />
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;