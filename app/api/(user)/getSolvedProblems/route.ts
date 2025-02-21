/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        const user = await prisma.user.findFirst({
            where: { clerkId: userId },
            include: {
                solvedProblems: {
                    select: { problemId: true, problemName: true, difficulty: true }
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            solvedProblemIds: user.solvedProblems.map(sp => sp.problemId)
        });
    } catch (error: any) {
        console.error("Error fetching user:", error.message);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}