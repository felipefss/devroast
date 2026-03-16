import { ImageResponse } from "@takumi-rs/image-response";
import type { AIRoastResponse } from "@/lib/ai-schema";
import { trpc } from "@/trpc/server";

// Takumi provides Geist and Geist Mono by default, which we will use.
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const { roast, submission } = await trpc.getRoastById({ id: params.id });
    const aiData = roast.content as AIRoastResponse;
    const codeLines = submission.code.split("\n").length;
    const scoreNum = parseFloat(roast.score).toFixed(1);

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          padding: "64px",
          gap: "28px",
        }}
      >
        {/* Logo Row */}
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
        >
          <span style={{ color: "#10B981", fontSize: "24px", fontWeight: "700" }}>{">_"}</span>
          <span style={{ color: "#FAFAFA", fontSize: "20px", fontWeight: "500" }}>devroast</span>
        </div>

        {/* Score Row */}
        <div
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "4px" }}
        >
          <span style={{ color: "#F59E0B", fontSize: "160px", fontWeight: "900", lineHeight: 1 }}>
            {scoreNum}
          </span>
          <span style={{ color: "#4B5563", fontSize: "56px", fontWeight: "normal", lineHeight: 1 }}>
            /10
          </span>
        </div>

        {/* Verdict Row */}
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: "#EF4444",
              borderRadius: "50%",
            }}
          ></div>
          <span style={{ color: "#EF4444", fontSize: "20px" }}>{aiData.verdict}</span>
        </div>

        {/* Lang Info */}
        <div style={{ color: "#4B5563", fontSize: "16px" }}>
          lang: {submission.language} · {codeLines} lines
        </div>

        {/* Quote */}
        <div
          style={{
            color: "#FAFAFA",
            fontSize: "22px",
            textAlign: "center",
            lineHeight: 1.5,
            marginTop: "16px",
          }}
        >
          “{aiData.summary}”
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        // Optional: fonts can be configured here if necessary.
        // Takumi includes Geist and Geist Mono by default.
      },
    );
  } catch (error) {
    // Fallback Image on Error / Not Found
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
        }}
      >
        <span style={{ color: "#10B981", fontSize: "48px", fontWeight: "700" }}>{">_"}</span>
        <span style={{ color: "#FAFAFA", fontSize: "40px", fontWeight: "500", marginTop: "16px" }}>
          devroast
        </span>
        <span style={{ color: "#EF4444", fontSize: "24px", marginTop: "32px" }}>
          Roast not found
        </span>
      </div>,
      { width: 1200, height: 630 },
    );
  }
}
