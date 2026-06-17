import { redirect } from "next/navigation";

// /panel → entrada por defecto del área interna.
// El middleware ya gestiona el caso sin sesión (redirige a /panel/login).
export default function PanelIndex() {
  redirect("/panel/calendario");
}
