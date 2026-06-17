"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ISOTIPO_VIEWBOX, isotipoPaths } from "@/components/ui/isotipoPaths";
import { Icon } from "@/components/ui/Icon";
import { trackEvent } from "@/lib/analytics/track";
import { registrarLeadRuleta } from "./actions";

/* ============================================================
   Ruleta de premios — Día del Padre (landing para ads)
   Estética del sitio: glassmorphism + paleta de marca (azul/rojo).
   8 segmentos visibles de 2% a 25%. SIEMPRE cae en 15%.
   (Para cambiarlo luego: editar WINNER_INDEX / SEGMENTS.)
   ============================================================ */

type Segmento = { label: string; color: string };

// Paleta de marca: azules de base, rojo de marca como acento = los 15%.
const SEGMENTS: Segmento[] = [
  { label: "5%", color: "#004a70" },
  { label: "15%", color: "#df0e0b" },
  { label: "2%", color: "#0a6695" },
  { label: "20%", color: "#004a70" },
  { label: "15%", color: "#df0e0b" },
  { label: "10%", color: "#0a6695" },
  { label: "25%", color: "#004a70" },
  { label: "15%", color: "#df0e0b" },
];

const WINNER_INDEX = 1; // siempre cae en este segmento (15%)
const PREMIO = "15%";
const SEG = 360 / SEGMENTS.length;

/** Punto en el borde del círculo: ángulo en grados, horario desde arriba. */
function pt(angleDeg: number, radius: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180;
  return [100 + radius * Math.sin(a), 100 - radius * Math.cos(a)];
}

function wedgePath(i: number): string {
  const start = i * SEG;
  const end = (i + 1) * SEG;
  const [x1, y1] = pt(start, 100);
  const [x2, y2] = pt(end, 100);
  return `M100,100 L${x1.toFixed(2)},${y1.toFixed(2)} A100,100 0 0 1 ${x2.toFixed(2)},${y2.toFixed(2)} Z`;
}

/* ----------------- Confeti (canvas, sin dependencias) ----------------- */
function lanzarConfeti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const c = ctx;
  const dpr = window.devicePixelRatio || 1;
  const W = (canvas.width = window.innerWidth * dpr);
  const H = (canvas.height = window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  const colores = ["#df0e0b", "#004a70", "#0a6695", "#ffffff"];
  const N = 150;
  type P = { x: number; y: number; vx: number; vy: number; rot: number; vr: number; size: number; color: string };
  const ps: P[] = Array.from({ length: N }, () => ({
    x: W / 2 + (Math.random() - 0.5) * 200 * dpr,
    y: H * 0.34,
    vx: (Math.random() - 0.5) * 14 * dpr,
    vy: (Math.random() * -16 - 6) * dpr,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    size: (Math.random() * 7 + 4) * dpr,
    color: colores[Math.floor(Math.random() * colores.length)],
  }));

  const g = 0.45 * dpr;
  let frame = 0;
  function tick() {
    frame++;
    c.clearRect(0, 0, W, H);
    for (const p of ps) {
      p.vy += g;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.rot += p.vr;
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rot);
      c.fillStyle = p.color;
      c.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      c.restore();
    }
    if (frame < 220) requestAnimationFrame(tick);
    else c.clearRect(0, 0, W, H);
  }
  tick();
}

const inputCls =
  "w-full rounded-2xl border border-[var(--color-borde)] bg-white/80 px-4 py-3 text-sm text-[var(--color-tinta)] outline-none transition focus:border-[var(--color-azul)] focus:bg-white";

