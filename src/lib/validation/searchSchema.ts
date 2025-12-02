import { z } from "zod";

export const searchSchema = z.object({
  query: z
    .string()
    .min(2, "Search query must be at least 2 characters")
    .max(100, "Search query must be less than 100 characters")
    .regex(/^[a-zA-Z0-9äöüÄÖÜß\s\-]+$/, "Invalid characters in search query"),
});

export type SearchInput = z.infer<typeof searchSchema>;
