// import { updateSession } from "@/lib/supabase/middleware"
// import type { NextRequest } from "next/server"

// export async function middleware(request: NextRequest) {
//   return await updateSession(request)
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
//      * Feel free to modify this pattern to include more paths.
//      */
//     "/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// }

// Middleware disabled to allow anonymous access to all tools
export function middleware() {
  // No authentication required - all users can access all pages
  return
}

export const config = {
  matcher: [],
}
