/**
 * Migración Bloque 2: "Entregar contenido" por día.
 *  - entregas_dia: la entrega (imagen) pegada a un día. RLS deny-all → solo
 *    service-role (se lee/escribe desde el server con scoping en código).
 *  - entregas_dia_auditoria: audit log INTERNO, append-only, invisible en el
 *    panel (RLS deny-all total; ni admin ni superadmin lo ven). Solo service-role.
 *
 * Idempotente. Uso: node --env-file=.env.local scripts/migracion-entregas-dia.mjs
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

// 1) entregas_dia
await c.query(`
  create table if not exists public.entregas_dia (
    id uuid primary key default gen_random_uuid(),
    dia_id uuid not null references public.dias(id) on delete cascade,
    url text not null,
    cloudinary_public_id text not null,
    formato text,
    ancho int,
    alto int,
    bytes int,
    nota text,
    subido_por_id uuid references auth.users(id) on delete set null,
    subido_por_nombre text,
    creado_en timestamptz not null default now(),
    actualizado_en timestamptz not null default now()
  )
`);
await c.query(`create index if not exists idx_entregas_dia_dia on public.entregas_dia(dia_id)`);
await c.query(`alter table public.entregas_dia enable row level security`);
// Sin policies → deny-all para usuarios; el server usa service-role (bypassa RLS).

// 2) entregas_dia_auditoria (interno)
await c.query(`
  create table if not exists public.entregas_dia_auditoria (
    id uuid primary key default gen_random_uuid(),
    entrega_dia_id uuid,
    dia_id uuid,
    accion text not null,
    url text,
    cloudinary_public_id text,
    subido_por_id uuid,
    actor_id uuid,
    actor_nombre text,
    actor_rol text,
    creado_en timestamptz not null default now()
  )
`);
await c.query(`create index if not exists idx_entregas_audit_dia on public.entregas_dia_auditoria(dia_id)`);
await c.query(`create index if not exists idx_entregas_audit_actor on public.entregas_dia_auditoria(actor_id)`);
await c.query(`alter table public.entregas_dia_auditoria enable row level security`);
// Sin policies → invisible en el panel. Solo consultable por service-role.

// verificación
const t = await c.query(
  `select table_name from information_schema.tables
   where table_schema='public' and table_name in ('entregas_dia','entregas_dia_auditoria')
   order by table_name`,
);
const rls = await c.query(
  `select relname, relrowsecurity rls, (select count(*) from pg_policies p where p.tablename=cl.relname) policies
   from pg_class cl where relname in ('entregas_dia','entregas_dia_auditoria')`,
);
console.log("Tablas creadas:", t.rows.map((r) => r.table_name).join(", "));
console.log("RLS:");
rls.rows.forEach((r) =>
  console.log(`  ${r.relname.padEnd(24)} rls=${r.rls} policies=${r.policies} ${r.policies === "0" ? "(deny-all ✓)" : ""}`),
);

await c.end();
console.log("\n✓ Migración Bloque 2 completa.");
