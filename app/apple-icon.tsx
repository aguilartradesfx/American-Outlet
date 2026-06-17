import { ImageResponse } from "next/og";
import { ISOTIPO_VIEWBOX, isotipoPaths } from "@/components/ui/isotipoPaths";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon: misma bolsita, a mayor tamaño para la pantalla de inicio iOS.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#101d27",
          borderRadius: 40,
        }}
      >
        <svg width="104" height="128" viewBox={ISOTIPO_VIEWBOX}>
          {isotipoPaths.map((d, i) => (
            <path key={i} fill="#fff" d={d} />
          ))}
        </svg>
      </div>
    ),
    { ...size },
  );
}
