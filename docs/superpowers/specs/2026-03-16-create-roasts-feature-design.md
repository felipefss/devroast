# Feature Design: Create Roasts

## Overview
This feature implements the core value proposition of the `devroast` application: allowing users to submit code snippets and receive a sarcastic, AI-generated critique ("roast"). The feature leverages the Gemini 2.5 Flash model to analyze the code and return structured data to populate the frontend results page.

## Technical Architecture

### 1. AI Integration (`ai` + `@ai-sdk/google`)
We will use the Vercel AI SDK to communicate with Google's Gemini 2.5 Flash model.
- **Provider:** `@ai-sdk/google`
- **Method:** `generateObject`
- **Schema:** A strictly defined Zod schema that matches the frontend requirements:
  - `score` (number 0-10)
  - `verdict` (string, e.g., "needs_serious_help")
  - `summary` (string, the main roast text)
  - `details` (array of objects containing `type`: 'good'|'warning'|'critical', `title`, and `description`)
  - `suggestedFix` (string, the improved code for the diff view)

### 2. Database Modifications (`drizzle-orm`)
The existing `roasts` table in `src/db/schema.ts` needs a modification to support the structured output from the AI.
- Change the `content` column type from `text` to `jsonb`. This allows us to store the entire structured output (`verdict`, `summary`, `details`, `suggestedFix`) natively and query it efficiently if needed.
- `score` remains a separate column to maintain performance for leaderboard sorting.
- `roastMode` enum (`normal` | `brutal`) is preserved and will be passed to the AI system prompt to adjust its tone.

### 3. Backend Logic (tRPC)
A new tRPC mutation `createRoast` will be implemented:
1. **Input Validation:** Accepts code (string), language (enum), and roastMode (boolean/enum).
2. **Rate Limiting:** Implement a basic rate limit using the IP address (hashed). E.g., max 5 submissions per hour per IP. If the limit is exceeded, return a TRPCError (TOO_MANY_REQUESTS).
3. **Database Transaction:**
   - Insert the submission into the `submissions` table.
   - Call the Gemini API via `generateObject`.
   - Insert the resulting structured data into the `roasts` table.
4. **Return:** Returns the newly created `roast.id`.

### 4. Frontend Integration
**Code Editor Component (`src/app/components/code-editor-wrapper.tsx`):**
- Connect the "roast_my_code" button to the `createRoast` tRPC mutation.
- Implement a loading state on the button (e.g., "roasting..." with a spinner or disabled state) while the mutation is pending.
- On success, use `useRouter` from `next/navigation` to redirect the user to `/roast/[id]`.
- Handle rate limit errors gracefully, showing a toast or inline message.

**Roast Result Page (`src/app/roast/[id]/page.tsx`):**
- Refactor the page to fetch real data from the database using a new tRPC query (e.g., `getRoastById`).
- Replace the static mock data with the parsed `jsonb` data from the `content` column.
- The UI components (Score Ring, Verdict, Detailed Analysis Cards, and Code Diff) will seamlessly map to the structured Zod schema outputted by the AI.

## Trade-offs & Considerations
- **Synchronous Server Execution:** The user will wait with a loading spinner while the AI generates the response. Gemini Flash is fast enough that this should be acceptable UX (typically < 3 seconds). Streaming would be better UX but significantly complicates the tRPC setup and state management for structured JSON data.
- **Rate Limiting:** In-memory or simple database-based rate limiting via IP hash is sufficient for an MVP, but if deployed in a serverless environment (like Vercel functions), memory is not shared. A DB count approach based on `createdAt` and `ipHash` is the most reliable without adding Redis.

## Action Plan
1. Install necessary dependencies (`ai`, `@ai-sdk/google`).
2. Update Drizzle schema (`jsonb` for `roasts.content`) and run migrations.
3. Create the Zod schema for the AI output.
4. Implement the tRPC mutation `createRoast` with rate limiting and AI calling.
5. Implement the tRPC query `getRoastById`.
6. Update the frontend `CodeEditorWrapper` to trigger the mutation and redirect.
7. Update the `/roast/[id]` page to consume and display the real data.