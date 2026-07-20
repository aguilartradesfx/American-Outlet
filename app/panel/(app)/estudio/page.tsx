import type { Metadata } from "next";
import { getUsuarioYRol } from "@/lib/auth/guards";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { EstudioTabs } from "./EstudioTabs";
import type { Historial } from "./EstudioHistorial";

export const metadata: Metadata = { title: "Estudio IA" };

// Accesible para todas las tiendas. El historial y los gastos solo los ve el superadmin.
export default async function EstudioPage() {
  const { rol } = await getUsuarioYRol();
  const esSuperadmin = rol === "superadmin";

  let historial: Historial | null = null;
  if (esSuperadmin) {
    const admin = createServiceRoleClient();
    const { data } = await admin
      .from("estudio_generaciones")
      .select(
        "id, creado_por_nombre, formato, proveedor, calidad, costo_usd, cloudinary_url, titular, creado_en",
      )
      .order("creado_en", { ascending: false })
      .limit(400);
    const rows = data ?? [];

    const mesActual = new Date().toISOString().slice(0, 7); // YYYY-MM
    const delMes = rows.filter((r) => (r.creado_en ?? "").slice(0, 7) === mesActual);
    const gastoMes = delMes.reduce((s, r) => s + (r.costo_usd ?? 0), 0);

    const porUsuarioMap = new Map<string, { total: number; count: number }>();
    for (const r of delMes) {
      const n = r.creado_por_nombre || "—";
      const e = porUsuarioMap.get(n) ?? { total: 0, count: 0 };
      e.total += r.costo_usd ?? 0;
      e.count += 1;
      porUsuarioMap.set(n, e);
    }
    const porUsuario = [...porUsuarioMap.entries()]
      .map(([nombre, v]) => ({ nombre, ...v }))
      .sort((a, b) => b.total - a.total);

    const mesesMap = new Map<string, { total: number; count: number }>();
    for (const r of rows) {
      const m = (r.creado_en ?? "").slice(0, 7);
      const e = mesesMap.get(m) ?? { total: 0, count: 0 };
      e.total += r.costo_usd ?? 0;
      e.count += 1;
      mesesMap.set(m, e);
    }
    const meses = [...mesesMap.entries()]
      .map(([mes, v]) => ({ mes, ...v }))
      .sort((a, b) => b.mes.localeCompare(a.mes))
      .slice(0, 6);

    historial = {
      mesActual,
      gastoMes,
      totalGeneraciones: rows.length,
      countMes: delMes.length,
      porUsuario,
      meses,
      items: rows.slice(0, 60).map((r) => ({
        id: r.id,
        nombre: r.creado_por_nombre,
        formato: r.formato,
        proveedor: r.proveedor,
        calidad: r.calidad,
        costo: r.costo_usd ?? 0,
        url: r.cloudinary_url,
        titular: r.titular,
        fecha: r.creado_en,
      })),
    };
  }

  return <EstudioTabs esSuperadmin={esSuperadmin} historial={historial} />;
}
