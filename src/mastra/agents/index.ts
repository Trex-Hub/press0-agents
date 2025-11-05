// CORE
import { anthropic } from "@ai-sdk/anthropic";
import { Agent } from "@mastra/core/agent";
// TOOLS
import { analyzeVideo } from "@/mastra/tools/video";
import { searchTool } from "@/mastra/tools/search";
// UTILS
import memory from "@/mastra/memory";

export const press0Agent = new Agent({
  name: "Press0 Agent",
  instructions: `You are a friendly and helpful Agent.`,
  description: "You are a friendly and helpful Agent.",
  model: anthropic("claude-3-5-sonnet-20240620"),
  tools: {
    analyzeVideo,
    searchTool,
  },
  memory,
});
