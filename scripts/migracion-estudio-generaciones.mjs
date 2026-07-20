/**
 * Migración: historial + gastos del Estudio IA.
 * Tabla estudio_generaciones — una fila por cada generación (quién, costo, imagen).
 * RLS deny-all → solo service-role (el panel lo lee en server, gateado a superadmin).
 *
 * Idempotente. Uso: node --env-file=.env.local scripts/migracion-estudio-generaciones.mjs
 */
import pg from "pg";

const c = new pg.Client({
  host: "aws-1-us-west-2.pooler.supabase.com",
  port: 5432,
  user: "postgres.jwdqifswocuaudqtlbyu",
  password: process.env.SUPABASE_DB_PASSWORD,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});
await c.connect();

await c.query(`
  create table if not exists public.estudio_generaciones (
    id uuid primary key default gen_random_uuid(),
    creado_por_id uuid references auth.users(id) on delete set null,
    creado_por_nombre text,
    proveedor text,
    modelo text,
    calidad text,
    formato text,
    tokens_in int,
    tokens_out int,
    costo_usd double precision not null default 0,
    cloudinary_url text,
    cloudinary_public_id text,
    titular text,
    creado_en timestamptz not null default now()
  )
`);
await c.query(
  `create index if not exists idx_estudio_gen_fecha on public.estudio_generaciones(creado_en desc)`,
);
await c.query(`alter table public.estudio_generaciones enable row level security`);
// Sin policies → deny-all; el server usa service-role (bypassa RLS) y gatea por rol.

const rls = await c.query(
  `select relrowsecurity rls, (select count(*) from pg_policies p where p.tablename='estudio_generaciones') policies
   from pg_class where relname='estudio_generaciones'`,
);
console.log("estudio_generaciones creada · rls:", rls.rows[0].rls, "· policies:", rls.rows[0].policies, "(deny-all ✓)");

await c.end();
console.log("✓ Migración lista.");
