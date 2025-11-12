// SERVICE
import { metaService } from "@/services/meta.service";
// UTILS
import { getMessagesValue } from "@/utils/index";
// CONSTANTS  
import { 
  PRESS_0_WORKFLOW_ID,
  STATUS_SUCCESS,
  STATUS_FAILED,
} from "@/utils/constants";
// LOGGER
import logger from "@/utils/logger";


export const handleWebhookGet = async (c: any) => {
  const mode = c.req.query("hub.mode");
  const token = c.req.query("hub.verify_token");
  const challenge = c.req.query("hub.challenge");
  if (await metaService.verifyWebhook({ mode, token })){
    return c.text(challenge, 200);
  };
  return c.text("Forbidden", 403);
};

export const handleWebhookPost = async (c: any) => {
  const body = await c.req.json();
  const value = getMessagesValue(body);
  // 1️⃣ Status updates → immediate return of a valid 200
  if (Array.isArray(value?.statuses) && value.statuses.length > 0) {
    return c.text("EVENT_RECEIVED", 200);
  };

  // 2️⃣ Inbound messages → ack _first_, then process
  if (Array.isArray(value?.messages) && value.messages.length > 0) {
    const msg = value.messages[0];
    const from = msg.from;
    
    // **return** the ack right away
    const ack = c.text("EVENT_RECEIVED", 200);

    // Handle video messages
    if (msg.type === "video" && msg.video?.id) {
      logger.info("🎥 Video message received", { 
        videoId: msg.video.id, 
        mimeType: msg.video.mime_type,
        caption: msg.video.caption 
      });

      (async () => {
        try {
          const videoPath = await metaService.downloadVideo(msg.video.id);
          logger.info(`📁 Video saved to: ${videoPath}`);
          // TODO: Add video analysis pipeline here
        } catch (error) {
          logger.error("Error downloading video", { error });
          await metaService.sendMessage({ 
            phoneNumber: from, 
            message: "Hi There, Apologies from Press0, we couldn't process your video. Please try again later." 
          });
        }
      })();

      return ack;
    }

    // Handle text messages
    const text = msg.text?.body ?? "";
    logger.info("💬 Inbound Message Content:", text);

    (async () => {
      try {
        const mastra = c.get("mastra");
        const run = await mastra.getWorkflow(PRESS_0_WORKFLOW_ID).createRunAsync();
        const { result, status } = await run.start({
          inputData: {
            message: text,
            resourceId: from,
          },
        }) ?? {};
        if (status === STATUS_FAILED) {
          await metaService.sendMessage({ phoneNumber: from, message: "Hi There, Apologies from Press0, something went wrong. We are working on fixing the issue. Please try again later." });
        } else if (status === STATUS_SUCCESS) {
          await metaService.sendMessage({ phoneNumber: from, message: result?.text ?? "" });
        };
      } catch (error) {
        logger.error("Error while running the workflow", { error });
        await metaService.sendMessage({ phoneNumber: from, message: "Hi There, Apologies from Press0, something went wrong. We are working on fixing the issue. Please try again later." });
      }
    })(); 

    // **this is crucial**—we return the ack, not `undefined`
    return ack;
  }

  // 3️⃣ Fallback
  return c.text("EVENT_RECEIVED", 200);
};