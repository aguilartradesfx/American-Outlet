import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUsuarioYRol } from "@/lib/auth/guards";
import { getPromos } from "@/lib/panel/promos";
import { PromosClient } from "./PromosClient";

export const metadata: Metadata = { title: "Promo mensual" };

export default async function PromosPage() {
  const { rol } = await getUsuarioYRol();
  if (rol !== "superadmin") redirect("/panel/calendario");

  const promos = await getPromos();

  return (
    <PromosClient
      promos={promos.map((p) => ({
        id: p.id,
        anio: p.anio,
        mes: p.mes,
        titulo: p.titulo,
        enlace: p.enlace,
        imagen_url: p.imagen_url,
        activa: p.activa,
      }))}
    />
  );
}
