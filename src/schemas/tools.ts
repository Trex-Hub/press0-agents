// ZOD
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

// Download and Analyze Video Types
export type DownloadAndAnalyzeVideoInput = z.infer<
  typeof DownloadAndAnalyzeVideoInputSchema
>;
export type VideoAnalysisInput = z.infer<typeof VideoAnalysisInputSchema>;
export type VideoAnalysisOutput = z.infer<typeof VideoAnalysisOutputSchema>;
export type DownloadAndAnalyzeReelInput = z.infer<
  typeof DownloadAndAnalyzeReelInputSchema
>;
