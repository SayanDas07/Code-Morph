/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SolvedProblem {
  problemId: string;
  problemName: string;
  solvedAt: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  createdAt: string;
  solvedProblems: SolvedProblem[];
}

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const getUser = async () => {
      try {
        const res = await fetch("/api/getUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        const data = await res.json();
        setUserData(data.currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getUser();
  }, [user]);

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-200">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-gray-900 shadow-xl rounded-2xl border border-gray-800">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-8 p-6">
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-gray-700 shadow-md">
              <img
                src={userData.image || "/api/placeholder/128/128"}
                alt={userData.firstName}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Full Name</h3>
                <p className="text-lg font-semibold text-white">{`${userData.firstName} ${userData.lastName}`}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400">Email</h3>
                <p className="text-lg text-gray-300">{userData.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400">Joined On</h3>
                <p className="text-lg text-gray-300">
                  {new Date(userData.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400">Solved Problems</h3>
                <p className="text-lg font-semibold text-white">{userData.solvedProblems.length}</p>
                <ul className="mt-2 space-y-1 text-gray-300">
                  {userData.solvedProblems.map((problem) => (
                    <li key={problem.problemId} className="text-sm border-b border-gray-700 pb-1">
                      {`${problem.problemName} (Solved on ${new Date(problem.solvedAt).toLocaleDateString()})`}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;