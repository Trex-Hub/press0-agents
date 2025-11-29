import { createStep, createWorkflow } from "@mastra/core/workflows";
// SCHEMAS
import {
  ChatStepInputSchema,
  ChatStepOutputSchema,
  WorkflowInputSchema,
  WorkflowOutputSchema,
  ThreadManagementInputSchema,
  ThreadManagementOutputSchema,
} from "@/schemas/workflow";
// CONSTANTS
import { 
  PRESS_0_WORKFLOW_ID, 
  THREAD_MANAGEMENT_STEP_ID,
  MESSAGE_STEP_ID,
  PRESS_0_AGENT_ID,
} from "@/utils/constants";
// MEMORY
import { runConvoThread } from "@/utils/threads";
// LOGGER
import logger from "@/utils/logger";


// THREAD MANAGEMENT STEP
const threadManagementStep = createStep({
  id: THREAD_MANAGEMENT_STEP_ID,
  inputSchema: ThreadManagementInputSchema,
  outputSchema: ThreadManagementOutputSchema,
  execute: async ({ inputData }) => {
    const { resourceId } = inputData ?? {};
    try {
      const { id: threadId }= await runConvoThread({
        resourceId,
      });
      logger.debug(` Using thread:", ${threadId}`);
      return { threadId };
    } catch (error) {
      throw error;
    }
  },
});


const chatStep = createStep({
  id: MESSAGE_STEP_ID,
  inputSchema: ChatStepInputSchema,
  outputSchema: ChatStepOutputSchema,
  execute: async ({ inputData, mastra, runtimeContext }) => {
    const { message, threadId, resourceId } = inputData ?? {};
    const agent = mastra?.getAgent(PRESS_0_AGENT_ID);
    if (!agent) {
       return { text: 'Press0 Agent seems to be offline. Please try again later.' };
    };


    try {
    const { text = ''} = await agent.generate(message, { 
      modelSettings:{
        temperature: 0.2,
      },
      runtimeContext, 
      threadId,
      resourceId,
    }) ?? {};
    return { text };
    } catch (error) {
      logger.error("Error in chat workflow:", { error });
      return { text: 'Press0 Agent seems to be having some technical issues. Please try again later.' };
    }
  },
});

export const chatWorkflow = createWorkflow({
  id: PRESS_0_WORKFLOW_ID,
  inputSchema: WorkflowInputSchema,
  outputSchema: WorkflowOutputSchema,
})
  .then(threadManagementStep)
  .map(async ({ inputData, getInitData }) => {
    const { threadId } = inputData ?? {};
    const { message, resourceId } = getInitData() ?? {};
    return {
      message,
      resourceId,
      threadId,
    };
  })
  .then(chatStep)
  .commit();

