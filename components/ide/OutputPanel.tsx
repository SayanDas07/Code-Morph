"use client";

import { CheckCircle2, XCircle, AlertTriangle, Loader2, Eye, EyeOff } from "lucide-react";

export interface TestResult {
  testCaseId: number;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error: string | null;
  errorType: string | null;
  isHidden: boolean;
}

interface OutputPanelProps {
  mode: "run" | "submit" | "idle";
  isLoading: boolean;
  // Run mode
  runOutput?: string;
  runError?: string | null;
  runErrorType?: string | null;
  // Submit mode
  testResults?: TestResult[];
  allPassed?: boolean;
  totalTests?: number;
  testsRun?: number;
}

export default function OutputPanel({
  mode,
  isLoading,
  runOutput,
  runError,
  runErrorType,
  testResults,
  allPassed,
  totalTests,
  testsRun,
}: OutputPanelProps) {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span>{mode === "run" ? "Running code..." : "Running test cases..."}</span>
      </div>
    );
  }

  if (mode === "idle") {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        <p>Run your code or submit to see output here</p>
      </div>
    );
  }

  // ── Run output ──
  if (mode === "run") {
    if (runError) {
      return (
        <div className="h-full overflow-auto p-4 space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>
              {runErrorType === "compilation"
                ? "Compilation Error"
                : "Runtime Error"}
            </span>
          </div>
          <pre className="text-red-300 text-sm font-mono whitespace-pre-wrap bg-red-950/30 rounded-lg p-3 border border-red-900/50">
            {runError}
          </pre>
          {runOutput && (
            <div>
              <p className="text-slate-400 text-xs mb-1">Partial Output:</p>
              <pre className="text-slate-300 text-sm font-mono whitespace-pre-wrap bg-slate-800/50 rounded-lg p-3">
                {runOutput}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="h-full overflow-auto p-4">
        <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Execution Successful</span>
        </div>
        <pre className="text-slate-200 text-sm font-mono whitespace-pre-wrap bg-slate-800/50 rounded-lg p-3">
          {runOutput || "(No output)"}
        </pre>
      </div>
    );
  }

  // ── Submit results ──
  if (mode === "submit" && testResults) {
    return (
      <div className="h-full overflow-auto p-4 space-y-3">
        {/* Summary */}
        <div
          className={`flex items-center gap-2 font-semibold text-lg ${
            allPassed ? "text-green-400" : "text-red-400"
          }`}
        >
          {allPassed ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span>
            {allPassed
              ? "All Test Cases Passed!"
              : `Failed — ${testsRun}/${totalTests} test cases run`}
          </span>
        </div>

        {/* Individual results */}
        <div className="space-y-2">
          {testResults.map((result) => (
            <div
              key={result.testCaseId}
              className={`rounded-lg border p-3 ${
                result.passed
                  ? "border-green-800/50 bg-green-950/20"
                  : "border-red-800/50 bg-red-950/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {result.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span
                    className={`font-medium text-sm ${
                      result.passed ? "text-green-300" : "text-red-300"
                    }`}
                  >
                    Test Case {result.testCaseId}
                  </span>
                </div>
                {result.isHidden && (
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <EyeOff className="w-3 h-3" /> Hidden
                  </span>
                )}
              </div>

              {result.error ? (
                <pre className="text-red-300 text-xs font-mono whitespace-pre-wrap bg-red-950/30 rounded p-2">
                  {result.error}
                </pre>
              ) : (
                <div className="space-y-1 text-xs font-mono">
                  {!result.isHidden && (
                    <>
                      <div>
                        <span className="text-slate-500">Input: </span>
                        <span className="text-slate-300">{result.input}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Expected: </span>
                        <span className="text-green-300">
                          {result.expectedOutput}
                        </span>
                      </div>
                    </>
                  )}
                  {!result.passed && (
                    <div>
                      <span className="text-slate-500">Got: </span>
                      <span className="text-red-300">
                        {result.isHidden ? "Hidden" : result.actualOutput || "(empty)"}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Show remaining tests not run */}
          {totalTests && testsRun && testsRun < totalTests && (
            <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-3 text-center text-slate-500 text-sm">
              <Eye className="w-4 h-4 inline mr-1" />
              {totalTests - testsRun} more test case(s) not executed
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
