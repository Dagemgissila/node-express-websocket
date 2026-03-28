import { z } from "zod";

/**
 * Validates query parameters for listing match commentary
 */
export const listCommentaryQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

/**
 * Validates the request body for creating a new commentary entry
 */
export const createCommentarySchema = z.object({
  // Time and Order
  minute: z.coerce.number().int().nonnegative().describe("Minute in the match (0+)"),
  sequence: z.coerce.number().int().describe("Sequential order of the commentary"),

  // Categorization
  period: z.string().trim().min(1).describe("Match period (e.g., '1st Half', 'Extra Time')"),
  eventType: z.string().trim().min(1).describe("Type of event (e.g., 'GOAL', 'YELLOW_CARD', 'SUB')"),

  // Participants
  actor: z.string().trim().optional().describe("Individual involved (e.g., 'Erling Haaland')"),
  team: z.string().trim().optional().describe("Team involved (e.g., 'Man City')"),

  // Content
  message: z.string().trim().min(1, "Message is required").describe("The human-readable commentary text"),

  // Data Buckets
  metadata: z.record(z.string(), z.unknown()).default({}).describe("Flexible key-value pairs for technical details"),
  tags: z.array(z.string()).default([]).describe("Searchable tags (e.g., ['important', 'var'])"),
});
