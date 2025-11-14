// CORE
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
// TOOLS
import { downloadAndAnalyzeVideo, analyzeVideo } from "@/mastra/tools";
// UTILS
import memory from "@/mastra/memory";
// CONSTANTS
import { PRESS_0_AGENT_ID } from "@/utils/constants";

export const press0Agent = new Agent({
  name: PRESS_0_AGENT_ID,
  id: PRESS_0_AGENT_ID,
  instructions: ({ runtimeContext }) => {
    const messageType = runtimeContext?.get("messageType") as string | undefined;
    const mediaId = runtimeContext?.get("mediaId") as string | undefined;

    // Dynamic instructions based on message type
    if (messageType === "video" && mediaId) {
      return `You are a friendly and helpful Agent for WhatsApp conversations.

The user has just sent you a VIDEO MESSAGE. The video is AUTOMATICALLY available to you via the mediaId in runtime context.
- IMMEDIATELY analyze the video using the available tool with the user's message/question as the prompt
- DO NOT ask the user to upload or send the video - use tool to download and analyze the video by passing the mediaId.
- Simply answer the user's question/prompt about the video
- The video will be automatically downloaded and processed for you via tool`;
    }

    // Default instructions for text messages
    return `You are a friendly and helpful Agent for WhatsApp conversations.

For text messages, respond naturally and helpfully. If a user provides a video URL in a text message, you can analyze it using the available tool.`;
  },
  description: "You are a friendly and helpful Agent for WhatsApp conversations. You can analyze videos that users send automatically.",
  model: openai("gpt-4o-mini"),
  tools: ({ runtimeContext }) => {
    const messageType = runtimeContext?.get("messageType") as string | undefined;
    
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
