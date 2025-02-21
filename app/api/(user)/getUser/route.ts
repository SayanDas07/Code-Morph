import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId } = body;

        console.log("userId", userId);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch user with solvedProblems
        const currentUser = await prisma.user.findFirst({
            where: { clerkId: userId },
            include: { solvedProblems: true }, // ✅ Include solved problems
        });

        console.log("currentUser", currentUser);

        // Ensure `solvedProblems` is always an array
        if (currentUser) {
            currentUser.solvedProblems = currentUser.solvedProblems || [];
        }

        return NextResponse.json({ currentUser }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching users:", error.message);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
