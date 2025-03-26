/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import Head from 'next/head';
import { BookOpen, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface GithubProfile {
    login: string;
    avatar_url: string;
    bio?: string;
    name: string;
    public_repos?: number;
    followers?: number;
    html_url: string;
    company?: string;
    blog?: string;
    location?: string;
    email?: string;
}


const fallbackProfiles: Record<string, GithubProfile> = {
    "Ironsoldier353": {
        login: "Ironsoldier353",
        avatar_url: "/images/jeet-sarkar.jpeg",
        bio: "Developer and Creator of Code Morph. Data Science enthusiast.",
        name: "Jeet Sarkar",
        html_url: "https://github.com/Ironsoldier353",
        location: "kolkata, India",
    },
    "SayanDas07": {
        login: "SayanDas07",
        avatar_url: "/images/sayan-das.jpeg",
        bio: "Lead Developer and Creator of Code Morph. ML Engineer and Full Stack Web Developer.",
        name: "Sayan Das",

        html_url: "https://github.com/SayanDas07",

        location: "Kolkata, India"
    }
};

const GithubCreator: React.FC<{
    username: string;
    linkedinUrl?: string;
}> = ({
    username,
    linkedinUrl
}) => {
        const [profileData, setProfileData] = useState<GithubProfile | null>(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const [usingFallback, setUsingFallback] = useState(false);

        useEffect(() => {
            const fetchGithubData = async () => {
                try {
                    setLoading(true);

                    // Fetch GitHub profile
                    const profileResponse = await fetch(`https://api.github.com/users/${username}`);

                    if (profileResponse.status === 403) {
                        // API rate limit likely exceeded
                        console.warn("GitHub API rate limit likely exceeded, using fallback data");

                        if (fallbackProfiles[username]) {
                            setProfileData(fallbackProfiles[username]);
                            setUsingFallback(true);
                        } else {
                            throw new Error(`Rate limit exceeded and no fallback data for ${username}`);
                        }
                    } else if (!profileResponse.ok) {
                        throw new Error(`Failed to fetch GitHub profile for ${username}`);
                    } else {
                        const fetchedProfileData: GithubProfile = await profileResponse.json();
                        setProfileData(fetchedProfileData);
                        setUsingFallback(false);
                    }

                    setLoading(false);
                } catch (error) {
                    console.error(`Error fetching data for ${username}:`, error);

                    // Try to use fallback data if available
                    if (fallbackProfiles[username]) {
                        console.log(`Using fallback data for ${username}`);
                        setProfileData(fallbackProfiles[username]);
                        setUsingFallback(true);
                        setError(null);
                    } else {
                        setError(`Failed to load GitHub profile for ${username}`);
                    }

                    setLoading(false);
                }
            };

            fetchGithubData();
        }, [username]);

        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center bg-slate-800 bg-opacity-30 rounded-lg p-12 backdrop-blur-sm border border-slate-700">
                    <Loader2 className="h-12 w-12 animate-spin text-emerald-400 mb-4" />
                    <p className="text-slate-300">Loading GitHub profile...</p>
                </div>
            );
        }

        if (error || !profileData) {
            return (
                <div className="bg-red-900/30 border border-red-700 text-red-200 p-6 rounded-lg">
                    <p>{error || "Failed to load GitHub profile"}</p>
                    <a
                        href={`https://github.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 text-white bg-red-700/50 hover:bg-red-700 px-4 py-2 rounded-md transition-colors"
                    >
                        Visit GitHub profile directly
                    </a>
                </div>
            );
        }

        return (
            <div className="flex flex-col bg-slate-800 bg-opacity-30 rounded-lg p-6 backdrop-blur-sm border border-slate-700 hover:border-slate-500 transition-all duration-300">
                {usingFallback && (
                    <div className="mb-4 text-amber-400 text-sm bg-amber-900/20 border border-amber-700/30 rounded p-2">
                        Note: Using cached profile data due to GitHub API limits. Data may not be current.
                    </div>
                )}
                <div className="flex flex-col md:flex-row items-center mb-6">
                    <div className="w-36 h-36 md:w-48 md:h-48 relative rounded-full overflow-hidden border-4 border-slate-700 mb-4 md:mb-0 md:mr-8">
                        {profileData.avatar_url && (
                            <img
                                src={profileData.avatar_url}
                                alt={profileData.name || username}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">{profileData.name || username}</h3>
                        <p className="text-emerald-400 text-lg mb-2">@{profileData.login}</p>

                        {profileData.bio && (
                            <p className="text-slate-300 mb-4">{profileData.bio}</p>
                        )}

                        <div className="flex flex-wrap gap-3 mb-4">
                            {profileData.location && (
                                <span className="text-sm bg-slate-700/50 px-3 py-1 rounded-full text-slate-300">
                                    📍 {profileData.location}
                                </span>
                            )}
                            {profileData.company && (
                                <span className="text-sm bg-slate-700/50 px-3 py-1 rounded-full text-slate-300">
                                    🏢 {profileData.company}
                                </span>
                            )}
                            {profileData.blog && (
                                <a
                                    href={profileData.blog.startsWith('http') ? profileData.blog : `https://${profileData.blog}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm bg-slate-700/50 px-3 py-1 rounded-full text-blue-300 hover:text-blue-200"
                                >
                                    🔗 {profileData.blog.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <a
                                href={profileData.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-slate-300 hover:text-white transition-colors duration-200"
                            >
                                <FaGithub className="mr-2 text-xl" />
                                <span>GitHub</span>
                            </a>
                            {linkedinUrl && (
                                <a
                                    href={linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-slate-300 hover:text-white transition-colors duration-200"
                                >
                                    <FaLinkedin className="mr-2 text-xl" />
                                    <span>LinkedIn</span>
                                </a>
                            )}
                        </div>

                        <div className="mt-4 flex space-x-6">
                            <div className="text-slate-300">
                                <span className="font-bold text-emerald-400">{profileData.public_repos}</span> repositories
                            </div>
                            <div className="text-slate-300">
                                <span className="font-bold text-emerald-400">{profileData.followers}</span> followers
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        );
    };

const CreatorsPage: React.FC = () => {
    const githubUsernames = [
        {
            username: "Ironsoldier353",
            linkedin: "https://www.linkedin.com/in/jeet-sarkar-4a4694323/"
        },
        {
            username: "SayanDas07",
            linkedin: "https://www.linkedin.com/in/sayan-das-643a85252/"
        }
    ];

    return (
        <div>
            <nav className="w-full px-6 py-4 border-white/10 bg-gradient-to-b from-slate-950 to-slate-900">
                <div className="max-w-auto mx-auto flex items-center justify-between">
                    <Link href="/">
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
                    </Link>

                    <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                        <span className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            The Creators
                        </span>
                    </div>
                </div>
            </nav>
            <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-16 px-4 sm:px-6 lg:px-8">
                <Head>
                    <title>Project Code Morph - Creators</title>
                    <meta name="description" content="Meet the creators of Project Code Morph - a platform for visualizing and mastering Data Structures & Algorithms" />
                </Head>

                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            Meet the team behind <span className="text-emerald-400 font-semibold">Project Code Morph</span> -
                            bringing data structures and algorithms to life through intuitive visualizations.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {githubUsernames.map((item) => (
                            <GithubCreator
                                key={item.username}
                                username={item.username}
                                linkedinUrl={item.linkedin}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <p className="bg-gradient-to-b from-slate-950 to-slate-900 text-white text-sm px-10 py-5">
                    © {new Date().getFullYear()} CodeMorph. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default CreatorsPage;