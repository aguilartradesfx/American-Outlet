import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUsuarioYRol } from "@/lib/auth/guards";
import { getTiendas } from "@/lib/panel/datos";
import { listarUsuarios } from "./actions";
import { UsuariosClient } from "./UsuariosClient";

export const metadata: Metadata = { title: "Usuarios" };

export default async function UsuariosPage() {
  const { rol } = await getUsuarioYRol();
  if (rol !== "admin" && rol !== "superadmin") redirect("/panel/calendario");

  const [res, tiendas] = await Promise.all([listarUsuarios(), getTiendas()]);
  const usuarios = res.ok ? res.data : [];

  return (
    <UsuariosClient
      rolActual={rol}
      usuarios={usuarios}
      tiendas={tiendas.map((t) => ({ slug: t.slug, nombre: t.nombre }))}
      errorCarga={res.ok ? null : res.error}
    />
  );
}
