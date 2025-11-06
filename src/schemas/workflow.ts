// CORE
import { z } from "zod";


export const ChatStepInputSchema = z.object({
  prompt: z.string().describe("The user's prompt or message"),
});

export const ChatStepOutputSchema = z.object({
  text: z.string().describe("The agent's response text"),
});

export const ChatWorkflowInputSchema = z.object({
  prompt: z.string().describe("The user's prompt or message"),
});

export const ChatWorkflowOutputSchema = z.object({
  text: z.string().describe("The agent's response text"),
});


// Chat Step Types
export type ChatStepInput = z.infer<typeof ChatStepInputSchema>;
export type ChatStepOutput = z.infer<typeof ChatStepOutputSchema>;

// Chat Workflow Types
export type ChatWorkflowInput = z.infer<typeof ChatWorkflowInputSchema>;
export type ChatWorkflowOutput = z.infer<typeof ChatWorkflowOutputSchema>;

