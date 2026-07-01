import { ImageResponse } from "next/og";
import { ISOTIPO_VIEWBOX, isotipoPaths } from "@/components/ui/isotipoPaths";
import { folioDe } from "@/components/promo/CuponTicket";

export const runtime = "nodejs";

// Cupón descargable como PNG (1080×1080).
// /cupon?code=CASA-XXXX&nombre=Juan&pct=10&tag=en+muebles
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const codigo = (searchParams.get("code") || "CASA-XXXX").toUpperCase().slice(0, 16);
  const nombre = (searchParams.get("nombre") || "Cliente").slice(0, 40);
  const pct = (searchParams.get("pct") || "15").replace(/[^\d]/g, "").slice(0, 2) || "15";
  const etiqueta = (searchParams.get("tag") || "para papá").slice(0, 24);

  const barras = Array.from({ length: 46 }, (_, i) => ((codigo.charCodeAt(i % codigo.length) + i * 7) % 3) + 2);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f8fb",
          padding: 80,
        }}
      >
        <div
          style={{
            width: 900,
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(145deg, #101d27, #1b2c39)",
            borderRadius: 56,
            padding: 72,
            color: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="40" height="50" viewBox={ISOTIPO_VIEWBOX}>
              {isotipoPaths.map((d, i) => (
                <path key={i} fill="#fff" d={d} />
              ))}
            </svg>
            <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: 6, color: "rgba(255,255,255,0.72)" }}>
              AMERICAN OUTLET
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", marginTop: 40 }}>
            <span style={{ fontSize: 200, fontWeight: 700, lineHeight: 1 }}>{pct}%</span>
            <span style={{ fontSize: 64, fontWeight: 700, color: "#df0e0b", marginLeft: 12, marginTop: 16 }}>OFF</span>
          </div>
          <span style={{ fontSize: 48, fontWeight: 500, color: "rgba(255,255,255,0.85)", marginTop: 8 }}>
            {etiqueta}
          </span>

          <div style={{ display: "flex", borderTop: "3px dashed rgba(255,255,255,0.25)", marginTop: 56, marginBottom: 48 }} />

          <span style={{ fontSize: 26, fontWeight: 600, letterSpacing: 6, color: "rgba(255,255,255,0.5)" }}>
            TU CÓDIGO
          </span>
          <span style={{ fontSize: 92, fontWeight: 700, letterSpacing: 10, marginTop: 8 }}>{codigo}</span>
          <span style={{ fontSize: 34, color: "rgba(255,255,255,0.72)", marginTop: 18 }}>
            A nombre de {nombre}
          </span>

          <div style={{ display: "flex", alignItems: "flex-end", marginTop: 56 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 80, flex: 1 }}>
              {barras.map((w, i) => (
                <div key={i} style={{ width: w * 3, height: "100%", background: "rgba(255,255,255,0.85)" }} />
              ))}
            </div>
            <span style={{ fontSize: 26, color: "rgba(255,255,255,0.5)", marginLeft: 24 }}>
              N.º {folioDe(codigo)}
            </span>
          </div>

          <span style={{ fontSize: 28, color: "rgba(255,255,255,0.6)", marginTop: 48 }}>
            Mostralo en cualquiera de nuestras tiendas · El Outlet #1 de Costa Rica
          </span>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      headers: {
        "Content-Disposition": 'attachment; filename="cupon-american-outlet.png"',
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}
