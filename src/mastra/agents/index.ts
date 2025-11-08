// CORE
import { anthropic } from "@ai-sdk/anthropic";
import { Agent } from "@mastra/core/agent";
// TOOLS
import { analyzeVideo } from "@/mastra/tools/video";
import { searchTool } from "@/mastra/tools/search";
// UTILS
import memory from "@/mastra/memory";
// CONSTANTS
import { PRESS_0_AGENT_ID } from "@/utils/constants";

export const press0Agent = new Agent({
  name: PRESS_0_AGENT_ID,
  instructions: `You are a friendly and helpful Agent.`,
  description: "You are a friendly and helpful Agent.",
  model: anthropic("claude-3-5-sonnet-20240620"),
  tools: {
    analyzeVideo,
    searchTool,
  },
  memory,
});
