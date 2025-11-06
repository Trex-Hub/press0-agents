import { mastra } from "@/mastra/index";

export const handleChat = async (c: any) => {
  const { prompt = "" } = (await c.req.json()) ?? {};

  if (!prompt) return c.json({ error: "Missing prompt" }, 400);
  c.header("Content-Type", "text/event-stream");
  c.header("Cache-Control", "no-cache");
  c.header("Connection", "keep-alive");
  c.header("Access-Control-Allow-Origin", "*");

  const workflow = mastra.getWorkflow("chatWorkflow");
  const run = await workflow.createRunAsync();

  const stream = await run.streamVNext({
    inputData: { prompt },
  });

  const sseStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          // Handle text chunks from agent (piped through writer)
          // Agent chunks come through as workflow-step-output with nested chunks
          if (chunk.type === "workflow-step-output") {
            const payload = chunk.payload as { output?: any };
            if (payload?.output) {
              const output = payload.output;
              // Handle nested text-delta chunks
              if (output.type === "text-delta" && output.payload?.text) {
                const data = `data: ${output.payload.text}\n\n`;
                controller.enqueue(new TextEncoder().encode(data));
              }
            }
          }
        }
        controller.close();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        const errorData = `data: ${JSON.stringify({
          type: "error",
          error: errorMessage,
        })}\n\n`;
        controller.enqueue(new TextEncoder().encode(errorData));
        controller.close();
      }
    },
  });

  return new Response(sseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
