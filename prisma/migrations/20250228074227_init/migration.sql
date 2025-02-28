-- CreateEnum
CREATE TYPE "Badge" AS ENUM ('NONE', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT,
    "githubLink" TEXT,
    "linkedinLink" TEXT,
    "leetcodeLink" TEXT,
    "activeBadge" "Badge" NOT NULL DEFAULT 'NONE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolvedProblem" (
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "problemName" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "solvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SolvedProblem_pkey" PRIMARY KEY ("userId","problemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "SolvedProblem" ADD CONSTRAINT "SolvedProblem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
