/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        const { clerkId, firstName, lastName, email } = body;

       
        if (!clerkId) {
            return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });
        }
        if (!firstName) {
            return NextResponse.json({ error: "Missing firstName" }, { status: 400 });
        }
        if (!email) {
            return NextResponse.json({ error: "Missing email" }, { status: 400 });
        }

       
        const user = await prisma.user.create({
            data: {
                id: crypto.randomUUID(),
                clerkId,
                firstName,
                lastName: lastName || null,
                email,
                image: null, 
            },
        });

        return NextResponse.json({ success: true, user }, { status: 201 });
        
    } catch (error: any) {
        // More detailed error handling
        const errorMessage = error?.message || "Unknown error occurred";
        console.error("Error storing user:", errorMessage);
        
        // Check for specific Prisma errors
        if (error?.code === 'P2002') {
            return NextResponse.json({ 
                error: "User already exists with this clerk ID or email" 
            }, { status: 409 });
        }

        return NextResponse.json({ 
            error: "Internal Server Error",
            details: errorMessage 
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}