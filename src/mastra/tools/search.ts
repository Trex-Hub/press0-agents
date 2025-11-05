// MASTRA
import { createTool } from "@mastra/core/tools";
// SERVICES
import { search } from "@/services/search.service";
// SCHEMAS
import { 
  SearchInputSchema, 
  SearchOutputSchema
} from "@/schemas/tools";
// TYPES
import { SearchResponse } from "@/types/search";

export const searchTool = createTool({
  id: "search",
  description: "Search the web for information",
  inputSchema: SearchInputSchema,
  outputSchema: SearchOutputSchema,
  execute: async ({ context }) => {
    const { query, history, systemInstructions, focusMode } = context;
    const { data, isError, error } = await search({
      query,
      history,
      systemInstructions,
      focusMode,
    });

    if (isError || !data) {
      throw new Error(error?.message || "Search failed");
    }

    return data as SearchResponse;
  },
});
