// OmniScore AI — Explainable Scoring Engine
// Implements the transparent weighted composite formula:
// OmniScore = (W_ats × S_ats) + (W_gap × S_gap) + (W_pow × S_pow) + (W_nlp × S_nlp)

import { type ParsedResume, ACTION_VERBS } from "./resume-parser";
import { type SkillMatchResult } from "./skill-matcher";

export interface ScoreBreakdown {
  overall: number;
  grade: string;
  label: string;
  pillars: {
    ats: PillarScore;
    skillMatch: PillarScore;
    proofOfWork: PillarScore;
    impact: PillarScore;
  };
  details: ScoreDetail[];
}

export interface PillarScore {
  score: number;
  weight: number;
  weightedScore: number;
  label: string;
  color: string;
  findings: Finding[];
}

export interface Finding {
  type: "positive" | "warning" | "negative";
  message: string;
  category: string;
}

export interface ScoreDetail {
  metric: string;
  value: string | number;
  status: "good" | "warning" | "poor";
  tip: string;
}

export interface GitHubMetrics {
  totalRepos: number;
  totalStars: number;
  totalCommits: number;
  languages: string[];
  topRepos: { name: string; stars: number; language: string }[];
  contributionStreak: number;
  hasReadme: boolean;
  avgCodeQuality: number;
}

// Weight constants from the spec
const WEIGHTS = {
  ATS: 0.20,
  SKILL_MATCH: 0.40,
  PROOF_OF_WORK: 0.25,
  IMPACT: 0.15,
};

// Required resume sections
const REQUIRED_SECTIONS = [
  "contact info",
  "summary",
  "experience",
  "education",
  "skills",
];

// Standard ATS-friendly fonts (for reference)
const ATS_SECTION_HEADERS = [
  "summary", "objective", "experience", "work experience",
  "education", "skills", "technical skills", "projects",
  "certifications", "awards",
];

export function calculateScore(
  resume: ParsedResume,
  skillMatch: SkillMatchResult | null,
  githubMetrics: GitHubMetrics | null
): ScoreBreakdown {
  const ats = calculateATSScore(resume);
  const gap = calculateSkillMatchScore(skillMatch);
  const pow = calculateProofOfWorkScore(resume, githubMetrics);
  const nlp = calculateImpactScore(resume);

  const overall = Math.round(
    ats.score * WEIGHTS.ATS +
    gap.score * WEIGHTS.SKILL_MATCH +
    pow.score * WEIGHTS.PROOF_OF_WORK +
    nlp.score * WEIGHTS.IMPACT
  );

  const grade = getGrade(overall);
  const label = getLabel(overall);

  // Build detail list
  const details: ScoreDetail[] = [
    {
      metric: "Word Count",
      value: resume.metadata.wordCount,
      status: resume.metadata.wordCount >= 300 && resume.metadata.wordCount <= 800 ? "good" : resume.metadata.wordCount > 800 ? "warning" : "poor",
      tip: resume.metadata.wordCount < 300 ? "Resume is too short. Add more details about your experience." : resume.metadata.wordCount > 800 ? "Resume might be too long. Aim for 1-2 pages." : "Good length for a professional resume.",
    },
    {
      metric: "Sections Found",
      value: resume.metadata.sectionCount,
      status: resume.metadata.sectionCount >= 4 ? "good" : resume.metadata.sectionCount >= 2 ? "warning" : "poor",
      tip: resume.metadata.sectionCount < 4 ? "Add more clearly labeled sections (Summary, Experience, Skills, Education)." : "Good section structure.",
    },
    {
      metric: "Skills Detected",
      value: resume.skills.length,
      status: resume.skills.length >= 8 ? "good" : resume.skills.length >= 4 ? "warning" : "poor",
      tip: resume.skills.length < 8 ? "List more technical skills. Include frameworks, tools, and methodologies." : "Good number of skills listed.",
    },
    {
      metric: "Skill Match",
      value: skillMatch ? `${Math.round(skillMatch.matchPercentage)}%` : "N/A",
      status: !skillMatch ? "warning" : skillMatch.matchPercentage >= 70 ? "good" : skillMatch.matchPercentage >= 40 ? "warning" : "poor",
      tip: !skillMatch ? "Upload a job description to see your skill match." : skillMatch.matchPercentage < 70 ? "Tailor your skills section to match the job requirements." : "Strong skill alignment with the target role.",
    },
    {
      metric: "Experience Entries",
      value: resume.experience.length,
      status: resume.experience.length >= 2 ? "good" : resume.experience.length === 1 ? "warning" : "poor",
      tip: resume.experience.length < 2 ? "Add more work experience entries with detailed bullet points." : "Good experience coverage.",
    },
    {
      metric: "Contact Information",
      value: resume.metadata.hasContactInfo ? "Complete" : "Missing",
      status: resume.metadata.hasContactInfo ? "good" : "poor",
      tip: resume.metadata.hasContactInfo ? "Contact info is present." : "Add email and phone number at the top of your resume.",
    },
  ];

  return {
    overall,
    grade,
    label,
    pillars: {
      ats: { ...ats, weight: WEIGHTS.ATS, weightedScore: Math.round(ats.score * WEIGHTS.ATS) },
      skillMatch: { ...gap, weight: WEIGHTS.SKILL_MATCH, weightedScore: Math.round(gap.score * WEIGHTS.SKILL_MATCH) },
      proofOfWork: { ...pow, weight: WEIGHTS.PROOF_OF_WORK, weightedScore: Math.round(pow.score * WEIGHTS.PROOF_OF_WORK) },
      impact: { ...nlp, weight: WEIGHTS.IMPACT, weightedScore: Math.round(nlp.score * WEIGHTS.IMPACT) },
    },
    details,
  };
}

