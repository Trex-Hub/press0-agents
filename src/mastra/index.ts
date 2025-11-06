// CORE
import { Mastra } from '@mastra/core/mastra';
import { registerApiRoute } from "@mastra/core/server";
// LOGGER
import { PinoLogger } from '@mastra/loggers';
// AGENTS
import { press0Agent } from '@/mastra/agents';
// WORKFLOWS
import { chatWorkflow } from '@/mastra/workflows';
// SERVICES
import { handleWebhookPost } from '@/services/message.handler';
// CONSTANTS
import { LOGGER_LEVEL } from '@/utils/constants';
// TYPES
import { LogLevel } from '@mastra/loggers';
// UTILS
import { getSharedStore } from '@/mastra/memory/db';

const storage = getSharedStore();

export const mastra = new Mastra({
  agents: { press0Agent },
  workflows: { chatWorkflow },
  logger: new PinoLogger({
    name: 'Mastra',
    level: LOGGER_LEVEL as LogLevel,
  }), 
  server:{
    apiRoutes: [
      registerApiRoute("/webhook/whatsapp",{
        method: "POST",
        handler: handleWebhookPost,
      })
    ]
  },
  storage,
});
