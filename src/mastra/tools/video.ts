// MASTRA
import { createTool } from "@mastra/core/tools";
// LIB
import google from "@/lib/google";
// SCHEMAS
import { 
  VideoAnalysisInputSchema, 
  VideoAnalysisOutputSchema 
} from "@/schemas/tools";

export const analyzeVideo = createTool({
  id: "analyze-video",
  description: "Analyze a video and return the insights",
  inputSchema: VideoAnalysisInputSchema,
  outputSchema: VideoAnalysisOutputSchema,
  execute: async ({ context }) => {
    const { prompt, videoUrl } = context;

    if (!prompt || !videoUrl) {
      throw new Error("Missing prompt or videoUrl");
    }

    const googleAIClient = google;
    const { genAI, model } = googleAIClient;
    const result = await genAI.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              fileData: {
                mimeType: "text/plain",
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