function calculateATSScore(resume: ParsedResume): Omit<PillarScore, "weight" | "weightedScore"> {
  let score = 0;
  const findings: Finding[] = [];

  // Contact info present (20 pts)
  if (resume.metadata.hasContactInfo) {
    score += 20;
    findings.push({ type: "positive", message: "Contact information is present", category: "Contact" });
  } else {
    findings.push({ type: "negative", message: "Missing email or phone number", category: "Contact" });
  }

  if (resume.contactInfo.email) {
    score += 5;
    findings.push({ type: "positive", message: `Email found: ${resume.contactInfo.email}`, category: "Contact" });
  }

  if (resume.contactInfo.linkedin) {
    score += 5;
    findings.push({ type: "positive", message: "LinkedIn profile URL included", category: "Contact" });
  } else {
    findings.push({ type: "warning", message: "Consider adding your LinkedIn profile URL", category: "Contact" });
  }

  // Standard sections (25 pts)
  const sectionScore = Math.min(25, resume.metadata.sectionCount * 5);
  score += sectionScore;

  if (resume.metadata.hasSummary) {
    findings.push({ type: "positive", message: "Professional summary/objective section present", category: "Structure" });
  } else {
    findings.push({ type: "warning", message: "Add a professional summary at the top of your resume", category: "Structure" });
  }

  if (resume.metadata.hasExperience) {
    findings.push({ type: "positive", message: "Work experience section is well structured", category: "Structure" });
  } else {
    findings.push({ type: "negative", message: "Missing work experience section", category: "Structure" });
  }

  if (resume.metadata.hasSkillsSection) {
    findings.push({ type: "positive", message: "Skills section detected with technical keywords", category: "Structure" });
  } else {
    findings.push({ type: "negative", message: "No dedicated skills section found — ATS may miss your competencies", category: "Structure" });
  }

  if (resume.metadata.hasEducation) {
    findings.push({ type: "positive", message: "Education section present", category: "Structure" });
  } else {
    findings.push({ type: "warning", message: "Consider adding an education section", category: "Structure" });
  }

  // Word count / length appropriateness (20 pts)
  const wordCount = resume.metadata.wordCount;
  if (wordCount >= 300 && wordCount <= 900) {
    score += 20;
    findings.push({ type: "positive", message: `Resume length is optimal (${wordCount} words)`, category: "Formatting" });
  } else if (wordCount >= 200 && wordCount <= 1200) {
    score += 12;
    findings.push({ type: "warning", message: `Resume length is ${wordCount} words. Aim for 300-900 words.`, category: "Formatting" });
  } else {
    score += 5;
    findings.push({ type: "negative", message: `Resume is ${wordCount < 200 ? "too short" : "too long"} (${wordCount} words)`, category: "Formatting" });
  }

  // Has clearly defined section headers (15 pts)
  const sectionHeaderMatches = ATS_SECTION_HEADERS.filter((h) =>
    Object.keys(resume.sections).some((s) => s.includes(h))
  ).length;
  const headerScore = Math.min(15, sectionHeaderMatches * 3);
  score += headerScore;
  if (headerScore >= 12) {
    findings.push({ type: "positive", message: "Standard ATS-friendly section headers detected", category: "Formatting" });
  } else {
    findings.push({ type: "warning", message: "Use standard section headers (Summary, Experience, Education, Skills)", category: "Formatting" });
  }

  // Skills count (10 pts)
  if (resume.skills.length >= 8) {
    score += 10;
  } else if (resume.skills.length >= 4) {
    score += 6;
  } else {
    score += 2;
  }

  // GitHub/LinkedIn presence bonus (5 pts)
  if (resume.contactInfo.github) {
    score += 3;
    findings.push({ type: "positive", message: "GitHub profile link included", category: "Online Presence" });
  }

  score = Math.min(100, Math.max(0, score));

  return {
    score,
    label: "ATS Compatibility",
    color: getScoreColor(score),
    findings,
  };
}

