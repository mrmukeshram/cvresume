// src/services/standard-resume.service.ts
import { callGemini } from "./gemini-client";
import { createStandardResumeBuilderPrompt } from "@/lib/gemini-prompts";
import { OptimizedResume } from "@/types/analysis";

/**
 * Builds a standard optimized resume by enhancing the user's original resume.
 * @param originalResumeText The user's original resume text.
 * @param jobDescriptionText The target job description text.
 * @returns A promise that resolves to the structured, optimized resume object.
 */
export const buildStandardResume = async (
  originalResumeText: string,
  jobDescriptionText: string
): Promise<OptimizedResume> => {
  try {
    const prompt = createStandardResumeBuilderPrompt(originalResumeText, jobDescriptionText);
    const optimizedResume = await callGemini<OptimizedResume>(prompt);
    return optimizedResume;
  } catch (error) {
    console.error("Error in buildStandardResume:", error);
    throw error;
  }
};
