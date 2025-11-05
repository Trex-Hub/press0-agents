// CORE
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
// UTILS
import { getSharedStore, getSharedVector } from "@/mastra/memory/db";

let memory: Memory | null = null;

const agentMemory = (() => {
  if (!memory) {
    memory = new Memory({
      storage: getSharedStore(),
      vector: getSharedVector(),
      embedder: openai.embedding("text-embedding-3-small"),
      options: {
        lastMessages: 10,
        semanticRecall: {
          topK: 4,
          messageRange: 10,
        },
        threads: {
          generateTitle: true,
        },
        workingMemory: {
          enabled: true,
        },
      },
    });
  }
  return memory;
})();

export default agentMemory;