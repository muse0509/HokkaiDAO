import { ImageResponse } from "next/og";

// Rendered once at build time for the static export.
export const dynamic = "force-static";
export const alt =
  "ctsDAO — a winter residency for builders in Japan. Sapporo, March 2027.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#f4f1ea",
          color: "#0e0e0f",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* thin gold rule, top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 80,
            width: 96,
            height: 3,
            background: "#d9a441",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 2,
            color: "#8b877c",
          }}
        >
          <span>SAPPORO · JAPAN</span>
          <span>MARCH 2027</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 104, fontWeight: 300, letterSpacing: -2 }}>
            ctsDAO
          </div>
          <div style={{ fontSize: 38, fontWeight: 300, color: "#2b2a26" }}>
            A winter residency for builders in Japan.
          </div>
          <div
            style={{
              display: "flex",
              gap: 28,
              fontSize: 24,
              color: "#57544c",
              marginTop: 8,
            }}
          >
            <span>Quiet,</span>
            <span style={{ color: "#c8362d" }}>but unforgettable.</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 2,
            color: "#8b877c",
          }}
        >
          <span>APPLICATION-ONLY</span>
          <span style={{ color: "#d9a441" }}>100+ BUILDERS</span>
        </div>
      </div>
    ),
    size,
  );
}
