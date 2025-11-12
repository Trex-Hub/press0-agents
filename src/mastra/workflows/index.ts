import { createStep, createWorkflow } from "@mastra/core/workflows";
// SCHEMAS
import {
  ChatStepInputSchema,
  ChatStepOutputSchema,
  ChatWorkflowInputSchema,
  ChatWorkflowOutputSchema,
} from "@/schemas/workflow";
// CONSTANTS
import { PRESS_0_WORKFLOW_ID } from "@/utils/constants";
// CONSTANTS
import { MESSAGE_STEP_ID , PRESS_0_AGENT_ID } from "@/utils/constants";

const chatStep = createStep({
  id: MESSAGE_STEP_ID,
  inputSchema: ChatStepInputSchema,
  outputSchema: ChatStepOutputSchema,
  execute: async ({ inputData, mastra }) => {
    const { message, resourceId } = inputData;

    const agent = mastra?.getAgent(PRESS_0_AGENT_ID);
    if (!agent) {
      throw new Error("Agent not found");
    };

    const { text = ''} = await agent.generate(message) ?? {};
    return { text };
  },
});

export const chatWorkflow = createWorkflow({
  id: PRESS_0_WORKFLOW_ID,
  inputSchema: ChatWorkflowInputSchema,
  outputSchema: ChatWorkflowOutputSchema,
})
  .then(chatStep)
  .commit();

