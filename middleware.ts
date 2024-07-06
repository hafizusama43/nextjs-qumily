import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from 'next/server';
// Define routes that should be protected
// const isProtectedRoute = createRouteMatcher([
//     new RegExp('^/organizations(/.*)?$'),
//     new RegExp('^/organization(/.*)?$'),
//     new RegExp('^/user-profile(/.*)?$'),
//     new RegExp('^/templates(/.*)?$')
// ]);

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
    matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
