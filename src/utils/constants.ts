import dotenv from "dotenv";
dotenv.config();

// LOGGER RELATED
export const LOGGER_LEVEL = process.env.LOGGER_LEVEL || "debug";

// GOOGLE
export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;
export const GOOGLE_MODEL = process.env.GOOGLE_MODEL || "gemini-2.0-flash";

// DATABASE
export const DATABASE_URL = process.env.DATABASE_URL!; 

// META
export const META_BASE_URL = process.env.META_BASE_URL!;
export const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN!;
export const META_BUSINESS_PHONE_ID = process.env.META_BUSINESS_PHONE_ID!;
export const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN!;

// IDS
export const PRESS_0_WORKFLOW_ID = 'press0-workflow';
export const MESSAGE_STEP_ID = 'message-step';
export const THREAD_MANAGEMENT_STEP_ID = 'thread-management-step';
export const PRESS_0_AGENT_ID = 'press0-agent';

// STATUS
export const STATUS_SUCCESS = 'success';
export const STATUS_FAILED = 'failed';

// LANGFUSE
export const LANGFUSE_BASE_URL = process.env.LANGFUSE_BASE_URL!;
export const LANGFUSE_PUBLIC_KEY = process.env.LANGFUSE_PUBLIC_KEY!;
export const LANGFUSE_SECRET_KEY = process.env.LANGFUSE_SECRET_KEY!;

// FLAGS
export const IS_DEV = process.env.NODE_ENV === 'development';