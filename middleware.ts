import { auth } from "@/auth"

export default auth((req, ctx) => {
  const isAuth = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');
  const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');

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

  // Protect dashboard routes
  if (isDashboardRoute && !isAuth) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }

  // Allow public routes
  if (!isDashboardRoute && !isAuth) {
    return null;
  }

  return null;
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)'
  ]
}