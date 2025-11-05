export type SearchFocusMode = 
  | "webSearch"
  | "academicSearch" 
  | "writingAssistant"
  | "wolframAlphaSearch"
  | "youtubeSearch"
  | "redditSearch";

export type OptimizationMode = "speed" | "balanced";

export interface SearchSource {
  pageContent: string;
  metadata: {
    title: string;
    url: string;
  };
}

export interface SearchInput {
  query: string;
  history?: Array<['human' | 'assistant', string]>;
  systemInstructions?: string;
  focusMode?: SearchFocusMode;
}

export interface SearchOutput {
  message: string;
  sources: SearchSource[];
}

// ============================================================================
// VIDEO ANALYSIS TYPES
// ============================================================================

export interface VideoAnalysisInput {
  prompt: string;
  videoUrl: string;
}

export interface VideoAnalysisOutput {
  text: string;
}

// ============================================================================
// LEGACY TYPES (for backward compatibility)
// ============================================================================

export type FocusMode = SearchFocusMode;
export type Sources = SearchSource;

// Search Request Interface
export interface SearchRequest {
  chatModel: {
    provider: string;
    name: string;
  };
  embeddingModel: {
    provider: string;
    name: string;
  };
  optimizationMode: OptimizationMode;
  focusMode: FocusMode;
  query: string;
  history: Array<['human' | 'assistant', string]>;
  systemInstructions: string;
  stream: boolean;
}

// Search Parameters Type
export type SearchParams = Omit<
  SearchRequest,
  "chatModel" | "embeddingModel" | "optimizationMode" | "stream"
>;

// Search Response Interface
export interface SearchResponse {
  message: string;
  sources: Sources[];
}