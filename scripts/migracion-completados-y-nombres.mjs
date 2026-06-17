/**
 * Migración: "marcar como completado" por usuario + nombres de usuario.
 *
 *  1. perfiles.nombre            → nombre legible de cada usuario.
 *  2. piezas.completado_*        → quién/cuándo marcó la pieza como hecha.
 *  3. handle_new_user()          → copia 'nombre' del metadata al perfil.
 *  4. Siembra nombres            → Alejandro / Josué / Mauro (cuentas existentes).
 *  5. Crea a Christian           → superadmin (vindas2327@gmail.com).
 *
 * Uso:  node --env-file=.env.local scripts/migracion-completados-y-nombres.mjs
 * Idempotente: se puede correr varias veces sin romper nada.
 */
import { createClient } from "@supabase/supabase-js";

const REF = "jwdqifswocuaudqtlbyu";
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!accessToken || !url || !serviceKey) {
  console.error("✗ Falta SUPABASE_ACCESS_TOKEN, NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

/** Ejecuta SQL arbitrario vía Management API (corre como superusuario). */
async function sql(query) {
  const r = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`SQL ${r.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}

// 1-3. DDL ------------------------------------------------------------------
await sql(`
  alter table public.perfiles add column if not exists nombre text;

  alter table public.piezas
    add column if not exists completado_en        timestamptz,
    add column if not exists completado_por_id     uuid references auth.users(id) on delete set null,
    add column if not exists completado_por_nombre text;

  create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  set search_path to 'public'
  as $$
  declare
    v_tienda_id uuid;
    v_slug   text := nullif(new.raw_user_meta_data->>'tienda_slug', '');
    v_tienda text := coalesce(nullif(new.raw_user_meta_data->>'tienda',''), 'American Outlet');
    v_nombre text := nullif(new.raw_user_meta_data->>'nombre','');
  begin
    if v_slug is not null then
      select id into v_tienda_id from public.tiendas where slug = v_slug;
    end if;
    insert into public.perfiles (id, tienda, tienda_id, rol, nombre)
    values (
      new.id,
      v_tienda,
      v_tienda_id,
      coalesce(nullif(new.raw_user_meta_data->>'rol',''), 'tienda'),
      v_nombre
    )
    on conflict (id) do nothing;
    return new;
  end;
  $$;
`);
console.log("✓ DDL aplicada (perfiles.nombre, piezas.completado_*, trigger).");

// 4. Sembrar nombres en cuentas existentes (por email) ----------------------
const nombresPorEmail = {
  "aguilartradesfx@gmail.com": "Alejandro",
  "josuea421@gmail.com": "Josué",
  "mauro156@live.com": "Mauro",
};
for (const [email, nombre] of Object.entries(nombresPorEmail)) {
  await sql(`
    update public.perfiles p
       set nombre = '${nombre.replace(/'/g, "''")}'
      from auth.users u
     where u.id = p.id and lower(u.email) = lower('${email}');
  `);
  console.log(`✓ ${email} → nombre "${nombre}".`);
}

// 5. Crear / asegurar a Christian (superadmin) ------------------------------
const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const CHRISTIAN = {
  email: "vindas2327@gmail.com",
  // No hardcodear credenciales: se lee de env. Para la cuenta ya existente esto
  // es indiferente (createUser devuelve "already registered" y solo se asegura
  // rol/nombre más abajo).
  password: process.env.SEED_SUPERADMIN_PASSWORD || globalThis.crypto.randomUUID(),
  nombre: "Christian",
  rol: "superadmin",
  tienda: "Bralto · Administración",
};

const { data: created, error: createErr } = await admin.auth.admin.createUser({
  email: CHRISTIAN.email,
  password: CHRISTIAN.password,
  email_confirm: true,
  user_metadata: { rol: CHRISTIAN.rol, nombre: CHRISTIAN.nombre, tienda: CHRISTIAN.tienda, tienda_slug: null },
});

if (createErr && !/already.*registered|exists/i.test(createErr.message)) {
  throw new Error(`Christian: ${createErr.message}`);
}
if (created?.user) {
  console.log(`✓ Christian creado (${CHRISTIAN.email}).`);
} else {
  console.log(`= Christian ya existía (${CHRISTIAN.email}); aseguro rol y nombre.`);
}

// Asegurar rol superadmin + nombre aunque el perfil ya existiera.
await sql(`
  update public.perfiles p
     set rol = 'superadmin', nombre = 'Christian'
    from auth.users u
   where u.id = p.id and lower(u.email) = lower('${CHRISTIAN.email}');
`);
console.log("✓ Christian asegurado como superadmin con nombre.");

console.log("\n✅ Migración completa.");
