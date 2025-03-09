/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, Badge } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

const BADGE_THRESHOLDS = {
  PLATINUM: 100,
  GOLD: 70,
  SILVER: 50,
  BRONZE: 30
};

const calculateBadge = (activeDays: number): Badge => {
  if (activeDays >= BADGE_THRESHOLDS.PLATINUM) return 'PLATINUM';
  if (activeDays >= BADGE_THRESHOLDS.GOLD) return 'GOLD';
  if (activeDays >= BADGE_THRESHOLDS.SILVER) return 'SILVER';
  if (activeDays >= BADGE_THRESHOLDS.BRONZE) return 'BRONZE';
  return 'NONE';
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Parsed Request Body:", body);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { userId, activeDays } = body;

    

    if (!userId || typeof userId !== "string" || typeof activeDays !== "number" || isNaN(activeDays)) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    console.log("Request Data:", { userId, activeDays });
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newBadge = calculateBadge(activeDays);

    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: { activeBadge: newBadge },
      select: {
        firstName: true,
        activeBadge: true,
      }
    });

    const response = {
      
      badge: updatedUser.activeBadge,
      name: updatedUser.firstName,
      thresholds: BADGE_THRESHOLDS,
      currentDays: activeDays,
      nextBadge: null as string | null,
      daysToNextBadge: null as number | null
    };

    if (newBadge !== 'PLATINUM') {
      const nextBadgeThresholds = {
        NONE: BADGE_THRESHOLDS.BRONZE,
        BRONZE: BADGE_THRESHOLDS.SILVER,
        SILVER: BADGE_THRESHOLDS.GOLD,
        GOLD: BADGE_THRESHOLDS.PLATINUM
      };

      const nextThreshold = nextBadgeThresholds[newBadge];
      response.nextBadge = Object.keys(BADGE_THRESHOLDS).find(
        key => BADGE_THRESHOLDS[key as keyof typeof BADGE_THRESHOLDS] === nextThreshold
      ) ?? null;
      response.daysToNextBadge = nextThreshold - activeDays;
    }

    return NextResponse.json(response);

  } catch (error: any) {
    console.error("Error assigning badge:", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
