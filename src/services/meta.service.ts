// SERVICES
import { ApiService } from "@/services/index";
// CONSTANTS
import { META_BASE_URL, META_BUSINESS_PHONE_ID } from "@/utils/constants";
// LOGGER
import logger from "@/utils/logger";

export class MetaService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService(`${META_BASE_URL}/${META_BUSINESS_PHONE_ID}`);
  };

  async sendMessage({ phoneNumber, message }: { phoneNumber: string, message: string }) {
    try {
          return this.apiService.post("/messages", {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: phoneNumber,
            type: "text",
            text: {
              preview_url: true,
              body: message,
            },
          });
    } catch (error) {
      logger.error(`Meta Service Error: ${error}`);
      throw error;
    }
  }

};

export const metaService = new MetaService();