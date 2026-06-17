import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUsuarioYRol } from "@/lib/auth/guards";
import { getTiendas } from "@/lib/panel/datos";
import { TiendasClient } from "./TiendasClient";

export const metadata: Metadata = { title: "Tiendas" };

export default async function TiendasPage() {
  const { rol } = await getUsuarioYRol();
  if (rol !== "admin" && rol !== "superadmin") redirect("/panel/calendario");

  const tiendas = await getTiendas();

  return (
    <TiendasClient
      tiendas={tiendas.map((t) => ({
        id: t.id,
        slug: t.slug,
        nombre: t.nombre,
        activa: t.activa,
      }))}
    />
  );
}
