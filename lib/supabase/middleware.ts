import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresca la sesión en cada request y protege el área interna (/panel).
 *
 * Defensa en profundidad: el middleware da la redirección de UX, pero la
 * verdadera puerta de acceso se valida también server-side en el layout del
 * panel con supabase.auth.getUser(). Nunca se confía solo en el middleware.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANTE: getUser() revalida el token contra Supabase (no confía en la cookie).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const esPanel = pathname.startsWith("/panel");
  const esLogin = pathname === "/panel/login";

  // Sin sesión y entrando al panel (que no sea el login) → al login.
  if (esPanel && !esLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/panel/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Con sesión activa y yendo al login → directo al panel.
  if (esLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/panel/calendario";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Aislamiento de calendarios por tienda: el calendario de fases/descuentos
  // (/panel/calendario y /panel/fases) es el de Ciudad Quesada. Un usuario de
  // tienda que NO es Ciudad Quesada (Fortuna/Florencia) no puede verlo — se le
  // manda a su calendario operativo. Admin/superadmin pasan sin restricción.
  // Nota: "/panel/calendario-operativo" no matchea estos patrones (lleva guion,
  // no slash), así que no se redirige a sí mismo.
  if (user && esPanel) {
    const esCalendarioCQ =
      pathname === "/panel/calendario" ||
      pathname.startsWith("/panel/calendario/");
    const esFases =
      pathname === "/panel/fases" || pathname.startsWith("/panel/fases/");

    if (esCalendarioCQ || esFases) {
      const { data: perfil } = await supabase
        .from("perfiles")
        .select("rol, tiendas(slug)")
        .eq("id", user.id)
        .maybeSingle();

      const rol = (perfil?.rol as string | undefined) ?? "tienda";
      const slug =
        (perfil as { tiendas?: { slug: string } | null } | null)?.tiendas
          ?.slug ?? null;

      if (rol === "tienda" && slug !== "ciudad-quesada") {
        const url = request.nextUrl.clone();
        url.pathname = "/panel/calendario-operativo";
        url.search = "";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
