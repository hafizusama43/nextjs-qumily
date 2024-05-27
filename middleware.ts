import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// Define routes that should be protected
const isProtectedRoute = createRouteMatcher([
    new RegExp('^/organizations(/.*)?$'),
    new RegExp('^/organization(/.*)?$'),
    new RegExp('^/user-profile(/.*)?$')
]);
// Update clerkMiddleware to manually protect routes
export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req) && !auth().userId) {
        auth().protect(); // Protect the route if it matches the defined criteria
        // return NextResponse.redirect(new URL("/sign-in",req.url));
    }
});
export const config = {
    matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
