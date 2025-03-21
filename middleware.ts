import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/BS/search",
    "/terms&cons",
    "/privacy"

]);

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    const currentUrl = new URL(req.url);
    const isAccessingDashboard = currentUrl.pathname === "/home";
    const isAccessingBS = currentUrl.pathname === "/BS/search";
    const isAccessingTerms = currentUrl.pathname === "/terms&cons";
    const isAccessingPrivacy = currentUrl.pathname === "/privacy";

    if (userId && isPublicRoute(req) && !isAccessingDashboard && !isAccessingBS && !isAccessingTerms && !isAccessingPrivacy) {
        return NextResponse.redirect(new URL("/home", req.url));
    }

    if (!userId && !isPublicRoute(req)) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'
    ],
};
