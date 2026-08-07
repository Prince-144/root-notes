import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

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
          background: "#0d111a",
          border: "3px solid #3b7dff",
          borderRadius: 10,
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 40,
            fontWeight: 700,
            color: "#3b7dff",
            lineHeight: 1,
            transform: "translateY(-2px)",
          }}
        >
          &gt;
        </span>
      </div>
    ),
    { ...size },
  );
}
