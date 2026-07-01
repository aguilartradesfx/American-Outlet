"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

type Rol = "tienda" | "admin" | "superadmin";

const restoBase = [
  { href: "/panel/historias", label: "Guía Historias", icon: "tech" },
  { href: "/panel/estudio", label: "Estudio IA", icon: "image" },
  { href: "/panel/leads", label: "Leads Web", icon: "chat" },
];

const adminItems = [
  { href: "/panel/usuarios", label: "Usuarios", icon: "baby", roles: ["admin", "superadmin"] },
  { href: "/panel/tiendas", label: "Tiendas", icon: "store", roles: ["admin", "superadmin"] },
];

const superadminItems = [
  { href: "/panel/planificacion", label: "Planificación", icon: "sparkle", roles: ["superadmin"] },
  { href: "/panel/promos", label: "Promo", icon: "tag", roles: ["superadmin"] },
];

export function PanelNav({
  rol,
  tiendaSlug,
  onNavigate,
}: {
  rol: Rol;
  tiendaSlug?: string | null;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const esTiendaOperativa =
    rol === "tienda" && !!tiendaSlug && tiendaSlug !== "ciudad-quesada";

  const calendarioItem = esTiendaOperativa
    ? { href: "/panel/calendario-operativo", label: "Calendario", icon: "calendar" }
    : { href: "/panel/calendario", label: "Calendario", icon: "calendar" };

  const entregasItem =
    rol === "superadmin"
      ? { href: "/panel/entregas", label: "Entregas", icon: "broadcast" }
      : rol === "tienda"
        ? { href: "/panel/entregas", label: "Materiales", icon: "broadcast" }
        : null;

  const items = [
    calendarioItem,
    ...(esTiendaOperativa
      ? []
      : [{ href: "/panel/fases", label: "Fases", icon: "chart" }]),
    ...restoBase,
    ...(entregasItem ? [entregasItem] : []),
    ...(rol === "superadmin"
      ? [{ href: "/panel/calendario-operativo", label: "Calendarios tienda", icon: "store" }]
      : []),
    ...superadminItems.filter((i) => i.roles.includes(rol)),
    ...adminItems.filter((i) => i.roles.includes(rol)),
  ];

  return (
    <nav className="flex flex-col gap-1">
      {items.map((v) => {
        const active = pathname === v.href || pathname.startsWith(v.href + "/");
        return (
          <Link
            key={v.href}
            href={v.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-[1.05rem] px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
              active
                ? "bg-[var(--color-azul-900)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_22px_-10px_rgba(16,29,39,0.85)]"
                : "text-[var(--color-tinta-suave)] hover:bg-white/70 hover:text-[var(--color-tinta)]"
            }`}
          >
            <Icon
              name={v.icon}
              className={`h-[18px] w-[18px] ${active ? "text-white" : "text-[var(--color-tinta-tenue)]"}`}
            />
            {v.label}
          </Link>
        );
      })}
    </nav>
  );
}
