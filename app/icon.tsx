import { ImageResponse } from "next/og";
import { ISOTIPO_VIEWBOX, isotipoPaths } from "@/components/ui/isotipoPaths";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Favicon: la "bolsita" oficial (isotipo) blanca sobre el azul de marca,
// igual que el ícono del navbar.
export default function Icon() {
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
          borderRadius: 9,
        }}
      >
        <svg width="20" height="25" viewBox={ISOTIPO_VIEWBOX}>
          {isotipoPaths.map((d, i) => (
            <path key={i} fill="#fff" d={d} />
          ))}
        </svg>
      </div>
    ),
    { ...size },
  );
}
