import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
    '/',
    '/product/(.*)',
    '/category/(.*)',
    '/blog(.*)',
    '/search',
    '/about-us',
    '/contact-us',
    '/privacy-policy',
    '/refund-policy',
    '/shipping-info',
    '/terms-conditions',
    '/track-order',
    '/api/shipping/(.*)',
    '/api/fulfillment/(.*)',
    '/api/cart/(.*)',
]);

export async function middleware(request: NextRequest) {
    return clerkMiddleware(async (auth, req) => {
        if (!isPublicRoute(req)) {
            // Protected routes (like /admin) would go here
            await auth.protect();
        }
    })(request);
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};

