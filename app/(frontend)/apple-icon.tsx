import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

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
          background: "#0d111a",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 110,
            fontWeight: 700,
            color: "#3b7dff",
            lineHeight: 1,
            transform: "translateY(-6px)",
          }}
        >
          &gt;
        </span>
      </div>
    ),
    { ...size },
  );
}
