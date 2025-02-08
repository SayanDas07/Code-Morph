"use client";
import { SignIn, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from "react";

export default function Page() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      console.log("User signed in:", user);
      fetch("/api/storeUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.primaryEmailAddress,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("User stored:", data))
        .catch((err) => console.error("Error storing user:", err));
    }
  }, [isSignedIn, user]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-900 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-center text-blue-500 mb-6">
          Welcome Back
        </h1>
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          redirectUrl="/home"
          appearance={{
            variables: {
              colorPrimary: "#4f83cc", // Primary color for buttons
              colorBackground: "#ffffff", // Background color
              colorText: "#333333", // Text color
              fontFamily: "Arial, sans-serif", // Custom font
            },
          }}
        />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}