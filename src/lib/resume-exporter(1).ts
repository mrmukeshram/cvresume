import { OptimizedResume } from '@/types/analysis';
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

export const downloadAsDocx = async (resume: OptimizedResume, fileName: string) => {
  try {
    const formatAchievements = (achievements: string[] = []) => {
        if (!achievements || achievements.length === 0) return [];
        return achievements.map(ach => new Paragraph({
            text: `• ${ach.replace(/^•\s*/, '')}`,
            spacing: { after: 60 }, // Reduced from 120
            indent: { left: 360 } // Reduced from 720
        }));
    };

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: { top: 720, right: 720, bottom: 720, left: 720 }
                }
            },
            children: [
                // Header
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: resume.header.name, bold: true, size: 36, color: '000000' })
                    ],
                    spacing: { after: 40 }
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: resume.header.title, size: 22, color: '222222' })
                    ],
                    spacing: { after: 80 }
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: resume.header.contact, size: 20 })],
                    spacing: { after: 180 } // Reduced from 360
                }),

                // Professional Summary
                new Paragraph({
                    border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                    spacing: { after: 60 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: "PROFESSIONAL SUMMARY", bold: true, size: 24 })],
                    spacing: { after: 80 } // Reduced from 120
                }),
                new Paragraph({
                    text: resume.professionalSummary,
                    spacing: { after: 180 }, // Reduced from 360
                    alignment: AlignmentType.JUSTIFIED
                }),

                // Core Skills
                ...(resume.coreSkills ? [
                    new Paragraph({
                        border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { after: 60 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "CORE SKILLS", bold: true, size: 24 })],
                        spacing: { after: 80 } // Reduced from 120
                    }),
                    ...(resume.coreSkills.technical?.length > 0 ? [
                        new Paragraph({
                            children: [
                                new TextRun({ text: "Technical: ", bold: true, size: 22 }),
                                new TextRun({ text: resume.coreSkills.technical.join(', '), size: 22 })
                            ],
                            spacing: { after: 120 } // Reduced from 240
                        })
                    ] : []),
                    ...(resume.coreSkills.soft?.length > 0 ? [
                        new Paragraph({
                            children: [
                                new TextRun({ text: "Soft Skills: ", bold: true, size: 22 }),
                                new TextRun({ text: resume.coreSkills.soft.join(', '), size: 22 })
                            ],
                            spacing: { after: 180 } // Reduced from 360
                        })
                    ] : [])
                ] : []),

                // Work Experience
                ...(resume.workExperience?.length > 0 ? [
                    new Paragraph({
                        border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { after: 60 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "WORK EXPERIENCE", bold: true, size: 24 })],
                        spacing: { after: 80 } // Reduced from 120
                    }),
                    ...resume.workExperience.flatMap(exp => [
                        new Paragraph({
                            children: [new TextRun({ text: exp.title, bold: true, size: 22 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({ text: exp.company, size: 20 }),
                                new TextRun({ text: `    ${exp.duration}`, italics: true, size: 20 })
                            ],
                            spacing: { after: 120 } // Reduced from 240
                        }),
                        ...formatAchievements(exp.achievements),
                        new Paragraph({ spacing: { after: 120 } }) // Reduced from 240
                    ])
                ] : []),

                // Projects
                ...(resume.projects?.length > 0 ? [
                    new Paragraph({
                        border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { after: 60 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "PROJECTS", bold: true, size: 24 })],
                        spacing: { after: 80 } // Reduced from 120
                    }),
                    ...resume.projects.flatMap(proj => [
                        new Paragraph({
                            children: [new TextRun({ text: proj.title, bold: true, size: 22 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: `Technologies: ${(proj.technologies || []).join(', ')}`, italics: true, size: 20 })],
                            spacing: { after: 120 } // Reduced from 240
                        }),
                        new Paragraph({ text: proj.description, spacing: { after: 120 } }), // Reduced from 240
                    ])
                ] : []),

                // Education
                ...(resume.education?.length > 0 ? [
                    new Paragraph({
                        border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { after: 60 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "EDUCATION", bold: true, size: 24 })],
                        spacing: { after: 80 } // Reduced from 120
                    }),
                    ...resume.education.flatMap(edu => [
                        new Paragraph({
                            children: [new TextRun({ text: edu.degree, bold: true, size: 22 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: edu.institution, size: 20 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: edu.year, size: 20 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        ...(edu.relevantCoursework?.length > 0 ? [
                            new Paragraph({
                                children: [new TextRun({ text: `Relevant Coursework: ${edu.relevantCoursework.join(', ')}`, size: 20 })],
                                spacing: { after: 120 } // Reduced from 240
                            })
                        ] : [])
                    ])
                ] : []),

                // Certifications
                ...(resume.certifications?.length > 0 ? [
                    new Paragraph({
                        border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { after: 60 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "CERTIFICATIONS", bold: true, size: 24 })],
                        spacing: { after: 80 } // Reduced from 120
                    }),
                    ...resume.certifications.flatMap(cert => [
                        new Paragraph({
                            children: [new TextRun({ text: cert.name, bold: true, size: 22 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: cert.issuingOrganization, size: 20 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: cert.year, size: 20 })],
                            spacing: { after: 120 } // Reduced from 240
                        })
                    ])
                ] : []),

                // Secondary Skills
                ...(resume.secondarySkills?.length > 0 ? [
                    new Paragraph({
                        border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { after: 60 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "SECONDARY SKILLS", bold: true, size: 24 })],
                        spacing: { after: 80 } // Reduced from 120
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: resume.secondarySkills.join(', '), size: 22 })],
                        spacing: { after: 180 } // Reduced from 360
                    })
                ] : []),

                // Awards and Honors
                ...(resume.awardsAndHonors?.length > 0 ? [
                    new Paragraph({
                        border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { after: 60 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "AWARDS AND HONORS", bold: true, size: 24 })],
                        spacing: { after: 80 } // Reduced from 120
                    }),
                    ...resume.awardsAndHonors.flatMap(award => [
                        new Paragraph({
                            children: [new TextRun({ text: award.name, bold: true, size: 22 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: award.organization, size: 20 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: award.year, size: 20 })],
                            spacing: { after: 120 } // Reduced from 240
                        })
                    ])
                ] : []),

                // Languages
                ...(resume.languages?.length > 0 ? [
                    new Paragraph({
                        border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { after: 60 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "LANGUAGES", bold: true, size: 24 })],
                        spacing: { after: 80 } // Reduced from 120
                    }),
                    ...resume.languages.flatMap(lang => [
                        new Paragraph({
                            children: [
                                new TextRun({ text: `${lang.language}: `, bold: true, size: 22 }),
                                new TextRun({ text: lang.proficiency, size: 22 })
                            ],
                            spacing: { after: 120 } // Reduced from 240
                        })
                    ])
                ] : []),

                // Additional Sections
                ...(resume.additionalSections?.length > 0 ? [
                    new Paragraph({
                        border: { bottom: { color: '999999', space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { after: 60 }
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "ADDITIONAL INFORMATION", bold: true, size: 24 })],
                        spacing: { after: 80 } // Reduced from 120
                    }),
                    ...resume.additionalSections.flatMap(section => [
                        new Paragraph({
                            children: [new TextRun({ text: section.title, bold: true, size: 22 })],
                            spacing: { after: 60 } // Reduced from 120
                        }),
                        new Paragraph({
                            text: section.content,
                            spacing: { after: 120 } // Reduced from 240
                        })
                    ])
                ] : [])
            ]
        }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${fileName}.docx`);
  } catch (error) {
    console.error('Error generating DOCX:', error);
    alert('Error generating Word document. Please try again.');
  }
};
