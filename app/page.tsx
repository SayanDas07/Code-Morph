import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import HomePage from "./home/page";
import { Code2Icon, ArrowRightIcon, PlayCircleIcon, CheckCircleIcon } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col text-white">
      {/* Header */}
      <header className="bg-slate-900/95 shadow-lg backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          {/* Logo and Title */}
          <div className="flex items-center gap-2">
            <Code2Icon className="w-8 h-8 text-cyan-400" />
            <span className="text-3xl font-extrabold tracking-tighter">
              Code<span className="text-cyan-400">Morph</span>
            </span>
          </div>

          {/* Auth Buttons */}
          {!userId && (
            <div className="flex gap-4">
              <Link
                href="/sign-in"
                className="px-6 py-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg transition-all"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {userId ? (
          <div className="container mx-auto p-6">
            <HomePage />
          </div>
        ) : (
          <div className="flex flex-col gap-20">
            {/* Hero Section */}
            <div className="container mx-auto px-6 pt-20 pb-16">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-6xl font-bold mb-6">
                  Visualize and Master
                  <span className="block text-cyan-400 mt-2">Data Structures & Algorithms</span>
                </h1>
                <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                  Interactive visualizations that make learning algorithms intuitive and engaging.
                  Watch your code come to life, step by step.
                </p>
                <div className="flex gap-6 justify-center">
                  <Link
                    href="/sign-up"
                    className="group px-8 py-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg transition-all flex items-center gap-2"
                  >
                    Start Learning Free
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/BS/search"
                    className="px-8 py-4 rounded-lg border-2 border-cyan-400/50 hover:border-cyan-400 text-cyan-400 transition-colors flex items-center gap-2"
                  >
                    Try Demo
                    <PlayCircleIcon className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* How to Use CodeFlow Section */}
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">How to Use CodeMorph</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-cyan-400/20 rounded-full p-2">
                      <CheckCircleIcon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold">1. Create Account</h3>
                  </div>
                  <p className="text-gray-300">
                    Sign up for a free account to access all features and track your progress.
                  </p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-cyan-400/20 rounded-full p-2">
                      <CheckCircleIcon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold">2. Choose Algorithm</h3>
                  </div>
                  <p className="text-gray-300">
                    Search or browse through our comprehensive library to find the algorithm you want to learn.
                  </p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-cyan-400/20 rounded-full p-2">
                      <CheckCircleIcon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold">3. Select Problem Type</h3>
                  </div>
                  <p className="text-gray-300">
                    Pick the specific type of problem you want to solve within the algorithm category.
                  </p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-cyan-400/20 rounded-full p-2">
                      <CheckCircleIcon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold">4. Watch Visualization</h3>
                  </div>
                  <p className="text-gray-300">
                    See the algorithm in action through our interactive visualization tool.
                  </p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-cyan-400/20 rounded-full p-2">
                      <CheckCircleIcon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold">5. Study Theory</h3>
                  </div>
                  <p className="text-gray-300">
                    Read comprehensive explanations and understand the theoretical concepts behind the algorithm.
                  </p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-cyan-400/20 rounded-full p-2">
                      <CheckCircleIcon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold">6. Practice Problems</h3>
                  </div>
                  <p className="text-gray-300">
                    Solidify your understanding by solving related practice problems and challenges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/90 backdrop-blur-sm py-8 mt-7">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center space-x-2 text-gray-300 pb-4">
            <span>Made by</span>
            <Link href="https://github.com/Ironsoldier353" className="text-blue-400 hover:text-blue-300 transition-colors font-medium mx-1">
              Jeet Sarkar
            </Link>
            <span>and</span>
            <Link href="https://github.com/SayanDas07" className="text-blue-400 hover:text-blue-300 transition-colors font-medium mx-1">
              Sayan Das
            </Link>
          </div>



          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} CodeMorph. All rights reserved.</p>

              <div className="flex items-center space-x-8">
                <Link href="/terms&cons" className="text-gray-400 hover:text-cyan-400 text-sm font-medium transition-colors">
                  Terms & Conditions
                </Link>
                <Link href="/privacy" className="text-gray-400 hover:text-cyan-400 text-sm font-medium transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}