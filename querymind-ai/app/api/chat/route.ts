import { google } from "@ai-sdk/google";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import {
  JSONSchema7,
  streamText,
  convertToModelMessages,
  type UIMessage,
} from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    system,
    tools,
  }: {
    messages: UIMessage[];
    system?: string;
    tools?: Record<string, { description?: string; parameters: JSONSchema7 }>;
  } = await req.json();

  const result = streamText({
    // USE GEMINI 2.5 FLASH HERE
    model: google("gemini-2.5-flash"), 
    messages: await convertToModelMessages(messages),
    // QueryMind_AI identity instruction
    system: system || "You are QueryMind_AI, a sophisticated and helpful AI assistant. Provide clear and technically accurate responses.",
    tools: {
      ...frontendTools(tools ?? {}),
    },
  });

  // Use toUIMessageStreamResponse for assistant-ui compatibility
  return result.toUIMessageStreamResponse();
}