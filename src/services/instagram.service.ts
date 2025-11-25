// SERVICES
import { ApiService } from "@/services/index";
// CONSTANTS
import { INSTAGRAM_REEL_DOWNLOADER_API_URL } from "@/utils/constants";
// LOGGER
import logger from "@/utils/logger";

export class InstagramService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService(INSTAGRAM_REEL_DOWNLOADER_API_URL);
    if (!INSTAGRAM_REEL_DOWNLOADER_API_URL) {
      throw new Error("INSTAGRAM_REEL_DOWNLOADER_API_URL is not set");
    }
  }

  async downloadReelAsBuffer(
    reelUrl: string
  ): Promise<{ buffer: ArrayBuffer; mimeType: string }> {
    try {
      // Step 1: Get the video URL from Instagram downloader API
      const reelInfoResult = await this.apiService.get<{
        status: string;
        data: {
          filename: string;
          width: string;
          height: string;
          videoUrl: string;
        };
      }>(`/?postUrl=${encodeURIComponent(reelUrl)}`);

      console.log("reelInfoResult", reelInfoResult);

      if (!reelInfoResult.isSuccess || !reelInfoResult.data) {
        throw new Error(
          `Failed to get reel info: ${
            reelInfoResult.error?.message || "Unknown error"
          }`
        );
      }

      if (
        reelInfoResult.data.status !== "success" ||
        !reelInfoResult.data.data?.videoUrl
      ) {
        throw new Error("No video URL found in reel info response");
      }

      const videoUrl = reelInfoResult.data.data.videoUrl;
      logger.info(`📥 Downloading reel from: ${videoUrl}`);

      // Step 2: Download the video file
      const videoUrlObj = new URL(videoUrl);
      const downloadApiService = new ApiService(
        `${videoUrlObj.protocol}//${videoUrlObj.host}`
      );

      const videoResult = await downloadApiService.get<Blob>(
        videoUrlObj.pathname + videoUrlObj.search,
        {
          responseType: "blob",
        }
      );

      if (!videoResult.isSuccess || !videoResult.data) {
        throw new Error(
          `Failed to download reel: ${
            videoResult.error?.message || "Unknown error"
          }`
        );
      }

      const videoBlob = videoResult.data;
      const videoBuffer = await videoBlob.arrayBuffer();
      const mimeType = "video/mp4"; // Instagram reels are typically MP4

      logger.info(
        `✅ Reel downloaded as buffer, size: ${videoBuffer.byteLength} bytes`
      );
      return { buffer: videoBuffer, mimeType };
    } catch (error) {
      logger.error("Error downloading reel", { error });
      throw error;
    }
  }
}

export const instagramService = new InstagramService();
