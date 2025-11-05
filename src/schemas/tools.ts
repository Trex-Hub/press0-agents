// ZOD 
import { z } from "zod";

// Search Focus Mode Enum Schema
export const SearchFocusModeSchema = z.enum([
  "webSearch",
  "academicSearch", 
  "writingAssistant",
  "wolframAlphaSearch",
  "youtubeSearch",
  "redditSearch",
]);

// Search Input Schema
export const SearchInputSchema = z.object({
  query: z.string().describe("The query to search for"),
  history: z
    .array(z.tuple([z.enum(["human", "assistant"]), z.string()]))
    .describe("The history of the conversation")
    .optional()
    .default([
      ["human", "Hi, how are you?"],
      ["assistant", "I am doing well, how can I help you today?"],
    ]),
  systemInstructions: z
    .string()
    .describe("The system instructions for the search")
    .optional()
    .default("You are a helpful assistant that can search the web for information."),
  focusMode: SearchFocusModeSchema
    .describe("The focus mode for the search")
    .optional()
    .default("webSearch"),
});

// Search Source Schema
export const SearchSourceSchema = z.object({
  pageContent: z.string().describe("The page content from the search"),
  metadata: z.object({
    title: z.string().describe("The title from the search"),
    url: z.string().describe("The url from the search"),
  }),
});

// Search Output Schema
export const SearchOutputSchema = z.object({
  message: z.string().describe("The message from the search"),
  sources: z.array(SearchSourceSchema),
});

// ============================================================================
// VIDEO ANALYSIS TOOL SCHEMAS
// ============================================================================

// Video Analysis Input Schema
export const VideoAnalysisInputSchema = z.object({
  prompt: z.string().describe("Prompt"),
  videoUrl: z.string().describe("Video URL"),
});

// Video Analysis Output Schema
export const VideoAnalysisOutputSchema = z.object({
  text: z.string().describe("Analysis of the video"),
});

export const OptimizationModeSchema = z.enum(["speed", "balanced"]);

// Search Types
export type SearchFocusMode = z.infer<typeof SearchFocusModeSchema>;
export type SearchInput = z.infer<typeof SearchInputSchema>;
export type SearchSource = z.infer<typeof SearchSourceSchema>;
export type SearchOutput = z.infer<typeof SearchOutputSchema>;

// Video Analysis Types
export type VideoAnalysisInput = z.infer<typeof VideoAnalysisInputSchema>;
export type VideoAnalysisOutput = z.infer<typeof VideoAnalysisOutputSchema>;

// Optimization Mode Type
export type OptimizationMode = z.infer<typeof OptimizationModeSchema>;

