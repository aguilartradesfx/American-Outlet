/**
 * Migración: Proyecto A (asignación de piezas + responsabilidad) y
 * Proyecto B2 (entregas de imágenes para tiendas).
 *
 *  A) perfiles.responsabilidad        → 'estaticos' | 'dinamicos' | null
 *     piezas.asignado_a_id/_nombre     → quién ejecuta la pieza
 *     Siembra responsabilidad          → Josué (estaticos) / Mauro (dinamicos)
 *     Backfill de asignación por tipo  → piezas existentes
 *  B2) entregas + entrega_destinos     → reparto de imágenes con borrado a 3 días
 *
 * Uso:  node --env-file=.env.local scripts/migracion-asignacion-y-entregas.mjs
 * Idempotente: se puede correr varias veces sin romper nada.
 */
const REF = "jwdqifswocuaudqtlbyu";
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

if (!accessToken) {
  console.error("✗ Falta SUPABASE_ACCESS_TOKEN en .env.local");
  process.exit(1);
}

async function sql(query) {
  const r = await fetch(
    `https://api.supabase.com/v1/projects/${REF}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    },
  );
  const text = await r.text();
  if (!r.ok) throw new Error(`SQL ${r.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}

// ---------------------------------------------------------------------------
// A) Asignación de piezas + responsabilidad
// ---------------------------------------------------------------------------
await sql(`
  alter table public.perfiles
    add column if not exists responsabilidad text
      check (responsabilidad in ('estaticos','dinamicos'));

  alter table public.piezas
    add column if not exists asignado_a_id     uuid references public.perfiles(id) on delete set null,
    add column if not exists asignado_a_nombre text;
`);
console.log("✓ A · DDL aplicada (perfiles.responsabilidad, piezas.asignado_*).");

// Sembrar responsabilidad por email (Josué = estáticos, Mauro = dinámicos).
const responsabilidadPorEmail = {
  "josuea421@gmail.com": "estaticos",
  "mauro156@live.com": "dinamicos",
};
for (const [email, resp] of Object.entries(responsabilidadPorEmail)) {
  await sql(`
    update public.perfiles p
       set responsabilidad = '${resp}'
      from auth.users u
     where u.id = p.id and lower(u.email) = lower('${email}');
  `);
  console.log(`✓ A · ${email} → responsabilidad "${resp}".`);
}

// Backfill: asignar piezas existentes por tipo, solo si aún no tienen asignado.
await sql(`
  update public.piezas p
     set asignado_a_id     = (select id     from public.perfiles where responsabilidad = 'estaticos' limit 1),
         asignado_a_nombre = (select nombre from public.perfiles where responsabilidad = 'estaticos' limit 1)
   where p.tipo in ('post','flyer','carrusel')
     and p.asignado_a_id is null
     and exists (select 1 from public.perfiles where responsabilidad = 'estaticos');

  update public.piezas p
     set asignado_a_id     = (select id     from public.perfiles where responsabilidad = 'dinamicos' limit 1),
         asignado_a_nombre = (select nombre from public.perfiles where responsabilidad = 'dinamicos' limit 1)
   where p.tipo in ('historia','reel','live','cinema')
     and p.asignado_a_id is null
     and exists (select 1 from public.perfiles where responsabilidad = 'dinamicos');
`);
console.log("✓ A · Backfill de asignación por tipo aplicado.");

// ---------------------------------------------------------------------------
// B2) Entregas de imágenes
// ---------------------------------------------------------------------------
await sql(`
  create table if not exists public.entregas (
    id                     uuid primary key default gen_random_uuid(),
    nota                   text,
    cloudinary_url         text not null,
    cloudinary_public_id   text not null,
    ancho                  integer,
    alto                   integer,
    bytes                  integer,
    creada_por_id          uuid references public.perfiles(id) on delete set null,
    creada_en              timestamptz not null default now(),
    expira_sin_descarga_en timestamptz not null,
    eliminada_en           timestamptz
  );

  create table if not exists public.entrega_destinos (
    id            uuid primary key default gen_random_uuid(),
    entrega_id    uuid not null references public.entregas(id) on delete cascade,
    tienda_id     uuid not null references public.tiendas(id) on delete cascade,
    descargada_en timestamptz,
    eliminar_en   timestamptz,
    eliminada_en  timestamptz,
    creada_en     timestamptz not null default now(),
    unique (entrega_id, tienda_id)
  );

  create index if not exists entrega_destinos_tienda_idx  on public.entrega_destinos (tienda_id);
  create index if not exists entrega_destinos_entrega_idx on public.entrega_destinos (entrega_id);

  alter table public.entregas         enable row level security;
  alter table public.entrega_destinos enable row level security;
`);
console.log("✓ B2 · Tablas entregas + entrega_destinos creadas.");

// RLS: superadmin todo; la tienda solo ve lo dirigido a ella (no eliminado).
// Las escrituras reales pasan por service-role (bypassa RLS), así que solo
// definimos SELECT para tienda + control total para superadmin.
await sql(`
  drop policy if exists entregas_superadmin       on public.entregas;
  drop policy if exists entregas_tienda_select     on public.entregas;
  drop policy if exists destinos_superadmin        on public.entrega_destinos;
  drop policy if exists destinos_tienda_select      on public.entrega_destinos;

  create policy entregas_superadmin on public.entregas
    for all using (public.es_superadmin()) with check (public.es_superadmin());

  create policy entregas_tienda_select on public.entregas
    for select using (
      exists (
        select 1
          from public.entrega_destinos d
          join public.perfiles pf on pf.id = auth.uid()
         where d.entrega_id = entregas.id
           and d.tienda_id  = pf.tienda_id
           and d.eliminada_en is null
      )
    );

  create policy destinos_superadmin on public.entrega_destinos
    for all using (public.es_superadmin()) with check (public.es_superadmin());

  create policy destinos_tienda_select on public.entrega_destinos
    for select using (
      tienda_id = (select tienda_id from public.perfiles where id = auth.uid())
    );
`);
console.log("✓ B2 · RLS configurada (superadmin total, tienda solo lo suyo).");

console.log("\n✅ Migración A + B2 completa.");
