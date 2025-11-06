import { createStep, createWorkflow } from "@mastra/core/workflows";
// SCHEMAS
import {
  ChatStepInputSchema,
  ChatStepOutputSchema,
  ChatWorkflowInputSchema,
  ChatWorkflowOutputSchema,
} from "@/schemas/workflow";

const chatStep = createStep({
  id: "chat-step",
  inputSchema: ChatStepInputSchema,
  outputSchema: ChatStepOutputSchema,
  execute: async ({ inputData, mastra, writer }) => {
    const { prompt } = inputData;

    const agent = mastra?.getAgent("press0Agent");
    if (!agent) {
      throw new Error("Agent not found");
    }

    const stream = await agent.stream(prompt);

    // Stream agent's output to workflow writer for real-time streaming
    if (writer) {
      // Forward chunks from agent's fullStream to workflow writer
      const reader = stream.fullStream.getReader();
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            await writer.write(value);
          }
        }
      } finally {
        reader.releaseLock();
      }
    }

    return {
      text: await stream.text,
    };
  },
});

export const chatWorkflow = createWorkflow({
  id: "chat-workflow",
  inputSchema: ChatWorkflowInputSchema,
  outputSchema: ChatWorkflowOutputSchema,
})
  .then(chatStep)
  .commit();

