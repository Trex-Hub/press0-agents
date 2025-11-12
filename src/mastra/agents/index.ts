// CORE
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
// TOOLS
import { analyzeVideo } from "@/mastra/tools/video";
// UTILS
import memory from "@/mastra/memory";
// CONSTANTS
import { PRESS_0_AGENT_ID } from "@/utils/constants";

export const press0Agent = new Agent({
  name: PRESS_0_AGENT_ID,
  id: PRESS_0_AGENT_ID,
  instructions: `You are a friendly and helpful Agent.`,
  description: "You are a friendly and helpful Agent.",
  model: openai("gpt-4o-mini"),
  tools: {
    analyzeVideo,
  },
  memory,
});
