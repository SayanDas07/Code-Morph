/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { userId, problemId, problemName } = await req.json();

        console.log(userId, problemId, problemName);
        const user = await prisma.user.findFirst({
            where: { clerkId: userId }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        await prisma.solvedProblem.delete({
            where: {
                userId_problemId: {
                    userId: user.id,
                    problemId,
                }
            }
        });

        return NextResponse.json({ success: true, status: 200, message: "Problem unmarked as solved" });
    } catch (error: any) {
        console.error("Error unmarking problem as solved:", error.message);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}