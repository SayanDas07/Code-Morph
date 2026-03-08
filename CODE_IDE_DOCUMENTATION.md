# Code-Morph IDE — Complete Technical Documentation

> **Version:** 1.0  
> **Last Updated:** June 2025  
> **Stack:** Next.js 15 · TypeScript · Monaco Editor · Docker · Prisma · Clerk · Tailwind CSS

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture & Full Flow](#2-architecture--full-flow)
3. [File Map — Every IDE-Related File Explained](#3-file-map--every-ide-related-file-explained)
   - 3.1 [utils/problemsData.tsx — Problem Bank](#31-utilsproblemsdatatsx--problem-bank)
   - 3.2 [app/problems/[problemId]/page.tsx — Dynamic Route](#32-appproblemsproblemidpagetsx--dynamic-route)
   - 3.3 [components/ide/ProblemIDE.tsx — Main IDE Layout](#33-componentsideproblemidestsx--main-ide-layout)
   - 3.4 [components/ide/CodeEditor.tsx — Monaco Editor Wrapper](#34-componentsidescodeeditortsx--monaco-editor-wrapper)
   - 3.5 [components/ide/OutputPanel.tsx — Results Display](#35-componentsideoutputpaneltsx--results-display)
   - 3.6 [lib/dockerExecutor.ts — Docker Execution Engine](#36-libdockerexecutorts--docker-execution-engine)
   - 3.7 [app/api/execute/route.ts — Run API](#37-appapiexecuteroutets--run-api)
   - 3.8 [app/api/submit/route.ts — Submit API](#38-appapisubmitroutets--submit-api)
   - 3.9 [scripts/setup-docker.ps1 — Docker Setup Script](#39-scriptssetup-dockerps1--docker-setup-script)
4. [Docker Setup — How & Why](#4-docker-setup--how--why)
5. [localStorage Strategy](#5-localstorage-strategy)
6. [Keyboard Shortcuts & Snippet System](#6-keyboard-shortcuts--snippet-system)
7. [UI Features & Design Decisions](#7-ui-features--design-decisions)
8. [All Changes & Their Impact](#8-all-changes--their-impact)
9. [How to Set Up & Run](#9-how-to-set-up--run)
10. [Future Improvements](#10-future-improvements)
    - 10.1 [Docker & Execution Improvements](#101-docker--execution-improvements)
    - 10.2 [localStorage Improvements](#102-localstorage-improvements)
    - 10.3 [IDE Feature Improvements](#103-ide-feature-improvements)

---

## 1. Overview

Code-Morph is an educational algorithm visualization platform. The **IDE feature** adds a full-fledged, in-browser code editor to each problem — users can read the problem, write a solution in C++/Python/JavaScript/Java, run it against custom input, and submit it against hidden test cases — **all without leaving the browser**.

### Key Capabilities

| Feature | Description |
|---|---|
| **Monaco Editor** | VS Code's editor engine with syntax highlighting, IntelliSense, bracket pair colorization, and multi-cursor support |
| **4 Languages** | C++ (gcc), Python (python3), JavaScript (Node 18), Java (Eclipse Temurin 17) |
| **Docker Execution** | User code runs in isolated, sandboxed Docker containers — zero third-party APIs |
| **16 Problems** | Covering HashMap, Hare-Tortoise, Sliding Window, DFS, BFS, Binary Search, Kadane's, Dutch National Flag, Moore's Voting |
| **Resizable Panels** | Drag dividers to resize the problem panel, editor, and output panel |
| **Code Persistence** | Code is auto-saved to localStorage per problem + language, auto-cleaned after 30 days |
| **Error Markers** | Compilation and runtime errors are parsed and shown as red squiggly lines in the editor |
| **10 Snippet Shortcuts** | Alt+F (for loop), Alt+W (while), etc. — language-aware, adapts to selected language |
| **Keyboard Run/Submit** | Ctrl+Enter to Run, Ctrl+Shift+Enter to Submit |
| **Solve Tracking** | Solved status persisted to both the database (via API) and localStorage (with timestamps) |

---

## 2. Architecture & Full Flow

### End-to-End Flow

```
User clicks "Solve" on AlgorithmCard (home page)
    │
    ▼
/problems/[problemId]        ← Next.js dynamic route (Server Component)
    │
    ├─ getProblemById(id)    ← From utils/problemsData.tsx
    │
    ▼
<ProblemIDE problem={...} /> ← Client Component — the entire IDE
    │
    ├── Left Panel: Description / Test Cases / Instructions (tabs)
    ├── Center: <CodeEditor /> (Monaco Editor)
    └── Bottom: <OutputPanel /> (run/submit results)

User writes code → clicks "Run" (or Ctrl+Enter)
    │
    ▼
POST /api/execute            ← Next.js API Route
    │
    ├─ Validates code + language
    ├─ Calls executeInDocker(code, language, input)
    │       │
    │       ├─ Creates temp dir with code file + input.txt
    │       ├─ docker run --rm --network none --memory 256m ...
    │       │    ├─ Compile step (if C++ or Java)
    │       │    └─ Run step (with stdin piped)
    │       ├─ Returns { output, error, errorType }
    │       └─ Cleans up temp dir + force-removes containers
    │
    └── Returns JSON { success, output, error, errorType }
            │
            ▼
        OutputPanel renders result (green success / red error)
        If error → parseErrorMarkers() → red squiggly lines in editor

User clicks "Submit" (or Ctrl+Shift+Enter)
    │
    ▼
POST /api/submit             ← Next.js API Route
    │
    ├─ Looks up problem's test cases from problemsData
    ├─ For each test case:
    │    ├─ executeInDocker(code, language, testCase.input)
    │    ├─ Compare output.trim() === expectedOutput.trim()
    │    └─ Stop on first failure (early exit)
    │
    └── Returns JSON { allPassed, totalTests, testsRun, results[] }
            │
            ▼
        OutputPanel renders per-test-case cards (pass/fail)
        If allPassed && userId:
            ├─ POST /api/markProblemSolved (saves to DB via Prisma)
            ├─ localStorage: save solved timestamp
            └─ "Solved Xh ago" badge appears in top bar
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  Browser (Client)                                       │
│                                                         │
│  ┌──────────────┐   code    ┌──────────────────┐       │
│  │  CodeEditor   │ ────────→│   ProblemIDE      │       │
│  │  (Monaco)     │ ←──────  │   (State Manager) │       │
│  └──────────────┘  markers  └────────┬─────────┘       │
│                                      │                  │
│  ┌──────────────┐   results  ┌───────▼─────────┐       │
│  │  OutputPanel  │ ←─────────│  fetch() calls   │       │
│  └──────────────┘            └───────┬─────────┘       │
│                                      │                  │
│  ┌──────────────┐                    │                  │
│  │  localStorage │  ← persist code,  │                  │
│  │               │    timestamps,     │                  │
│  │               │    font prefs      │                  │
│  └──────────────┘                    │                  │
└──────────────────────────────────────┼──────────────────┘
                                       │ HTTP POST
                                       ▼
┌──────────────────────────────────────────────────────────┐
│  Server (Next.js API Routes)                             │
│                                                          │
│  /api/execute  ──→  lib/dockerExecutor.ts                │
│  /api/submit   ──→  lib/dockerExecutor.ts (per testcase) │
│  /api/markProblemSolved ──→ Prisma → PostgreSQL          │
│                                                          │
│  dockerExecutor.ts                                       │
│  ┌────────────────────────────────────────────────┐      │
│  │  1. Create temp dir                            │      │
│  │  2. Write code file + input.txt               │      │
│  │  3. docker run --rm --network none ...         │      │
│  │     (compile → run)                            │      │
│  │  4. Parse stdout/stderr                        │      │
│  │  5. Cleanup temp dir + force-remove container  │      │
│  └────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────┘
```

---

## 3. File Map — Every IDE-Related File Explained

### 3.1 `utils/problemsData.tsx` — Problem Bank

**Purpose:** Single source of truth for all 16 problems. Contains problem metadata, test cases, and language-specific boilerplate code.

**Types:**

```typescript
interface TestCase {
  id: number;
  input: string;          // Exact stdin to feed
  expectedOutput: string; // Exact stdout to match
  isHidden?: boolean;     // Hidden test cases don't show input/expected in UI
}

interface ProblemData {
  id: string;                        // e.g., "hm1", "dfs2", "bs1"
  name: string;                      // Display name
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;               // Problem statement
  constraints: string[];             // e.g., "1 <= arr.length <= 10^5"
  examples: {                        // Shown in Description tab
    input: string;
    output: string;
    explanation?: string;
  }[];
  testCases: TestCase[];             // Used by /api/submit
  boilerplate: Record<string, string>; // Starter code per language
  visualizationLink?: string;        // Link to existing visualization page
}
```

**All 16 Problems:**

| ID | Name | Category | Difficulty |
|---|---|---|---|
| `hm1` | Frequency of Elements | HashMap | Easy |
| `hm2` | Two Sum | HashMap | Easy |
| `ht1` | Detect Cycle in Linked List | Hare-Tortoise | Medium |
| `ht2` | Middle of Linked List | Hare-Tortoise | Easy |
| `sw1` | Maximum Sum Subarray of Size K | Sliding Window | Easy |
| `sw2` | Flip At Most K Zeros | Sliding Window | Medium |
| `dfs1` | DFS of Graph | DFS | Easy |
| `dfs2` | Inorder Traversal of Binary Tree | DFS | Easy |
| `dfs3` | Preorder Traversal of Binary Tree | DFS | Easy |
| `dfs4` | Postorder Traversal of Binary Tree | DFS | Easy |
| `bfs1` | BFS of Graph | BFS | Easy |
| `bfs2` | Level-Order Traversal of Binary Tree | BFS | Easy |
| `bfs3` | Rotten Oranges | BFS | Medium |
| `bs1` | Binary Search | Binary Search | Easy |
| `kd1` | Maximum Subarray Sum | Kadane's Algo | Medium |
| `dnf1` | Sort 0s, 1s, and 2s | Dutch National Flag | Medium |
| `moore1` | Majority Element | Moore's Voting | Easy |

**Exports:**

```typescript
export function getAllProblems(): ProblemData[]     // Returns array of all problems
export function getProblemById(id: string): ProblemData | undefined
```

**Design Decision:** Problems are defined as a plain TypeScript object (not a database table) because:
- They are read-only and rarely change
- No server round-trip needed — imported directly during build
- Switching to a database later is trivial (same interface)

---

### 3.2 `app/problems/[problemId]/page.tsx` — Dynamic Route

**Purpose:** Next.js Server Component that serves the IDE for any problem.

**Full Code (19 lines):**

```typescript
import { notFound } from "next/navigation";
import { getProblemById } from "@/utils/problemsData";
import ProblemIDE from "@/components/ide/ProblemIDE";

interface PageProps {
  params: Promise<{ problemId: string }>;
}

export default async function ProblemPage({ params }: PageProps) {
  const { problemId } = await params;
  const problem = getProblemById(problemId);

  if (!problem) {
    notFound();
  }

  return <ProblemIDE problem={problem} />;
}
```

**How it works:**
1. URL `/problems/hm1` → `params.problemId === "hm1"`
2. Looks up the problem from `problemsData`
3. If not found → Next.js `notFound()` → 404 page
4. Otherwise renders `<ProblemIDE problem={problem} />`

**Why Server Component?** Only the data lookup happens on the server. The actual IDE (`ProblemIDE`) is a `"use client"` component.

---

### 3.3 `components/ide/ProblemIDE.tsx` — Main IDE Layout (~1050 lines)

**Purpose:** The central orchestrator — manages all state, layout, panels, persistence, and wires CodeEditor + OutputPanel together.

#### Top-Level Structure

```
┌─Top Bar──────────────────────────────────────────────────────────┐
│ [≡] CodeMorph │ Problem Name │ Easy │ ✓ Solved 2h ago │ [Lang ▾]│
├──────────────────────────────┬───────────────────────────────────┤
│  Left Panel (resizable)      │  Editor Header (font/tab/reset)  │
│  ┌─ Tabs ──────────────────┐ │  ┌─────────────────────────────┐ │
│  │ Description │ Tests │ ℹ  │ │  │ Monaco CodeEditor           │ │
│  ├──────────────────────────┤ │  │ (fills all available space)  │ │
│  │                          │ │  │                              │ │
│  │  Tab Content             │ │  │                              │ │
│  │                          │ │  │                              │ │
│  │                          │ │  └─────────────────────────────┘ │
│  └──────────────────────────┘ │  ┌─ Action Buttons ────────────┐ │
│  ↕ Drag to resize             │  │ ▶ Run   ↗ Submit           │ │
│                               │  ├─────────────────────────────┤ │
│                               │  │ Output Panel (resizable)    │ │
│                               │  │ (run results / test cases)  │ │
│                               │  └─────────────────────────────┘ │
└───────────────────────────────┴─────────────────────────────────┘
```

#### Key State Variables

| State | Type | Purpose |
|---|---|---|
| `language` | `string` | Current language (`"cpp"`, `"python"`, `"javascript"`, `"java"`) |
| `code` | `string` | Current editor contents |
| `customInput` | `string` | User's custom stdin input for "Run" |
| `activeTab` | `"description" \| "testcases" \| "instructions"` | Currently active left-panel tab |
| `outputMode` | `"run" \| "submit" \| "idle"` | What the output panel is showing |
| `isRunning` / `isSubmitting` | `boolean` | Loading indicators |
| `leftPanelCollapsed` | `boolean` | Whether the left panel is hidden |
| `outputCollapsed` | `boolean` | Whether the output panel is hidden |
| `runOutput` / `runError` / `runErrorType` | `string \| null` | Results from /api/execute |
| `errorMarkers` | `{ line, message }[]` | Passed to CodeEditor for red squiggly lines |
| `testResults` | `TestResult[]` | Per-test-case results from /api/submit |
| `allPassed` | `boolean` | Whether all test cases passed on submit |
| `solved` / `solvedTime` | `boolean` / `number \| null` | Whether the user has solved this problem |
| `editorFontSize` | `number` | Font size (10–24px), persisted to localStorage |
| `useSpaces` / `tabSize` | `boolean` / `number` | Tab vs spaces preference, persisted |
| `saveStatus` | `"saved" \| "saving" \| "idle"` | Auto-save indicator state |

#### Custom Hook: `useResizable`

```typescript
function useResizable(direction, initialSize, minSize, maxSize)
```

Returns `{ size, setSize, handleMouseDown }`. Attaches mousemove/mouseup listeners on drag, clamping to min/max bounds. Used for:
- Left panel width (horizontal, 280–700px, default 420px)
- Output panel height (vertical, 100–500px, default 250px)

#### Code Persistence Logic

```
On mount:
  1. Read saved language from localStorage → set as initial language
  2. Read saved code for that language → set as initial code
  3. Run cleanupExpiredCode() to remove entries older than 30 days

On code change (handleCodeChange):
  1. Set saveStatus = "saving"
  2. Debounce 500ms → write code + timestamp to localStorage
  3. Set saveStatus = "saved" → after 2s → set "idle"

On language switch (switchLanguage):
  1. Save current language's code to localStorage
  2. Load new language's saved code (or boilerplate if none)
  3. Clear error markers

On reset:
  1. Restore boilerplate for current language
  2. Remove localStorage entries for this problem+language
```

#### Error Marker Parsing (`parseErrorMarkers`)

Extracts line numbers from compiler/runtime error messages:

```
C++/Java: main.cpp:5:10: error: ...     → line 5
Python:   File "main.py", line 5         → line 5
```

Returns `{ line, message }[]` → fed to CodeEditor → Monaco `setModelMarkers()`.

#### Submit Flow

```
1. POST /api/submit { code, language, problemId }
2. Receive { allPassed, totalTests, testsRun, results[] }
3. If allPassed && userId:
   a. setSolved(true), setSolvedTime(Date.now())
   b. localStorage: save solved timestamp
   c. POST /api/markProblemSolved { userId, problemId, problemName, difficulty }
      → Prisma creates SolvedProblem record in PostgreSQL
```

#### Sub-Components (defined in same file)

| Component | Purpose |
|---|---|
| `DescriptionTab` | Renders problem name, description, examples, constraints |
| `TestCasesTab` | Shows visible test cases + hidden count, editable custom input textarea |
| `InstructionsTab` | How-to guide, I/O format per language, keyboard shortcuts table, snippet shortcuts, tips |
| `Step` | Numbered step component for Instructions |
| `ShortcutRow` | Table row for shortcut key display |

---

### 3.4 `components/ide/CodeEditor.tsx` — Monaco Editor Wrapper (~320 lines)

**Purpose:** Wraps `@monaco-editor/react` with custom actions, error markers, and language-aware snippet shortcuts.

#### Props

```typescript
interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  errorMarkers?: { line: number; message: string }[];
  onRun?: () => void;
  onSubmit?: () => void;
  fontSize?: number;   // 10-24, default 14
  tabSize?: number;    // default 4
  useSpaces?: boolean; // default true
}
```

#### Key Implementation Details

**1. ResizeObserver for Layout**

Monaco doesn't auto-resize when its container changes dimensions. A `ResizeObserver` watches the container and calls `editor.layout()` on every resize:

```typescript
useEffect(() => {
  if (!containerRef.current || !editorRef.current) return;
  const observer = new ResizeObserver(() => editorRef.current?.layout());
  observer.observe(containerRef.current);
  return () => observer.disconnect();
}, []);
```

**Why?** Without this, resizing panels causes the editor's cursor to misalign and content to clip.

**2. Custom Actions (Ctrl+Enter, Ctrl+Shift+Enter)**

Registered via `editorInstance.addAction()` during `onMount`. Uses refs (`onRunRef`, `onSubmitRef`) so the callbacks always point to the latest versions without re-registering the action.

**3. Error Markers**

```typescript
useEffect(() => {
  const model = editorInstance.getModel();
  const markers = errorMarkers.map(err => ({
    severity: monaco.MarkerSeverity.Error,
    message: err.message,
    startLineNumber: err.line,
    endLineNumber: err.line,
    startColumn: 1,
    endColumn: model.getLineMaxColumn(err.line),
  }));
  monaco.editor.setModelMarkers(model, "codemorph", markers);
}, [errorMarkers]);
```

Red squiggly underlines appear on exact error lines. Cleared when user modifies code or changes language.

**4. Language-Aware Snippets**

10 snippet shortcuts that generate language-appropriate code:

| Shortcut | C++ | Python | JavaScript | Java |
|---|---|---|---|---|
| `Alt+F` | `for (int i...)` | `for i in range(n):` | `for (let i...)` | `for (int i...)` |
| `Alt+W` | `while (cond) {}` | `while cond:` | `while (cond) {}` | `while (cond) {}` |
| `Alt+I` | `if (cond) {}` | `if cond:` | `if (cond) {}` | `if (cond) {}` |
| `Alt+N` | `void fn() {}` | `def fn():` | `function fn() {}` | `public static void fn() {}` |
| `Alt+P` | `cout << ""` | `print("")` | `console.log("")` | `System.out.println("")` |
| `Alt+T` | `try {} catch` | `try: except` | `try {} catch` | `try {} catch` |
| `Alt+S` | `switch/case` | `match/case` | `switch/case` | `switch/case` |
| `Alt+D` | `do {} while` | `while True: if not: break` | `do {} while` | `do {} while` |
| `Alt+C` | `class Foo {};` | `class Foo: __init__` | `class Foo { constructor }` | `class Foo {}` |
| `Alt+M` | `int main()` | `if __name__` | `function main()` | `public static void main()` |

Snippets are disposed and re-registered whenever the language changes:

```typescript
useEffect(() => {
  snippetDisposables.current.forEach(d => d.dispose());
  snippetDisposables.current = registerSnippets(ed, monaco, language);
}, [language]);
```

**5. Editor Options**

Noteworthy Monaco options configured:

```typescript
{
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
  fontLigatures: true,
  minimap: { enabled: false },          // Save screen space
  bracketPairColorization: { enabled: true },
  cursorStyle: "line",
  cursorWidth: 2,
  cursorBlinking: "expand",
  cursorSmoothCaretAnimation: "on",
  mouseWheelZoom: true,                 // Ctrl+Scroll to zoom
  glyphMargin: true,                    // Needed for error marker icons
  renderWhitespace: "selection",
  guides: { indentation: true, bracketPairs: true },
}
```

---

### 3.5 `components/ide/OutputPanel.tsx` — Results Display (~200 lines)

**Purpose:** Renders execution results. Three modes:

#### Mode: `idle`
Shows placeholder text: "Run your code or submit to see output here"

#### Mode: `run`
Two sub-states:

| Condition | Display |
|---|---|
| `runError` exists | Red panel: "Compilation Error" or "Runtime Error" with full error text in monospace pre block. If partial output exists, shows that too. |
| No error | Green panel: "Execution Successful" with output in a code block. Shows "(No output)" if stdout was empty. |

#### Mode: `submit`
Renders a list of per-test-case result cards:

```
✓ Test Case 1  ← green card
  Input: 5\n1 2 2 3 3
  Expected: 1: 1\n2: 2\n3: 2

✗ Test Case 3  ← red card, hidden
  [Hidden]
  Got: Hidden

📋 2 more test case(s) not executed
```

**Hidden Test Cases:** If `isHidden`, input and expected output are shown as "Hidden". Only actual output is shown on failure (also hidden for hidden tests).

**Summary Header:** "All Test Cases Passed!" (green) or "Failed — X/Y test cases run" (red).

**Exported Type:**

```typescript
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
```

---

### 3.6 `lib/dockerExecutor.ts` — Docker Execution Engine (~160 lines)

**Purpose:** Core utility that executes user code in Docker containers with security sandboxing.

#### Why Does This File Exist? What Problem Does It Solve?

When a user writes C++ code in the browser and clicks "Run", that code needs to actually *execute somewhere*. The browser can't run C++ — it can only run JavaScript. So the code must be sent to the server, compiled, and run in a real operating system environment.

But running arbitrary user code on your server is **extremely dangerous**. A malicious user could:
- Run `rm -rf /` and destroy the server
- Start a crypto miner using your CPU
- Read environment variables (database passwords, API keys)
- Make network requests to attack other services
- Fork-bomb the system and crash the server

**Docker solves all of this.** Each piece of user code runs inside a throwaway container — a lightweight, isolated mini-OS that:
- Has no access to the host filesystem (only sees a mounted temp directory)
- Has no network access (`--network none`)
- Has limited memory (256 MB) and CPU (1 core)
- Is automatically deleted after execution (`--rm`)
- Is forcefully killed if it takes too long (10-second timeout)

Think of it as running the user's code inside a sealed box. The box has a compiler, stdin, and stdout — nothing else. When execution finishes, the box is destroyed.

#### What Happens When `executeInDocker()` Is Called — Full Lifecycle

Let's trace exactly what happens when a user writes a C++ solution and clicks Run:

```
Browser: User clicks "Run"
    │
    ▼
ProblemIDE.handleRun()
    │   POST /api/execute { code: "#include...", language: "cpp", input: "5\n1 2 3 4 5" }
    │
    ▼
app/api/execute/route.ts
    │   Validates inputs → calls executeInDocker(code, "cpp", "5\n1 2 3 4 5")
    │
    ▼
lib/dockerExecutor.ts — executeInDocker()
    │
    ├─ Step 1: Generate a unique session ID
    │   sessionId = "a3f7c2b1-..."  (UUID v4)
    │   This ensures multiple users running code simultaneously never collide.
    │
    ├─ Step 2: Create a temp directory on the HOST machine
    │   /tmp/codemorph-a3f7c2b1/
    │   (On Windows: C:\Users\<user>\AppData\Local\Temp\codemorph-a3f7c2b1\)
    │
    ├─ Step 3: Write two files into that directory
    │   /tmp/codemorph-a3f7c2b1/main.cpp   ← The user's code
    │   /tmp/codemorph-a3f7c2b1/input.txt  ← The stdin input
    │
    ├─ Step 4: COMPILATION (C++ and Java only)
    │   Spawn a Docker container:
    │
    │   docker run --rm                          ← Delete container after exit
    │     --name codemorph-a3f7c2b1-compile      ← Named for force-cleanup
    │     --network none                         ← No internet
    │     --memory 256m                          ← 256 MB RAM max
    │     --cpus 1.0                             ← 1 CPU core max
    │     --pids-limit 64                        ← Max 64 processes (blocks fork bombs)
    │     -v "/tmp/codemorph-a3f7c2b1:/code"     ← Mount temp dir as /code inside container
    │     gcc:latest                             ← Use the GCC Docker image
    │     sh -c "g++ -o /code/main /code/main.cpp -std=c++17 2>&1"
    │                                            ← Compile with C++17 standard
    │
    │   What happens inside the container:
    │   - A fresh Linux environment boots (~0.5-1s)
    │   - GCC reads /code/main.cpp
    │   - Compiles it → writes binary to /code/main
    │   - Since /code is a mounted volume, the binary appears in the HOST's temp dir
    │   - Container exits and is auto-removed
    │
    │   If compilation fails (syntax error, etc.):
    │   - stderr contains "main.cpp:5:10: error: expected ';'"
    │   - Return immediately: { error: "main.cpp:5:10: ...", errorType: "compilation" }
    │   - ProblemIDE.parseErrorMarkers() extracts line 5 → red squiggly in editor
    │   - Done. No run step happens.
    │
    ├─ Step 5: EXECUTION
    │   Spawn a SECOND Docker container:
    │
    │   docker run --rm
    │     --name codemorph-a3f7c2b1-run
    │     --network none --memory 256m --cpus 1.0 --pids-limit 64
    │     -v "/tmp/codemorph-a3f7c2b1:/code"
    │     gcc:latest
    │     sh -c "/code/main < /code/input.txt 2>&1"
    │                      ↑ stdin piped from input.txt
    │
    │   What happens inside the container:
    │   - Fresh Linux boots again
    │   - Runs the compiled binary /code/main
    │   - input.txt content ("5\n1 2 3 4 5") is fed as stdin
    │   - Program writes to stdout → captured
    │   - Container exits
    │
    │   Possible outcomes:
    │   - exit 0         → Success. Return { output: "15", error: null }
    │   - exit 137       → SIGKILL (OOM or timeout). Return { errorType: "timeout" }
    │   - exit non-zero  → Runtime error (segfault, exception). Return { errorType: "runtime" }
    │
    ├─ Step 6: CLEANUP (always runs, even on errors — in the `finally` block)
    │   - rm -rf /tmp/codemorph-a3f7c2b1/    ← Delete temp files
    │   - docker rm -f codemorph-a3f7c2b1-compile  ← Force-remove if still alive
    │   - docker rm -f codemorph-a3f7c2b1-run      ← Force-remove if still alive
    │
    ▼
Result flows back: API route → JSON response → ProblemIDE → OutputPanel
```

#### Why Two Separate Containers (Compile vs Run)?

We use **two containers** instead of one because:
1. **Cleaner error categorization** — if the first container fails, we know it's a compilation error. If the second fails, it's a runtime error. Users get different error messages for each.
2. **Faster feedback** — if compilation fails, we skip the run container entirely.
3. **Isolation** — the compile step needs write access (to produce a binary), but the run step for interpreted languages only needs read access.

#### Why Not Just Use `child_process.exec()` Without Docker?

Running `g++ user_code.cpp && ./a.out` directly on the server would work — but it's catastrophically unsafe:

| Risk | Without Docker | With Docker |
|---|---|---|
| User runs `rm -rf /` | Server destroyed | Only the container's filesystem is affected (which is about to be deleted anyway) |
| User reads `/etc/passwd` | Leaks server info | Container has its own `/etc/passwd` |
| User reads `process.env` | Leaks DB passwords, API keys | Container has no env variables |
| User runs `while(1) fork()` | Server crashes | `--pids-limit 64` caps it, container killed by timeout |
| User allocates 10 GB RAM | Server runs OOM | `--memory 256m` hard cap |
| User runs `curl evil.com` | Can exfiltrate data | `--network none` blocks all networking |
| User runs for 10 minutes | Eats server resources | Killed after 10 seconds |

#### The `runCommand` Helper — Double-Layered Timeout

```typescript
function runCommand(cmd, timeoutMs):
  exec(cmd, { timeout: timeoutMs + 2000 })   // Node's built-in timeout (12s)
  setTimeout(() => proc.kill("SIGKILL"), timeoutMs + 1000)  // Manual SIGKILL (11s)
```

Why two layers?
- Node's `exec` timeout sends `SIGTERM` which some processes can ignore.
- The manual `SIGKILL` at 11 seconds is uncatchable — guarantees the process dies.
- Docker's own `--rm` flag ensures the container is cleaned up regardless.

This triple-safety (Node timeout + manual SIGKILL + Docker `--rm`) guarantees no zombie containers or runaway processes.

#### Language Configuration

| Language | Docker Image | File Name | Compile Command | Run Command |
|---|---|---|---|---|
| C++ | `gcc:latest` | `main.cpp` | `g++ -o /code/main /code/main.cpp -std=c++17` | `/code/main` |
| Python | `python:3-slim` | `main.py` | — | `python3 /code/main.py` |
| JavaScript | `node:18-slim` | `main.js` | — | `node /code/main.js` |
| Java | `eclipse-temurin:17-jdk` | `Main.java` | `javac /code/Main.java` | `java -cp /code Main` |

#### Security Flags

Every `docker run` command includes:

```
--rm                  Remove container after execution
--network none        No internet access (prevent data exfiltration)
--memory 256m         Hard memory limit
--cpus 1.0            CPU throttle
--pids-limit 64       Prevent fork bombs
```

#### Execution Flow

```
executeInDocker(code, language, stdin):
  1. Generate UUID session ID
  2. Create temp dir: /tmp/codemorph-<uuid>/
  3. Write code to <tempDir>/main.cpp (or main.py, etc.)
  4. Write stdin to <tempDir>/input.txt
  
  5. If language needs compilation (C++, Java):
     docker run --rm --network none --memory 256m --cpus 1.0 --pids-limit 64
       -v "<tempDir>:/code" <image> sh -c "<compileCmd> 2>&1"
     
     If exit code != 0 → return { error: <compileOutput>, errorType: "compilation" }
  
  6. Run code:
     docker run --rm --network none --memory 256m --cpus 1.0 --pids-limit 64
       -v "<tempDir>:/code[:ro]" <image> sh -c "<runCmd> < /code/input.txt 2>&1"
     
     If exit 137 → return { errorType: "timeout" }  (SIGKILL from OOM/timeout)
     If exit != 0 → return { errorType: "runtime" }
     Otherwise    → return { output, error: null }
  
  7. finally: rm -rf tempDir, docker rm -f containers
```

#### Volume Mount Strategy

- **Compiled languages (C++, Java):** Mount with read-write (`-v "dir:/code"`) during compilation (so the binary can be written), then same for run (binary needs to be readable)
- **Interpreted languages (Python, JS):** Mount as read-only (`-v "dir:/code:ro"`) for extra safety

#### Timeout Handling

```typescript
function runCommand(cmd, timeoutMs):
  exec(cmd, { timeout: timeoutMs + 2000, maxBuffer: 1MB })
  // Also hard-kill after timeoutMs + 1000 via setTimeout → SIGKILL
```

Double-layered: Node's `exec` timeout + manual `SIGKILL` as a safety net.

#### Return Type

```typescript
interface ExecutionResult {
  output: string;       // stdout + stderr combined
  error: string | null;
  errorType: "compilation" | "runtime" | "timeout" | "service" | null;
}
```

**Exports:**

```typescript
export function executeInDocker(code, language, stdin): Promise<ExecutionResult>
export function getSupportedLanguages(): string[]  // ["cpp", "python", "javascript", "java"]
```

---

### 3.7 `app/api/execute/route.ts` — Run API (~45 lines)

**Purpose:** `POST /api/execute` — runs user code against custom input.

**Request Body:**
```json
{ "code": "...", "language": "cpp", "input": "5\n1 2 3 4 5" }
```

**Response (success):**
```json
{ "success": true, "output": "15", "error": null, "errorType": null }
```

**Response (error):**
```json
{ "success": false, "error": "main.cpp:5: error: ...", "errorType": "compilation", "output": "" }
```

**Validation:**
- Requires `code` and `language`
- Checks `getSupportedLanguages().includes(language)`
- Returns 400 on invalid input, 500 on internal errors

---

### 3.8 `app/api/submit/route.ts` — Submit API (~95 lines)

**Purpose:** `POST /api/submit` — runs code against all test cases for a problem.

**Request Body:**
```json
{ "code": "...", "language": "python", "problemId": "hm1" }
```

**Response:**
```json
{
  "allPassed": false,
  "totalTests": 4,
  "testsRun": 2,
  "results": [
    {
      "testCaseId": 1,
      "passed": true,
      "input": "5\n1 2 2 3 3",
      "expectedOutput": "1: 1\n2: 2\n3: 2",
      "actualOutput": "1: 1\n2: 2\n3: 2",
      "error": null,
      "errorType": null,
      "isHidden": false
    },
    {
      "testCaseId": 2,
      "passed": false,
      "input": "4\n4 4 4 4",
      "expectedOutput": "4: 4",
      "actualOutput": "4 4",
      "error": null,
      "errorType": null,
      "isHidden": false
    }
  ]
}
```

**Logic:**
1. Validate `code`, `language`, `problemId`
2. Look up problem from `problemsData`
3. Iterate through test cases sequentially:
   - Execute code via `executeInDocker(code, language, testCase.input)`
   - If error → push failed result → **break** (early exit)
   - If output doesn't match expected → push failed result → **break**
   - If passes → push passed result → continue
4. Return summary + results array

**Early Exit:** Stops at the first failure to save Docker execution time. The "X more test case(s) not executed" message is shown in OutputPanel.

**Hidden Test Cases:** Input and expected output are replaced with `"Hidden"` in the response for hidden test cases. Output is also hidden unless the test failed and the test isn't hidden.

---

### 3.9 `scripts/setup-docker.ps1` — Docker Setup Script

**Purpose:** One-time PowerShell script to pull all required Docker images.

**What it does:**
1. Checks if Docker Desktop is running (`docker info`)
2. Pulls all 4 images:
   - `gcc:latest` (~1.4 GB)
   - `python:3-slim` (~150 MB)
   - `node:18-slim` (~200 MB)
   - `eclipse-temurin:17-jdk` (~400 MB)
3. Reports success/failure for each

**Usage:**
```powershell
.\scripts\setup-docker.ps1
```

---

## 4. Docker Setup — How & Why

### Why Docker?

The IDE went through several execution backend iterations:

| Backend | Outcome |
|---|---|
| **Piston API** | Public endpoint was dead/unreliable |
| **Judge0 CE** | Requires paid RapidAPI subscription |
| **JDoodle** | User rejected — wanted full control |
| **Docker (self-hosted)** | ✅ Free, fast, fully sandboxed, works offline |

Docker was chosen because:
1. **Free** — no API keys, no rate limits, no subscriptions
2. **Fast** — containers spin up in ~1-2 seconds on a modern machine
3. **Secure** — `--network none` prevents network access, memory/CPU limits prevent abuse
4. **Offline** — works without internet after initial image pull
5. **Controllable** — full control over compiler versions, timeouts, resource limits

### How It Works (Step by Step)

```
1. User submits code from browser
2. Next.js API route receives the request
3. dockerExecutor creates a temp directory:
   /tmp/codemorph-<uuid>/
     ├── main.cpp (or main.py, main.js, Main.java)
     └── input.txt

4. Docker mounts this directory as /code inside the container:
   docker run --rm --network none --memory 256m --cpus 1.0 --pids-limit 64
     -v "/tmp/codemorph-uuid:/code"
     gcc:latest
     sh -c "g++ -o /code/main /code/main.cpp -std=c++17 2>&1"

5. If compilation succeeds, runs the code:
   docker run --rm --network none --memory 256m --cpus 1.0 --pids-limit 64
     -v "/tmp/codemorph-uuid:/code"
     gcc:latest
     sh -c "/code/main < /code/input.txt 2>&1"

6. stdout + stderr are captured and returned
7. Temp directory is deleted, containers are force-removed
```

### Docker Images Required

| Image | Language | Size | Notes |
|---|---|---|---|
| `gcc:latest` | C++ | ~1.4 GB | GCC compiler with C++17 |
| `python:3-slim` | Python | ~150 MB | Slim Python 3 runtime |
| `node:18-slim` | JavaScript | ~200 MB | Node.js 18 LTS |
| `eclipse-temurin:17-jdk` | Java | ~400 MB | Replaced deprecated `openjdk:17-slim` |

### Security Measures

| Flag | Purpose |
|---|---|
| `--rm` | Auto-remove container after exit (no leftover containers) |
| `--network none` | Zero network access — code cannot exfiltrate data or download packages |
| `--memory 256m` | Hard memory cap — prevents memory exhaustion |
| `--cpus 1.0` | Uses at most 1 CPU core |
| `--pids-limit 64` | Prevents fork bombs |
| 10s timeout | Hard-kill after 10 seconds + 1s grace period |
| Temp dir cleanup | Always deleted in `finally` block |
| Container force-remove | `docker rm -f` as final safety net |

---

## 5. localStorage Strategy

Code-Morph uses `localStorage` extensively to persist user preferences and code without needing database writes for every keystroke.

### Keys & Purposes

| Key Pattern | Example | What It Stores |
|---|---|---|
| `codemorph-code-{problemId}-{lang}` | `codemorph-code-hm1-cpp` | User's code for that problem+language |
| `codemorph-ts-{problemId}-{lang}` | `codemorph-ts-hm1-cpp` | Timestamp of last code save (for expiry) |
| `codemorph-lang-{problemId}` | `codemorph-lang-hm1` | Last selected language for that problem |
| `codemorph-solved-{problemId}` | `codemorph-solved-hm1` | Timestamp when the problem was solved |
| `codemorph-fontSize` | `codemorph-fontSize` | Editor font size (10–24) |
| `codemorph-useSpaces` | `codemorph-useSpaces` | `"true"` or `"false"` |
| `codemorph-tabSize` | `codemorph-tabSize` | Tab size (default 4) |

### Auto-Cleanup

On mount, `cleanupExpiredCode()` runs:
1. Scans all localStorage keys starting with `codemorph-ts-`
2. If the timestamp is older than 30 days, removes both the timestamp key and corresponding code key
3. This prevents localStorage from growing indefinitely

### Debounced Auto-Save

```
User types → 500ms debounce → save to localStorage
           → Show "Saving..." (yellow dot)
           → After save → Show "Saved" (green dot)
           → After 2s → Hide indicator
```

### Solve Timestamps

When a user solves a problem (all test cases pass):
- `localStorage.setItem("codemorph-solved-hm1", String(Date.now()))` is saved
- This timestamp is read by:
  - **ProblemIDE top bar:** Shows "Solved 2h ago"
  - **AlgorithmCard on home page:** Shows "Solved 2h ago" badge
  - **Dashboard:** Shows latest solve time alongside database first-solve time

---

## 6. Keyboard Shortcuts & Snippet System

### Editor Shortcuts (Built into Monaco)

| Action | Shortcut |
|---|---|
| Undo | `Ctrl + Z` |
| Redo | `Ctrl + Y` |
| Toggle comment | `Ctrl + /` |
| Find | `Ctrl + F` |
| Find and replace | `Ctrl + H` |
| Select all | `Ctrl + A` |
| Copy line (no selection) | `Ctrl + C` |
| Cut line (no selection) | `Ctrl + X` |
| Move line up | `Alt + Up` |
| Move line down | `Alt + Down` |
| Duplicate line | `Shift + Alt + Down` |
| Delete line | `Ctrl + Shift + K` |
| Indent | `Tab` |
| Outdent | `Shift + Tab` |
| Go to line | `Ctrl + G` |
| Command palette | `F1` |
| Quick suggestions | `Ctrl + Space` |
| Zoom in | `Ctrl + Scroll Up` |
| Zoom out | `Ctrl + Scroll Down` |
| Multi-cursor | `Alt + Click` |
| Select next match | `Ctrl + D` |

### Custom Actions (Registered via `addAction`)

| Action | Shortcut | Implementation |
|---|---|---|
| Run code | `Ctrl + Enter` | Calls `onRunRef.current()` → `handleRun()` |
| Submit code | `Ctrl + Shift + Enter` | Calls `onSubmitRef.current()` → `handleSubmit()` |

### Code Snippet Shortcuts (Language-Aware)

| Shortcut | Action | How It Works |
|---|---|---|
| `Alt + F` | Insert for loop | Reads current language → inserts appropriate syntax |
| `Alt + W` | Insert while loop | Python: `while cond:` / Others: `while (cond) {}` |
| `Alt + I` | Insert if block | Python: `if cond:` / Others: `if (cond) {}` |
| `Alt + N` | Insert function | Python: `def fn():` / JS: `function fn()` / etc. |
| `Alt + P` | Insert print | Python: `print("")` / C++: `cout <<` / JS: `console.log` |
| `Alt + T` | Insert try-catch | Python: `try: except` / Others: `try {} catch` |
| `Alt + S` | Insert switch-case | Python: `match/case` / Others: `switch/case` |
| `Alt + D` | Insert do-while | Python: `while True: break` / Others: `do {} while` |
| `Alt + C` | Insert class | Python: `class: __init__` / C++: `class {};` / etc. |
| `Alt + M` | Insert main | Python: `if __name__` / C++: `int main()` / etc. |

**How snippets work:**
1. `getSnippets(language)` returns a map of template strings with `{I}` indent placeholders
2. `registerSnippets()` registers each as a Monaco action with an Alt+key binding
3. When triggered, it reads the current line's indent, replaces `{I}` with that indent, inserts the text, and positions the cursor inside the new block
4. When language changes, all snippet disposables are `.dispose()`d and re-registered with new templates

---

## 7. UI Features & Design Decisions

### Resizable Panels

Two `useResizable` hooks:
- **Left panel** (horizontal): 280–700px, default 420px. Drag the vertical divider.
- **Output panel** (vertical): 100–500px, default 250px. Drag the horizontal divider.

Visual feedback: Dividers have a grip icon (GripVertical / GripHorizontal) and turn cyan on hover.

### Collapsible Panels

- **Left panel:** Toggle via PanelLeftOpen/PanelLeftClose button in top bar. When collapsed, the editor takes full width.
- **Output panel:** Toggle via Maximize2/Minimize2 button in editor header. When collapsed, the editor takes full height.

### Auto-Save Indicator

Three states shown next to "C++ Editor" in the header:
- Yellow pulsing dot + "Saving..." — debounce in progress
- Green dot + "Saved" — just saved
- Hidden — 2 seconds after save

### Font Size Controls

`A-` and `A+` buttons in the editor header. Range: 10–24px. Persisted to `localStorage`.

### Tab vs Spaces Toggle

Button showing "Spaces: 4" or "Tabs: 4". Click to switch. Persisted to `localStorage`. Passes `insertSpaces` and `tabSize` to Monaco options.

### Solved Badge

When all test cases pass, a green "✓ Solved 2h ago" badge appears in the top bar with relative time. Timestamp shown on hover via the `title` attribute.

### Dark Theme

Entire IDE uses `vs-dark` Monaco theme + custom `slate-900`/`slate-950` backgrounds. Cyan accents for interactive elements. Green/red/yellow for status colors.

---

## 8. All Changes & Their Impact

### Phase 1: Core IDE Build

| Change | Files Created/Modified | Impact |
|---|---|---|
| Installed `@monaco-editor/react` | `package.json` | Added Monaco Editor dependency |
| Created problem bank | `utils/problemsData.tsx` | 16 problems with test cases + 4-language boilerplates |
| Created dynamic route | `app/problems/[problemId]/page.tsx` | `/problems/hm1` now serves the IDE |
| Created Docker executor | `lib/dockerExecutor.ts` | Sandboxed code execution in Docker containers |
| Created Run API | `app/api/execute/route.ts` | `POST /api/execute` — run code with custom input |
| Created Submit API | `app/api/submit/route.ts` | `POST /api/submit` — run against all test cases |
| Created CodeEditor | `components/ide/CodeEditor.tsx` | Monaco wrapper with syntax highlighting |
| Created OutputPanel | `components/ide/OutputPanel.tsx` | Run/submit result display |
| Created ProblemIDE | `components/ide/ProblemIDE.tsx` | Full IDE layout orchestrator |
| Created setup script | `scripts/setup-docker.ps1` | One-time Docker image pull |

### Phase 2: Docker Fixes

| Change | Impact |
|---|---|
| `openjdk:17-slim` → `eclipse-temurin:17-jdk` | Fixed Java compilation — openjdk image was deprecated |
| Fixed compilation flow | Docker now correctly pipes compile → run in two separate container invocations |

### Phase 3: Editor Cursor Fix

| Change | Impact |
|---|---|
| Added `ResizeObserver` to CodeEditor | Editor now correctly re-layouts when panels resize |
| Added explicit cursor settings | `cursorStyle: "line"`, `cursorWidth: 2`, `cursorBlinking: "expand"` — consistent visible cursor |
| Added `setTimeout(() => layout(), 100)` on mount | Ensures initial layout is correct after DOM settles |

### Phase 4: Resizable & Collapsible Panels

| Change | Impact |
|---|---|
| Added `useResizable` hook | Both panels are now draggable with min/max bounds |
| Added collapse toggles | Left panel and output panel can be hidden for maximum editor space |
| Added grip icons on dividers | Visual cue that panels are resizable |
| Added Instructions tab | Users can read shortcuts, I/O format, and tips without leaving the IDE |

### Phase 5: Code Persistence & Error Markers

| Change | Impact |
|---|---|
| localStorage persistence | Code survives page refresh, per problem + per language |
| 30-day auto-cleanup | Prevents localStorage bloat |
| `parseErrorMarkers()` | Compilation/runtime errors show as red squiggly lines in the editor |
| 5 snippet shortcuts | `Alt+F/W/I/N/P` — boilerplate code insertion |

### Phase 6: Advanced Features

| Change | Impact |
|---|---|
| 5 more snippets | `Alt+T/S/D/C/M` — try-catch, switch, do-while, class, main |
| Language-aware snippets | Snippets adapt to selected language (Python vs C++ vs JS vs Java) |
| `Ctrl+Enter` Run / `Ctrl+Shift+Enter` Submit | Keyboard-driven workflow |
| Debounced auto-save indicator | "Saving..." / "Saved" indicator in editor header |
| Font size persistence | `A-`/`A+` controls, 10–24px, saved to localStorage |
| Tab vs Spaces toggle | Toggle button, saved to localStorage |
| Solve timestamp in localStorage | "Solved 2h ago" displayed in IDE, home page cards, and dashboard |

### Phase 7: Home Page & Dashboard Enhancements

| Change | Impact |
|---|---|
| Solve button loading spinner | Spinner appears while navigating to IDE |
| Unclickable status column | Prevents accidental clicks on status badges |
| Collapsible sidebar on `/home` | PanelLeftClose/PanelLeftOpen toggle for more content space |
| Dashboard clickable problems | Problem entries in dashboard now link to their IDE page |
| Dashboard dual timestamps | Shows both DB first-solve time and localStorage latest-solve time |
| Last-solved badge on home cards | "Solved 2h ago" on AlgorithmCards using localStorage timestamps |

---

## 9. How to Set Up & Run

### Prerequisites

- **Node.js** 18+ and npm
- **Docker Desktop** running
- **PostgreSQL** database (NeonDB recommended)
- **Clerk** account for authentication

### Step 1: Clone & Install

```bash
git clone <repo-url>
cd Code-Morph
npm install
```

### Step 2: Environment Variables

Create `.env`:

```env
DATABASE_URL="postgresql://user:password@host/dbname"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
```

### Step 3: Database Setup

```bash
npx prisma db push
# or
npx prisma migrate dev
```

### Step 4: Pull Docker Images

```powershell
.\scripts\setup-docker.ps1
```

Or manually:

```bash
docker pull gcc:latest
docker pull python:3-slim
docker pull node:18-slim
docker pull eclipse-temurin:17-jdk
```

### Step 5: Run

```bash
npm run dev
```

Open `http://localhost:3000` → Navigate to any algorithm → Click "Solve" → Start coding!

### Verifying Docker Works

```bash
# Quick test — should print "Hello"
docker run --rm gcc:latest sh -c "echo '#include<stdio.h>\nint main(){printf(\"Hello\");return 0;}' > /tmp/t.c && gcc -o /tmp/t /tmp/t.c && /tmp/t"
```

---

## Appendix: File Tree (IDE-Related Only)

```
Code-Morph/
├── app/
│   ├── api/
│   │   ├── execute/
│   │   │   └── route.ts          ← Run API
│   │   └── submit/
│   │       └── route.ts          ← Submit API
│   └── problems/
│       └── [problemId]/
│           └── page.tsx           ← Dynamic route
├── components/
│   └── ide/
│       ├── CodeEditor.tsx         ← Monaco Editor wrapper
│       ├── OutputPanel.tsx        ← Results display
│       └── ProblemIDE.tsx         ← Main IDE layout/state
├── lib/
│   └── dockerExecutor.ts         ← Docker execution engine
├── utils/
│   └── problemsData.tsx          ← 16 problems + test cases
└── scripts/
    └── setup-docker.ps1          ← Docker image setup
```

---

## 10. Future Improvements

### 10.1 Docker & Execution Improvements

| Improvement | Why | Complexity |
|---|---|---|
| **Pre-warm containers** | Currently each run boots a fresh container (~1-2s overhead). Keeping warm containers in a pool (e.g., Docker Compose with `--restart always`) would cut execution time to ~200ms. | Medium |
| **WebSocket streaming output** | Currently the entire output is returned at once after execution. Streaming stdout in real-time (line by line) would give users instant feedback, especially for long-running code. | Medium |
| **Container pool / queue** | If multiple users submit simultaneously, each spawns its own Docker containers. A job queue (e.g., BullMQ + Redis) would throttle concurrent executions and prevent resource exhaustion. | Medium-High |
| **Run all test cases in parallel** | Currently `/api/submit` runs test cases sequentially (one container at a time). Running them in parallel (e.g., `Promise.all` with a concurrency limit of 4) would speed up submissions significantly. | Low |
| **Custom Docker images** | Build a single multi-language Docker image with gcc + python + node + javac pre-installed. This avoids pulling 4 separate images (~2.2 GB total) and speeds up container start. | Low |
| **Linux cgroup limits instead of Docker** | On a Linux host (production), using cgroups v2 directly (via `nsjail` or `isolate`) is faster than Docker for sandboxing — used by competitive programming judges like Codeforces. | High |
| **Support more languages** | Add Rust (`rust:slim`), Go (`golang:alpine`), TypeScript (compile with `tsc` then run with Node), C# (`mcr.microsoft.com/dotnet/sdk`). Only requires adding entries to `LANGUAGE_CONFIG`. | Low |
| **Execution time measurement** | Capture the exact execution time (wall clock + CPU time) and display it in the output panel (e.g., "Executed in 45ms"). Add `time` command or `performance.now()` around the Docker exec. | Low |
| **Memory usage tracking** | Use `docker stats` or `--memory-swap` + exit code analysis to report actual memory usage alongside output. | Medium |
| **Rate limiting** | Add per-user rate limiting (e.g., max 10 executions per minute) to prevent abuse. Can be done with a simple in-memory counter or Redis. | Low |

### 10.2 localStorage Improvements

| Improvement | Why | Complexity |
|---|---|---|
| **Migrate to IndexedDB** | `localStorage` has a ~5-10 MB limit per origin. With 16 problems × 4 languages × ~5 KB per solution, heavy users could hit the cap. IndexedDB supports hundreds of MB and has async APIs that don't block the main thread. Libraries like `idb-keyval` make the API trivially simple. | Medium |
| **Cloud sync (save to database)** | localStorage is browser-local — clearing browser data or switching devices loses all code. Syncing code to the database (debounced, one write per save) tied to the user's Clerk account would enable cross-device continuity. | Medium |
| **Export / Import solutions** | Let users download their solutions as files (e.g., `hm1_solution.cpp`) or import previously written code. Reduces dependency on localStorage persistence. | Low |
| **Version history** | Store the last N versions of code per problem (ring buffer in localStorage or IndexedDB). Users could undo to a previous version if they accidentally break their working solution. | Medium |
| **Configurable expiry** | Currently hardcoded to 30 days. Let users choose their cleanup interval (7 days / 30 days / 90 days / never) in a settings panel. | Low |
| **Storage usage indicator** | Show how much localStorage is being used (e.g., "Using 1.2 MB / 5 MB") in a settings or profile section. Alert users when they're close to the limit. | Low |
| **Solve data backup to Clerk metadata** | Store the user's solve timestamps and progress in Clerk's `publicMetadata` or `privateMetadata`. This makes the solve history portable — it follows the user across browsers and devices without needing a custom sync endpoint. | Low-Medium |
| **Compression** | Compress code with a lightweight algorithm (e.g., LZ-String) before writing to localStorage. Typical source code compresses 3-5x, dramatically increasing effective storage capacity. `lz-string` is a 5 KB library that works synchronously. | Low |

### 10.3 IDE Feature Improvements

| Improvement | Why | Complexity |
|---|---|---|
| **Split-pane test vs custom input** | Instead of tabs, show test cases and custom input side by side so users can reference examples while editing input. | Low |
| **Diff view for failed tests** | When a test case fails, show a side-by-side or inline diff between expected and actual output (Monaco has a built-in `DiffEditor`). | Medium |
| **AI hints** | On repeated failures, offer optional hints powered by an LLM (e.g., "Your solution doesn't handle negative numbers"). Rate-limited and opt-in. | High |
| **Submission history** | Log each submission attempt (timestamp, language, pass/fail, code snapshot) in the database. Show a history tab in the IDE. | Medium |
| **Collaborative editing** | Allow two users to edit the same problem simultaneously (like Google Docs). Could use Yjs or Liveblocks with Monaco's collaborative editing API. | High |
| **Test case creation** | Let users add their own custom test cases (input + expected output) that persist alongside the problem's built-in test cases. | Low |
| **Execution stats leaderboard** | Track execution time per submission and show a leaderboard of fastest solutions per problem. | Medium |
| **Mobile responsive IDE** | Currently the resizable panels don't work well on mobile. Add a stacked layout for small screens with tab-based navigation between description/editor/output. | Medium |