function calculateSkillMatchScore(
  skillMatch: SkillMatchResult | null
): Omit<PillarScore, "weight" | "weightedScore"> {
  const findings: Finding[] = [];

  if (!skillMatch) {
    return {
      score: 50,
      label: "Skill Match",
      color: "#F59E0B",
      findings: [
        {
          type: "warning",
          message: "No job description provided. Upload a target job description for accurate skill matching.",
          category: "Matching",
        },
      ],
    };
  }

  // Base score from match percentage
  let score = Math.round(skillMatch.matchPercentage);

  // Bonus for semantic/contextual matches
  const semanticMatches = skillMatch.matchedSkills.filter((s) => s.matchType === "semantic").length;
  if (semanticMatches > 0) {
    score += Math.min(10, semanticMatches * 2);
    findings.push({
      type: "positive",
      message: `${semanticMatches} skills matched contextually (e.g., implied through related technologies)`,
      category: "Semantic Match",
    });
  }

  // Penalty for missing critical skills
  const missingCritical = skillMatch.missingSkills.filter((s) => s.importance === "critical");
  if (missingCritical.length > 0) {
    score -= missingCritical.length * 5;
    findings.push({
      type: "negative",
      message: `Missing ${missingCritical.length} critical skills: ${missingCritical.map((s) => s.skill).join(", ")}`,
      category: "Critical Gaps",
    });
  }

  // Detail matched skills
  const exactMatches = skillMatch.matchedSkills.filter((s) => s.matchType === "exact");
  if (exactMatches.length > 0) {
    findings.push({
      type: "positive",
      message: `${exactMatches.length} skills exactly match job requirements`,
      category: "Direct Match",
    });
  }

  // Missing important skills
  const missingImportant = skillMatch.missingSkills.filter((s) => s.importance === "important");
  if (missingImportant.length > 0) {
    findings.push({
      type: "warning",
      message: `${missingImportant.length} important skills not found: ${missingImportant.map((s) => s.skill).join(", ")}`,
      category: "Important Gaps",
    });
  }

  // Category breakdown insights
  skillMatch.categoryBreakdown.forEach((cat) => {
    if (cat.percentage === 100) {
      findings.push({
        type: "positive",
        message: `${cat.category}: All ${cat.total} required skills matched`,
        category: cat.category,
      });
    } else if (cat.percentage === 0) {
      findings.push({
        type: "negative",
        message: `${cat.category}: None of the ${cat.total} required skills found`,
        category: cat.category,
      });
    }
  });

  // Cosine similarity bonus
  if (skillMatch.overallSimilarity > 0.7) {
    score += 5;
    findings.push({
      type: "positive",
      message: `High semantic alignment (${(skillMatch.overallSimilarity * 100).toFixed(0)}% cosine similarity)`,
      category: "Vector Analysis",
    });
  }

  score = Math.min(100, Math.max(0, score));

  return {
    score,
    label: "Skill Match",
    color: getScoreColor(score),
    findings,
  };
}

