import { NextRequest, NextResponse } from "next/server";
import { executeInDocker, getSupportedLanguages } from "@/lib/dockerExecutor";

export async function POST(req: NextRequest) {
  try {
    const { code, language, input } = await req.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }

    if (!getSupportedLanguages().includes(language)) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    const result = await executeInDocker(code, language, input || "");

    if (result.error) {
      return NextResponse.json({
        success: false,
        error: result.error,
        errorType: result.errorType,
        output: result.output,
      });
    }

    return NextResponse.json({
      success: true,
      output: result.output,
      error: null,
      errorType: null,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
