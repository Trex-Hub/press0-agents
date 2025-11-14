// MASTRA
import { createTool } from "@mastra/core/tools";
// LIB
import google from "@/lib/google";
// SERVICES
import { metaService } from "@/services/meta.service";
// SCHEMAS
import { 
  DownloadAndAnalyzeVideoInputSchema, 
  VideoAnalysisOutputSchema 
} from "@/schemas/tools";
// LOGGER
import logger from "@/utils/logger";

export const downloadAndAnalyzeVideo = createTool({
  id: "download-and-analyze-video",
  description: "Download and analyze a video that the user just sent via WhatsApp. The video is AUTOMATICALLY available via mediaId in runtime context. Simply call this tool with the user's question/prompt about the video. This tool is specifically for WhatsApp video messages.",
  inputSchema: DownloadAndAnalyzeVideoInputSchema,
  outputSchema: VideoAnalysisOutputSchema,
  execute: async ({ context, runtimeContext }) => {
    const { prompt } = context;
    const mediaId = runtimeContext?.get("mediaId") as string | undefined;

    if (!prompt) {
      throw new Error("Missing prompt");
    }

    if (!mediaId) {
      throw new Error("Missing mediaId - this tool requires a video from WhatsApp (mediaId in runtime context)");
    }

    const googleAIClient = google;
    const { genAI, model } = googleAIClient;

    try {
      logger.info(`📥 Downloading video with mediaId: ${mediaId}`);
      const { buffer, mimeType } = await metaService.downloadVideoAsBuffer(mediaId);
      const videoBuffer = Buffer.from(buffer);
      const fileSizeMB = videoBuffer.length / (1024 * 1024);
      
      logger.info(`📤 Using inline video data (${fileSizeMB.toFixed(2)}MB)`);
      const base64Video = videoBuffer.toString('base64');
      
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
      logger.error("Error processing video with mediaId", { error });
      throw new Error(`Failed to process video: ${error}`);
    }
  },
});

