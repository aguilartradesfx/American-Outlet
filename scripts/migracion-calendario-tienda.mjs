/**
 * Migración: scopea el calendario por tienda.
 *  1. meses.tienda_id (FK a tiendas) + backfill de los meses existentes → Ciudad Quesada.
 *  2. Unicidad (tienda_id, anio, mes) en vez de (anio, mes).
 *  3. Índice por tienda_id + NOT NULL.
 *  4. Siembra un mes vigente vacío (Julio 2026) para Florencia y Fortuna.
 *
 * Idempotente. Uso: node --env-file=.env.local scripts/migracion-calendario-tienda.mjs
 */
import pg from "pg";

const REF = "jwdqifswocuaudqtlbyu";
const CQ = "cf350688-7f21-411b-8b30-acdad2c023ac";
const OTRAS = [
  { slug: "florencia", id: "8a71fcde-d52d-4256-9588-361d3cc5c420" },
  { slug: "fortuna", id: "236fe927-e4fd-49db-9749-79b2b8aa737b" },
];

const c = new pg.Client({
  host: "aws-1-us-west-2.pooler.supabase.com",
  port: 5432,
  user: "postgres." + REF,
  password: process.env.SUPABASE_DB_PASSWORD,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});
await c.connect();

// --- estado previo ---
const consAntes = await c.query(
  "select conname, pg_get_constraintdef(oid) def, contype from pg_constraint where conrelid='public.meses'::regclass",
);
console.log("Constraints de meses (antes):");
consAntes.rows.forEach((r) => console.log(`  [${r.contype}] ${r.conname}: ${r.def}`));

// 1) columna tienda_id
await c.query(
  "alter table public.meses add column if not exists tienda_id uuid references public.tiendas(id)",
);

// 2) backfill de los meses existentes → Ciudad Quesada
const bf = await c.query(
  "update public.meses set tienda_id=$1 where tienda_id is null",
  [CQ],
);
console.log(`\n✓ Backfill → CQ: ${bf.rowCount} meses`);

// 3) unicidad: quita la vieja (anio,mes), agrega (tienda_id,anio,mes)
for (const u of consAntes.rows.filter((r) => r.contype === "u")) {
  if (/\banio\b/.test(u.def) && /\bmes\b/.test(u.def) && !/tienda_id/.test(u.def)) {
    await c.query(`alter table public.meses drop constraint ${u.conname}`);
    console.log(`✓ Drop unique viejo: ${u.conname}`);
  }
}
await c
  .query(
    "alter table public.meses add constraint meses_tienda_anio_mes_uniq unique (tienda_id, anio, mes)",
  )
  .then(() => console.log("✓ Unique (tienda_id, anio, mes) creada"))
  .catch((e) => console.log(`• Unique ya existía (${e.code})`));

// 4) índice + NOT NULL
await c.query("create index if not exists idx_meses_tienda_id on public.meses(tienda_id)");
await c
  .query("alter table public.meses alter column tienda_id set not null")
  .then(() => console.log("✓ tienda_id NOT NULL"))
  .catch((e) => console.log(`• NOT NULL: ${e.code} ${e.message}`));

// 4b) slug: de único GLOBAL → único POR TIENDA (varias tiendas comparten '2026-07')
await c.query("drop index if exists public.idx_meses_slug");
await c
  .query(
    "create unique index if not exists idx_meses_tienda_slug on public.meses(tienda_id, slug)",
  )
  .then(() => console.log("✓ slug único por tienda (no global)"))
  .catch((e) => console.log(`• slug idx: ${e.code}`));

// 5) siembra mes vacío (Julio 2026) para Florencia y Fortuna
for (const t of OTRAS) {
  const m = await c.query(
    `insert into public.meses (tienda_id, anio, mes, titulo, marca, estado, publicado_en)
     values ($1, 2026, 7, 'Julio 2026', 'American Outlet', 'publicado', now())
     on conflict (tienda_id, anio, mes) do update set titulo = excluded.titulo
     returning id`,
    [t.id],
  );
  const mesId = m.rows[0].id;
  const d = await c.query(
    `insert into public.dias (mes_id, fecha, dia_semana)
     select $1, g, extract(dow from make_date(2026, 7, g))::int
     from generate_series(1, 31) g
     on conflict (mes_id, fecha) do nothing`,
    [mesId],
  );
  console.log(`✓ ${t.slug}: mes ${mesId} · +${d.rowCount} días`);
}

// --- verificación ---
const ver = await c.query(
  `select t.slug, count(distinct me.id) meses, count(di.id) dias
   from public.tiendas t
   left join public.meses me on me.tienda_id = t.id
   left join public.dias di on di.mes_id = me.id
   group by t.slug order by t.slug`,
);
console.log("\n=== Verificación (meses/días por tienda) ===");
ver.rows.forEach((r) => console.log(`  ${r.slug.padEnd(16)} meses=${r.meses}  dias=${r.dias}`));

await c.end();
console.log("\n✓ Migración completa.");