export function RuletaLanding({ fondo }: { fondo: string | null }) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [rotacion, setRotacion] = useState(0);
  const [fase, setFase] = useState<"idle" | "girando" | "ganado">("idle");
  const [showForm, setShowForm] = useState(false);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function girar() {
    if (fase !== "idle") return;
    setFase("girando");
    const centro = WINNER_INDEX * SEG + SEG / 2;
    const jitter = (Math.random() - 0.5) * (SEG * 0.7);
    const vueltas = 6;
    const destino = 360 * vueltas - centro - jitter;
    setRotacion(destino);
  }

  function alTerminarGiro() {
    if (fase !== "girando") return;
    setFase("ganado");
    if (canvasRef.current) lanzarConfeti(canvasRef.current);
    window.setTimeout(() => setShowForm(true), 900);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const r = await registrarLeadRuleta({ nombre, correo, whatsapp });
      if (!r.ok) return setError(r.error);
      // Conversión solo en lead NUEVO. Empuje antes del router.push: dataLayer
      // es síncrono y la navegación de Next es soft (no recarga → GTM sigue vivo).
      if (!r.data.yaRegistrado) {
        trackEvent("generate_lead", {
          lead_type: "ruleta_papa",
          lead_origen: "ruleta-papa-ads",
          // Advanced matching de Meta (Adsmurai hashea server-side). No mapear a GA4.
          customer_email: correo,
          customer_phone: whatsapp,
          customer_name: nombre,
        });
      }
      const q = new URLSearchParams({
        code: r.data.cupon,
        nombre: r.data.nombre,
        desc: PREMIO,
      });
      router.push(`/papa/confirmacion?${q.toString()}`);
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-[var(--color-tinta)]">
      {/* Fondo: banner del mes difuminado + degradado de marca */}
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        {fondo ? (
          <Image
            src={fondo}
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-110 object-cover object-center blur-2xl"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--color-azul-900)]" />
        )}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(45rem 45rem at 50% -10%, rgba(0,74,112,0.35), transparent 60%), radial-gradient(45rem 45rem at 100% 110%, rgba(223,14,11,0.28), transparent 55%), linear-gradient(180deg, rgba(16,29,39,0.62), rgba(16,29,39,0.78))",
        }}
      />

      {/* Confeti por encima de todo */}
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50" aria-hidden="true" />

      <section className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-5 py-12 sm:py-16">
        {/* Tarjeta glass principal */}
        <div className="glass-strong glass-hairline w-full rounded-[2rem] px-6 py-10 text-center sm:px-10 sm:py-12">
          {/* Marca */}
          <div className="flex items-center justify-center gap-2">
            <svg width="15" height="19" viewBox={ISOTIPO_VIEWBOX} aria-hidden="true">
              {isotipoPaths.map((d, i) => (
                <path key={i} fill="var(--color-azul)" d={d} />
              ))}
            </svg>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-tinta-suave)]">
              American Outlet
            </span>
          </div>

          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-rojo)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-rojo-700)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-rojo)]" />
            Día del Padre · Domingo 21 de junio
          </span>

          <h1 className="mt-5 text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--color-tinta)] sm:text-5xl">
            Girá la ruleta y ganá
            <br className="hidden sm:block" /> tu descuento para papá
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--color-tinta-suave)] sm:text-base">
            Tenés un giro. Girá, ganá tu cupón y mostralo en cualquiera de nuestras
            tiendas de American Outlet.
          </p>

          {/* Ruleta */}
          <div className="relative mx-auto mt-9 flex w-full max-w-[20rem] items-center justify-center sm:max-w-[23rem]">
            {/* Puntero */}
            <div className="absolute -top-1 left-1/2 z-20 -translate-x-1/2">
              <div
                className="h-0 w-0"
                style={{
                  borderLeft: "15px solid transparent",
                  borderRight: "15px solid transparent",
                  borderTop: "24px solid var(--color-rojo)",
                  filter: "drop-shadow(0 4px 6px rgba(16,29,39,0.3))",
                }}
              />
            </div>

            <div className="relative aspect-square w-full">
              {/* Aro exterior frosted */}
              <div className="absolute inset-0 rounded-full bg-white/40 p-2 shadow-[0_24px_50px_-18px_rgba(16,29,39,0.5)] backdrop-blur-md ring-1 ring-white/60" />

              <svg
                viewBox="0 0 200 200"
                className="relative h-full w-full p-2"
                style={{
                  transform: `rotate(${rotacion}deg)`,
                  transition:
                    fase === "girando" ? "transform 5.2s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                }}
                onTransitionEnd={alTerminarGiro}
              >
                <defs>
                  {/* Brillo de cristal */}
                  <radialGradient id="gloss" cx="35%" cy="28%" r="75%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                    <stop offset="45%" stopColor="#ffffff" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <circle cx="100" cy="100" r="100" fill="#ffffff" />
                <g>
                  {SEGMENTS.map((s, i) => {
                    const centro = i * SEG + SEG / 2;
                    const [lx, ly] = pt(centro, 64);
                    return (
                      <g key={i}>
                        <path d={wedgePath(i)} fill={s.color} stroke="#ffffff" strokeWidth="1.5" />
                        <text
                          x={lx}
                          y={ly}
                          fill="#ffffff"
                          fontSize="15"
                          fontWeight="700"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${centro}, ${lx}, ${ly})`}
                        >
                          {s.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
                {/* Sheen de cristal encima de los gajos */}
                <circle cx="100" cy="100" r="100" fill="url(#gloss)" pointerEvents="none" />
                <circle cx="100" cy="100" r="99" fill="none" stroke="#101d27" strokeWidth="1.5" opacity="0.12" />
              </svg>

              {/* Botón de giro en el centro de la ruleta */}
              <button
                onClick={girar}
                disabled={fase !== "idle"}
                aria-label="Girar la ruleta"
                className="group absolute left-1/2 top-1/2 z-20 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-[var(--color-rojo)] text-white shadow-[0_12px_28px_-8px_rgba(223,14,11,0.75)] ring-4 ring-white transition-all duration-300 hover:scale-[1.06] disabled:cursor-not-allowed disabled:opacity-90 sm:h-[5.5rem] sm:w-[5.5rem]"
              >
                {fase === "idle" && (
                  <>
                    <svg width="16" height="20" viewBox={ISOTIPO_VIEWBOX} aria-hidden="true" className="mb-0.5">
                      {isotipoPaths.map((d, i) => (
                        <path key={i} fill="#ffffff" d={d} />
                      ))}
                    </svg>
                    <span className="text-[12px] font-bold uppercase tracking-[0.08em] leading-none">
                      Girar
                    </span>
                  </>
                )}
                {fase === "girando" && (
                  <span className="text-[13px] font-bold uppercase tracking-[0.12em] leading-none">
                    …
                  </span>
                )}
                {fase === "ganado" && <span className="text-2xl leading-none">🎉</span>}
              </button>
            </div>
          </div>

          {/* Estado del giro bajo la ruleta */}
          <p className="mt-8 inline-flex items-center justify-center gap-2 text-sm font-semibold text-[var(--color-tinta)]">
            {fase === "idle" && (
              <>
                Tocá <span className="text-[var(--color-rojo)]">Girar</span> en el centro de la ruleta
                <Icon name="arrow" className="h-[16px] w-[16px]" />
              </>
            )}
            {fase === "girando" && "Girando…"}
            {fase === "ganado" && "¡Ganaste! 🎉"}
          </p>

          <p className="mt-4 text-xs text-[var(--color-tinta-tenue)]">
            Promoción válida por tiempo limitado. Un cupón por persona.
          </p>
        </div>
      </section>

      {/* ----------------- Popup de datos tras ganar ----------------- */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-[var(--color-azul-900)]/55 backdrop-blur-sm" aria-hidden="true" />
          <div className="glass-strong glass-hairline relative w-full max-w-md rounded-[1.8rem] p-7 sm:p-8">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-rojo)]/10 text-2xl">
                🎉
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-[var(--color-tinta)]">
                ¡Ganaste {PREMIO} OFF!
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-tinta-suave)]">
                Dejanos tus datos y te generamos tu cupón al instante para usarlo en
                tienda.
              </p>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-3.5" noValidate>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} required autoComplete="name" placeholder="Nombre completo" className={inputCls} />
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required autoComplete="email" placeholder="Correo" className={inputCls} />
              <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required autoComplete="tel" placeholder="WhatsApp (8888-8888)" className={inputCls} />

              {error && (
                <p role="alert" className="rounded-2xl border border-[var(--color-rojo)]/20 bg-[var(--color-rojo)]/5 px-4 py-3 text-sm text-[var(--color-rojo-700)]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-full bg-[var(--color-rojo)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(223,14,11,0.7)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
              >
                {pending ? "Generando tu cupón…" : `Reclamar mi ${PREMIO} OFF`}
              </button>
              <p className="text-center text-[11px] leading-relaxed text-[var(--color-tinta-tenue)]">
                Al participar aceptás recibir novedades de American Outlet. Tus datos
                no se comparten con terceros.
              </p>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
