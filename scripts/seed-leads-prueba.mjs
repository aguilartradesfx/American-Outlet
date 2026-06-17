/**
 * Inserta leads MOCK en la tabla `leads` para poblar /panel/leads y verificar la vista.
 * Imita el formato real del banner: cupón PAPA-XXXXX, WhatsApp +506, mezcla de
 * sincronizados/no sincronizados con GHL y fechas escalonadas en los últimos días.
 *
 * Para distinguirlos de leads reales usan origen = "mock-prueba", así se borran fácil:
 *   delete from leads where origen = 'mock-prueba';
 *
 * Uso:  npm run seed-leads-prueba
 *
 * ⚠️ Datos de prueba. Borralos cuando termines de verificar la vista.
 */
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("✗ Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const ORIGEN = "mock-prueba";

function generarCupon() {
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(5);
  let code = "";
  for (let i = 0; i < 5; i++) code += abc[bytes[i] % abc.length];
  return `PAPA-${code}`;
}

// nombre, correo, whatsapp (8 dígitos CR), sincronizado con GHL, hace cuántas horas
const base = [
  ["María José Fernández", "mariajose.fdez@gmail.com", "83014522", true, 2],
  ["Carlos Quesada Rojas", "carlos.quesada88@hotmail.com", "70125896", true, 6],
  ["Ana Lucía Mora", "analu.mora@gmail.com", "86459021", false, 9],
  ["José Pablo Villalobos", "jp.villalobos@outlook.com", "84772310", true, 20],
  ["Daniela Soto Campos", "dani.soto@gmail.com", "61287745", true, 27],
  ["Andrés Jiménez Vargas", "andres.jimenez@gmail.com", "89903417", false, 33],
  ["Karla Vanessa Ureña", "karla.urena@gmail.com", "83356180", true, 45],
  ["Luis Diego Hernández", "luisd.hernandez@yahoo.com", "70559924", true, 52],
  ["Gabriela Arias Solano", "gaby.arias@gmail.com", "84410072", false, 68],
  ["Roberto Castro Méndez", "roberto.castro@gmail.com", "62018853", true, 74],
  ["Natalia Brenes Picado", "nati.brenes@gmail.com", "83627749", true, 96],
  ["Esteban Rodríguez León", "esteban.rl@gmail.com", "70046612", false, 120],
];

const HORA = 60 * 60 * 1000;
const ahora = Date.now();

const filas = base.map(([nombre, correo, tel, sync, hace]) => ({
  nombre,
  correo,
  whatsapp: "+506" + tel,
  cupon: generarCupon(),
  origen: ORIGEN,
  ghl_contact_id: sync ? "mock_" + crypto.randomBytes(6).toString("hex") : null,
  ghl_sincronizado: sync,
  creado_en: new Date(ahora - hace * HORA).toISOString(),
}));

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await admin.from("leads").insert(filas).select("id");

if (error) {
  console.error("✗ Error insertando leads mock:", error.message);
  process.exit(1);
}

console.log(`✓ ${data.length} leads mock insertados (origen="${ORIGEN}").`);
console.log("  Verás los nuevos registros en /panel/leads.");
console.log(`  Para borrarlos:  delete from leads where origen = '${ORIGEN}';`);
