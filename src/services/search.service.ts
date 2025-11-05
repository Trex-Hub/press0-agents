// CORE
import { ApiService } from "@/services/index";
// CONSTANTS
import { PERPLEXICA_BASE_URL, PERPLEXICA_CONFIG } from "@/utils/constants";
// TYPES
import { SearchParams } from "@/types/search";
// LOGGER
import logger from "@/utils/logger";

const searchService = new ApiService(PERPLEXICA_BASE_URL);

export const search = async (params: SearchParams) => {
  logger.info(`Search Service: ${PERPLEXICA_BASE_URL}`);
  const body = {
    ...PERPLEXICA_CONFIG,
    ...params,
  };
  try {
    return await searchService.post("/api/search", body);
  } catch (error) {
    logger.error(`Search Service Error: ${error}`);
    throw error;
  }
};
