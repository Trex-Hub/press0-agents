import { press0Agent } from "@/mastra/agents";
export const handleChat = async (c: any) => {
  const { prompt = "" } = (await c.req.json()) ?? {};

  if (!prompt) return c.json({ error: "Missing prompt" }, 400);
  c.header("Content-Type", "text/event-stream");
  c.header("Cache-Control", "no-cache");
  c.header("Connection", "keep-alive");
  c.header("Access-Control-Allow-Origin", "*");

  const stream = await press0Agent.streamVNext([
    { role: "user", content: prompt },
  ]);

  const sseStream = new ReadableStream({
    async start(controller) {
      try {
        const reader = stream.textStream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const data = `data: ${value}\n\n`;
          controller.enqueue(new TextEncoder().encode(data));
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
