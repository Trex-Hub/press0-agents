// CORE
import { z } from "zod";


export const ThreadManagementInputSchema = z.object({
  message: z.string().describe("The user's inbound message from WhatsApp (text or video caption)"),
  resourceId: z.string().describe("The user's WhatsApp mobile number"),
});

export const ThreadManagementOutputSchema = z.object({
  threadId: z.string().describe("The thread ID"),
});

export const ChatStepInputSchema = z.object({
  message: z.string().describe("The user's inbound message from WhatsApp (text or video caption)"),
  resourceId: z.string().describe("The user's WhatsApp mobile number"),
  threadId: z.string().describe("The thread ID"),
});

export const ChatStepOutputSchema = z.object({
  text: z.string().describe("The agent's response text"),
});

export const WorkflowInputSchema = z.object({
  message: z.string().describe("The user's inbound message from WhatsApp (text or video caption)"),
  resourceId: z.string().describe("The user's WhatsApp mobile number"),
});

export const WorkflowOutputSchema = z.object({
  text: z.string().describe("The agent's response text"),
});


// Chat Step Types
export type ChatStepInput = z.infer<typeof ChatStepInputSchema>;
export type ChatStepOutput = z.infer<typeof ChatStepOutputSchema>;

// Chat Workflow Types
export type WorkflowInput = z.infer<typeof WorkflowInputSchema>;
export type WorkflowOutput = z.infer<typeof WorkflowOutputSchema>;

// Thread Management Types
export type ThreadManagementInput = z.infer<typeof ThreadManagementInputSchema>;
export type ThreadManagementOutput = z.infer<typeof ThreadManagementOutputSchema>;