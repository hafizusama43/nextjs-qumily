import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from 'next/server';

// Or only protect these routes
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/privacy-policy', '/terms-conditions']);

// Update clerkMiddleware to manually protect routes
export default clerkMiddleware((auth, req: NextRequest) => {
    if (req.url.includes('api') && !auth().userId) {
        return NextResponse.json({ message: "Unauthenticated" }, { status: 401 })
    }
    if (!isPublicRoute(req) && !req.url.includes('api')) {
        auth().protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
