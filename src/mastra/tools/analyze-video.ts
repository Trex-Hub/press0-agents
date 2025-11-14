// MASTRA
import { createTool } from "@mastra/core/tools";
// LIB
import google from "@/lib/google";
// SCHEMAS
import { 
  VideoAnalysisInputSchema, 
  VideoAnalysisOutputSchema 
} from "@/schemas/tools";
// LOGGER
import logger from "@/utils/logger";

export const analyzeVideo = createTool({
  id: "analyze-video",
  description: "Analyze a video from a provided video URL. Use this tool when you have a direct video URL to analyze. For WhatsApp video messages, use download-and-analyze-video instead.",
  inputSchema: VideoAnalysisInputSchema,
  outputSchema: VideoAnalysisOutputSchema,
  execute: async ({ context }) => {
    const { prompt, videoUrl } = context;

    if (!prompt) {
      throw new Error("Missing prompt");
    }

    if (!videoUrl) {
      throw new Error("Missing videoUrl - this tool requires a video URL to analyze");
    }

    const googleAIClient = google;
    const { genAI, model } = googleAIClient;

    logger.info(`📹 Analyzing video from URL: ${videoUrl}`);
    
    const result = await genAI.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              fileData: {
                mimeType: "video/mp4",
                fileUri: videoUrl,
              },
            },
          ],
        },
      ],
    });

    if (!result.text) {
      throw new Error("No text found in the result");
    }
    return {
      text: result.text,
    };
  },
});
