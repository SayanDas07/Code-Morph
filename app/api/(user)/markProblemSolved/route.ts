/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { userId, problemId, problemName  } = await req.json();

        const user = await prisma.user.findFirst({
            where: { clerkId: userId }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        await prisma.solvedProblem.create({
            data: {
                userId: user.id,
                problemId,
                problemName
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        // If problem is already marked as solved, just return success
        if (error.code === 'P2002') {
            return NextResponse.json({ success: true });
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}