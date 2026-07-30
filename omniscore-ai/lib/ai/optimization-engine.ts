// OmniScore AI — Optimization Engine
// Generates line-by-line rewrite suggestions, ATS tips, and role-specific feedback.

import { type ParsedResume, ACTION_VERBS } from "./resume-parser";
import { type SkillMatchResult } from "./skill-matcher";

export interface OptimizationSuggestion {
  id: string;
  category: "ats" | "keywords" | "impact" | "formatting" | "content";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  original?: string;
  suggested?: string;
  section: string;
}

export function generateOptimizations(
  resume: ParsedResume,
  skillMatch: SkillMatchResult | null
): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];
  let idCounter = 0;
  const nextId = () => `opt-${++idCounter}`;

  // === ATS Suggestions ===
  if (!resume.metadata.hasContactInfo) {
    suggestions.push({
      id: nextId(),
      category: "ats",
      priority: "high",
      title: "Add Contact Information",
      description: "Your resume is missing essential contact details. Include your full name, email, phone number, and location at the top.",
      section: "Header",
    });
  }

  if (!resume.contactInfo.email) {
    suggestions.push({
      id: nextId(),
      category: "ats",
      priority: "high",
      title: "Add Professional Email",
      description: "Include a professional email address (preferably firstname.lastname@domain.com).",
      section: "Header",
    });
  }

  if (!resume.contactInfo.linkedin) {
    suggestions.push({
      id: nextId(),
      category: "ats",
      priority: "medium",
      title: "Add LinkedIn Profile URL",
      description: "Including a LinkedIn URL shows online professional presence and allows recruiters to learn more about you.",
      suggested: "linkedin.com/in/yourname",
      section: "Header",
    });
  }

  if (!resume.contactInfo.github) {
    suggestions.push({
      id: nextId(),
      category: "ats",
      priority: "medium",
      title: "Add GitHub Profile Link",
      description: "For technical roles, a GitHub link demonstrates your coding activity and open-source contributions.",
      suggested: "github.com/yourusername",
      section: "Header",
    });
  }

  if (!resume.metadata.hasSummary) {
    suggestions.push({
      id: nextId(),
      category: "content",
      priority: "high",
      title: "Add Professional Summary",
      description: "Start your resume with a 2-3 sentence professional summary highlighting your experience, key skills, and career objectives.",
      suggested: "Results-driven [Your Title] with [X] years of experience in [domain]. Skilled in [Key Skill 1], [Key Skill 2], and [Key Skill 3]. Proven track record of [key achievement].",
      section: "Summary",
    });
  } else if (resume.summary.length < 50) {
    suggestions.push({
      id: nextId(),
      category: "content",
      priority: "medium",
      title: "Expand Professional Summary",
      description: "Your summary is too brief. A strong summary is 2-3 sentences that capture your value proposition.",
      original: resume.summary.substring(0, 100),
      suggested: `${resume.summary} Proven track record of delivering high-quality solutions. Passionate about [specific domain] with expertise in [key technologies].`,
      section: "Summary",
    });
  }

  if (!resume.metadata.hasSkillsSection) {
    suggestions.push({
      id: nextId(),
      category: "ats",
      priority: "high",
      title: "Add a Dedicated Skills Section",
      description: "ATS systems scan for a dedicated 'Skills' or 'Technical Skills' section. List your key technologies, frameworks, and tools.",
      suggested: "Technical Skills:\n• Languages: Python, JavaScript, TypeScript\n• Frameworks: React, Node.js, FastAPI\n• Databases: PostgreSQL, MongoDB\n• Tools: Docker, Git, AWS",
      section: "Skills",
    });
  }

  if (resume.metadata.wordCount < 300) {
    suggestions.push({
      id: nextId(),
      category: "formatting",
      priority: "high",
      title: "Resume is Too Short",
      description: `Your resume has only ${resume.metadata.wordCount} words. Aim for 400-700 words for a single-page resume. Add more detail to experience bullet points and include projects.`,
      section: "Overall",
    });
  } else if (resume.metadata.wordCount > 1000) {
    suggestions.push({
      id: nextId(),
      category: "formatting",
      priority: "medium",
      title: "Resume May Be Too Long",
      description: `Your resume has ${resume.metadata.wordCount} words. Unless you have 10+ years of experience, aim for a concise single-page resume (400-700 words).`,
      section: "Overall",
    });
  }

  // === Impact Suggestions (Bullet Point Rewrites) ===
  resume.experience.forEach((exp, expIdx) => {
    exp.bullets.forEach((bullet, bulletIdx) => {
      const firstWord = bullet.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "");

      // Check for weak opening
      if (!ACTION_VERBS.includes(firstWord)) {
        const suggestedVerb = suggestActionVerb(bullet);
        suggestions.push({
          id: nextId(),
          category: "impact",
          priority: "medium",
          title: `Strengthen Bullet Point ${bulletIdx + 1} in "${exp.title || exp.company}"`,
          description: "Start bullet points with strong action verbs to demonstrate impact.",
          original: bullet.substring(0, 120) + (bullet.length > 120 ? "..." : ""),
          suggested: rewriteBullet(bullet, suggestedVerb),
          section: `Experience - ${exp.title || exp.company}`,
        });
      }

      // Check for lack of metrics
      const hasMetrics = /\b(\d+[%xX]|\$[\d,.]+|\d+\+?\s*(users|clients|customers|projects|team|revenue|reduction|increase|improvement))\b/i.test(bullet);
      if (!hasMetrics && bullet.length > 20) {
        suggestions.push({
          id: nextId(),
          category: "impact",
          priority: "low",
          title: `Quantify Impact in "${exp.title || exp.company}" Bullet ${bulletIdx + 1}`,
          description: "Add metrics and numbers to demonstrate measurable impact. Recruiters prioritize quantified achievements.",
          original: bullet.substring(0, 120) + (bullet.length > 120 ? "..." : ""),
          suggested: addMetricsTooltip(bullet),
          section: `Experience - ${exp.title || exp.company}`,
        });
      }
    });

    // Check for too few bullets
    if (exp.bullets.length < 3) {
      suggestions.push({
        id: nextId(),
        category: "content",
        priority: "medium",
        title: `Add More Details for "${exp.title || exp.company}"`,
        description: `This role has only ${exp.bullets.length} bullet point(s). Aim for 3-5 detailed bullets per role covering responsibilities, achievements, and technologies used.`,
        section: `Experience - ${exp.title || exp.company}`,
      });
    }
  });

  // === Keyword Suggestions ===
  if (skillMatch) {
    // Missing critical skills
    skillMatch.missingSkills
      .filter((s) => s.importance === "critical")
      .forEach((skill) => {
        suggestions.push({
          id: nextId(),
          category: "keywords",
          priority: "high",
          title: `Add Critical Skill: ${skill.skill}`,
          description: skill.suggestion,
          section: "Skills / Experience",
        });
      });

    // Missing important skills
    skillMatch.missingSkills
      .filter((s) => s.importance === "important")
      .forEach((skill) => {
        suggestions.push({
          id: nextId(),
          category: "keywords",
          priority: "medium",
          title: `Add Important Skill: ${skill.skill}`,
          description: skill.suggestion,
          section: "Skills / Experience",
        });
      });

    // Low match categories
    skillMatch.categoryBreakdown
      .filter((cat) => cat.percentage < 50 && cat.total >= 2)
      .forEach((cat) => {
        const missing = cat.skills.filter((s) => !s.matched).map((s) => s.name);
        suggestions.push({
          id: nextId(),
          category: "keywords",
          priority: "medium",
          title: `Strengthen ${cat.category} Skills`,
          description: `You match only ${cat.matched}/${cat.total} skills in ${cat.category}. Consider adding: ${missing.join(", ")}`,
          section: "Skills",
        });
      });
  }

  // === Formatting Suggestions ===
  if (!resume.metadata.hasProjects && resume.experience.length < 3) {
    suggestions.push({
      id: nextId(),
      category: "content",
      priority: "medium",
      title: "Add a Projects Section",
      description: "With limited work experience, a Projects section showcasing personal or open-source contributions can significantly strengthen your profile.",
      suggested: "Projects:\n• Project Name | Technologies Used\n  - Brief description of what you built and its impact\n  - Key metrics or outcomes",
      section: "Projects",
    });
  }

  if (resume.certifications.length === 0) {
    suggestions.push({
      id: nextId(),
      category: "content",
      priority: "low",
      title: "Consider Adding Certifications",
      description: "Industry certifications (AWS, Google Cloud, Microsoft, etc.) add credibility and can help pass ATS filters.",
      section: "Certifications",
    });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return suggestions;
}

