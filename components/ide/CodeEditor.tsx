"use client";

import { useRef, useCallback, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type { editor, IDisposable } from "monaco-editor";

interface ErrorMarker {
  line: number;
  message: string;
}

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  errorMarkers?: ErrorMarker[];
  onRun?: () => void;
  onSubmit?: () => void;
  fontSize?: number;
  tabSize?: number;
  useSpaces?: boolean;
}

const LANGUAGE_MAP: Record<string, string> = {
  cpp: "cpp",
  python: "python",
  javascript: "javascript",
  java: "java",
};

export default function CodeEditor({
  code,
  language,
  onChange,
  readOnly = false,
  errorMarkers = [],
  onRun,
  onSubmit,
  fontSize = 14,
  tabSize = 4,
  useSpaces = true,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const snippetDisposables = useRef<IDisposable[]>([]);
  const onRunRef = useRef(onRun);
  const onSubmitRef = useRef(onSubmit);

  // Keep refs in sync
  useEffect(() => { onRunRef.current = onRun; }, [onRun]);
  useEffect(() => { onSubmitRef.current = onSubmit; }, [onSubmit]);

  const handleMount: OnMount = useCallback((editorInstance, monaco) => {
    editorRef.current = editorInstance;
    monacoRef.current = monaco;
    editorInstance.focus();
    setTimeout(() => editorInstance.layout(), 100);

    // Ctrl+Enter → Run
    editorInstance.addAction({
      id: "codemorph-run",
      label: "Run Code",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => onRunRef.current?.(),
    });

    // Ctrl+Shift+Enter → Submit
    editorInstance.addAction({
      id: "codemorph-submit",
      label: "Submit Code",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter],
      run: () => onSubmitRef.current?.(),
    });

    // Register snippet shortcuts for current language
    snippetDisposables.current = registerSnippets(editorInstance, monaco, language);
  }, [language]);

  // Re-register snippets when language changes
  useEffect(() => {
    const ed = editorRef.current;
    const monaco = monacoRef.current;
    if (!ed || !monaco) return;
    // Dispose old snippets
    snippetDisposables.current.forEach((d) => d.dispose());
    snippetDisposables.current = registerSnippets(ed, monaco, language);
  }, [language]);

  // Re-layout when container resizes
  useEffect(() => {
    if (!containerRef.current || !editorRef.current) return;
    const observer = new ResizeObserver(() => {
      editorRef.current?.layout();
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Update error markers when they change
  useEffect(() => {
    const editorInstance = editorRef.current;
    const monaco = monacoRef.current;
    if (!editorInstance || !monaco) return;

    const model = editorInstance.getModel();
    if (!model) return;

    if (errorMarkers.length === 0) {
      monaco.editor.setModelMarkers(model, "codemorph", []);
      return;
    }

    const markers = errorMarkers.map((err) => ({
      severity: monaco.MarkerSeverity.Error,
      message: err.message,
      startLineNumber: err.line,
      startColumn: 1,
      endLineNumber: err.line,
      endColumn: model.getLineMaxColumn(err.line) || 1,
    }));

    monaco.editor.setModelMarkers(model, "codemorph", markers);
  }, [errorMarkers]);

  // Cleanup snippets on unmount
  useEffect(() => {
    return () => {
      snippetDisposables.current.forEach((d) => d.dispose());
    };
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full overflow-hidden">
      <Editor
        height="100%"
        language={LANGUAGE_MAP[language] || "plaintext"}
        value={code}
        onChange={(val) => onChange(val || "")}
        onMount={handleMount}
        theme="vs-dark"
        options={{
          fontSize,
          fontFamily:
            "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          tabSize,
          insertSpaces: useSpaces,
          readOnly,
          padding: { top: 12, bottom: 12 },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          parameterHints: { enabled: true },
          bracketPairColorization: { enabled: true },
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          formatOnPaste: true,
          lineNumbers: "on",
          renderLineHighlight: "all",
          cursorStyle: "line",
          cursorWidth: 2,
          cursorBlinking: "expand",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          mouseWheelZoom: true,
          dragAndDrop: true,
          links: true,
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          renderWhitespace: "selection",
          guides: {
            indentation: true,
            bracketPairs: true,
          },
          stickyScroll: { enabled: false },
          glyphMargin: true, // Needed for error markers
        }}
      />
    </div>
  );
}

// ── Language-aware snippet templates ──
function getSnippets(lang: string) {
  const py = lang === "python";
  const js = lang === "javascript";
  const java = lang === "java";

  return {
    forLoop: py
      ? "for i in range(n):\n{I}    "
      : js
      ? "for (let i = 0; i < n; i++) {\n{I}    \n{I}}"
      : java
      ? "for (int i = 0; i < n; i++) {\n{I}    \n{I}}"
      : "for (int i = 0; i < n; i++) {\n{I}    \n{I}}",

    whileLoop: py
      ? "while condition:\n{I}    "
      : `while (condition) {\n{I}    \n{I}}`,

    ifBlock: py
      ? "if condition:\n{I}    "
      : `if (condition) {\n{I}    \n{I}}`,

    function: py
      ? "def function_name():\n{I}    "
      : js
      ? "function functionName() {\n{I}    \n{I}}"
      : java
      ? "public static void functionName() {\n{I}    \n{I}}"
      : "void functionName() {\n{I}    \n{I}}",

    print: py
      ? 'print("")'
      : js
      ? 'console.log("");'
      : java
      ? 'System.out.println("");'
      : 'cout << "" << endl;',

    tryCatch: py
      ? "try:\n{I}    \n{I}except Exception as e:\n{I}    "
      : js
      ? "try {\n{I}    \n{I}} catch (error) {\n{I}    \n{I}}"
      : java
      ? "try {\n{I}    \n{I}} catch (Exception e) {\n{I}    \n{I}}"
      : "try {\n{I}    \n{I}} catch (exception& e) {\n{I}    \n{I}}",

    switchCase: py
      ? "match variable:\n{I}    case 1:\n{I}        pass\n{I}    case 2:\n{I}        pass\n{I}    case _:\n{I}        pass"
      : `switch (variable) {\n{I}    case 1:\n{I}        break;\n{I}    case 2:\n{I}        break;\n{I}    default:\n{I}        break;\n{I}}`,

    doWhile: py
      ? "while True:\n{I}    \n{I}    if not condition:\n{I}        break"
      : `do {\n{I}    \n{I}} while (condition);`,

    classStruct: py
      ? "class ClassName:\n{I}    def __init__(self):\n{I}        "
      : js
      ? "class ClassName {\n{I}    constructor() {\n{I}        \n{I}    }\n{I}}"
      : java
      ? "class ClassName {\n{I}    \n{I}}"
      : "class ClassName {\n{I}public:\n{I}    \n{I}};",

    mainFunc: py
      ? 'if __name__ == "__main__":\n{I}    '
      : js
      ? "function main() {\n{I}    \n{I}}\n{I}main();"
      : java
      ? "public static void main(String[] args) {\n{I}    \n{I}}"
      : "int main() {\n{I}    \n{I}    return 0;\n{I}}",
  };
}

function registerSnippets(
  editorInstance: editor.IStandaloneCodeEditor,
  monaco: typeof import("monaco-editor"),
  language: string
): IDisposable[] {
  const disposables: IDisposable[] = [];
  const snippets = getSnippets(language);

  function addSnippetAction(
    id: string,
    label: string,
    keybinding: number,
    template: string,
    cursorLineOffset = 1,
    cursorColExtra = 5
  ) {
    const d = editorInstance.addAction({
      id,
      label,
      keybindings: [keybinding],
      run: (ed) => {
        const position = ed.getPosition();
        if (!position) return;
        const indent = getLineIndent(ed, position.lineNumber);
        const text = `${indent}${template.replace(/\{I\}/g, indent)}`;
        ed.executeEdits("snippet", [
          {
            range: new monaco.Range(
              position.lineNumber, position.column,
              position.lineNumber, position.column
            ),
            text,
          },
        ]);
        ed.setPosition({
          lineNumber: position.lineNumber + cursorLineOffset,
          column: indent.length + cursorColExtra,
        });
        ed.focus();
      },
    });
    disposables.push(d);
  }

  addSnippetAction("codemorph-for-loop", "Insert For Loop", monaco.KeyMod.Alt | monaco.KeyCode.KeyF, snippets.forLoop);
  addSnippetAction("codemorph-while-loop", "Insert While Loop", monaco.KeyMod.Alt | monaco.KeyCode.KeyW, snippets.whileLoop);
  addSnippetAction("codemorph-if-block", "Insert If Block", monaco.KeyMod.Alt | monaco.KeyCode.KeyI, snippets.ifBlock);
  addSnippetAction("codemorph-function", "Insert Function", monaco.KeyMod.Alt | monaco.KeyCode.KeyN, snippets.function);
  addSnippetAction("codemorph-print", "Insert Print", monaco.KeyMod.Alt | monaco.KeyCode.KeyP, snippets.print, 0, 10);
  addSnippetAction("codemorph-try-catch", "Insert Try-Catch", monaco.KeyMod.Alt | monaco.KeyCode.KeyT, snippets.tryCatch);
  addSnippetAction("codemorph-switch-case", "Insert Switch-Case", monaco.KeyMod.Alt | monaco.KeyCode.KeyS, snippets.switchCase, 1, 9);
  addSnippetAction("codemorph-do-while", "Insert Do-While", monaco.KeyMod.Alt | monaco.KeyCode.KeyD, snippets.doWhile);
  addSnippetAction("codemorph-class", "Insert Class/Struct", monaco.KeyMod.Alt | monaco.KeyCode.KeyC, snippets.classStruct, 2, 5);
  addSnippetAction("codemorph-main", "Insert Main", monaco.KeyMod.Alt | monaco.KeyCode.KeyM, snippets.mainFunc);

  return disposables;
}

function getLineIndent(
  ed: editor.ICodeEditor,
  lineNumber: number
): string {
  const model = ed.getModel();
  if (!model) return "";
  const line = model.getLineContent(lineNumber);
  const match = line.match(/^(\s*)/);
  return match ? match[1] : "";
}
