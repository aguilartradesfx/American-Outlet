/**
 * Seed de las 3 cuentas de tienda del área interna (/panel).
 * ----------------------------------------------------------------------------
 * Crea (o deja como están) los usuarios de Supabase Auth para las 3 tiendas.
 * Las contraseñas NO están en el código: se leen de variables de entorno, una
 * por tienda. Si una variable falta, esa cuenta se salta.
 *
 * Uso (local, nunca en cliente):
 *   1. Llená en .env.local:
 *        SUPABASE_SERVICE_ROLE_KEY=...        (privada)
 *        SEED_PASSWORD_CIUDAD_QUESADA=...
 *        SEED_PASSWORD_FORTUNA=...
 *        SEED_PASSWORD_FLORENCIA=...
 *   2. Corré:
 *        npm run seed-tiendas
 *
 * El trigger `on_auth_user_created` materializa el perfil (tabla `perfiles`)
 * automáticamente a partir del metadata `tienda` que se manda acá.
 * ----------------------------------------------------------------------------
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "✗ Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local",
  );
  process.exit(1);
}

const tiendas = [
  {
    tienda: "American Outlet Ciudad Quesada",
    tienda_slug: "ciudad-quesada",
    email: "ciudadquesada@americanoutlet.cr",
    password: process.env.SEED_PASSWORD_CIUDAD_QUESADA,
  },
  {
    tienda: "American Outlet La Fortuna",
    tienda_slug: "fortuna",
    email: "fortuna@americanoutlet.cr",
    password: process.env.SEED_PASSWORD_FORTUNA,
  },
  {
    tienda: "American Outlet Florencia",
    tienda_slug: "florencia",
    email: "florencia@americanoutlet.cr",
    password: process.env.SEED_PASSWORD_FLORENCIA,
  },
];

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

for (const t of tiendas) {
  if (!t.password) {
    console.warn(`• ${t.tienda}: sin contraseña en env, se omite.`);
    continue;
  }

  const { error } = await admin.auth.admin.createUser({
    email: t.email,
    password: t.password,
    email_confirm: true,
    user_metadata: { tienda: t.tienda, tienda_slug: t.tienda_slug, rol: "tienda" },
  });

  if (error) {
    if (/already.*registered|exists/i.test(error.message)) {
      console.log(`= ${t.tienda}: ya existía (${t.email}).`);
    } else {
      console.error(`✗ ${t.tienda}: ${error.message}`);
    }
  } else {
    console.log(`✓ ${t.tienda}: creada (${t.email}).`);
  }
}

console.log("\nListo. Las contraseñas viven solo en tu .env.local local.");
