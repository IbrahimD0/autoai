import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createClient } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Clone the request headers and add pathname
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  // Protected routes
  const protectedPaths = ['/dashboard', '/account'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    const { supabase, response } = createClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Redirect to signin if user is not authenticated
      const redirectUrl = new URL('/signin', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Pass the modified headers to updateSession
  const response = await updateSession(request);
  
  // Apply the pathname header to the response
  response.headers.set('x-pathname', request.nextUrl.pathname);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
