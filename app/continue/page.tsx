"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function StoreUserPage() {
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const router = useRouter();
    const { isSignedIn, user } = useUser();

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
        }
    }, [user]);


    const handleStoreUser = async () => {
        if (!isSignedIn || !user) {
            console.error("User not signed in");
            return;
        }

        if (!firstName.trim()) {
            alert("First name is required");
            return;
        }

        setLoading(true);
        try {
            const userData = {
                clerkId: user.id,
                firstName: firstName,
                lastName: lastName,
                email: user.primaryEmailAddress?.emailAddress || "",
                imageUrl: user?.imageUrl || "",
            };

            if (!userData.clerkId || !userData.firstName || !userData.email) {
                throw new Error("Missing required user data");
            }

            const res = await fetch("/api/storeUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });


            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to store user");
            }

            const data = await res.json();
            console.log("User stored successfully:", data);
            router.push("/home");

        } catch (error) {
            console.error("Error:", error instanceof Error ? error.message : "Failed to store user");

            alert(error instanceof Error ? error.message : "Failed to store user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col">
            
            <nav className="w-full px-6 py-4 border-b border-white/10 backdrop-blur-md bg-slate-950/80">
                <div className="max-w-auto mx-auto flex items-center justify-between">
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
                    
                    {isSignedIn && user && (
                        <div className="flex items-center gap-4">
                            <p className="text-gray-400 text-sm hidden md:block">
                                Welcome, <span className="text-white">{user.firstName || user.username || "User"}!</span>
                            </p>
                            
                        </div>
                    )}
                </div>
            </nav>

            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                {isSignedIn && user ? (
                    <div className="w-full max-w-4xl">
                        <div className="mb-16 text-center">
                            <h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
                            <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>
                            <p className="text-gray-400 mt-4">We have pre-filled your name from your account. You can update it <span className="font-bold">ONLY NOW</span> if needed.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8">
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Your Information
                                </h2>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm">First Name*</label>
                                        <input 
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="Enter your first name"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm">Last Name*</label>
                                        <input 
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Enter your last name"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center mt-4">
                                        <div className="w-10 h-10 flex-shrink-0 bg-blue-600/20 rounded-full flex items-center justify-center mr-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 text-sm">Email Address</div>
                                            <div className="text-white font-medium">
                                                {user.primaryEmailAddress?.emailAddress}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 flex flex-col">
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Confirm and Continue
                                </h2>

                                <p className="text-gray-400 mb-8">
                                    We have automatically filled in your name from your account. Feel free to modify it <span className="font-bold">ONLY NOW</span> if needed, then confirm to proceed to your dashboard.
                                </p>

                                <button
                                    onClick={handleStoreUser}
                                    disabled={loading}
                                    className="mt-auto w-full bg-gradient-to-r from-blue-900 to-indigo-600 text-white px-6 py-4 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 transition-all font-medium"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        "Continue"
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-gray-400 text-sm">
                                By continuing, you agree to our {" "}
                                <Link href="/terms&cons" className="text-blue-400 hover:text-blue-300 underline">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-12 w-full max-w-md">
                        <div className="text-center">
                            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/20 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
                            <p className="text-gray-400 mb-8">You need to be signed in to access your profile</p>

                            <Link href="/sign-in">
                                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium">
                                    Sign In to Continue
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}