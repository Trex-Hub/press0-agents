// CORE
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
// TOOLS
import { downloadAndAnalyzeVideo, analyzeVideo, downloadAndAnalyzeReel } from "@/mastra/tools";
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

export const press0Agent = new Agent({
  name: PRESS_0_AGENT_ID,
  id: PRESS_0_AGENT_ID,
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
    const messageType = runtimeContext?.get("messageType") as
      | string
      | undefined;

    const reelUrl = runtimeContext?.get("reelUrl") as string | undefined;

    if (reelUrl) {
      return {
        downloadAndAnalyzeReel,
      };
    }

    // If message type is video, only provide downloadAndAnalyzeVideo tool
    if (messageType === "video") {
      return {
        downloadAndAnalyzeVideo,
      };
    }

    // For text messages, only provide analyzeVideo tool (for external URLs if needed)
    return {
      analyzeVideo,
    };
  },
  memory,
});
