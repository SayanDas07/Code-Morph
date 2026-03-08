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
