export interface OptimizedResume {
  header: {
    name: string;
    title: string;
    contact: string;
  };
  professionalSummary: string;
  coreSkills: {
    technical: string[];
    soft: string[];
  };
  workExperience?: Array<{
    title: string;
    company: string;
    duration: string;
    achievements: string[];
  }>;
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    relevantCoursework?: string[];
  }>;
  additionalSections?: Array<{
    title: string;
    content: string;
  }>;
  certifications?: Array<{
    name: string;
    issuingOrganization: string;
    year: string;
  }>;
  secondarySkills?: string[];
  awardsAndHonors?: Array<{
    name: string;
    organization: string;
    year: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency: string;
  }>;
}

export interface AnalysisResult {
  matchScore: {
    total: number;
    hardSkills: number;
    softSkills: number;
    roleAlignment: number;
    atsCompatibility: number;
  };
  missingKeywords: string[];
  actionPlan: string[];
  recruiterLens: {
    positives: string[];
    redFlags: string[];
    shortlistProbability: number;
    verdict: string;
  };
  atsVerdict: {
    willAutoReject: boolean;
    reason: string;
  };
  rewriteSuggestions: {
    headline: string;
    summary: string;
    experienceBullet: string;
  };
  coverLetter: string;
}
