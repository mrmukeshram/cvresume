// src/services/fully-optimized-resume.service.ts
import { callGemini } from "./gemini-client";
import {
  createResumeAnalysisPrompt,
  createDynamicResumePrompt,
  createIntelligentLayoutPrompt
} from "@/lib/fully-optimized-prompts";
import { OptimizedResume } from "@/types/analysis";

// Analysis result interface for internal use
interface ResumeAnalysisResult {
  patternAnalysis: {
    pattern: string;
    confidence: string;
    sectionsPresent: string[];
    sectionsMissing: string[];
    contentDensity: string;
    estimatedPageCount: number;
  };
  contentStrategy: {
    sectionsToOptimize: string[];
    sectionsToGenerate: string[];
    contentExpansionNeeded: boolean;
    contentCondensationNeeded: boolean;
    prioritySections: string[];
  };
  dynamicActions: Array<{
    action: string;
    reason: string;
    content: string;
  }>;
}

/**
 * Builds a fully optimized, single-page resume using a three-step dynamic process:
 * 1. Analyzes the resume pattern and determines content strategy
 * 2. Generates dynamic content based on the analysis
 * 3. Optimizes layout for perfect single-page fit
 * @param originalResumeText The user's original resume text.
 * @param jobDescriptionText The target job description text.
 * @returns A promise that resolves to the final, layout-optimized resume object.
 */
export const buildFullyOptimizedResume = async (
  originalResumeText: string,
  jobDescriptionText: string
): Promise<OptimizedResume> => {
  try {
    // Step 1: Perform probability-based analysis
    // Analyze the resume pattern and determine dynamic content strategy
    const analysisPrompt = createResumeAnalysisPrompt(originalResumeText, jobDescriptionText);
    const analysisResult = await callGemini<ResumeAnalysisResult>(analysisPrompt);

    console.log("Resume Analysis Result:", analysisResult);

    // Step 2: Generate dynamic content based on analysis
    // Use the analysis to create content tailored to the specific resume pattern
    const dynamicContentPrompt = createDynamicResumePrompt(
      originalResumeText,
      jobDescriptionText,
      JSON.stringify(analysisResult)
    );
    const dynamicResumeContent = await callGemini<OptimizedResume>(dynamicContentPrompt);

    // Step 3: Perform intelligent single-page layout optimization
    // Use the content density analysis to apply appropriate condensation/expansion
    const layoutOptimizationPrompt = createIntelligentLayoutPrompt(
      JSON.stringify(dynamicResumeContent),
      JSON.stringify(analysisResult)
    );
    const finalOptimizedResume = await callGemini<OptimizedResume>(layoutOptimizationPrompt);

    return finalOptimizedResume;
  } catch (error) {
    console.error("Error in buildFullyOptimizedResume:", error);
    // Consider more specific error handling or user feedback here
    throw new Error("Failed to build the optimized resume. Please try again.");
  }
};
