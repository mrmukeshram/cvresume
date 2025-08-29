import React from 'react';
import ModernCard from './ui/ModernCard';
import ModernButton from './ui/ModernButton';
import { OptimizedResume } from '@/types/analysis';
import { ArrowLeft, User, Briefcase, GraduationCap, Lightbulb, Star, FolderKanban, Sparkles, Download, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { downloadAsDocx, estimateResumeLayout, autoReduceToSinglePage } from '@/lib/resume-exporter';
import MatchScoreCircular from './ui/MatchScoreCircular';

interface OptimizedResumeDisplayProps {
  resume: OptimizedResume;
  onBackToResults: () => void;
}

const SectionCard: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; className?: string }> = ({ title, icon: Icon, children, className }) => (
    <div className={`mb-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm ${className}`}>
        <h3 className="text-xl font-bold mb-4 flex items-center text-black">
            <Icon className="mr-3 h-6 w-6 text-black" />
            {title}
        </h3>
        {children}
    </div>
);

const OptimizedResumeDisplay: React.FC<OptimizedResumeDisplayProps> = ({ resume, onBackToResults }) => {
  const [finalResume, setFinalResume] = React.useState<OptimizedResume>(resume);
  const [hasBeenOptimized, setHasBeenOptimized] = React.useState(false);
  const [selectedReductions, setSelectedReductions] = React.useState<{
    summary: boolean;
    bullets60: boolean;
    projects3: boolean;
    certs3: boolean;
    awards2: boolean;
    removeAdditional: boolean;
    removeSecondary: boolean;
    removeExtraLanguages: boolean;
  }>({
    summary: false,
    bullets60: false,
    projects3: false,
    certs3: false,
    awards2: false,
    removeAdditional: false,
    removeSecondary: false,
    removeExtraLanguages: false,
  });

  // Create refs for checkboxes
  const summaryRef = React.useRef<HTMLInputElement>(null);
  const bullets60Ref = React.useRef<HTMLInputElement>(null);
  const projects3Ref = React.useRef<HTMLInputElement>(null);
  const certs3Ref = React.useRef<HTMLInputElement>(null);
  const awards2Ref = React.useRef<HTMLInputElement>(null);
  const removeAdditionalRef = React.useRef<HTMLInputElement>(null);
  const removeSecondaryRef = React.useRef<HTMLInputElement>(null);
  const removeExtraLanguagesRef = React.useRef<HTMLInputElement>(null);

  const applyUserOptimizations = () => {
    // Get current selections from checkboxes
    const currentSelections = {
      summary: summaryRef.current?.checked || false,
      bullets60: bullets60Ref.current?.checked || false,
      projects3: projects3Ref.current?.checked || false,
      certs3: certs3Ref.current?.checked || false,
      awards2: awards2Ref.current?.checked || false,
      removeAdditional: removeAdditionalRef.current?.checked || false,
      removeSecondary: removeSecondaryRef.current?.checked || false,
      removeExtraLanguages: removeExtraLanguagesRef.current?.checked || false,
    };

    setSelectedReductions(currentSelections);

    // Create optimized copy
    const optimized = JSON.parse(JSON.stringify(finalResume)) as OptimizedResume;

    // Apply optimizations based on selections
    if (currentSelections.summary && optimized.professionalSummary) {
      const words = optimized.professionalSummary.split(' ');
      if (words.length > 120) {
        optimized.professionalSummary = words.slice(0, 95).join(' ') + '...';
      }
    }

    if (currentSelections.bullets60 && optimized.workExperience && optimized.workExperience.length > 0) {
      optimized.workExperience = optimized.workExperience.map(exp => ({
        ...exp,
        achievements: exp.achievements?.slice(0, Math.max(2, Math.floor(exp.achievements.length * 0.6))) || []
      }));
    }

    if (currentSelections.projects3 && optimized.projects && optimized.projects.length > 3) {
      optimized.projects = optimized.projects.slice(0, 3);
    }

    if (currentSelections.certs3 && optimized.certifications && optimized.certifications.length > 3) {
      optimized.certifications = optimized.certifications.slice(0, 3);
    }

    if (currentSelections.awards2 && optimized.awardsAndHonors && optimized.awardsAndHonors.length > 2) {
      optimized.awardsAndHonors = optimized.awardsAndHonors.slice(0, 2);
    }

    if (currentSelections.removeAdditional) {
      optimized.additionalSections = [];
    }

    if (currentSelections.removeSecondary) {
      optimized.secondarySkills = [];
    }

    if (currentSelections.removeExtraLanguages && optimized.languages && optimized.languages.length > 1) {
      optimized.languages = optimized.languages.slice(0, 1);
    }

    setFinalResume(optimized);
    setHasBeenOptimized(true);
  };

  const handleDownloadDocx = () => {
    downloadAsDocx(finalResume, `${finalResume.header.name.replace(/\s+/g, '_')}_Resume`);
  };

  const formatContact = (contact: any) => {
    if (typeof contact === 'string') {
      return contact;
    }
    if (typeof contact === 'object' && contact !== null) {
      return Object.values(contact).filter(Boolean).join(' | ');
    }
    return '';
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="order-2 md:order-1">
          <ModernButton
            variant="secondary"
            onClick={onBackToResults}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </ModernButton>
        </div>
        
        <div className="text-center order-1 md:order-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gradient-primary mb-2">Perfect Your Resume with AI Intelligence</h1>
          <p className="text-sm text-muted-foreground">Optimized for ATS and human reviewers</p>
        </div>
        
        <div className="order-3">
          <ModernButton
            variant="primary"
            onClick={handleDownloadDocx}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Word
          </ModernButton>
        </div>
      </div>

      {/* User-guided optimization options when resume won't fit on one page */}
      {(() => {
        const layout = estimateResumeLayout(resume);
        return layout.estimatedPageCount > 1 ? (
          <ModernCard variant="floating" className="p-6 mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <AlertTriangle className="mr-3 h-6 w-6 text-orange-600" />
                <h2 className="text-xl font-bold text-orange-900">Optimize for Single Page</h2>
              </div>
              <div className="text-sm text-orange-700">
                {Math.round(layout.estimatedPageCount)} pages detected
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Choose what to optimize:</h4>
              <div className="space-y-3">
                {layout.estimatedPageCount > 1.2 && (
                  <div className="flex items-center p-3 border border-red-200 rounded-lg bg-red-50">
                    <input type="checkbox" className="mr-3 h-4 w-4" />
                    <div>
                      <div className="font-medium text-red-900">Critical: Reduce content significantly</div>
                      <div className="text-sm text-red-700">Remove 40-50% of content, focus on most essential information</div>
                    </div>
                  </div>
                )}

                {resume.professionalSummary?.split(' ').length > 120 && (
                  <div className="flex items-center p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                    <input type="checkbox" ref={summaryRef} className="mr-3 h-4 w-4" />
                    <div>
                      <div className="font-medium text-yellow-900">Shorten Professional Summary</div>
                      <div className="text-sm text-yellow-700">
                        {resume.professionalSummary.split(' ').length} → 80-100 words
                      </div>
                    </div>
                  </div>
                )}

                {resume.workExperience && resume.workExperience.reduce((total, exp) => total + (exp.achievements?.length || 0), 0) > 10 && (
                  <div className="flex items-center p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                    <input type="checkbox" ref={bullets60Ref} className="mr-3 h-4 w-4" />
                    <div>
                      <div className="font-medium text-yellow-900">Reduce Work Experience Bullets</div>
                      <div className="text-sm text-yellow-700">
                        Keep top 2-3 achievements per role
                      </div>
                    </div>
                  </div>
                )}

                {resume.projects && resume.projects.length > 3 && (
                  <div className="flex items-center p-3 border border-orange-200 rounded-lg bg-orange-50">
                    <input type="checkbox" ref={projects3Ref} className="mr-3 h-4 w-4" />
                    <div>
                      <div className="font-medium text-orange-900">Limit Projects</div>
                      <div className="text-sm text-orange-700">
                        {resume.projects.length} → 2-3 most relevant projects
                      </div>
                    </div>
                  </div>
                )}

                {resume.certifications && resume.certifications.length > 3 && (
                  <div className="flex items-center p-3 border border-orange-200 rounded-lg bg-orange-50">
                    <input type="checkbox" ref={certs3Ref} className="mr-3 h-4 w-4" />
                    <div>
                      <div className="font-medium text-orange-900">Prioritize Certifications</div>
                      <div className="text-sm text-orange-700">
                        Keep 3 most recent/relevant certifications
                      </div>
                    </div>
                  </div>
                )}

                {resume.awardsAndHonors && resume.awardsAndHonors.length > 2 && (
                  <div className="flex items-center p-3 border border-orange-200 rounded-lg bg-orange-50">
                    <input type="checkbox" ref={awards2Ref} className="mr-3 h-4 w-4" />
                    <div>
                      <div className="font-medium text-orange-900">Limit Awards</div>
                      <div className="text-sm text-orange-700">
                        Keep 2 most significant awards
                      </div>
                    </div>
                  </div>
                )}

                {resume.additionalSections && resume.additionalSections.filter(section => section && section.title && section.content && section.content.trim().length > 0).length > 0 && (
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <input type="checkbox" ref={removeAdditionalRef} className="mr-3 h-4 w-4" />
                    <div>
                      <div className="font-medium text-gray-900">Remove Additional Sections</div>
                      <div className="text-sm text-gray-700">
                        Remove {resume.additionalSections.filter(section => section && section.title && section.content && section.content.trim().length > 0).length} additional section(s)
                      </div>
                    </div>
                  </div>
                )}

                {resume.secondarySkills && resume.secondarySkills.length > 0 && (
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <input type="checkbox" ref={removeSecondaryRef} className="mr-3 h-4 w-4" />
                    <div>
                      <div className="font-medium text-gray-900">Remove Secondary Skills</div>
                      <div className="text-sm text-gray-700">Remove skills list to save space</div>
                    </div>
                  </div>
                )}

                {resume.languages && resume.languages.length > 1 && (
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <input type="checkbox" ref={removeExtraLanguagesRef} className="mr-3 h-4 w-4" />
                    <div>
                      <div className="font-medium text-gray-900">Keep Primary Language Only</div>
                      <div className="text-sm text-gray-700">{resume.languages.length - 1} extra language(s) to remove</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <ModernButton variant="primary" onClick={applyUserOptimizations}>
                  Apply Selected Changes
                </ModernButton>
                <ModernButton variant="secondary">
                  Preview Changes
                </ModernButton>
              </div>
            </div>
          </ModernCard>
        ) : null;
      })()}

      {/* Page Layout Analysis */}
      {(() => {
        const originalLayout = estimateResumeLayout(resume);
        const finalLayout = estimateResumeLayout(finalResume);

        return (
          <ModernCard variant="floating" className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FileText className="mr-3 h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-blue-900">Page Layout Analysis</h2>
              </div>
              {hasBeenOptimized ? (
                <div className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  User-Optimized ✅
                </div>
              ) : finalLayout.willOverflow ? (
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  <span className="text-sm font-medium">Will Overflow</span>
                </div>
              ) : (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <span className="text-sm font-medium">Single Page Fit</span>
                </div>
              )}
            </div>

            {hasBeenOptimized && (
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">
                  Before: <span className="font-medium text-red-600">{originalLayout.estimatedPageCount} pages</span>
                  → After: <span className="font-medium text-green-600">{finalLayout.estimatedPageCount} page</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{finalLayout.estimatedPageCount}</div>
                <div className="text-sm text-gray-600">Estimated Pages</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(finalLayout.spaceUsedPercentage)}%</div>
                <div className="text-sm text-gray-600">Space Used</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(finalLayout.contentHeight / 1440 * 2.54)}cm</div>
                <div className="text-sm text-gray-600">Estimated Length</div>
              </div>
            </div>

            {finalLayout.suggestions.length > 0 && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Optimization Suggestions:</h4>
                <ul className="space-y-1">
                  {finalLayout.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </ModernCard>
        );
      })()}

      <ModernCard variant="floating" className="p-8">
        {finalResume.header && (
          <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-black">{finalResume.header.name}</h2>
              <p className="text-xl text-gray-700 font-medium">{finalResume.header.title}</p>
              <p className="text-sm text-gray-600 mt-2">{formatContact(finalResume.header.contact)}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
              {finalResume.professionalSummary && (
                <SectionCard title="Professional Summary" icon={Lightbulb}>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{finalResume.professionalSummary}</p>
                </SectionCard>
              )}

              {finalResume.workExperience && finalResume.workExperience.length > 0 && (
                <SectionCard title="Work Experience" icon={Briefcase}>
                    <div className="space-y-6">
                    {finalResume.workExperience.map((exp, i) => (
                        <div key={i} className="border-b border-gray-100 pb-4 last:border-b-0">
                            <h4 className="font-bold text-lg text-black">{exp.title}</h4>
                            <p className="text-gray-700 font-medium">{exp.company}</p>
                            <p className="text-sm text-gray-600 mb-3">{exp.duration}</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-1 leading-relaxed">
                                {(exp.achievements || []).map((ach, j) => <li key={j}>{ach.replace(/^•\s*/, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                    </div>
                </SectionCard>
              )}

              {finalResume.projects && finalResume.projects.length > 0 && (
                <SectionCard title="Projects" icon={FolderKanban}>
                  <div className="space-y-6">
                    {finalResume.projects.map((proj, i) => (
                      <div key={i} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <h4 className="font-bold text-lg text-black">{proj.title}</h4>
                        <p className="text-sm text-gray-600 mb-2 font-medium">{(proj.technologies || []).join(', ')}</p>
                        <p className="text-gray-700 mb-3 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {finalResume.additionalSections && finalResume.additionalSections.filter(section => section && section.title && section.content && section.content.trim().length > 0).length > 0 && (
                <SectionCard title="Additional Information" icon={Sparkles}>
                  <div className="space-y-6">
                    {finalResume.additionalSections
                      .filter(section => section && section.title && section.content && section.content.trim().length > 0)
                      .map((section, i) => (
                      <div key={i} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <h4 className="font-bold text-lg text-black">{section.title}</h4>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            {finalResume.coreSkills && (
              <SectionCard title="Core Skills" icon={Star}>
                   <div className="space-y-4">
                      {(finalResume.coreSkills.technical || []).length > 0 && <div><h4 className="font-semibold text-black mb-2">Technical Skills</h4><p className="text-sm text-gray-700 leading-relaxed">{(finalResume.coreSkills.technical || []).join(', ')}</p></div>}
                      {(finalResume.coreSkills.soft || []).length > 0 && <div><h4 className="font-semibold text-black mb-2">Soft Skills</h4><p className="text-sm text-gray-700 leading-relaxed">{(finalResume.coreSkills.soft || []).join(', ')}</p></div>}
                   </div>
              </SectionCard>
            )}

            {finalResume.education && finalResume.education.length > 0 && (
              <SectionCard title="Education" icon={GraduationCap}>
                  {finalResume.education.map((edu, i) => (
                      <div key={i} className="pb-4 last:border-b-0">
                          <h4 className="font-bold text-black">{edu.degree}</h4>
                          <p className="text-gray-700 font-medium">{edu.institution}</p>
                          <p className="text-sm text-gray-600 mt-1">{edu.year}</p>
                          {(edu.relevantCoursework || []).length > 0 && <p className="text-sm text-gray-700 mt-2"><span className="font-medium">Relevant Coursework:</span> {(edu.relevantCoursework || []).join(', ')}</p>}
                      </div>
                  ))}
              </SectionCard>
            )}

            {finalResume.certifications && finalResume.certifications.length > 0 && (
              <SectionCard title="Certifications" icon={Sparkles}>
                {finalResume.certifications.map((cert, i) => (
                  <div key={i} className="pb-4 last:border-b-0">
                    <h4 className="font-bold text-black">{cert.name}</h4>
                    <p className="text-gray-700 font-medium">{cert.issuingOrganization}</p>
                    <p className="text-sm text-gray-600 mt-1">{cert.year}</p>
                  </div>
                ))}
              </SectionCard>
            )}

            {finalResume.secondarySkills && finalResume.secondarySkills.length > 0 && (
              <SectionCard title="Secondary Skills" icon={Star}>
                <p className="text-sm text-gray-700 leading-relaxed">{finalResume.secondarySkills.join(', ')}</p>
              </SectionCard>
            )}

            {finalResume.awardsAndHonors && finalResume.awardsAndHonors.length > 0 && (
              <SectionCard title="Awards and Honors" icon={Sparkles}>
                {finalResume.awardsAndHonors.map((award, i) => (
                  <div key={i} className="pb-4 last:border-b-0">
                    <h4 className="font-bold text-black">{award.name}</h4>
                    <p className="text-gray-700 font-medium">{award.organization}</p>
                    <p className="text-sm text-gray-600 mt-1">{award.year}</p>
                  </div>
                ))}
              </SectionCard>
            )}

            {finalResume.languages && finalResume.languages.length > 0 && (
              <SectionCard title="Languages" icon={Sparkles}>
                {finalResume.languages.map((lang, i) => (
                  <div key={i} className="pb-4 last:border-b-0">
                    <h4 className="font-bold text-black">{lang.language}</h4>
                    <p className="text-gray-700 font-medium">{lang.proficiency}</p>
                  </div>
                ))}
              </SectionCard>
            )}
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default OptimizedResumeDisplay;
