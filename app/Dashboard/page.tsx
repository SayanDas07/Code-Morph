/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Award, Calendar, Mail, Clock } from "lucide-react";

interface SolvedProblem {
  problemId: string;
  problemName: string;
  solvedAt: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  createdAt: string;
  solvedProblems: SolvedProblem[];
}


const ProgressCircle = ({ value, maxValue, color, size = 120 }: { value: number; maxValue: number; color: string; size?: number }) => {
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background Circle */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{value}</span>
        <span className="text-xs text-gray-400">/ {maxValue}</span>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProblems, setTotalProblems] = useState(300);

  const [difficultyTotals, setDifficultyTotals] = useState({
    easy: 120,
    medium: 120,
    hard: 60
  });

  useEffect(() => {
    if (!user?.id) return;

    const getUser = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [user]);

  // Helper function to group problems by month
  const groupProblemsByMonth = (problems: SolvedProblem[]) => {
    const grouped = problems.reduce((acc, problem) => {
      const month = new Date(problem.solvedAt).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[month]) acc[month] = [];
      acc[month].push(problem);
      return acc;
    }, {} as Record<string, SolvedProblem[]>);

    return Object.entries(grouped).sort((a, b) => {
      return new Date(b[0]).getTime() - new Date(a[0]).getTime();
    });
  };

  // Get difficulty count from actual data
  const getDifficultyCount = (problems: SolvedProblem[]) => {
    return {
      easy: problems.filter(p => p.difficulty === 'Easy').length,
      medium: problems.filter(p => p.difficulty === 'Medium').length,
      hard: problems.filter(p => p.difficulty === 'Hard').length
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-lg text-gray-300 animate-pulse">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
        <p className="text-lg text-gray-300">No user data available</p>
      </div>
    );
  }

  const difficultyStats = getDifficultyCount(userData.solvedProblems);
  const groupedProblems = groupProblemsByMonth(userData.solvedProblems);
  const memberSince = new Date(userData.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const daysAsMember = Math.floor((new Date().getTime() - new Date(userData.createdAt).getTime()) / (1000 * 3600 * 24));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-xl rounded-xl overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
              <div className="absolute -bottom-16 left-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-800 shadow-lg">
                  <img
                    src={userData.image || "/api/placeholder/128/128"}
                    alt={userData.firstName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <CardContent className="pt-20 pb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">{`${userData.firstName} ${userData.lastName}`}</h2>
              <p className="text-gray-400 flex items-center mt-1 gap-2">
                <Mail className="h-4 w-4" /> {userData.email}
              </p>

              <div className="flex items-center mt-4 text-sm text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Joined {memberSince}</span>
              </div>

              <div className="flex items-center mt-2 text-sm text-gray-400">
                <Clock className="h-4 w-4 mr-2" />
                <span>{daysAsMember} days as member</span>
              </div>

              {/* Overall Progress Circle */}
              <div className="mt-6 flex items-center justify-center">
                <ProgressCircle
                  value={userData.solvedProblems.length}
                  maxValue={totalProblems}
                  color="#60a5fa"
                  size={120}
                />
              </div>

              <div className="text-center mt-2">
                <p className="text-sm text-gray-400">Total Progress</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((userData.solvedProblems.length / totalProblems) * 100).toFixed(1)}% completed
                </p>
              </div>

              {/* Difficulty Breakdown */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Difficulty Breakdown</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex justify-center">
                    <ProgressCircle
                      value={difficultyStats.easy}
                      maxValue={difficultyTotals.easy}
                      color="#4ade80"
                      size={80}
                    />
                  </div>
                  <div className="flex justify-center">
                    <ProgressCircle
                      value={difficultyStats.medium}
                      maxValue={difficultyTotals.medium}
                      color="#facc15"
                      size={80}
                    />
                  </div>
                  <div className="flex justify-center">
                    <ProgressCircle
                      value={difficultyStats.hard}
                      maxValue={difficultyTotals.hard}
                      color="#f87171"
                      size={80}
                    />
                  </div>
                  <div className="text-center text-xs text-gray-400">
                    Easy ({difficultyStats.easy})
                  </div>
                  <div className="text-center text-xs text-gray-400">
                    Medium ({difficultyStats.medium})
                  </div>
                  <div className="text-center text-xs text-gray-400">
                    Hard ({difficultyStats.hard})
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Solved Problems Section */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-xl rounded-xl col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-blue-400" />
                Problem Solving History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="timeline" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6 bg-gray-700/30">
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="list">Problem List</TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="m-0">
                  <div className="relative pl-8 border-l border-gray-700 space-y-8">
                    {groupedProblems.map(([month, problems]) => (
                      <div key={month} className="relative">
                        <div className="absolute -left-10 top-0 w-6 h-6 bg-blue-500 rounded-full border-4 border-gray-800 flex items-center justify-center">
                          <span className="text-xs text-white font-bold">{problems.length}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-blue-300 mb-3">{month}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {problems.map((problem) => (
                            <div key={problem.problemId} className="bg-gray-700/20 rounded-lg p-3 hover:bg-gray-700/40 transition-colors">
                              <div className="flex justify-between items-start">
                                <p className="font-medium text-white">{problem.problemName}</p>
                                <Badge
                                  variant="outline"
                                  className={`ml-2 ${problem.difficulty === 'Easy' ? 'bg-green-900/30 text-green-300 border-green-700' :
                                      problem.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700' :
                                        'bg-red-900/30 text-red-300 border-red-700'
                                    }`}
                                >
                                  {problem.difficulty}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(problem.solvedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="list" className="m-0">
                  <div className="space-y-4">
                    {userData.solvedProblems.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2">
                        {userData.solvedProblems.map((problem) => (
                          <div key={problem.problemId} className="flex items-center justify-between p-3 bg-gray-700/20 rounded-lg hover:bg-gray-700/40 transition-colors">
                            <div>
                              <p className="font-medium text-white">{problem.problemName}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`${problem.difficulty === 'Easy' ? 'bg-green-900/30 text-green-300 border-green-700' :
                                    problem.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700' :
                                      'bg-red-900/30 text-red-300 border-red-700'
                                  }`}
                              >
                                {problem.difficulty}
                              </Badge>
                              <Badge variant="outline" className="bg-blue-900/30 hover:bg-blue-800/40 text-blue-300 border-blue-700">
                                {new Date(problem.solvedAt).toLocaleDateString()}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-gray-400">No problems solved yet. Start your problem-solving journey!</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;