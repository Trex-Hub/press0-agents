// CORE
import { google } from "@ai-sdk/google";
import { Memory } from "@mastra/memory";
// UTILS
import { getSharedStore, getSharedVector } from "@/mastra/memory/db";
import { GOOGLE_EMBEDDING_MODEL } from "@/utils/constants";
// TYPES

let memory: Memory | null = null;

const agentMemory = (() => {
  if (!memory) {
    const storage = getSharedStore();
    const vector = getSharedVector();

    memory = new Memory({
      storage: storage as any, 
      vector: vector as any,
      embedder: google.embedding(GOOGLE_EMBEDDING_MODEL),
      options: {
        lastMessages: 10,
        semanticRecall: {
          topK: 4,
          messageRange: 10,
          scope: "thread",
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
