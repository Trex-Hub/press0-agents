import "./instrumentation"; 
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
import { handleWebhookPost, handleWebhookGet } from '@/services/message.handler';
// CONSTANTS
import { 
  LOGGER_LEVEL,
  PRESS_0_AGENT_ID,
  PRESS_0_WORKFLOW_ID, 
  LANGFUSE_BASE_URL,
  LANGFUSE_PUBLIC_KEY,
  LANGFUSE_SECRET_KEY,
  IS_DEV,
} from '@/utils/constants';
// TYPES
import { LogLevel } from '@mastra/loggers';
// UTILS
import { getSharedStore } from '@/mastra/memory/db';
// LANGFUSE
import { LangfuseExporter } from "@mastra/langfuse";

const storage = getSharedStore();

export const mastra = new Mastra({
  agents: { [PRESS_0_AGENT_ID]: press0Agent },
  workflows: { [PRESS_0_WORKFLOW_ID]: chatWorkflow },
  logger: new PinoLogger({
    name: 'Mastra',
    level: LOGGER_LEVEL as LogLevel,
  }), 
  server:{
    apiRoutes: [
      registerApiRoute("/webhook",{
        method: "GET",
        handler: handleWebhookGet,
      }),
      registerApiRoute("/webhook",{
        method: "POST",
        handler: handleWebhookPost,
      }),
    ]
  },
  storage,
  observability:{
    configs:{
      langfuse: {
        serviceName: 'press0-agents',
        exporters: [ new LangfuseExporter({
          baseUrl: LANGFUSE_BASE_URL,
          publicKey: LANGFUSE_PUBLIC_KEY,
          secretKey: LANGFUSE_SECRET_KEY,
          realtime: IS_DEV,
          logLevel: LOGGER_LEVEL as LogLevel,
        })],
      }
    }  
  }
});
