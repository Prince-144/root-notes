import { ImageResponse } from "next/og";
import { siteConfig } from "@/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0d111a",
          color: "#f2f5f9",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 28,
            color: "#3b7dff",
            textTransform: "uppercase",
            letterSpacing: 6,
          }}
        >
          $ {siteConfig.shortName.toLowerCase()}
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.15 }}>
          {siteConfig.tagline}
        </div>
        <div style={{ display: "flex", fontSize: 28, opacity: 0.6 }}>{siteConfig.name}</div>
      </div>
    ),
    { ...size },
  );
}
