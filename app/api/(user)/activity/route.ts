// app/api/user/active-days/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

   
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    
    const solvedProblems = await prisma.solvedProblem.findMany({
      where: {
        userId: user.id,
      },
      select: {
        solvedAt: true,
      },
    });

    
    const activeDaysSet = new Set(
      solvedProblems.map((problem) => 
        problem.solvedAt.toISOString().split('T')[0]
      )
    );

  
    const activeDaysCount = activeDaysSet.size;

  

    return NextResponse.json({
      activeDays: activeDaysCount,
     
      activeDates: Array.from(activeDaysSet).sort(),
    });

  } catch (error) {
    console.error("[ACTIVE_DAYS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}