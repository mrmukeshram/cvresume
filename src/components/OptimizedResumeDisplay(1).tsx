import React from 'react';
import ModernCard from './ui/ModernCard';
import ModernButton from './ui/ModernButton';
import { OptimizedResume } from '@/types/analysis';
import { ArrowLeft, User, Briefcase, GraduationCap, Lightbulb, Star, FolderKanban, Sparkles, Download } from 'lucide-react';
import { downloadAsDocx } from '@/lib/resume-exporter';
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
  const handleDownloadDocx = () => {
    downloadAsDocx(resume, `${resume.header.name.replace(/\s+/g, '_')}_Resume`);
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

      <ModernCard variant="floating" className="p-8">
        {resume.header && (
          <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-black">{resume.header.name}</h2>
              <p className="text-xl text-gray-700 font-medium">{resume.header.title}</p>
              <p className="text-sm text-gray-600 mt-2">{formatContact(resume.header.contact)}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
              {resume.professionalSummary && (
                <SectionCard title="Professional Summary" icon={Lightbulb}>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{resume.professionalSummary}</p>
                </SectionCard>
              )}

              {resume.workExperience && resume.workExperience.length > 0 && (
                <SectionCard title="Work Experience" icon={Briefcase}>
                    <div className="space-y-6">
                    {resume.workExperience.map((exp, i) => (
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
              
              {resume.projects && resume.projects.length > 0 && (
                <SectionCard title="Projects" icon={FolderKanban}>
                  <div className="space-y-6">
                    {resume.projects.map((proj, i) => (
                      <div key={i} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <h4 className="font-bold text-lg text-black">{proj.title}</h4>
                        <p className="text-sm text-gray-600 mb-2 font-medium">{(proj.technologies || []).join(', ')}</p>
                        <p className="text-gray-700 mb-3 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {resume.additionalSections && resume.additionalSections.length > 0 && (
                <SectionCard title="Additional Information" icon={Sparkles}>
                  <div className="space-y-6">
                    {resume.additionalSections.map((section, i) => (
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
            {resume.coreSkills && (
              <SectionCard title="Core Skills" icon={Star}>
                   <div className="space-y-4">
                      {(resume.coreSkills.technical || []).length > 0 && <div><h4 className="font-semibold text-black mb-2">Technical Skills</h4><p className="text-sm text-gray-700 leading-relaxed">{(resume.coreSkills.technical || []).join(', ')}</p></div>}
                      {(resume.coreSkills.soft || []).length > 0 && <div><h4 className="font-semibold text-black mb-2">Soft Skills</h4><p className="text-sm text-gray-700 leading-relaxed">{(resume.coreSkills.soft || []).join(', ')}</p></div>}
                   </div>
              </SectionCard>
            )}

            {resume.education && resume.education.length > 0 && (
              <SectionCard title="Education" icon={GraduationCap}>
                  {resume.education.map((edu, i) => (
                      <div key={i} className="pb-4 last:border-b-0">
                          <h4 className="font-bold text-black">{edu.degree}</h4>
                          <p className="text-gray-700 font-medium">{edu.institution}</p>
                          <p className="text-sm text-gray-600 mt-1">{edu.year}</p>
                          {(edu.relevantCoursework || []).length > 0 && <p className="text-sm text-gray-700 mt-2"><span className="font-medium">Relevant Coursework:</span> {(edu.relevantCoursework || []).join(', ')}</p>}
                      </div>
                  ))}
              </SectionCard>
            )}

            {resume.certifications && resume.certifications.length > 0 && (
              <SectionCard title="Certifications" icon={Sparkles}>
                {resume.certifications.map((cert, i) => (
                  <div key={i} className="pb-4 last:border-b-0">
                    <h4 className="font-bold text-black">{cert.name}</h4>
                    <p className="text-gray-700 font-medium">{cert.issuingOrganization}</p>
                    <p className="text-sm text-gray-600 mt-1">{cert.year}</p>
                  </div>
                ))}
              </SectionCard>
            )}

            {resume.secondarySkills && resume.secondarySkills.length > 0 && (
              <SectionCard title="Secondary Skills" icon={Star}>
                <p className="text-sm text-gray-700 leading-relaxed">{resume.secondarySkills.join(', ')}</p>
              </SectionCard>
            )}

            {resume.awardsAndHonors && resume.awardsAndHonors.length > 0 && (
              <SectionCard title="Awards and Honors" icon={Sparkles}>
                {resume.awardsAndHonors.map((award, i) => (
                  <div key={i} className="pb-4 last:border-b-0">
                    <h4 className="font-bold text-black">{award.name}</h4>
                    <p className="text-gray-700 font-medium">{award.organization}</p>
                    <p className="text-sm text-gray-600 mt-1">{award.year}</p>
                  </div>
                ))}
              </SectionCard>
            )}

            {resume.languages && resume.languages.length > 0 && (
              <SectionCard title="Languages" icon={Sparkles}>
                {resume.languages.map((lang, i) => (
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
