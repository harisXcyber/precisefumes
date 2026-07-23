import { ImageResponse } from "next/og";

export const runtime = "edge";
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
          fontSize: 48,
          background: "#fafaf8",
          color: "#1a1714",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          padding: "60px",
          textAlign: "center",
        }}
      >
        {/* Background accent */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "600px",
            height: "600px",
            background: "rgba(205, 169, 106, 0.1)",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              fontSize: 32,
              color: "#cda96a",
              letterSpacing: "0.18em",
              marginBottom: "20px",
              textTransform: "uppercase",
            }}
          >
            The Art of Fragrance
          </div>

          <h1
            style={{
              fontSize: 72,
              fontWeight: 300,
              margin: "20px 0",
              lineHeight: "1.2",
              fontStyle: "italic",
            }}
          >
            Scent, Composed with Precision
          </h1>

          <p
            style={{
              fontSize: 24,
              color: "#6d6258",
              marginTop: "30px",
              fontWeight: 300,
            }}
          >
            Meticulously crafted luxury perfumes for Pakistan
          </p>

          <div
            style={{
              marginTop: "50px",
              fontSize: 16,
              color: "#a39f96",
              letterSpacing: "0.05em",
            }}
          >
            precisefumes.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
