// src/services/analysis.service.ts
import { callGemini } from "./gemini-client";
import { createAnalysisPrompt } from "@/lib/gemini-prompts";
import { AnalysisResult } from "@/types/analysis";

/**
 * Analyzes the user's resume against the job description.
 * @param originalResumeText The user's original resume text.
 * @param jobDescriptionText The target job description text.
 * @returns A promise that resolves to the analysis results.
 */
export const analyzeResume = async (
  originalResumeText: string,
  jobDescriptionText: string
): Promise<AnalysisResult> => {
  try {
    const prompt = createAnalysisPrompt(originalResumeText, jobDescriptionText);
    const analysisResult = await callGemini<AnalysisResult>(prompt);
    return analysisResult;
  } catch (error) {
    console.error("Error in analyzeResume:", error);
    throw error;
  }
};
