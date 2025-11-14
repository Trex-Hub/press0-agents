// MASTRA
import { createTool } from "@mastra/core/tools";
// LIB
import google from "@/lib/google";
// SERVICES
import { metaService } from "@/services/meta.service";
// SCHEMAS
import { 
  VideoAnalysisInputSchema, 
  VideoAnalysisOutputSchema 
} from "@/schemas/tools";
// LOGGER
import logger from "@/utils/logger";

export const analyzeVideo = createTool({
  id: "analyze-video",
  description: "Analyze a video that the user just sent via WhatsApp. The video is AUTOMATICALLY available - you do NOT need to ask the user to upload or send it. When a user sends a video message, this tool automatically has access to it via mediaId in runtime context. Simply call this tool with the user's question/prompt about the video. DO NOT ask for videoUrl - the video is already available when called from a WhatsApp video message.",
  inputSchema: VideoAnalysisInputSchema,
  outputSchema: VideoAnalysisOutputSchema,
  execute: async ({ context, runtimeContext }) => {
    const { prompt, videoUrl } = context;
    const mediaId = runtimeContext?.get("mediaId") as string | undefined;

    if (!prompt) {
      throw new Error("Missing prompt");
    }

    const googleAIClient = google;
    const { genAI, model } = googleAIClient;

    // If mediaId is present, download video and use inline data
    if (mediaId) {
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
    } else if (videoUrl) {
      // Use provided videoUrl directly with fileData
      logger.info(`📹 Using provided videoUrl: ${videoUrl}`);
      
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
    } else {
      throw new Error("Missing mediaId or videoUrl");
    }
  },
});
