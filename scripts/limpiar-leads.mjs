/**
 * Exporta los leads reales a CSV y limpia la tabla `leads` para arrancar de cero.
 *
 * Uso:
 *   node --env-file=.env.local scripts/limpiar-leads.mjs           → exporta + reporta (NO borra)
 *   node --env-file=.env.local scripts/limpiar-leads.mjs --borrar  → exporta + BORRA todos los leads
 *
 * "Reales" = todo lo que NO sea origen 'mock-prueba'. Se guardan en un CSV con
 * timestamp antes de cualquier borrado, así no se pierde ningún contacto.
 */
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("✗ Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const borrar = process.argv.includes("--borrar");
const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

const { data, error } = await admin.from("leads").select("*");
if (error) {
  console.error("✗ Error leyendo leads:", error.message);
  process.exit(1);
}

const reales = data.filter((l) => (l.origen || "") !== "mock-prueba");
console.log(`Total leads: ${data.length}  |  mock-prueba: ${data.length - reales.length}  |  reales: ${reales.length}`);

// Exportar los reales a CSV (siempre, antes de borrar).
if (reales.length > 0) {
  const cols = Object.keys(reales[0]);
  const esc = (v) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [cols.join(","), ...reales.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  const ruta = fileURLToPath(new URL("../leads-reales-export.csv", import.meta.url));
  writeFileSync(ruta, csv, "utf8");
  console.log(`\n✓ ${reales.length} leads reales exportados a: leads-reales-export.csv`);

  // Resumen legible de los reales.
  console.log("\n--- Leads reales ---");
  for (const r of reales) {
    const nombre = r.nombre ?? r.name ?? "(sin nombre)";
    const wa = r.whatsapp ?? r.telefono ?? r.phone ?? "";
    const cupon = r.cupon ?? r.coupon ?? "";
    console.log(`  • [${r.origen}] ${nombre}  ${wa}  ${cupon}`);
  }
}

if (!borrar) {
  console.log("\n(Modo export/reporte. Para borrar TODOS: agregá --borrar)");
  process.exit(0);
}

const { error: errDel } = await admin.from("leads").delete().not("id", "is", null);
if (errDel) {
  console.error("✗ Error borrando:", errDel.message);
  process.exit(1);
}
console.log(`\n✓ ${data.length} leads borrados. Tabla lista para recolección real.`);
