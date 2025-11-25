// CONSTANTS
import { FOCUS_MODES, ROLES } from "@/utils/constants";

export type Role = (typeof ROLES)[keyof typeof ROLES];

export type Message = {
  role: Role;
  content: string;
};

export type FocusMode = (typeof FOCUS_MODES)[keyof typeof FOCUS_MODES];

export type OptimizationMode = "speed" | "balanced";

export type LLMModel = {
  providerId: string;
  key: string;
};

export type ConversationTurn = [Role, string];

export type History = ConversationTurn[];

export type SEARCH_BODY = {
  chatModel?: LLMModel;
  embeddingModel?: LLMModel;
  focusMode: FocusMode; // REQUIRED
  optimizationMode?: OptimizationMode;
  query: string; // REQUIRED
  history?: History;
  systemInstructions?: string;
  stream?: boolean;
};

export type SearchSource = {
  pageContent: string;
  metadata: {
    title: string;
    url: string;
  };
};

export type SEARCH_RESPONSE = {
  message: string;
  sources: SearchSource[];
};

export const defaultSearchBody: Omit<SEARCH_BODY, "query" | "focusMode"> = {
  chatModel: {
    providerId: "1f2e9b24-f0ff-4505-ba82-2781f11f668c",
    key: "gpt-4o",
  },
  embeddingModel: {
    providerId: "1f2e9b24-f0ff-4505-ba82-2781f11f668c",
    key: "text-embedding-3-small",
  },
  optimizationMode: "speed",
  history: [],
  stream: false,
  systemInstructions:
    "You are a search assistant who can access the web to find information about the query.",
};
