import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.nombre} — ${site.tagline}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#101d27",
          backgroundImage:
            "radial-gradient(600px 600px at 85% 10%, rgba(223,14,11,0.35), transparent 60%), radial-gradient(700px 700px at 10% 100%, rgba(0,74,112,0.55), transparent 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.08)",
              borderRadius: 16,
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24">
              <path
                d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.9 6.1 21.2l1.3-6.6L2.5 9.4l6.6-.8z"
                fill="#df0e0b"
              />
            </svg>
          </div>
          <span style={{ color: "white", fontSize: 30, fontWeight: 600, letterSpacing: -1 }}>
            American Outlet
          </span>
        </div>

        <div
          style={{
            marginTop: 40,
            color: "white",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          Lo mejor de las tiendas americanas, aquí en Costa Rica.
        </div>

        <div style={{ marginTop: 28, color: "rgba(255,255,255,0.7)", fontSize: 30 }}>
          {site.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
