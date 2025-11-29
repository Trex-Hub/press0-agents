// MASTRA
import { createTool } from "@mastra/core/tools";
import { SearchInputSchema, SearchOutputSchema } from "@/schemas/tools";
import { searchService } from "@/services/search.service";
import logger from "@/utils/logger";

export const search = createTool({
  id: "search",
  description:
    "Search the web for information based on the query. Use this tool when you need to search the web for information.",
  inputSchema: SearchInputSchema,
  outputSchema: SearchOutputSchema,
  execute: async ({ context }) => {
    const { query, focusMode, optimizationMode } = context;
    if (!query) {
      throw new Error("Missing query");
    }
    if (!focusMode) {
      throw new Error("Missing focusMode");
    }
    try {
      const result = await searchService.search({
        query,
        focusMode,
        optimizationMode,
      });
      return result;
    } catch (error) {
      logger.error("[ERROR LOG]", { error });
      throw new Error("Failed to search");
    }
  },
});