function calculateProofOfWorkScore(
  resume: ParsedResume,
  github: GitHubMetrics | null
): Omit<PillarScore, "weight" | "weightedScore"> {
  let score = 0;
  const findings: Finding[] = [];

  // Projects section (30 pts max)
  if (resume.metadata.hasProjects) {
    const projectPoints = Math.min(30, resume.projects.length * 10);
    score += projectPoints;
    findings.push({
      type: "positive",
      message: `${resume.projects.length} project(s) listed on resume`,
      category: "Projects",
    });
  } else {
    findings.push({
      type: "warning",
      message: "No projects section found. Consider adding notable projects.",
      category: "Projects",
    });
  }

  // GitHub/Portfolio links on resume (10 pts)
  if (resume.contactInfo.github) {
    score += 10;
    findings.push({ type: "positive", message: "GitHub profile linked on resume", category: "Portfolio" });
  }
  if (resume.contactInfo.portfolio) {
    score += 5;
    findings.push({ type: "positive", message: "Portfolio website linked", category: "Portfolio" });
  }

  // GitHub metrics if available (55 pts max)
  if (github) {
    // Repos (15 pts)
    if (github.totalRepos >= 10) {
      score += 15;
      findings.push({ type: "positive", message: `${github.totalRepos} public repositories`, category: "GitHub" });
    } else if (github.totalRepos >= 5) {
      score += 10;
      findings.push({ type: "positive", message: `${github.totalRepos} public repositories`, category: "GitHub" });
    } else if (github.totalRepos > 0) {
      score += 5;
      findings.push({ type: "warning", message: `Only ${github.totalRepos} public repositories. Consider publishing more projects.`, category: "GitHub" });
    }

    // Stars (10 pts)
    if (github.totalStars >= 50) {
      score += 10;
      findings.push({ type: "positive", message: `${github.totalStars} total stars — strong community recognition`, category: "GitHub" });
    } else if (github.totalStars >= 10) {
      score += 6;
      findings.push({ type: "positive", message: `${github.totalStars} total stars`, category: "GitHub" });
    } else if (github.totalStars > 0) {
      score += 3;
    }

    // Commits (15 pts)
    if (github.totalCommits >= 500) {
      score += 15;
      findings.push({ type: "positive", message: `${github.totalCommits} total commits — excellent activity`, category: "GitHub" });
    } else if (github.totalCommits >= 100) {
      score += 10;
      findings.push({ type: "positive", message: `${github.totalCommits} total commits — good activity`, category: "GitHub" });
    } else if (github.totalCommits > 0) {
      score += 5;
      findings.push({ type: "warning", message: `${github.totalCommits} commits. Increase contribution frequency.`, category: "GitHub" });
    }

    // Language diversity (10 pts)
    if (github.languages.length >= 4) {
      score += 10;
      findings.push({ type: "positive", message: `Polyglot developer: ${github.languages.join(", ")}`, category: "GitHub" });
    } else if (github.languages.length >= 2) {
      score += 6;
    }

    // README quality (5 pts)
    if (github.hasReadme) {
      score += 5;
      findings.push({ type: "positive", message: "Profile README present", category: "GitHub" });
    }
  } else {
    // No GitHub data — base on resume content only
    score += 10; // Baseline
    findings.push({
      type: "warning",
      message: "Connect your GitHub account for a detailed proof-of-work analysis",
      category: "GitHub",
    });
  }

  // Certifications bonus
  if (resume.certifications.length > 0) {
    score += Math.min(10, resume.certifications.length * 5);
    findings.push({
      type: "positive",
      message: `${resume.certifications.length} certification(s) listed`,
      category: "Certifications",
    });
  }

  score = Math.min(100, Math.max(0, score));

  return {
    score,
    label: "Proof of Work",
    color: getScoreColor(score),
    findings,
  };
}

