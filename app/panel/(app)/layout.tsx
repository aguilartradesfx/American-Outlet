import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelShell } from "./PanelShell";

export const metadata: Metadata = {
  title: { default: "Panel interno", template: "%s · Panel American Outlet" },
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/panel/login");
  }

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("tienda, rol, tiendas(slug)")
    .eq("id", user.id)
    .maybeSingle();

  const tienda = perfil?.tienda ?? "American Outlet";
  const rol = (perfil?.rol ?? "tienda") as "tienda" | "admin" | "superadmin";
  const tiendaSlug =
    (perfil as { tiendas?: { slug: string } | null } | null)?.tiendas?.slug ??
    null;
  const esAdmin = rol === "admin" || rol === "superadmin";
  const rolLabel =
    rol === "superadmin" ? "Superadmin" : rol === "admin" ? "Admin" : "Tienda";

  return (
    <PanelShell
      rol={rol}
      tiendaSlug={tiendaSlug}
      tienda={tienda}
      rolLabel={rolLabel}
      esAdmin={esAdmin}
    >
      {children}
    </PanelShell>
  );
}
