// MEMORY
import memory from '@/mastra/memory';
// LOGGER
import logger from './logger';

/**
 * Get threads by resource ID
 */

export const getThreads = async ({ resourceId }: { resourceId: string }) => {
  try {
    return await memory.getThreadsByResourceId({ resourceId });
  } catch (error) {
    logger.error("💭 Error while getting threads");
    throw error;
  }
};

/**
 * Create a new thread
 */
export const createThread = async ({ resourceId, title }: { resourceId: string; title?: string }) => {
  try {
    const thread = await memory.createThread({ resourceId, title });
    logger.debug(`💭 Created thread:", ${thread.id}`);
    return thread;
  } catch (error) {
    logger.error("💭 Error while creating thread:");
    throw error;
  }
};

/**
 * Update a thread
 */
export const updateThread = async ({ threadId, title, metadata }: { threadId: string; title?: string; metadata?: any }) => {
  try {
    const thread = await memory.updateThread({
      id: threadId,
      title: title || '',
      metadata: metadata ?? {}
    });
    logger.info(`💭 Thread is updated: ${thread.id}`);
    return thread;
  } catch (error) {
    logger.error("💭 Error while updating thread:"); 
    throw error;
  }
};

/**
 * Get or create a thread
 */
export const runConvoThread = async ({ resourceId, title }: { resourceId: string; title?: string }) => {
  try {
    const threads = await getThreads({ resourceId });
    // Get the most recent thread by sorting by createdAt in descending order
    const sortedThreads = threads?.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const [latestThread] = sortedThreads ?? [];
    const now = new Date();
    const createdAt = latestThread?.createdAt ? new Date(latestThread.createdAt) : now;
    const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (!latestThread|| hoursSinceCreation >= 1) {
      logger.debug("💭 Creating new thread");
      const newThread = await createThread({
        resourceId,
        title
      });
      logger.debug("💭 Created new thread:", newThread);
      return newThread;
    };

    // Ensure we have a title when updating
    const threadTitle = title || latestThread.title;

    logger.debug(`💭 Reusing existing thread:", ${latestThread.id}`);
    const updatedThread = await updateThread({
      threadId: latestThread.id,
      title: threadTitle
    });
    return updatedThread;
  } catch (error) {
    logger.error("💭 Error while  running convo thread");
    throw error;
  }
};