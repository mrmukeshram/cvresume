export const createAnalysisPrompt = (resumeText: string, jobDescriptionText: string): string => `
You are a strict but FAIR ATS system and expert recruiter with 20+ years of experience. Gemini 2.0's enhanced reasoning will help you provide pinpoint accuracy.

SCORING GUIDELINES (out of 100):
- 0-20: Completely wrong field/industry, no relevant experience
- 21-40: Some transferable skills but major gaps, different domain
- 41-60: Related field, missing 40%+ of core requirements
- 61-75: Good foundation, missing 20-30% of requirements
- 76-85: Strong match, minor gaps, 70–80% of requirements met
- 86-95: Near-perfect match, 90%+ of requirements met
- 96-100: Perfect match (extremely rare)

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescriptionText}

Return ONLY a JSON object with the following structure, filled with your analysis. DO NOT add any extra text.
{
  "matchScore": {
    "total": "number (0-100)",
    "hardSkills": "number (0-25)",
    "softSkills": "number (0-25)",
    "roleAlignment": "number (0-25)",
    "atsCompatibility": "number (0-25)"
  },
  "missingKeywords": ["string"],
  "actionPlan": ["string"],
  "recruiterLens": {
    "positives": ["string"],
    "redFlags": ["string"],
    "shortlistProbability": "number (0-100)",
    "verdict": "string"
  },
  "atsVerdict": {
    "willAutoReject": "boolean",
    "reason": "string"
  },
  "rewriteSuggestions": {
    "headline": "string",
    "summary": "string",
    "experienceBullet": "string"
  },
  "coverLetter": "string"
}
`;

export const createStandardResumeBuilderPrompt = (originalResume: string, jobDescription: string): string => {
  return `
    You are an expert resume editor. Your task is to enhance the provided resume to better match the job description while preserving the original structure and content as much as possible.

    ## INSTRUCTIONS
    1.  **Enhance, Don't Replace:** Improve the wording, add relevant keywords from the job description, and strengthen the bullet points. Do not invent new jobs or projects.
    2.  **Keyword Integration:** Naturally weave keywords from the job description into the existing resume sections.
    3.  **Single-Page Optimization:** Your highest priority is to ensure the final resume is EXACTLY one page.
        - If the content is too long, you MUST summarize the descriptions in the 'Work Experience' and 'Projects' sections. Be concise and focus on the most impactful information.
        - If there is significant empty space, you MUST expand on the existing sections or add new sections to ensure the page is adequately filled. You can add sections such as "Secondary Skills," "Certifications," "Awards and Honors," or "Languages." The goal is a dense, well-utilized single page.
    5.  **Output:** Return ONLY a valid JSON object matching the specified resume structure.

    ## INPUT DATA
    - **Original Resume:** \`\`\`${originalResume}\`\`\`
    - **Job Description:** \`\`\`${jobDescription}\`\`\`

    ## SMART WORK EXPERIENCE HANDLING
    - Analyze the original resume text carefully
    - If the original resume contains work experience details, integrate and optimize them
    - If work experience is not mentioned in the original resume, do not create or fabricate it
    - Focus on enhancing the sections that ARE present in the original resume

    ## REQUIRED JSON OUTPUT STRUCTURE
    \`\`\`json
    {
      "header": { "name": "string", "title": "string", "contact": "string" },
      "professionalSummary": "string",
      "coreSkills": { "technical": ["string"], "soft": ["string"] },
      "workExperience": [{ "title": "string", "company": "string", "duration": "string", "achievements": ["string"] }],
      "projects": [{ "title": "string", "description": "string", "technologies": ["string"] }],
      "education": [{ "degree": "string", "institution": "string", "year": "string", "relevantCoursework": ["string"] }],
      "certifications": [{ "name": "string", "issuingOrganization": "string", "year": "string" }],
      "secondarySkills": ["string"],
      "awardsAndHonors": [{ "name": "string", "organization": "string", "year": "string" }],
      "languages": [{ "language": "string", "proficiency": "string" }]
    }
    \`\`\`

    IMPORTANT: The "workExperience" array should be populated ONLY if work experience details are found in the original resume. If no work experience is present in the original, exclude this field from the JSON or set it as an empty array.
    \`\`\`
>>>>>>> 056185b (Add secondarySkills to JSON output structure)
  `;
};
