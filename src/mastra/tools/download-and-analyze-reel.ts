// MASTRA
import { createTool } from "@mastra/core/tools";
// LIB
import google from "@/lib/google";
// SERVICES
import { instagramService } from "@/services/instagram.service";
// SCHEMAS
import {
  DownloadAndAnalyzeReelInputSchema,
  VideoAnalysisOutputSchema,
} from "@/schemas/tools";
// LOGGER
import logger from "@/utils/logger";

export const downloadAndAnalyzeReel = createTool({
  id: "download-and-analyze-reel",
  description:
    "Download and analyze an Instagram reel from a URL. Provide the reel URL and a prompt/question about the reel.",
  inputSchema: DownloadAndAnalyzeReelInputSchema,
  outputSchema: VideoAnalysisOutputSchema,
  execute: async ({ context }) => {
    const { prompt, reelUrl } = context;

    if (!prompt) {
      throw new Error("Missing prompt");
    }

    if (!reelUrl) {
      throw new Error("Missing reelUrl");
    }

    const googleAIClient = google;
    const { genAI, model } = googleAIClient;

    try {
      logger.info(`📥 Downloading reel from URL: ${reelUrl}`);
      const { buffer, mimeType } = await instagramService.downloadReelAsBuffer(
        reelUrl
      );
      const videoBuffer = Buffer.from(buffer);
      const fileSizeMB = videoBuffer.length / (1024 * 1024);

      logger.info(`📤 Using inline video data (${fileSizeMB.toFixed(2)}MB)`);
      const base64Video = videoBuffer.toString("base64");

      const result = await genAI.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || "video/mp4",
                  data: base64Video,
                },
              },
              { text: prompt },
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
    } catch (error) {
      logger.error("Error processing reel", { error });
      throw new Error(`Failed to process reel: ${error}`);
    }
  },
});
