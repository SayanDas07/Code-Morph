"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Play,
  Send,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  Terminal,
  ExternalLink,
  CheckCircle2,
  Loader2,
  BookOpen,
  Keyboard,
  Lightbulb,
  GripVertical,
  GripHorizontal,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import CodeEditor from "./CodeEditor";
import OutputPanel, { TestResult } from "./OutputPanel";
import type { ProblemData } from "@/utils/problemsData";

interface ProblemIDEProps {
  problem: ProblemData;
}

const LANGUAGES = [
  { id: "cpp", name: "C++", icon: "⚡" },
  { id: "python", name: "Python", icon: "🐍" },
  { id: "javascript", name: "JavaScript", icon: "📜" },
  { id: "java", name: "Java", icon: "☕" },
];

// ── Resizable Hook ──
function useResizable(
  direction: "horizontal" | "vertical",
  initialSize: number,
  minSize: number,
  maxSize: number
) {
  const [size, setSize] = useState(initialSize);
  const isDragging = useRef(false);
  const startPos = useRef(0);
  const startSize = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      startPos.current = direction === "horizontal" ? e.clientX : e.clientY;
      startSize.current = size;

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        const delta =
          direction === "horizontal"
            ? e.clientX - startPos.current
            : e.clientY - startPos.current;
        const newSize = Math.max(minSize, Math.min(maxSize, startSize.current + delta));
        setSize(newSize);
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = direction === "horizontal" ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";
    },
    [direction, size, minSize, maxSize]
  );

  return { size, setSize, handleMouseDown };
}

// Helper to get localStorage key for a problem+language
function getStorageKey(problemId: string, lang: string) {
  return `codemorph-code-${problemId}-${lang}`;
}

function getTimestampKey(problemId: string, lang: string) {
  return `codemorph-ts-${problemId}-${lang}`;
}

const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

/** Remove code entries older than 30 days */
function cleanupExpiredCode() {
  if (typeof window === "undefined") return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("codemorph-ts-")) continue;
      const ts = parseInt(localStorage.getItem(key) || "0", 10);
      if (Date.now() - ts > ONE_MONTH_MS) {
        keysToRemove.push(key);
        // Also remove the associated code key
        keysToRemove.push(key.replace("codemorph-ts-", "codemorph-code-"));
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch { /* ignore */ }
}

