// ZOD
import { FOCUS_MODES } from "@/utils/constants";
import { z } from "zod";

// Download and Analyze Video Input Schema (for WhatsApp videos with mediaId)
export const DownloadAndAnalyzeVideoInputSchema = z.object({
  prompt: z.string().describe("The prompt/question to analyze the video with"),
});

// Video Analysis Input Schema (for external video URLs)
export const VideoAnalysisInputSchema = z.object({
  prompt: z.string().describe("The prompt/question to analyze the video with"),
  videoUrl: z.string().describe("The URL of the video to analyze"),
});

// Video Analysis Output Schema
export const VideoAnalysisOutputSchema = z.object({
  text: z.string().describe("Analysis of the video"),
});

// Download and Analyze Reel Input Schema
export const DownloadAndAnalyzeReelInputSchema = z.object({
  prompt: z.string().describe("The prompt/question to analyze the reel with"),
  reelUrl: z
    .string()
    .url()
    .describe("The Instagram reel URL to download and analyze"),
});

export const SearchInputSchema = z.object({
  query: z.string().describe("The query to search for").min(1),
  focusMode: z
    .enum(FOCUS_MODES)
    .describe("The focus mode to use for the search")
    .default("webSearch"),
  optimizationMode: z
    .enum(["speed", "balanced"])
    .optional()
    .describe("The optimization mode to use for the search")
    .default("speed"),
});

export const SearchOutputSchema = z
  .object({
    message: z
      .string()
      .describe("The search result, generated based on the query"),
    sources: z
      .array(
        z.object({
          pageContent: z
            .string()
            .describe("A snippet of the relevant content from the source."),
          metadata: z.object({
            title: z.string().describe("The title of the webpage."),
            url: z.url().describe("The URL of the webpage."),
          }),
        })
      )
      .describe("The sources found for the query"),
  })
  .describe(
    "The output of the search, including the search result and the sources found."
  );

// Download and Analyze Video Types
export type DownloadAndAnalyzeVideoInput = z.infer<
  typeof DownloadAndAnalyzeVideoInputSchema
>;
export type VideoAnalysisInput = z.infer<typeof VideoAnalysisInputSchema>;
export type VideoAnalysisOutput = z.infer<typeof VideoAnalysisOutputSchema>;
export type DownloadAndAnalyzeReelInput = z.infer<
  typeof DownloadAndAnalyzeReelInputSchema
>;
export type SearchInput = z.infer<typeof SearchInputSchema>;
export type SearchOutput = z.infer<typeof SearchOutputSchema>;
