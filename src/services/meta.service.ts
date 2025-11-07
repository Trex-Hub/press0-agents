// SERVICES
import { ApiService } from "@/services/index";
// CONSTANTS
import { 
  META_BASE_URL, 
  META_BUSINESS_PHONE_ID, 
  META_ACCESS_TOKEN,
  META_VERIFY_TOKEN
} from "@/utils/constants";
// LOGGER
import logger from "@/utils/logger";

export class MetaService {
  private apiService: ApiService;
  private accessToken: string = META_ACCESS_TOKEN;

  constructor() {
    this.apiService = new ApiService(`${META_BASE_URL}/${META_BUSINESS_PHONE_ID}`);
    if(!this.accessToken){
       throw new Error('META_ACCESS_TOKEN is not set');
    };
  };

  async verifyWebhook({ mode, token }: { mode: string, token: string }){
    if (mode && token && mode === "subscribe" && token === META_VERIFY_TOKEN){
      return true;
    };
    return false;
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
          },{
            headers:{
              'Authorization': `Bearer ${this.accessToken}`,
            }
          });
    } catch (error) {
      logger.error(`Meta Service Error: ${error}`);
      throw error;
    };
  }

};

export const metaService = new MetaService();