/**
 * Crea 3 usuarios de PRUEBA, uno por rol, para verificar el panel.
 * Idempotente: si ya existen, los deja como están.
 *
 * Uso:  npm run seed-usuarios-prueba
 *
 * ⚠️ Cuentas de prueba con contraseña conocida. Borralas desde /panel/usuarios
 *    cuando termines de verificar.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("✗ Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const PASSWORD = process.env.SEED_TEST_PASSWORD || "AOprueba2026!";

const usuarios = [
  {
    email: "tienda.prueba@americanoutlet.cr",
    rol: "tienda",
    tienda: "American Outlet La Fortuna",
    tienda_slug: "fortuna",
  },
  {
    email: "admin.prueba@americanoutlet.cr",
    rol: "admin",
    tienda: "Bralto · Administración",
    tienda_slug: null,
  },
  {
    email: "super.prueba@americanoutlet.cr",
    rol: "superadmin",
    tienda: "Bralto · Administración",
    tienda_slug: null,
  },
];

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

for (const u of usuarios) {
  const { error } = await admin.auth.admin.createUser({
    email: u.email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { rol: u.rol, tienda: u.tienda, tienda_slug: u.tienda_slug },
  });

  if (error) {
    if (/already.*registered|exists/i.test(error.message)) {
      console.log(`= ${u.rol.padEnd(10)} ya existía (${u.email}).`);
    } else {
      console.error(`✗ ${u.rol}: ${error.message}`);
    }
  } else {
    console.log(`✓ ${u.rol.padEnd(10)} creado (${u.email}).`);
  }
}

console.log(`\nContraseña de las 3 cuentas: ${PASSWORD}`);
console.log("Borralas desde /panel/usuarios cuando termines.");
