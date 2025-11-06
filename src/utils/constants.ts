import dotenv from "dotenv";
dotenv.config();

// LOGGER RELATED
export const LOGGER_LEVEL = process.env.LOGGER_LEVEL || "info";

// GOOGLE
export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;
export const GOOGLE_MODEL = process.env.GOOGLE_MODEL || "gemini-2.0-flash";

// PERPLEXICA

export const PERPLEXICA_BASE_URL =
  process.env.PERPLEXICA_BASE_URL || "http://localhost:3000";

export const PERPLEXICA_CONFIG = {
  chatModel: {
    provider: "openai",
    name: "gpt-4o-mini",
  },
  embeddingModel: {
    provider: "openai",
    name: "text-embedding-3-large",
  },
  optimizationMode: "speed",
  focusMode: "webSearch",
  stream: false,
};

// DATABASE
export const DATABASE_URL = process.env.DATABASE_URL!; 

// META
export const META_BASE_URL = process.env.META_BASE_URL!;
export const META_BUSINESS_PHONE_ID = process.env.META_BUSINESS_PHONE_ID!;


// IDS
export const PRESS_0_WORKFLOW_ID = 'press0-workflow';
export const MESSAGE_STEP_ID = 'message-step';
export const PRESS_0_AGENT_ID = 'press0-agent';