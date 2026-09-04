import { AIProvider } from "./provider";
import { GeminiAIProvider } from "./gemini-provider";
import { HeuristicAIProvider } from "./heuristic-provider";

const apiKey = process.env.GEMINI_API_KEY || "";

export const aiEngine: AIProvider = apiKey
  ? new GeminiAIProvider(apiKey)
  : new HeuristicAIProvider();

export * from "./types";
export * from "./provider";
export * from "./heuristic-provider";
export * from "./gemini-provider";
