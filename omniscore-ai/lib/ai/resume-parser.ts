// OmniScore AI — Resume Parser
// Extracts structured data from PDF/DOCX text content.
// Works locally with regex-based NLP; optionally enhanced with OpenAI.

export interface ParsedResume {
  rawText: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  summary: string;
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: string[];
  projects: ProjectEntry[];
  languages: string[];
  sections: Record<string, string>;
  metadata: {
    wordCount: number;
    pageEstimate: number;
    hasContactInfo: boolean;
    hasSummary: boolean;
    hasSkillsSection: boolean;
    hasExperience: boolean;
    hasEducation: boolean;
    hasProjects: boolean;
    sectionCount: number;
  };
}

export interface ExperienceEntry {
  title: string;
  company: string;
  duration: string;
  bullets: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

export interface ProjectEntry {
  name: string;
  description: string;
  technologies: string[];
}

// Comprehensive tech skill dictionary for entity extraction
const TECH_SKILLS = [
  // Programming Languages
  "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust", "ruby",
  "php", "swift", "kotlin", "scala", "r", "matlab", "perl", "lua", "dart", "elixir",
  "haskell", "clojure", "objective-c", "assembly", "fortran", "cobol", "visual basic",
  "shell", "bash", "powershell", "sql", "nosql", "graphql",
  // Web Frameworks
  "react", "react.js", "reactjs", "next.js", "nextjs", "angular", "vue", "vue.js",
  "svelte", "nuxt", "gatsby", "remix", "astro", "ember", "backbone",
  // Backend Frameworks
  "node.js", "nodejs", "express", "express.js", "fastapi", "django", "flask",
  "spring", "spring boot", "rails", "ruby on rails", "laravel", "asp.net",
  "nest.js", "nestjs", "koa", "hapi", "fastify", "gin", "fiber", "echo",
  // Databases
  "mongodb", "postgresql", "postgres", "mysql", "sqlite", "redis", "elasticsearch",
  "cassandra", "dynamodb", "firebase", "firestore", "supabase", "couchdb",
  "neo4j", "mariadb", "oracle", "mssql", "sql server", "qdrant", "pinecone",
  "weaviate", "chromadb", "milvus",
  // Cloud & DevOps
  "aws", "amazon web services", "azure", "gcp", "google cloud", "docker",
  "kubernetes", "k8s", "terraform", "ansible", "jenkins", "github actions",
  "gitlab ci", "circleci", "travis ci", "vercel", "netlify", "heroku",
  "digitalocean", "cloudflare", "nginx", "apache", "linux", "ubuntu",
  // Data Science & ML
  "machine learning", "deep learning", "neural networks", "tensorflow",
  "pytorch", "keras", "scikit-learn", "pandas", "numpy", "scipy",
  "matplotlib", "seaborn", "plotly", "jupyter", "colab", "hugging face",
  "transformers", "nlp", "natural language processing", "computer vision",
  "opencv", "spacy", "nltk", "gensim", "langchain", "llamaindex",
  "openai", "gpt", "llm", "large language models", "rag", "fine-tuning",
  "bert", "word2vec", "stable diffusion", "generative ai",
  // Data Engineering & BI
  "spark", "hadoop", "airflow", "kafka", "rabbitmq", "celery",
  "tableau", "power bi", "looker", "metabase", "superset", "grafana",
  "dbt", "snowflake", "bigquery", "redshift", "databricks", "etl",
  "data pipeline", "data warehouse", "data lake",
  // Tools & Methodologies
  "git", "github", "gitlab", "bitbucket", "jira", "confluence",
  "agile", "scrum", "kanban", "ci/cd", "tdd", "bdd", "microservices",
  "rest api", "restful", "graphql", "grpc", "websockets", "oauth",
  "jwt", "api gateway", "swagger", "postman",
  // Mobile
  "react native", "flutter", "ionic", "xamarin", "android", "ios",
  "swift ui", "jetpack compose",
  // Testing
  "jest", "mocha", "chai", "cypress", "playwright", "selenium",
  "pytest", "unittest", "vitest", "testing library",
  // Design & Frontend Tools
  "figma", "sketch", "adobe xd", "photoshop", "illustrator",
  "tailwind", "tailwindcss", "bootstrap", "material ui", "chakra ui",
  "styled components", "sass", "less", "css", "html",
  // Concepts
  "data structures", "algorithms", "system design", "design patterns",
  "solid principles", "clean architecture", "domain driven design",
  "event driven", "serverless", "edge computing", "web3", "blockchain",
];

const SECTION_HEADERS = [
  "summary", "objective", "professional summary", "career objective",
  "about me", "profile", "overview",
  "experience", "work experience", "professional experience",
  "employment history", "work history", "career history",
  "education", "academic background", "qualifications",
  "skills", "technical skills", "core competencies", "competencies",
  "key skills", "areas of expertise", "technologies",
  "projects", "personal projects", "key projects", "notable projects",
  "certifications", "certificates", "licenses", "professional development",
  "awards", "honors", "achievements", "accomplishments",
  "publications", "research", "papers",
  "languages", "language proficiency",
  "volunteer", "volunteering", "community involvement",
  "interests", "hobbies", "activities",
  "references", "referees",
];

const ACTION_VERBS = [
  "achieved", "administered", "analyzed", "architected", "automated",
  "built", "collaborated", "configured", "created", "debugged",
  "delivered", "deployed", "designed", "developed", "documented",
  "engineered", "established", "evaluated", "executed", "generated",
  "implemented", "improved", "increased", "initiated", "integrated",
  "launched", "led", "managed", "mentored", "migrated",
  "monitored", "negotiated", "optimized", "orchestrated", "organized",
  "planned", "presented", "programmed", "proposed", "published",
  "reduced", "refactored", "resolved", "restructured", "reviewed",
  "scaled", "secured", "simplified", "spearheaded", "streamlined",
  "supervised", "tested", "trained", "transformed", "troubleshot",
  "upgraded", "utilized",
];

export function parseResumeText(text: string): ParsedResume {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const rawText = text;

  // Extract contact info
  const contactInfo = extractContactInfo(text);

  // Detect and extract sections
  const sections = extractSections(lines);

  // Extract skills
  const skills = extractSkills(text, sections["skills"] || "");

  // Extract experience
  const experience = extractExperience(sections["experience"] || sections["work experience"] || "");

  // Extract education
  const education = extractEducation(sections["education"] || "");

  // Extract certifications
  const certifications = extractCertifications(sections["certifications"] || "");

  // Extract projects
  const projects = extractProjects(sections["projects"] || "");

  // Extract summary
  const summary = sections["summary"] || sections["objective"] || sections["professional summary"] || sections["about me"] || sections["profile"] || "";

  // Extract languages
  const languages = extractLanguages(sections["languages"] || "");

  // Build metadata
  const wordCount = text.split(/\s+/).length;
  const metadata = {
    wordCount,
    pageEstimate: Math.max(1, Math.ceil(wordCount / 500)),
    hasContactInfo: !!(contactInfo.email || contactInfo.phone),
    hasSummary: summary.length > 20,
    hasSkillsSection: skills.length > 0,
    hasExperience: experience.length > 0,
    hasEducation: education.length > 0,
    hasProjects: projects.length > 0,
    sectionCount: Object.keys(sections).length,
  };

  return {
    rawText,
    contactInfo,
    summary,
    skills,
    experience,
    education,
    certifications,
    projects,
    languages,
    sections,
    metadata,
  };
}

function extractContactInfo(text: string) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const linkedinRegex = /(?:linkedin\.com\/in\/[\w-]+|linkedin\.com\/[\w-]+)/i;
  const githubRegex = /(?:github\.com\/[\w-]+)/i;
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?[\w-]+\.[\w.]+(?:\/[\w-]*)?/gi;

