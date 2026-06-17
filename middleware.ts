import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Solo corre sobre el área interna. El sitio público no toca Supabase.
  matcher: ["/panel/:path*"],
};
