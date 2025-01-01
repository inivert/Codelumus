import { auth } from "@/auth"

export default auth((req) => {
  const isAuth = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');
  const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');

  // Allow all auth-related routes
  if (isApiAuthRoute) {
    return null;
  }

  // Redirect from auth page if already authenticated
  if (isAuthPage) {
    if (isAuth) {
      return Response.redirect(new URL('/dashboard', req.nextUrl));
    }
    return null;
  }

  // Allow public routes
  if (!isAuth) {
    return null;
  }
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)'
  ]
}