import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "HokkaiDAO — Asia's first Web3 winter builder retreat. Sapporo, Japan, March 2027.";
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
          padding: 72,
          background:
            "linear-gradient(160deg, #060d1a 0%, #04080f 55%, #0a1a2e 100%)",
          color: "#eef4fb",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* mountain silhouette */}
        <svg
          width="1200"
          height="280"
          viewBox="0 0 1200 280"
          style={{ position: "absolute", bottom: 0, left: 0 }}
        >
          <polygon
            points="0,280 220,90 360,200 520,40 700,210 880,80 1060,190 1200,110 1200,280"
            fill="#0a1426"
          />
          <polygon
            points="520,40 600,130 440,130"
            fill="#16263f"
          />
        </svg>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 6,
            color: "#6b9cc9",
          }}
        >
          <span>SAPPORO, JAPAN</span>
          <span>MARCH 2027</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2 }}>
            HokkaiDAO
          </div>
          <div style={{ fontSize: 36, color: "#b6d2ea" }}>
            Asia&apos;s first Web3 winter builder retreat.
          </div>
          <div
            style={{
              display: "flex",
              gap: 28,
              fontSize: 24,
              color: "#7fd8e8",
              marginTop: 8,
            }}
          >
            <span>Two weeks.</span>
            <span>One room.</span>
            <span>Real builders.</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 4,
            color: "#6b9cc9",
          }}
        >
          <span>APPLICATION-ONLY</span>
          <span style={{ color: "#c9a35c" }}>50–100 BUILDERS</span>
        </div>
      </div>
    ),
    size,
  );
}
