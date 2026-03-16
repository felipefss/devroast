# OpenGraph Takumi Image Generation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add dynamically generated OpenGraph images to shareable roast results using @takumi-rs/image-response, matching the approved DevRoast design.

**Architecture:** A new API route (`/api/og/roast/[id]`) that fetches roast data via tRPC server caller and generates a 1200x630 OpenGraph image using Takumi. The main roast page exports Next.js metadata pointing to this endpoint.

**Tech Stack:** Next.js (App Router), React, @takumi-rs/image-response, tRPC.

---

## Chunk 1: Setup and Configuration

### Task 1: Install @takumi-rs/image-response

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

Run: `pnpm add @takumi-rs/image-response`
Expected: Installation completes successfully and package.json is updated.

- [ ] **Step 2: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "build: install @takumi-rs/image-response"
```

### Task 2: Configure next.config.ts for Takumi

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Write the configuration update**
Update `next.config.ts` to include `serverExternalPackages: ["@takumi-rs/core"]`.

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@takumi-rs/core"],
  // Keep any other existing config options...
};

export default nextConfig;
```

- [ ] **Step 2: Verify build configuration**

Run: `pnpm build`
Expected: Next.js builds without errors related to configuration.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "chore: opt-out takumi core from nextjs bundling"
```

---

## Chunk 2: API Route Implementation

### Task 3: Create the OG API Route

**Files:**
- Create: `src/app/api/og/roast/[id]/route.tsx`

- [ ] **Step 1: Implement the route with data fetching and layout**
Create the file and implement the image generation logic.
```tsx
import { ImageResponse } from "@takumi-rs/image-response";
import { trpc } from "@/trpc/server";
import { AIRoastResponse } from "@/lib/ai-schema";

// Takumi provides Geist and Geist Mono by default, which we will use.
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  try {
    const { roast, submission } = await trpc.getRoastById({ id: params.id });
    const aiData = roast.content as AIRoastResponse;
    const codeLines = submission.code.split("\n").length;
    const scoreNum = parseFloat(roast.score).toFixed(1);

    return new ImageResponse(
      (
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span style={{ color: "#10B981", fontSize: "24px", fontWeight: "700" }}>{">_"}</span>
            <span style={{ color: "#FAFAFA", fontSize: "20px", fontWeight: "500" }}>devroast</span>
          </div>

          {/* Score Row */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "4px" }}>
            <span style={{ color: "#F59E0B", fontSize: "160px", fontWeight: "900", lineHeight: 1 }}>{scoreNum}</span>
            <span style={{ color: "#4B5563", fontSize: "56px", fontWeight: "normal", lineHeight: 1 }}>/10</span>
          </div>

          {/* Verdict Row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <div style={{ width: "12px", height: "12px", backgroundColor: "#EF4444", borderRadius: "50%" }}></div>
            <span style={{ color: "#EF4444", fontSize: "20px" }}>{aiData.verdict}</span>
          </div>

          {/* Lang Info */}
          <div style={{ color: "#4B5563", fontSize: "16px" }}>
            lang: {submission.language} · {codeLines} lines
          </div>

          {/* Quote */}
          <div style={{ color: "#FAFAFA", fontSize: "22px", textAlign: "center", lineHeight: 1.5, marginTop: "16px" }}>
            “{aiData.summary}”
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        // Optional: fonts can be configured here if necessary. 
        // Takumi includes Geist and Geist Mono by default. 
      }
    );
  } catch (error) {
    // Fallback Image on Error / Not Found
    return new ImageResponse(
      (
        <div style={{
          height: "100%", width: "100%", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", backgroundColor: "#0A0A0A",
        }}>
          <span style={{ color: "#10B981", fontSize: "48px", fontWeight: "700" }}>{">_"}</span>
          <span style={{ color: "#FAFAFA", fontSize: "40px", fontWeight: "500", marginTop: "16px" }}>devroast</span>
          <span style={{ color: "#EF4444", fontSize: "24px", marginTop: "32px" }}>Roast not found</span>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}
```

- [ ] **Step 2: Check Types**

Run: `pnpm tsc --noEmit`
Expected: No type errors in the new API route.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/og/roast/[id]/route.tsx
git commit -m "feat: add takumi opengraph api route for roasts"
```

---

## Chunk 3: Update Page Metadata

### Task 4: Export generateMetadata in Page

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Add generateMetadata export**
Append the metadata generation function to the existing file. Make sure to import `Metadata` from `next`.

```tsx
import type { Metadata } from "next";

// Add this function alongside the existing Page component
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const ogUrl = new URL(`/api/og/roast/${id}`, appUrl).toString();

  return {
    title: "DevRoast Result",
    description: "Check out this brutal code review from DevRoast.",
    metadataBase: new URL(appUrl),
    openGraph: {
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: "DevRoast OpenGraph Image",
        },
      ],
    },
  };
}
```

- [ ] **Step 2: Check Types and Lint**

Run: `pnpm format && pnpm lint`
Expected: Formatting applies and no lint errors.

- [ ] **Step 3: Test Build**

Run: `pnpm build`
Expected: Complete build succeeding without Next.js errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/roast/[id]/page.tsx
git commit -m "feat: inject dynamic opengraph image metadata into roast page"
```
