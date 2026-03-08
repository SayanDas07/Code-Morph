import { NextRequest, NextResponse } from "next/server";
import { getProblemById } from "@/utils/problemsData";
import { executeInDocker, getSupportedLanguages } from "@/lib/dockerExecutor";

export async function POST(req: NextRequest) {
  try {
    const { code, language, problemId } = await req.json();

    if (!code || !language || !problemId) {
      return NextResponse.json(
        { error: "code, language, and problemId are required" },
        { status: 400 }
      );
    }

    if (!getSupportedLanguages().includes(language)) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    const problem = getProblemById(problemId);
    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }

    const results = [];
    let allPassed = true;

    for (const testCase of problem.testCases) {
      const { output, error, errorType } = await executeInDocker(
        code,
        language,
        testCase.input
      );

      if (error) {
        results.push({
          testCaseId: testCase.id,
          passed: false,
          input: testCase.isHidden ? "Hidden" : testCase.input,
          expectedOutput: testCase.isHidden ? "Hidden" : testCase.expectedOutput,
          actualOutput: output || "",
          error,
          errorType,
          isHidden: testCase.isHidden || false,
        });
        allPassed = false;
        // Stop on first error to save API calls
        break;
      }

      const passed = output.trim() === testCase.expectedOutput.trim();
      if (!passed) allPassed = false;

      results.push({
        testCaseId: testCase.id,
        passed,
        input: testCase.isHidden ? "Hidden" : testCase.input,
        expectedOutput: testCase.isHidden ? "Hidden" : testCase.expectedOutput,
        actualOutput: testCase.isHidden && passed ? "Hidden" : output,
        error: null,
        errorType: null,
        isHidden: testCase.isHidden || false,
      });

      // Stop on first failure
      if (!passed) break;
    }

    return NextResponse.json({
      allPassed,
      totalTests: problem.testCases.length,
      testsRun: results.length,
      results,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
