import type { Metadata } from "next";

import { EstudioClient } from "./EstudioClient";

export const metadata: Metadata = { title: "Estudio IA" };

// Accesible para todas las tiendas: el layout del panel ya exige sesión.
export default async function EstudioPage() {
  return <EstudioClient />;
}
