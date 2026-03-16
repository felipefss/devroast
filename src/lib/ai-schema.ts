import { z } from "zod";

export const roastDetailsSchema = z.object({
  type: z.enum(["good", "warning", "critical"]).describe("The severity or type of the feedback."),
  title: z
    .string()
    .describe("A short, punchy title for this specific feedback point. Keep it under 5 words."),
  description: z
    .string()
    .describe(
      "A detailed, sarcastic, and brutal explanation of what is wrong or right. 1-2 sentences max.",
    ),
});

export const aiRoastSchema = z.object({
  score: z
    .number()
    .min(0)
    .max(10)
    .describe(
      "A brutal score from 0 to 10. 10 means terrible, 0 means perfect. Can have one decimal place (e.g. 8.5).",
    ),
  verdict: z
    .string()
    .describe(
      "A 2-4 word slug summarizing the roast, formatted with underscores like 'needs_serious_help' or 'straight_to_jail'.",
    ),
  summary: z
    .string()
    .describe(
      "A brutal 1-2 sentence overall summary of the code. Sarcastic, condescending, but technically accurate.",
    ),
  details: z
    .array(roastDetailsSchema)
    .min(3)
    .max(6)
    .describe(
      "Specific points of feedback. Include mostly warnings/criticals, maybe one good thing if they are lucky.",
    ),
  suggestedFix: z
    .string()
    .describe(
      "The completely rewritten, optimal version of their code. Only return the raw code, no markdown formatting or backticks around it.",
    ),
});

export type AIRoastResponse = z.infer<typeof aiRoastSchema>;
