import { ImageResponse } from "next/og";

export const alt = "Precise Fumes — Luxury Fragrances";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0a09",
          color: "#f1ece4",
          padding: "60px",
          textAlign: "center",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#cda96a",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          The Art of Fragrance · Est. 2026
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 300,
            marginTop: 28,
            lineHeight: 1.1,
            fontStyle: "italic",
          }}
        >
          Scent, Composed with Precision
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#9a948b",
            marginTop: 32,
          }}
        >
          Luxury perfumes · PKR 3,000 · Free delivery in Karachi
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 20,
            color: "#cda96a",
            letterSpacing: "0.1em",
          }}
        >
          precisefumes.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
