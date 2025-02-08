"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";


export default function StoreUserPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { isSignedIn, user } = useUser();

    console.log("User:", user);

    const handleStoreUser = async () => {
        if (!isSignedIn || !user) {
            console.error("User not signed in");
            return;
        }

        setLoading(true);
        try {
            
            const userData = {
                clerkId: user.id,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.primaryEmailAddress?.emailAddress || "",
            };

            // Validate required fields
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

            // First check if the response is ok
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
                {isSignedIn && user ? (
                    <>
                        <div className="flex flex-col items-center">

                            <h2 className="text-xl font-semibold text-gray-800 mt-3">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
                        </div>
                        <button
                            onClick={handleStoreUser}
                            disabled={loading}
                            className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition-all"
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
                                "Click Here to Continue"
                            )}
                        </button>
                    </>
                ) : (
                    <p className="text-gray-500">Please sign in to store your user data.</p>
                )}
            </div>
        </div>
    );
}