function getSolvedTimestampKey(problemId: string) {
  return `codemorph-solved-${problemId}`;
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function ProblemIDE({ problem }: ProblemIDEProps) {
  const { userId } = useAuth();
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "cpp";
    return localStorage.getItem(`codemorph-lang-${problem.id}`) || "cpp";
  });
  const [code, setCode] = useState(() => {
    if (typeof window === "undefined") return problem.boilerplate["cpp"] || "";
    const savedLang = localStorage.getItem(`codemorph-lang-${problem.id}`) || "cpp";
    return localStorage.getItem(getStorageKey(problem.id, savedLang)) || problem.boilerplate[savedLang] || "";
  });
  const [customInput, setCustomInput] = useState(
    problem.examples[0]?.input || ""
  );
  const [activeTab, setActiveTab] = useState<
    "description" | "testcases" | "instructions"
  >("description");
  const [outputMode, setOutputMode] = useState<"run" | "submit" | "idle">(
    "idle"
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Panel collapse states
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [outputCollapsed, setOutputCollapsed] = useState(false);

  // Run results
  const [runOutput, setRunOutput] = useState("");
  const [runError, setRunError] = useState<string | null>(null);
  const [runErrorType, setRunErrorType] = useState<string | null>(null);

  // Error markers for editor
  const [errorMarkers, setErrorMarkers] = useState<
    { line: number; message: string }[]
  >([]);

  // Submit results
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [allPassed, setAllPassed] = useState(false);
  const [totalTests, setTotalTests] = useState(0);
  const [testsRun, setTestsRun] = useState(0);
  const [solved, setSolved] = useState(false);
  const [solvedTime, setSolvedTime] = useState<number | null>(null);

  // Editor settings with localStorage persistence
  const [editorFontSize, setEditorFontSize] = useState(() => {
    if (typeof window === "undefined") return 14;
    return parseInt(localStorage.getItem("codemorph-fontSize") || "14", 10);
  });
  const [useSpaces, setUseSpaces] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("codemorph-useSpaces") !== "false";
  });
  const [tabSize, setTabSize] = useState(() => {
    if (typeof window === "undefined") return 4;
    return parseInt(localStorage.getItem("codemorph-tabSize") || "4", 10);
  });

  // Auto-save indicator
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("idle");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize solved state from localStorage
  useEffect(() => {
    try {
      const ts = localStorage.getItem(getSolvedTimestampKey(problem.id));
      if (ts) {
        setSolved(true);
        setSolvedTime(parseInt(ts, 10));
      }
    } catch { /* ignore */ }
  }, [problem.id]);

  // Cleanup expired localStorage entries on mount
  useEffect(() => {
    cleanupExpiredCode();
  }, []);

  // Resizable panels
  const leftPanel = useResizable("horizontal", 420, 280, 700);
  const outputPanel = useResizable("vertical", 250, 100, 500);

  // Persist code to localStorage on every change
  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode);
      setSaveStatus("saving");
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        try {
          localStorage.setItem(getStorageKey(problem.id, language), newCode);
          localStorage.setItem(getTimestampKey(problem.id, language), String(Date.now()));
        } catch { /* localStorage full — ignore */ }
        setSaveStatus("saved");
        saveTimerRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
      }, 500);
    },
    [problem.id, language]
  );

  const switchLanguage = useCallback(
    (lang: string) => {
      // Save current code before switching
      try {
        localStorage.setItem(getStorageKey(problem.id, language), code);
        localStorage.setItem(getTimestampKey(problem.id, language), String(Date.now()));
        localStorage.setItem(`codemorph-lang-${problem.id}`, lang);
      } catch { /* ignore */ }
      setLanguage(lang);
      // Load saved code for the new language, or use boilerplate
      const savedCode = localStorage.getItem(getStorageKey(problem.id, lang));
      setCode(savedCode || problem.boilerplate[lang] || "");
      setLangDropdownOpen(false);
      setErrorMarkers([]);
    },
    [problem.boilerplate, problem.id, language, code]
  );

  const resetCode = useCallback(() => {
    setCode(problem.boilerplate[language] || "");
    setOutputMode("idle");
    setErrorMarkers([]);
    try {
      localStorage.removeItem(getStorageKey(problem.id, language));
      localStorage.removeItem(getTimestampKey(problem.id, language));
    } catch { /* ignore */ }
  }, [problem.boilerplate, problem.id, language]);

  // Parse error messages to extract line numbers for editor markers
  const parseErrorMarkers = useCallback(
    (errorText: string): { line: number; message: string }[] => {
      const markers: { line: number; message: string }[] = [];
      const lines = errorText.split("\n");
      for (const line of lines) {
        // Match patterns like: main.cpp:5:10: error: ... OR Main.java:5: error: ...
        const match = line.match(/(?:main\.\w+|Main\.\w+):(\d+)(?::\d+)?:\s*(.*)/);
        if (match) {
          markers.push({ line: parseInt(match[1], 10), message: match[2].trim() });
        }
        // Python: File "main.py", line 5
        const pyMatch = line.match(/File\s+"[^"]*",\s+line\s+(\d+)/);
        if (pyMatch) {
          const nextLine = lines[lines.indexOf(line) + 2] || "";
          markers.push({ line: parseInt(pyMatch[1], 10), message: nextLine.trim() || "Error" });
        }
      }
      return markers;
    },
    []
  );

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutputMode("run");
    setOutputCollapsed(false);
    setRunOutput("");
    setRunError(null);
    setRunErrorType(null);
    setErrorMarkers([]);

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, input: customInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRunError(data.error || "Unknown error");
        setRunErrorType("service");
      } else if (!data.success) {
        setRunError(data.error);
        setRunErrorType(data.errorType);
        setRunOutput(data.output || "");
        if (data.error) setErrorMarkers(parseErrorMarkers(data.error));
      } else {
        setRunOutput(data.output);
      }
    } catch {
      setRunError("Network error — could not reach execution server");
      setRunErrorType("service");
    } finally {
      setIsRunning(false);
    }
  }, [code, language, customInput, parseErrorMarkers]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setOutputMode("submit");
    setOutputCollapsed(false);
    setTestResults([]);
    setAllPassed(false);
    setErrorMarkers([]);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, problemId: problem.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        setRunError(data.error || "Submission failed");
        setRunErrorType("service");
        setOutputMode("run");
        return;
      }

      setTestResults(data.results);
      setAllPassed(data.allPassed);
      setTotalTests(data.totalTests);
      setTestsRun(data.testsRun);

      // Set error markers from first failed test case
      const firstError = data.results.find(
        (r: TestResult) => r.error && r.errorType
      );
      if (firstError?.error) {
        setErrorMarkers(parseErrorMarkers(firstError.error));
      }

      if (data.allPassed && userId) {
        setSolved(true);
        const now = Date.now();
        setSolvedTime(now);
        try {
          localStorage.setItem(getSolvedTimestampKey(problem.id), String(now));
        } catch { /* ignore */ }
        await fetch("/api/markProblemSolved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            problemId: problem.id,
            problemName: problem.name,
            difficulty: problem.difficulty,
          }),
        });
      }
    } catch {
      setRunError("Network error — could not reach server");
      setRunErrorType("service");
      setOutputMode("run");
    } finally {
      setIsSubmitting(false);
    }
  }, [code, language, problem, userId, parseErrorMarkers]);

  const currentLang = LANGUAGES.find((l) => l.id === language)!;

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            title={leftPanelCollapsed ? "Show problem panel" : "Hide problem panel"}
          >
            {leftPanelCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
          <a
            href="/home"
            className="text-cyan-400 hover:text-cyan-300 font-bold text-lg"
          >
            CodeMorph
          </a>
          <span className="text-slate-600">|</span>
          <h1 className="text-sm font-semibold text-slate-200 truncate max-w-[300px]">
            {problem.name}
          </h1>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              problem.difficulty === "Easy"
                ? "bg-green-900/50 text-green-400"
                : problem.difficulty === "Medium"
                ? "bg-yellow-900/50 text-yellow-400"
                : "bg-red-900/50 text-red-400"
            }`}
          >
            {problem.difficulty}
          </span>
          {solved && (
            <span className="flex items-center gap-1 text-xs text-green-400" title={solvedTime ? new Date(solvedTime).toLocaleString() : undefined}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Solved{solvedTime ? ` ${formatTimeAgo(solvedTime)}` : ""}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {problem.visualizationLink && (
            <a
              href={problem.visualizationLink}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-purple-900/40 text-purple-300 hover:bg-purple-900/60 transition border border-purple-800/50"
            >
              <ExternalLink className="w-3 h-3" /> Visualize
            </a>
          )}
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              <span>{currentLang.icon}</span>
              <span>{currentLang.name}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => switchLanguage(lang.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-700 transition ${
                      language === lang.id
                        ? "bg-cyan-900/30 text-cyan-300"
                        : "text-slate-300"
                    }`}
                  >
                    <span>{lang.icon}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* ── Left Panel: Problem Description ── */}
        {!leftPanelCollapsed && (
          <>
            <div
              className="shrink-0 flex flex-col bg-slate-900/50 overflow-hidden"
              style={{ width: leftPanel.size }}
            >
              {/* Tabs */}
              <div className="flex border-b border-slate-800 shrink-0">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition ${
                    activeTab === "description"
                      ? "text-cyan-400 border-b-2 border-cyan-400"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Description
                </button>
                <button
                  onClick={() => setActiveTab("testcases")}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition ${
                    activeTab === "testcases"
                      ? "text-cyan-400 border-b-2 border-cyan-400"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" /> Test Cases
                </button>
                <button
                  onClick={() => setActiveTab("instructions")}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition ${
                    activeTab === "instructions"
                      ? "text-cyan-400 border-b-2 border-cyan-400"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" /> Instructions
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-auto p-4">
                {activeTab === "description" ? (
                  <DescriptionTab problem={problem} />
                ) : activeTab === "testcases" ? (
                  <TestCasesTab
                    problem={problem}
                    customInput={customInput}
                    setCustomInput={setCustomInput}
                  />
                ) : (
                  <InstructionsTab language={language} />
                )}
              </div>
            </div>

            {/* ── Left Panel Resize Handle ── */}
            <div
              onMouseDown={leftPanel.handleMouseDown}
              className="w-1.5 shrink-0 bg-slate-800 hover:bg-cyan-600 active:bg-cyan-500 cursor-col-resize transition-colors flex items-center justify-center group"
            >
              <GripVertical className="w-3 h-3 text-slate-600 group-hover:text-white" />
            </div>
          </>
        )}

        {/* ── Right Panel: Editor + Output ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Editor header */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Code2 className="w-3.5 h-3.5" />
              <span>{currentLang.name} Editor</span>
              {/* Auto-save indicator */}
              {saveStatus === "saving" && (
                <span className="flex items-center gap-1 text-yellow-500 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                  Saving...
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="flex items-center gap-1 text-green-500 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Saved
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Font size controls */}
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <button
                  onClick={() => {
                    const newSize = Math.max(10, editorFontSize - 1);
                    setEditorFontSize(newSize);
                    localStorage.setItem("codemorph-fontSize", String(newSize));
                  }}
                  className="hover:text-slate-300 transition px-1"
                  title="Decrease font size"
                >
                  A-
                </button>
                <span className="text-slate-400">{editorFontSize}px</span>
                <button
                  onClick={() => {
                    const newSize = Math.min(24, editorFontSize + 1);
                    setEditorFontSize(newSize);
                    localStorage.setItem("codemorph-fontSize", String(newSize));
                  }}
                  className="hover:text-slate-300 transition px-1"
                  title="Increase font size"
                >
                  A+
                </button>
              </div>
              <span className="text-slate-700">|</span>
              {/* Tab/Spaces toggle */}
              <button
                onClick={() => {
                  const next = !useSpaces;
                  setUseSpaces(next);
                  localStorage.setItem("codemorph-useSpaces", String(next));
                }}
                className="text-[10px] text-slate-500 hover:text-slate-300 transition"
                title={`Currently using ${useSpaces ? "spaces" : "tabs"}. Click to switch.`}
              >
                {useSpaces ? `Spaces: ${tabSize}` : `Tabs: ${tabSize}`}
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={() => setOutputCollapsed(!outputCollapsed)}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition"
                title={outputCollapsed ? "Show output panel" : "Hide output panel"}
              >
                {outputCollapsed ? (
                  <Maximize2 className="w-3 h-3" />
                ) : (
                  <Minimize2 className="w-3 h-3" />
                )}
                {outputCollapsed ? "Show Output" : "Hide Output"}
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={resetCode}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          </div>

          {/* Editor area — takes remaining space */}
          <div className="flex-1 min-h-0">
            <CodeEditor
              code={code}
              language={language}
              onChange={handleCodeChange}
              errorMarkers={errorMarkers}
              onRun={handleRun}
              onSubmit={handleSubmit}
              fontSize={editorFontSize}
              tabSize={tabSize}
              useSpaces={useSpaces}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-y border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRun}
                disabled={isRunning || isSubmitting}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isRunning ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
                Run
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isRunning || isSubmitting}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-lg bg-green-700 hover:bg-green-600 text-white border border-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Submit
              </motion.button>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-600">
              <span>Ctrl+Enter Run</span>
              <span>Ctrl+Shift+Enter Submit</span>
              <span>Ctrl+/ Comment</span>
              <span>Ctrl+Z Undo</span>
            </div>
          </div>

          {/* ── Output Panel ── */}
          {!outputCollapsed && (
            <>
              {/* Output Resize Handle */}
              <div
                onMouseDown={(e) => {
                  // Invert: dragging up = smaller output (negative delta → subtract)
                  e.preventDefault();
                  const startY = e.clientY;
                  const startH = outputPanel.size;
                  const handleMove = (ev: MouseEvent) => {
                    const delta = startY - ev.clientY;
                    const newH = Math.max(100, Math.min(500, startH + delta));
                    outputPanel.setSize(newH);
                  };
                  const handleUp = () => {
                    document.removeEventListener("mousemove", handleMove);
                    document.removeEventListener("mouseup", handleUp);
                    document.body.style.cursor = "";
                    document.body.style.userSelect = "";
                  };
                  document.addEventListener("mousemove", handleMove);
                  document.addEventListener("mouseup", handleUp);
                  document.body.style.cursor = "row-resize";
                  document.body.style.userSelect = "none";
                }}
                className="h-1.5 shrink-0 bg-slate-800 hover:bg-cyan-600 active:bg-cyan-500 cursor-row-resize transition-colors flex items-center justify-center group"
              >
                <GripHorizontal className="w-3 h-3 text-slate-600 group-hover:text-white" />
              </div>

              <div
                className="shrink-0 bg-slate-900/60 overflow-hidden"
                style={{ height: outputPanel.size }}
              >
                <OutputPanel
                  mode={outputMode}
                  isLoading={isRunning || isSubmitting}
                  runOutput={runOutput}
                  runError={runError}
                  runErrorType={runErrorType}
                  testResults={testResults}
                  allPassed={allPassed}
                  totalTests={totalTests}
                  testsRun={testsRun}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Description Tab ──
function DescriptionTab({ problem }: { problem: ProblemData }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white mb-2">{problem.name}</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          {problem.description}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-2">Examples</h3>
        {problem.examples.map((ex, i) => (
          <div
            key={i}
            className="mb-3 bg-slate-800/60 rounded-lg p-3 border border-slate-700/50"
          >
            <div className="text-xs text-slate-400 mb-1">Example {i + 1}:</div>
            <div className="text-xs font-mono space-y-1">
              <div>
                <span className="text-slate-500">Input: </span>
                <span className="text-cyan-300 whitespace-pre-wrap">
                  {ex.input}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Output: </span>
                <span className="text-green-300">{ex.output}</span>
              </div>
              {ex.explanation && (
                <div className="mt-1 text-slate-400">
                  <span className="text-slate-500">Explanation: </span>
                  {ex.explanation}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-2">
          Constraints
        </h3>
        <ul className="space-y-1">
          {problem.constraints.map((c, i) => (
            <li
              key={i}
              className="text-xs text-slate-400 font-mono flex items-start gap-1"
            >
              <span className="text-cyan-500 mt-0.5">•</span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Test Cases Tab ──
function TestCasesTab({
  problem,
  customInput,
  setCustomInput,
}: {
  problem: ProblemData;
  customInput: string;
  setCustomInput: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-200">
        Sample Test Cases
      </h3>
      {problem.testCases
        .filter((tc) => !tc.isHidden)
        .map((tc) => (
          <div
            key={tc.id}
            className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50"
          >
            <div className="text-xs text-slate-400 mb-1">
              Test Case {tc.id}
            </div>
            <div className="text-xs font-mono space-y-1">
              <div>
                <span className="text-slate-500">Input:</span>
                <pre className="text-cyan-300 whitespace-pre-wrap mt-0.5">
                  {tc.input}
                </pre>
              </div>
              <div>
                <span className="text-slate-500">Expected Output: </span>
                <span className="text-green-300">{tc.expectedOutput}</span>
              </div>
            </div>
          </div>
        ))}
      <p className="text-xs text-slate-600">
        + {problem.testCases.filter((tc) => tc.isHidden).length} hidden test
        case(s)
      </p>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-slate-200 mb-2">
          Custom Input
        </h3>
        <textarea
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          className="w-full h-24 bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs font-mono text-slate-200 resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500"
          placeholder="Enter custom input here..."
        />
      </div>
    </div>
  );
}

// ── Instructions Tab ──
function InstructionsTab({ language }: { language: string }) {
  return (
    <div className="space-y-5">
      {/* How to Use */}
      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-cyan-400 mb-3">
          <Lightbulb className="w-4 h-4" /> How to Solve a Problem
        </h3>
        <div className="space-y-2 text-xs text-slate-300">
          <Step n={1}>
            Read the <strong>Description</strong> tab to understand the problem, examples, and constraints.
          </Step>
          <Step n={2}>
            Select your preferred language from the dropdown in the top bar.
          </Step>
          <Step n={3}>
            Write your solution in the editor. The boilerplate code already handles input reading — just add your logic where indicated.
          </Step>
          <Step n={4}>
            Use <strong>Run</strong> to test with the custom input you provide in the Test Cases tab.
          </Step>
          <Step n={5}>
            Use <strong>Submit</strong> to run against all test cases (including hidden ones). All must pass to mark the problem as solved.
          </Step>
        </div>
      </section>

      {/* I/O Format */}
      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-cyan-400 mb-3">
          <Terminal className="w-4 h-4" /> Input / Output Format
        </h3>
        <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50 text-xs text-slate-300 space-y-2">
          <p>
            Your code reads from <strong>standard input (stdin)</strong> and writes
            to <strong>standard output (stdout)</strong>.
          </p>
          {language === "cpp" && (
            <div>
              <span className="text-slate-500">C++:</span> Use{" "}
              <code className="text-cyan-300 bg-slate-700/60 px-1 rounded">
                cin &gt;&gt; var
              </code>{" "}
              to read and{" "}
              <code className="text-cyan-300 bg-slate-700/60 px-1 rounded">
                cout &lt;&lt; var
              </code>{" "}
              to print.
            </div>
          )}
          {language === "python" && (
            <div>
              <span className="text-slate-500">Python:</span> Use{" "}
              <code className="text-cyan-300 bg-slate-700/60 px-1 rounded">
                input()
              </code>{" "}
              to read and{" "}
              <code className="text-cyan-300 bg-slate-700/60 px-1 rounded">
                print()
              </code>{" "}
              to output.
            </div>
          )}
          {language === "javascript" && (
            <div>
              <span className="text-slate-500">JavaScript:</span> Input is
              available via{" "}
              <code className="text-cyan-300 bg-slate-700/60 px-1 rounded">
                readline
              </code>{" "}
              — see the boilerplate code.
            </div>
          )}
          {language === "java" && (
            <div>
              <span className="text-slate-500">Java:</span> Use{" "}
              <code className="text-cyan-300 bg-slate-700/60 px-1 rounded">
                Scanner
              </code>{" "}
              to read and{" "}
              <code className="text-cyan-300 bg-slate-700/60 px-1 rounded">
                System.out.println()
              </code>{" "}
              to print.
            </div>
          )}
          <p className="text-slate-500 mt-1">
            Output must match expected output exactly — no extra spaces or blank
            lines.
          </p>
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-cyan-400 mb-3">
          <Keyboard className="w-4 h-4" /> Editor Shortcuts
        </h3>
        <div className="bg-slate-800/60 rounded-lg border border-slate-700/50 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left p-2 text-slate-400 font-medium">
                  Action
                </th>
                <th className="text-right p-2 text-slate-400 font-medium">
                  Shortcut
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <ShortcutRow action="Undo" shortcut="Ctrl + Z" />
              <ShortcutRow action="Redo" shortcut="Ctrl + Y" />
              <ShortcutRow action="Toggle comment" shortcut="Ctrl + /" />
              <ShortcutRow action="Find" shortcut="Ctrl + F" />
              <ShortcutRow action="Find and replace" shortcut="Ctrl + H" />
              <ShortcutRow action="Select all" shortcut="Ctrl + A" />
              <ShortcutRow action="Copy line (no selection)" shortcut="Ctrl + C" />
              <ShortcutRow action="Cut line (no selection)" shortcut="Ctrl + X" />
              <ShortcutRow action="Move line up" shortcut="Alt + Up" />
              <ShortcutRow action="Move line down" shortcut="Alt + Down" />
              <ShortcutRow action="Duplicate line" shortcut="Shift + Alt + Down" />
              <ShortcutRow action="Delete line" shortcut="Ctrl + Shift + K" />
              <ShortcutRow action="Indent line" shortcut="Tab" />
              <ShortcutRow action="Outdent line" shortcut="Shift + Tab" />
              <ShortcutRow action="Go to line" shortcut="Ctrl + G" />
              <ShortcutRow action="Command palette" shortcut="F1" />
              <ShortcutRow action="Quick suggestions" shortcut="Ctrl + Space" />
              <ShortcutRow action="Zoom in" shortcut="Ctrl + Scroll Up" />
              <ShortcutRow action="Zoom out" shortcut="Ctrl + Scroll Down" />
              <ShortcutRow action="Multi-cursor" shortcut="Alt + Click" />
              <ShortcutRow action="Select next match" shortcut="Ctrl + D" />
              <ShortcutRow action="Run code" shortcut="Ctrl + Enter" />
              <ShortcutRow action="Submit code" shortcut="Ctrl + Shift + Enter" />
            </tbody>
          </table>
        </div>

        {/* Code Snippet Shortcuts */}
        <h4 className="text-xs font-semibold text-slate-300 mt-3 mb-2">
          Code Snippet Shortcuts
        </h4>
        <div className="bg-slate-800/60 rounded-lg border border-slate-700/50 overflow-hidden">
          <table className="w-full text-xs">
            <tbody className="text-slate-300">
              <ShortcutRow action="Insert for loop" shortcut="Alt + F" />
              <ShortcutRow action="Insert while loop" shortcut="Alt + W" />
              <ShortcutRow action="Insert if block" shortcut="Alt + I" />
              <ShortcutRow action="Insert function" shortcut="Alt + N" />
              <ShortcutRow action="Insert print/cout" shortcut="Alt + P" />
              <ShortcutRow action="Insert try-catch" shortcut="Alt + T" />
              <ShortcutRow action="Insert switch-case" shortcut="Alt + S" />
              <ShortcutRow action="Insert do-while" shortcut="Alt + D" />
              <ShortcutRow action="Insert class/struct" shortcut="Alt + C" />
              <ShortcutRow action="Insert main()" shortcut="Alt + M" />
            </tbody>
          </table>
        </div>
      </section>

      {/* Tips */}
      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-cyan-400 mb-3">
          <Code2 className="w-4 h-4" /> Tips
        </h3>
        <ul className="space-y-2 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5 shrink-0">•</span>
            <span>
              <strong>Test with &quot;Run&quot; first</strong> — use the Custom Input box to try
              different inputs before submitting.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5 shrink-0">•</span>
            <span>
              <strong>Read the error carefully</strong> — compilation errors show
              the exact line number and error message.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5 shrink-0">•</span>
            <span>
              <strong>Don&apos;t print extra output</strong> — debug prints like{" "}
              <code className="text-cyan-300 bg-slate-700/60 px-1 rounded">
                cout &lt;&lt; &quot;debug&quot;
              </code>{" "}
              will cause test cases to fail.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5 shrink-0">•</span>
            <span>
              <strong>Switch languages freely</strong> — changing language resets
              the editor to that language&apos;s starter code.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5 shrink-0">•</span>
            <span>
              <strong>Resize panels</strong> — drag the dividers between panels to
              adjust the layout. Collapse panels using the buttons in the toolbar.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5 shrink-0">•</span>
            <span>
              <strong>Visualize</strong> — click the Visualize button in the top bar (if available) to see an animated walkthrough of the algorithm.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}

// ── Helper Components ──
function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="shrink-0 w-5 h-5 rounded-full bg-cyan-900/50 text-cyan-400 text-[10px] font-bold flex items-center justify-center border border-cyan-800/50">
        {n}
      </span>
      <span>{children}</span>
    </div>
  );
}

function ShortcutRow({
  action,
  shortcut,
}: {
  action: string;
  shortcut: string;
}) {
  return (
    <tr className="border-b border-slate-700/30 last:border-0 hover:bg-slate-700/20">
      <td className="p-2">{action}</td>
      <td className="p-2 text-right">
        <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px] text-slate-300 font-mono border border-slate-600">
          {shortcut}
        </kbd>
      </td>
    </tr>
  );
}
