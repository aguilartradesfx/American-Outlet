import type { Metadata } from "next";
import { getRolActual, getTiendaActual, getTiendas } from "@/lib/panel/datos";
import { getEntregasAdmin, getMaterialesDeTienda } from "@/lib/panel/entregas";
import { EntregaUploader } from "@/components/panel/EntregaUploader";
import { EntregasAdminList } from "@/components/panel/EntregasAdminList";
import { MaterialesTienda } from "@/components/panel/MaterialesTienda";

export const metadata: Metadata = { title: "Entregas" };

export default async function EntregasPage() {
  const [rol, tienda] = await Promise.all([getRolActual(), getTiendaActual()]);

  // Superadmin: subir y administrar entregas.
  if (rol === "superadmin") {
    const [tiendas, entregas] = await Promise.all([
      getTiendas(),
      getEntregasAdmin(),
    ]);
    return (
      <div className="space-y-7">
        <EntregaUploader
          tiendas={tiendas.map((t) => ({ slug: t.slug, nombre: t.nombre }))}
        />
        <div>
          <h2 className="mb-3 text-lg font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
            Repartidas
          </h2>
          <EntregasAdminList entregas={entregas} />
        </div>
      </div>
    );
  }

  // Tienda: descargar sus materiales.
  if (tienda) {
    const materiales = await getMaterialesDeTienda(tienda.tiendaId);
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--color-tinta)] sm:text-3xl">
            Materiales para descargar
          </h1>
          <p className="mt-1 text-sm text-[var(--color-tinta-suave)]">
            Imágenes listas para que las subas a tu estado/historia de WhatsApp.
          </p>
        </div>
        <MaterialesTienda materiales={materiales} />
      </div>
    );
  }

  return (
    <div className="card-3d p-8 text-center">
      <p className="text-sm text-[var(--color-tinta-suave)]">
        Esta sección es para subir y descargar materiales por tienda.
      </p>
    </div>
  );
}