function suggestActionVerb(bullet: string): string {
  const lowerBullet = bullet.toLowerCase();
  if (lowerBullet.includes("code") || lowerBullet.includes("software") || lowerBullet.includes("application"))
    return "Developed";
  if (lowerBullet.includes("team") || lowerBullet.includes("manage") || lowerBullet.includes("lead"))
    return "Led";
  if (lowerBullet.includes("improve") || lowerBullet.includes("performance") || lowerBullet.includes("speed"))
    return "Optimized";
  if (lowerBullet.includes("test") || lowerBullet.includes("bug") || lowerBullet.includes("quality"))
    return "Engineered";
  if (lowerBullet.includes("deploy") || lowerBullet.includes("release") || lowerBullet.includes("launch"))
    return "Deployed";
  if (lowerBullet.includes("design") || lowerBullet.includes("architect") || lowerBullet.includes("system"))
    return "Architected";
  if (lowerBullet.includes("data") || lowerBullet.includes("analy") || lowerBullet.includes("report"))
    return "Analyzed";
  if (lowerBullet.includes("automat") || lowerBullet.includes("script") || lowerBullet.includes("pipeline"))
    return "Automated";
  return "Implemented";
}

function rewriteBullet(bullet: string, verb: string): string {
  // Remove common weak openers
  const cleaned = bullet
    .replace(/^(responsible for|worked on|helped with|assisted in|was involved in|tasked with|duties included)\s*/i, "")
    .replace(/^(i |my )/i, "");
  return `${verb} ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
}

function addMetricsTooltip(bullet: string): string {
  return `${bullet} [Consider adding: "resulting in X% improvement" or "serving X users" or "reducing processing time by X%"]`;
}
