import langfuse from "@/utils/langfuse";
import { DEFAULT_PRESS0_AGENT, REEL_ANALYSIS_AGENT, VIDEO_ANALYSIS_AGENT } from "@/utils/constants";

export const defaultPressOAgentPrompt = await langfuse.prompt.get(
  DEFAULT_PRESS0_AGENT
);

export const videoAnalysisAgentPrompt = await langfuse.prompt.get(
  VIDEO_ANALYSIS_AGENT
);

export const reelAnalysisAgentPrompt = await langfuse.prompt.get(
  REEL_ANALYSIS_AGENT
);