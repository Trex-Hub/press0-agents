// CORE
import { ApiService } from "@/services/index";
// TYPES
import {
  FocusMode,
  OptimizationMode,
  SEARCH_BODY,
  SEARCH_RESPONSE,
  defaultSearchBody,
} from "@/types/tools";
// CONSTANTS
import { WE_SEARCH_API_URL } from "@/utils/constants";
// LOGGER
import logger from "@/utils/logger";

export class SearchService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService(`${WE_SEARCH_API_URL}`);
  }

  async search({
    query,
    focusMode,
    optimizationMode,
  }: {
    query: string;
    focusMode: FocusMode;
    optimizationMode?: OptimizationMode;
  }): Promise<SEARCH_RESPONSE> {
    const payload: SEARCH_BODY = {
      ...defaultSearchBody,
      query,
      focusMode,
      optimizationMode,
    };
    try {
      const { data } = await this.apiService.post<SEARCH_RESPONSE>(
        `/search`,
        payload
      );
      return data as SEARCH_RESPONSE;
    } catch (error) {
      logger.error("[ERROR LOG]", { error });
      throw new Error("Failed to search");
    }
  }
}

export const searchService = new SearchService();
