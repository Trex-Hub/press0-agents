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
// NODE
import fs from "fs/promises";
import path from "path";

export class MetaService {
  private apiService: ApiService;
  private graphApiService: ApiService;
  private accessToken: string = META_ACCESS_TOKEN;

  constructor() {
    this.apiService = new ApiService(`${META_BASE_URL}/${META_BUSINESS_PHONE_ID}`);
    this.graphApiService = new ApiService(META_BASE_URL);
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

  async downloadVideoAsBuffer(mediaId: string): Promise<{ buffer: ArrayBuffer; mimeType: string }> {
    try {
      // Step 1: Get the download URL from WhatsApp API
      const mediaInfoResult = await this.graphApiService.get<{ url: string; mime_type?: string }>(
        `/${mediaId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!mediaInfoResult.isSuccess || !mediaInfoResult.data) {
        throw new Error(`Failed to get media info: ${mediaInfoResult.error?.message || 'Unknown error'}`);
      }

      const downloadUrl = mediaInfoResult.data.url;
      if (!downloadUrl) {
        throw new Error('No download URL found in media info');
      }

      // Step 2: Download the video file
      const downloadUrlObj = new URL(downloadUrl);
      const downloadApiService = new ApiService(`${downloadUrlObj.protocol}//${downloadUrlObj.host}`);
      
      const videoResult = await downloadApiService.get<Blob>(
        downloadUrlObj.pathname + downloadUrlObj.search,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
          responseType: 'blob',
        }
      );

      if (!videoResult.isSuccess || !videoResult.data) {
        throw new Error(`Failed to download video: ${videoResult.error?.message || 'Unknown error'}`);
      }

      const videoBlob = videoResult.data;
      const videoBuffer = await videoBlob.arrayBuffer();
      const mimeType = mediaInfoResult.data.mime_type || 'video/mp4';

      logger.info(`✅ Video downloaded as buffer, size: ${videoBuffer.byteLength} bytes, mimeType: ${mimeType}`);
      return { buffer: videoBuffer, mimeType };
    } catch (error) {
      logger.error(`Error downloading video as buffer: ${error}`);
      throw error;
    };
  }

  async downloadVideo(mediaId: string): Promise<string> {
    try {
      // Step 1: Get the download URL from WhatsApp API
      const mediaInfoResult = await this.graphApiService.get<{ url: string; mime_type?: string }>(
        `/${mediaId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!mediaInfoResult.isSuccess || !mediaInfoResult.data) {
        throw new Error(`Failed to get media info: ${mediaInfoResult.error?.message || 'Unknown error'}`);
      }

      const downloadUrl = mediaInfoResult.data.url;
      if (!downloadUrl) {
        throw new Error('No download URL found in media info');
      }

      // Step 2: Download the video file
      // Parse the download URL to use with ApiService
      const downloadUrlObj = new URL(downloadUrl);
      const downloadApiService = new ApiService(`${downloadUrlObj.protocol}//${downloadUrlObj.host}`);
      
      const videoResult = await downloadApiService.get<Blob>(
        downloadUrlObj.pathname + downloadUrlObj.search,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
          responseType: 'blob',
        }
      );

      if (!videoResult.isSuccess || !videoResult.data) {
        throw new Error(`Failed to download video: ${videoResult.error?.message || 'Unknown error'}`);
      }

      const videoBlob = videoResult.data;
      const videoBuffer = await videoBlob.arrayBuffer();
      
      // Step 3: Determine file extension from mime_type
      const mimeType = mediaInfoResult.data.mime_type || 'video/mp4';
      const extension = mimeType.split('/')[1] || 'mp4';
      
      // Step 4: Create temp_video directory if it doesn't exist
      const tempVideoDir = path.join(process.cwd(), 'temp_video');
      await fs.mkdir(tempVideoDir, { recursive: true });

      // Step 5: Save the video file
      const fileName = `${mediaId}.${extension}`;
      const filePath = path.join(tempVideoDir, fileName);
      
      await fs.writeFile(filePath, Buffer.from(videoBuffer));

      logger.info(`✅ Video downloaded and saved to: ${filePath}`);
      return filePath;
    } catch (error) {
      logger.error(`Error downloading video: ${error}`);
      throw error;
    };
  };

};

export const metaService = new MetaService();