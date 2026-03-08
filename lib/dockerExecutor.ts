import { exec } from "child_process";
import { writeFile, mkdir, rm } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { tmpdir } from "os";

const TIMEOUT_MS = 10_000;
const MEMORY_LIMIT = "256m";
const CPU_LIMIT = "1.0";

interface DockerConfig {
  image: string;
  fileName: string;
  compileCmd?: string;
  runCmd: string;
}

const LANGUAGE_CONFIG: Record<string, DockerConfig> = {
  cpp: {
    image: "gcc:latest",
    fileName: "main.cpp",
    compileCmd: "g++ -o /code/main /code/main.cpp -std=c++17",
    runCmd: "/code/main",
  },
  python: {
    image: "python:3-slim",
    fileName: "main.py",
    runCmd: "python3 /code/main.py",
  },
  javascript: {
    image: "node:18-slim",
    fileName: "main.js",
    runCmd: "node /code/main.js",
  },
  java: {
    image: "eclipse-temurin:17-jdk",
    fileName: "Main.java",
    compileCmd: "javac /code/Main.java",
    runCmd: "java -cp /code Main",
  },
};

function runCommand(cmd: string, timeoutMs: number): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve) => {
    const proc = exec(cmd, { timeout: timeoutMs + 2000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      resolve({
        stdout: stdout || "",
        stderr: stderr || "",
        exitCode: error ? (error.code ?? 1) : 0,
      });
    });

    // Hard kill after timeout
    setTimeout(() => {
      try { proc.kill("SIGKILL"); } catch { /* ignore */ }
    }, timeoutMs + 1000);
  });
}

export interface ExecutionResult {
  output: string;
  error: string | null;
  errorType: "compilation" | "runtime" | "timeout" | "service" | null;
}

export function getSupportedLanguages(): string[] {
  return Object.keys(LANGUAGE_CONFIG);
}

export async function executeInDocker(
  code: string,
  language: string,
  stdin: string
): Promise<ExecutionResult> {
  const config = LANGUAGE_CONFIG[language];
  if (!config) {
    return { output: "", error: `Unsupported language: ${language}`, errorType: "service" };
  }

  const sessionId = randomUUID();
  const tempDir = join(tmpdir(), `codemorph-${sessionId}`);
  const containerName = `codemorph-${sessionId}`;

  try {
    // Create temp directory with code and input files
    await mkdir(tempDir, { recursive: true });
    await writeFile(join(tempDir, config.fileName), code, "utf-8");
    await writeFile(join(tempDir, "input.txt"), stdin || "", "utf-8");

    // If compilation step needed
    if (config.compileCmd) {
      // For compilation, we need write access to produce the binary
      const compileDocker = [
        "docker run --rm",
        `--name ${containerName}-compile`,
        "--network none",
        `--memory ${MEMORY_LIMIT}`,
        `--cpus ${CPU_LIMIT}`,
        "--pids-limit 64",
        `-v "${tempDir.replace(/\\/g, "/")}:/code"`,
        "--workdir /code",
        config.image,
        `sh -c "${config.compileCmd} 2>&1"`,
      ].join(" ");

      const compileResult = await runCommand(compileDocker, TIMEOUT_MS);

      if (compileResult.exitCode !== 0) {
        const errorOutput = (compileResult.stdout + compileResult.stderr).trim();
        return {
          output: "",
          error: errorOutput || "Compilation failed",
          errorType: "compilation",
        };
      }
    }

    // Run the code
    // For compiled languages, mount with write access so binary is accessible
    const runDocker = [
      "docker run --rm",
      `--name ${containerName}-run`,
      "--network none",
      `--memory ${MEMORY_LIMIT}`,
      `--cpus ${CPU_LIMIT}`,
      "--pids-limit 64",
      `-v "${tempDir.replace(/\\/g, "/")}:/code${config.compileCmd ? "" : ":ro"}"`,
      "--workdir /code",
      config.image,
      `sh -c "${config.runCmd} < /code/input.txt 2>&1"`,
    ].join(" ");

    const runResult = await runCommand(runDocker, TIMEOUT_MS);

    const output = (runResult.stdout + runResult.stderr).trim();

    // Check for timeout (exit code 137 = SIGKILL, often from OOM or timeout)
    if (runResult.exitCode === 137) {
      return {
        output: "",
        error: "Time Limit Exceeded or Memory Limit Exceeded",
        errorType: "timeout",
      };
    }

    if (runResult.exitCode !== 0) {
      return {
        output: "",
        error: output || "Runtime error",
        errorType: "runtime",
      };
    }

    return {
      output: output,
      error: null,
      errorType: null,
    };
  } catch (err) {
    return {
      output: "",
      error: `Docker execution error: ${err instanceof Error ? err.message : "Unknown error"}`,
      errorType: "service",
    };
  } finally {
    // Cleanup temp directory
    try {
      await rm(tempDir, { recursive: true, force: true });
    } catch { /* ignore cleanup errors */ }

    // Force-remove containers if still running
    try {
      exec(`docker rm -f ${containerName} ${containerName}-compile ${containerName}-run 2>nul`, () => {});
    } catch { /* ignore */ }
  }
}