  const email = text.match(emailRegex)?.[0] || "";
  const phone = text.match(phoneRegex)?.[0] || "";
  const linkedin = text.match(linkedinRegex)?.[0] || "";
  const github = text.match(githubRegex)?.[0] || "";

  // Guess name from first non-empty line (heuristic)
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  let name = "";
  for (const line of lines.slice(0, 5)) {
    // Skip lines that look like contact info
    if (line.includes("@") || line.match(phoneRegex) || line.length > 80) continue;
    if (line.match(/^[A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)+$/)) {
      name = line;
      break;
    }
  }
  if (!name && lines.length > 0) {
    name = lines[0].length < 60 ? lines[0] : "";
  }

  // Location (city, state pattern)
  const locationRegex = /([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}(?:\s+\d{5})?)/;
  const location = text.match(locationRegex)?.[0] || "";

  // Portfolio (any URL that's not LinkedIn or GitHub)
  const allUrls = text.match(urlRegex) || [];
  const portfolio = allUrls.find(
    (u) =>
      !u.includes("linkedin") &&
      !u.includes("github") &&
      !u.includes("@") &&
      u.includes(".")
  ) || "";

  return { name, email, phone, location, linkedin, github, portfolio };
}

function extractSections(lines: string[]): Record<string, string> {
  const sections: Record<string, string> = {};
  let currentSection = "";
  let currentContent: string[] = [];

  for (const line of lines) {
    const lowerLine = line.toLowerCase().replace(/[:\-_|#*]/g, "").trim();
    const matchedHeader = SECTION_HEADERS.find(
      (h) => lowerLine === h || lowerLine.startsWith(h + " ")
    );

    if (matchedHeader && line.length < 60) {
      if (currentSection) {
        sections[currentSection] = currentContent.join("\n");
      }
      currentSection = matchedHeader;
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  if (currentSection) {
    sections[currentSection] = currentContent.join("\n");
  }

  return sections;
}

function extractSkills(fullText: string, skillsSection: string): string[] {
  const foundSkills = new Set<string>();
  const searchText = (fullText + " " + skillsSection).toLowerCase();

  for (const skill of TECH_SKILLS) {
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escapedSkill}\\b`, "i");
    if (regex.test(searchText)) {
      foundSkills.add(skill);
    }
  }

  // Also extract from comma/pipe separated skills section
  if (skillsSection) {
    const extraSkills = skillsSection
      .split(/[,|•·▪■►●◆\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1 && s.length < 40);
    extraSkills.forEach((s) => foundSkills.add(s.toLowerCase()));
  }

  return Array.from(foundSkills);
}

function extractExperience(section: string): ExperienceEntry[] {
  if (!section.trim()) return [];

  const entries: ExperienceEntry[] = [];
  const lines = section.split("\n").filter((l) => l.trim());

  let current: Partial<ExperienceEntry> | null = null;
  let bullets: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect date patterns to identify role headers
    const datePattern = /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s*\d{0,4}\s*[-–—to]+\s*(?:present|current|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|\d{4})/i;
    const yearPattern = /\b(20\d{2}|19\d{2})\s*[-–—to]+\s*(present|current|20\d{2}|19\d{2})\b/i;

    if (datePattern.test(trimmed) || yearPattern.test(trimmed)) {
      if (current) {
        entries.push({ ...current, bullets } as ExperienceEntry);
      }
      const durationMatch = trimmed.match(datePattern) || trimmed.match(yearPattern);
      const duration = durationMatch ? durationMatch[0] : "";
      const titlePart = trimmed.replace(datePattern, "").replace(yearPattern, "").replace(/[|,\-–—]/g, " ").trim();

      const parts = titlePart.split(/\s{2,}|[|@]/);
      current = {
        title: parts[0]?.trim() || trimmed,
        company: parts[1]?.trim() || "",
        duration: duration,
      };
      bullets = [];
    } else if (
      (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("●") || trimmed.startsWith("▪") || trimmed.startsWith("*")) &&
      current
    ) {
      bullets.push(trimmed.replace(/^[•\-●▪*]\s*/, ""));
    } else if (current && trimmed.length > 10 && !datePattern.test(trimmed)) {
      // Could be a bullet without marker or continuation
      if (bullets.length > 0) {
        bullets.push(trimmed);
      } else if (!current.company) {
        current.company = trimmed;
      }
    }
  }

  if (current) {
    entries.push({ ...current, bullets } as ExperienceEntry);
  }

  // If no structured entries found, create a generic one
  if (entries.length === 0 && section.trim().length > 20) {
    entries.push({
      title: "Professional Experience",
      company: "",
      duration: "",
      bullets: section.split("\n").filter((l) => l.trim().length > 10).map((l) => l.trim()),
    });
  }

  return entries;
}

function extractEducation(section: string): EducationEntry[] {
  if (!section.trim()) return [];

  const entries: EducationEntry[] = [];
  const lines = section.split("\n").filter((l) => l.trim());

  const degreePatterns = /\b(bachelor|master|phd|ph\.d|doctorate|associate|b\.s\.|b\.a\.|m\.s\.|m\.a\.|mba|bsc|msc|b\.tech|m\.tech|b\.e\.|m\.e\.)\b/i;

  let currentEntry: Partial<EducationEntry> | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (degreePatterns.test(trimmed) || trimmed.match(/university|college|institute|school/i)) {
      if (currentEntry) {
        entries.push(currentEntry as EducationEntry);
      }
      const yearMatch = trimmed.match(/\b(20\d{2}|19\d{2})\b/);
      const gpaMatch = trimmed.match(/(?:gpa|cgpa)[:\s]*([0-9.]+)/i);
      currentEntry = {
        degree: trimmed.replace(/\b(20\d{2}|19\d{2})\b/g, "").trim(),
        institution: "",
        year: yearMatch?.[0] || "",
        gpa: gpaMatch?.[1] || undefined,
      };
    } else if (currentEntry && !currentEntry.institution && trimmed.length > 5) {
      currentEntry.institution = trimmed;
    }
  }

  if (currentEntry) {
    entries.push(currentEntry as EducationEntry);
  }

  if (entries.length === 0 && section.trim().length > 10) {
    entries.push({
      degree: section.trim().split("\n")[0],
      institution: section.trim().split("\n")[1] || "",
      year: section.match(/\b(20\d{2}|19\d{2})\b/)?.[0] || "",
    });
  }

  return entries;
}

function extractCertifications(section: string): string[] {
  if (!section.trim()) return [];
  return section
    .split("\n")
    .map((l) => l.replace(/^[•\-●▪*]\s*/, "").trim())
    .filter((l) => l.length > 3);
}

function extractProjects(section: string): ProjectEntry[] {
  if (!section.trim()) return [];

  const lines = section.split("\n").filter((l) => l.trim());
  const projects: ProjectEntry[] = [];
  let current: Partial<ProjectEntry> | null = null;
  let descLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (
      (trimmed.length < 80 && !trimmed.startsWith("•") && !trimmed.startsWith("-")) ||
      trimmed.match(/^[A-Z]/)
    ) {
      if (current) {
        const desc = descLines.join(" ");
        const techMatches: string[] = [];
        TECH_SKILLS.forEach((skill) => {
          if (desc.toLowerCase().includes(skill)) techMatches.push(skill);
        });
        projects.push({
          ...current,
          description: desc,
          technologies: techMatches,
        } as ProjectEntry);
      }
      current = { name: trimmed };
      descLines = [];
    } else {
      descLines.push(trimmed.replace(/^[•\-●▪*]\s*/, ""));
    }
  }

  if (current) {
    const desc = descLines.join(" ");
    const techMatches: string[] = [];
    TECH_SKILLS.forEach((skill) => {
      if (desc.toLowerCase().includes(skill)) techMatches.push(skill);
    });
    projects.push({
      ...current,
      description: desc,
      technologies: techMatches,
    } as ProjectEntry);
  }

  return projects;
}

function extractLanguages(section: string): string[] {
  if (!section.trim()) return [];
  return section
    .split(/[,\n•\-●|]/)
    .map((l) => l.trim())
    .filter((l) => l.length > 1 && l.length < 30);
}

// Export for use in scoring
export { ACTION_VERBS, TECH_SKILLS, SECTION_HEADERS };
