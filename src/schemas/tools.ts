// ZOD 
import { z } from "zod";

// Video Analysis Input Schema
export const VideoAnalysisInputSchema = z.object({
  prompt: z.string().describe("Prompt"),
  videoUrl: z.string().describe("Video URL"),
});

// Video Analysis Output Schema
export const VideoAnalysisOutputSchema = z.object({
  text: z.string().describe("Analysis of the video"),
});


// Video Analysis Types
export type VideoAnalysisInput = z.infer<typeof VideoAnalysisInputSchema>;
export type VideoAnalysisOutput = z.infer<typeof VideoAnalysisOutputSchema>;

