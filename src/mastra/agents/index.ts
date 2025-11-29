// CORE
import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
// TOOLS
import {
  downloadAndAnalyzeVideo,
  analyzeVideo,
  downloadAndAnalyzeReel,
  search,
} from "@/mastra/tools";
// UTILS
import memory from "@/mastra/memory";
// CONSTANTS
import { PRESS_0_AGENT_ID } from "@/utils/constants";
// PROMPT
import {
  defaultPressOAgentPrompt,
  videoAnalysisAgentPrompt,
  reelAnalysisAgentPrompt,
} from "@/mastra/prompts";
// UTILS
import { whatsappFormatter } from "@/utils/formatter";

export const press0Agent = new Agent({
  name: PRESS_0_AGENT_ID,
  id: PRESS_0_AGENT_ID,
  outputProcessors: [whatsappFormatter],
  instructions: ({ runtimeContext }) => {
    const messageType = runtimeContext?.get("messageType") as
      | string
      | undefined;
    const mediaId = runtimeContext?.get("mediaId") as string | undefined;

    const reelUrl = runtimeContext?.get("reelUrl") as string | undefined;

    // Dynamic instructions based on message type
    if (messageType === "video" && mediaId) {
      return videoAnalysisAgentPrompt.compile();
    }

    if (reelUrl) {
      return reelAnalysisAgentPrompt.compile();
    }

    // Default instructions for text messages
    return defaultPressOAgentPrompt.compile();
  },
  description:
    "You are a friendly and helpful Agent for WhatsApp conversations. You can analyze videos that users send automatically.",
  model: google("gemini-2.5-flash"),
  tools: ({ runtimeContext }) => {
    // Common tools available in all scenarios
    const commonTools = {
      search,
    };
    const messageType = runtimeContext?.get("messageType") as
      | string
      | undefined;

    const reelUrl = runtimeContext?.get("reelUrl") as string | undefined;

    // If reelUrl is provided, provide downloadAndAnalyzeReel tool
    if (reelUrl) {
      return {
        ...commonTools,
        downloadAndAnalyzeReel,
      };
    }

    // If message type is video, provide downloadAndAnalyzeVideo tool
    if (messageType === "video") {
      return {
        ...commonTools,
        downloadAndAnalyzeVideo,
      };
    }

    // For text messages, provide analyzeVideo tool (for external URLs if needed)
    return {
      ...commonTools,
      analyzeVideo,
    };
  },
  memory,
});