function calculateImpactScore(resume: ParsedResume): Omit<PillarScore, "weight" | "weightedScore"> {
  let score = 0;
  const findings: Finding[] = [];

  // Collect all bullet points from experience
  const allBullets = resume.experience.flatMap((exp) => exp.bullets);

  if (allBullets.length === 0) {
    return {
      score: 20,
      label: "Impact & Language",
      color: getScoreColor(20),
      findings: [
        { type: "negative", message: "No bullet points found in experience section", category: "Content" },
        { type: "warning", message: "Use bullet points to describe achievements and impact in each role", category: "Content" },
      ],
    };
  }

  // Action verbs analysis (30 pts max)
  let actionVerbCount = 0;
  allBullets.forEach((bullet) => {
    const firstWord = bullet.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "");
    if (ACTION_VERBS.includes(firstWord)) {
      actionVerbCount++;
    }
  });

  const actionVerbRatio = allBullets.length > 0 ? actionVerbCount / allBullets.length : 0;
  if (actionVerbRatio >= 0.7) {
    score += 30;
    findings.push({ type: "positive", message: `${Math.round(actionVerbRatio * 100)}% of bullet points start with strong action verbs`, category: "Action Verbs" });
  } else if (actionVerbRatio >= 0.4) {
    score += 20;
    findings.push({ type: "warning", message: `Only ${Math.round(actionVerbRatio * 100)}% of bullets use action verbs. Aim for 70%+`, category: "Action Verbs" });
  } else {
    score += 10;
    findings.push({ type: "negative", message: "Most bullets don't start with action verbs. Use words like 'Developed', 'Implemented', 'Optimized'", category: "Action Verbs" });
  }

  // Quantified achievements (30 pts max)
  const metricPattern = /\b(\d+[%xX]|\$[\d,.]+|\d+\+?\s*(users|clients|customers|projects|team|revenue|reduction|increase|improvement|faster|growth))\b/i;
  let quantifiedCount = 0;
  allBullets.forEach((bullet) => {
    if (metricPattern.test(bullet) || /\b\d{2,}\b/.test(bullet)) {
      quantifiedCount++;
    }
  });

  const quantifiedRatio = allBullets.length > 0 ? quantifiedCount / allBullets.length : 0;
  if (quantifiedRatio >= 0.5) {
    score += 30;
    findings.push({ type: "positive", message: `${quantifiedCount} bullet points include quantified metrics — excellent!`, category: "Metrics" });
  } else if (quantifiedRatio >= 0.2) {
    score += 18;
    findings.push({ type: "warning", message: `Only ${quantifiedCount} bullets have metrics. Quantify more achievements (e.g., "Reduced load time by 40%")`, category: "Metrics" });
  } else {
    score += 8;
    findings.push({ type: "negative", message: "Very few quantified achievements. Add numbers, percentages, and dollar amounts.", category: "Metrics" });
  }

  // Bullet point count quality (20 pts max)
  const avgBulletsPerRole = resume.experience.length > 0
    ? allBullets.length / resume.experience.length
    : 0;
  if (avgBulletsPerRole >= 3 && avgBulletsPerRole <= 6) {
    score += 20;
    findings.push({ type: "positive", message: `Average of ${avgBulletsPerRole.toFixed(1)} bullets per role — optimal`, category: "Detail" });
  } else if (avgBulletsPerRole >= 2) {
    score += 14;
    findings.push({ type: "warning", message: `Average of ${avgBulletsPerRole.toFixed(1)} bullets per role. Aim for 3-6.`, category: "Detail" });
  } else {
    score += 6;
    findings.push({ type: "negative", message: "Too few details per role. Expand your bullet points.", category: "Detail" });
  }

  // Summary quality (10 pts)
  if (resume.metadata.hasSummary && resume.summary.length > 50) {
    score += 10;
    findings.push({ type: "positive", message: "Professional summary provides good overview", category: "Summary" });
  } else if (resume.metadata.hasSummary) {
    score += 5;
    findings.push({ type: "warning", message: "Summary is too brief. Aim for 2-3 sentences highlighting your key strengths.", category: "Summary" });
  } else {
    findings.push({ type: "negative", message: "No professional summary found at top of resume", category: "Summary" });
  }

  // Bullet point length quality (10 pts)
  const avgBulletLength = allBullets.length > 0
    ? allBullets.reduce((sum, b) => sum + b.split(/\s+/).length, 0) / allBullets.length
    : 0;
  if (avgBulletLength >= 8 && avgBulletLength <= 25) {
    score += 10;
    findings.push({ type: "positive", message: "Bullet point length is well-calibrated", category: "Readability" });
  } else if (avgBulletLength > 25) {
    score += 5;
    findings.push({ type: "warning", message: "Some bullet points are too long. Keep each under 2 lines.", category: "Readability" });
  } else {
    score += 4;
    findings.push({ type: "warning", message: "Bullet points are too short. Add more context and detail.", category: "Readability" });
  }

  score = Math.min(100, Math.max(0, score));

  return {
    score,
    label: "Impact & Language",
    color: getScoreColor(score),
    findings,
  };
}

function getGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 40) return "D";
  return "F";
}

function getLabel(score: number): string {
  if (score >= 90) return "Outstanding";
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 60) return "Good";
  if (score >= 50) return "Average";
  if (score >= 40) return "Below Average";
  return "Needs Improvement";
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#F59E0B";
  if (score >= 40) return "#F97316";
  return "#EF4444";
}
