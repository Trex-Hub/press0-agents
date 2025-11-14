// CORE
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
// TOOLS
import { analyzeVideo } from "@/mastra/tools/analyze-video";
// UTILS
import memory from "@/mastra/memory";
// CONSTANTS
import { PRESS_0_AGENT_ID } from "@/utils/constants";

export const press0Agent = new Agent({
  name: PRESS_0_AGENT_ID,
  id: PRESS_0_AGENT_ID,
  instructions: `You are a friendly and helpful Agent for WhatsApp conversations.

IMPORTANT VIDEO HANDLING RULES:
- When a user sends a VIDEO MESSAGE via WhatsApp, the video is AUTOMATICALLY available to you via the analyzeVideo tool
- You should IMMEDIATELY use the analyzeVideo tool with the user's message/question as the prompt
- DO NOT ask the user to upload or send the video - it's already received and available
- DO NOT ask for videoUrl - the video is automatically accessible via mediaId in runtime context
- Simply call analyzeVideo with the user's question/prompt about the video
- The tool will automatically download and process the video that was just sent

For text messages, respond naturally and helpfully.`,
  description: "You are a friendly and helpful Agent for WhatsApp conversations. You can analyze videos that users send automatically.",
  model: openai("gpt-4o-mini"),
  tools: {
    analyzeVideo,
  },
  memory,
});
