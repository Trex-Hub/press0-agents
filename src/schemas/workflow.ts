// CORE
import { z } from "zod";


export const ChatStepInputSchema = z.object({
  message: z.string().describe("The user's inbound message from WhatsApp"),
  resourceId: z.string().describe("The user's WhatsApp mobile number"),
});

export const ChatStepOutputSchema = z.object({
  text: z.string().describe("The agent's response text"),
});

export const ChatWorkflowInputSchema = z.object({
  message: z.string().describe("The user's inbound message from WhatsApp"),
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

