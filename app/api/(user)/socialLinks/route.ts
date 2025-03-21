/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/user/social-links/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to validate URL and domain
function validateLink(url: string | null | undefined, domain: string): boolean {
  if (!url) return true; // Allow null/undefined values
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes(domain);
  } catch {
    return false;
  }
}

// Helper function to validate request data
function validateRequestData(data: any) {
  if (!data.userId || typeof data.userId !== 'string') {
    return { isValid: false, error: 'Invalid userId' };
  }

  // Only validate links that are provided in the request
  if ('githubLink' in data) {
    if (data.githubLink && !validateLink(data.githubLink, 'github.com')) {
      return { isValid: false, error: 'Invalid GitHub URL. URL must be from github.com' };
    }
  }

  if ('linkedinLink' in data) {
    if (data.linkedinLink && !validateLink(data.linkedinLink, 'linkedin.com')) {
      return { isValid: false, error: 'Invalid LinkedIn URL. URL must be from linkedin.com' };
    }
  }

  if ('leetcodeLink' in data) {
    if (data.leetcodeLink && !validateLink(data.leetcodeLink, 'leetcode.com')) {
      return { isValid: false, error: 'Invalid LeetCode URL. URL must be from leetcode.com' };
    }
  }

  return { isValid: true };
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request data
    const validation = validateRequestData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    // Create update object only with provided links
    const updateData: any = {};
    if ('githubLink' in body) updateData.githubLink = body.githubLink;
    if ('linkedinLink' in body) updateData.linkedinLink = body.linkedinLink;
    if ('leetcodeLink' in body) updateData.leetcodeLink = body.leetcodeLink;
    
    // Update user's social links
    const updatedUser = await prisma.user.update({
      where: {
        clerkId: body.userId,
      },
      data: updateData,
      select: {
        githubLink: true,
        linkedinLink: true,
        leetcodeLink: true,
      },
    });

    return NextResponse.json({...updatedUser, success: true,  message: "Social links updated successfully" }, { status: 200});

  } catch (error) {
    console.error('Error updating social links:', error);
    return NextResponse.json(
      { error: "Failed to update social links" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate userId
    if (!body.userId || typeof body.userId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid userId' },
        { status: 400 }
      );
    }
    
    // Check which links to remove
    const updateData: any = {};
    
    if (body.removeGithub) {
      updateData.githubLink = null;
    }
    
    if (body.removeLinkedin) {
      updateData.linkedinLink = null;
    }
    
    if (body.removeLeetcode) {
      updateData.leetcodeLink = null;
    }
    
    // If no links specified to remove
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No links specified to remove" },
        { status: 400 }
      );
    }
    
    // Update user record by removing specified links
    const updatedUser = await prisma.user.update({
      where: {
        clerkId: body.userId,
      },
      data: updateData,
      select: {
        githubLink: true,
        linkedinLink: true,
        leetcodeLink: true,
      },
    });

    return NextResponse.json(
      { 
        ...updatedUser, 
        success: true, 
        message: "Social links removed successfully" 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('Error removing social links:', error);
    return NextResponse.json(
      { error: "Failed to remove social links" },
      { status: 500 }
    );
  }
}