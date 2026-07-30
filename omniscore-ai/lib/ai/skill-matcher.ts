// OmniScore AI — Skill Matcher Engine
// Performs TF-IDF cosine similarity matching between candidate skills and job requirements.
// Identifies skill gaps, partial matches, and provides importance-weighted analysis.

import { cosineSimilarity, buildTermVector, buildVocabulary } from "../utils";

export interface SkillMatchResult {
  overallSimilarity: number;
  matchedSkills: MatchedSkill[];
  missingSkills: MissingSkill[];
  extraSkills: string[];
  categoryBreakdown: CategoryBreakdown[];
  matchPercentage: number;
}

export interface MatchedSkill {
  skill: string;
  category: string;
  importance: "critical" | "important" | "nice-to-have";
  matchType: "exact" | "semantic" | "partial";
}

export interface MissingSkill {
  skill: string;
  category: string;
  importance: "critical" | "important" | "nice-to-have";
  suggestion: string;
}

export interface CategoryBreakdown {
  category: string;
  matched: number;
  total: number;
  percentage: number;
  skills: { name: string; matched: boolean }[];
}

// Skill category mappings
const SKILL_CATEGORIES: Record<string, string[]> = {
  "Programming Languages": [
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust",
    "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "dart", "sql",
  ],
  "Frontend Frameworks": [
    "react", "react.js", "reactjs", "next.js", "nextjs", "angular", "vue",
    "vue.js", "svelte", "nuxt", "gatsby", "remix", "astro",
  ],
  "Backend Frameworks": [
    "node.js", "nodejs", "express", "express.js", "fastapi", "django", "flask",
    "spring", "spring boot", "rails", "laravel", "asp.net", "nest.js", "nestjs",
    "koa", "fastify", "gin",
  ],
  "Databases": [
    "mongodb", "postgresql", "postgres", "mysql", "sqlite", "redis",
    "elasticsearch", "cassandra", "dynamodb", "firebase", "supabase",
    "neo4j", "qdrant", "pinecone",
  ],
  "Cloud & DevOps": [
    "aws", "amazon web services", "azure", "gcp", "google cloud", "docker",
    "kubernetes", "k8s", "terraform", "ansible", "jenkins", "github actions",
    "vercel", "netlify", "heroku", "linux", "nginx",
  ],
  "Data Science & ML": [
    "machine learning", "deep learning", "tensorflow", "pytorch", "keras",
    "scikit-learn", "pandas", "numpy", "nlp", "natural language processing",
    "computer vision", "spacy", "langchain", "openai", "llm", "hugging face",
    "transformers", "generative ai", "rag",
  ],
  "Data & BI Tools": [
    "tableau", "power bi", "looker", "grafana", "spark", "hadoop", "airflow",
    "kafka", "dbt", "snowflake", "bigquery", "redshift", "databricks", "etl",
  ],
  "Testing & QA": [
    "jest", "mocha", "cypress", "playwright", "selenium", "pytest", "vitest",
    "testing library",
  ],
  "Tools & Practices": [
    "git", "github", "jira", "agile", "scrum", "ci/cd", "tdd", "microservices",
    "rest api", "graphql", "websockets", "oauth", "jwt", "swagger", "postman",
  ],
  "Mobile Development": [
    "react native", "flutter", "ionic", "android", "ios", "swift ui",
  ],
};

// Semantic equivalence map — these skills imply each other
const SEMANTIC_EQUIVALENTS: Record<string, string[]> = {
  "react": ["react.js", "reactjs"],
  "react.js": ["react", "reactjs"],
  "node.js": ["nodejs"],
  "nodejs": ["node.js"],
  "next.js": ["nextjs"],
  "nextjs": ["next.js"],
  "express": ["express.js"],
  "express.js": ["express"],
  "nest.js": ["nestjs"],
  "nestjs": ["nest.js"],
  "vue": ["vue.js", "vuejs"],
  "vue.js": ["vue", "vuejs"],
  "postgresql": ["postgres"],
  "postgres": ["postgresql"],
  "aws": ["amazon web services"],
  "amazon web services": ["aws"],
  "kubernetes": ["k8s"],
  "k8s": ["kubernetes"],
  "gcp": ["google cloud"],
  "google cloud": ["gcp"],
  "rest api": ["restful", "rest apis"],
  "machine learning": ["ml"],
  "natural language processing": ["nlp"],
  "nlp": ["natural language processing"],
  "ci/cd": ["continuous integration", "continuous deployment"],
};

// Skill implication map — having one skill implies knowledge of related skill
const SKILL_IMPLICATIONS: Record<string, string[]> = {
  "react": ["javascript", "html", "css"],
  "next.js": ["react", "javascript", "node.js"],
  "nextjs": ["react", "javascript", "node.js"],
  "angular": ["typescript", "javascript", "html", "css"],
  "vue": ["javascript", "html", "css"],
  "fastapi": ["python"],
  "django": ["python"],
  "flask": ["python"],
  "express": ["node.js", "javascript"],
  "spring boot": ["java"],
  "rails": ["ruby"],
  "laravel": ["php"],
  "pytorch": ["python", "machine learning"],
  "tensorflow": ["python", "machine learning"],
  "keras": ["python", "deep learning"],
  "pandas": ["python"],
  "numpy": ["python"],
  "langchain": ["python", "llm"],
  "react native": ["react", "javascript"],
  "flutter": ["dart"],
  "mongoose": ["mongodb", "node.js"],
};

export function analyzeSkillGap(
  candidateSkills: string[],
  jobRequirements: string[]
): SkillMatchResult {
  const normalizedCandidate = candidateSkills.map((s) => s.toLowerCase().trim());
  const normalizedJob = jobRequirements.map((s) => s.toLowerCase().trim());

  // Build extended candidate skills with implications
  const extendedCandidate = new Set(normalizedCandidate);
  normalizedCandidate.forEach((skill) => {
    // Add semantic equivalents
    const equivalents = SEMANTIC_EQUIVALENTS[skill] || [];
    equivalents.forEach((eq) => extendedCandidate.add(eq));
    // Add implied skills
    const implied = SKILL_IMPLICATIONS[skill] || [];
    implied.forEach((imp) => extendedCandidate.add(imp));
  });

  // Match skills
  const matchedSkills: MatchedSkill[] = [];
  const missingSkills: MissingSkill[] = [];

  normalizedJob.forEach((jobSkill) => {
    const category = getSkillCategory(jobSkill);
    const importance = getSkillImportance(jobSkill, normalizedJob);

    if (normalizedCandidate.includes(jobSkill)) {
      matchedSkills.push({ skill: jobSkill, category, importance, matchType: "exact" });
    } else if (extendedCandidate.has(jobSkill)) {
      matchedSkills.push({ skill: jobSkill, category, importance, matchType: "semantic" });
    } else {
      // Check for partial matches
      const partialMatch = normalizedCandidate.find(
        (cs) => cs.includes(jobSkill) || jobSkill.includes(cs)
      );
      if (partialMatch) {
        matchedSkills.push({ skill: jobSkill, category, importance, matchType: "partial" });
      } else {
        missingSkills.push({
          skill: jobSkill,
          category,
          importance,
          suggestion: generateSkillSuggestion(jobSkill),
        });
      }
    }
  });

  // Extra skills (candidate has but job doesn't require)
  const extraSkills = normalizedCandidate.filter(
    (cs) => !normalizedJob.some(
      (js) => js === cs || (SEMANTIC_EQUIVALENTS[js] || []).includes(cs)
    )
  );

  // Category breakdown
  const categoryBreakdown = buildCategoryBreakdown(normalizedJob, matchedSkills);

  // TF-IDF cosine similarity
  const vocabulary = buildVocabulary(normalizedCandidate, normalizedJob);
  const candidateVector = buildTermVector(normalizedCandidate, vocabulary);
  const jobVector = buildTermVector(normalizedJob, vocabulary);
  const overallSimilarity = cosineSimilarity(candidateVector, jobVector);

  const matchPercentage = normalizedJob.length > 0
    ? (matchedSkills.length / normalizedJob.length) * 100
    : 0;

  return {
    overallSimilarity,
    matchedSkills,
    missingSkills,
    extraSkills,
    categoryBreakdown,
    matchPercentage,
  };
}

function getSkillCategory(skill: string): string {
  for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
    if (skills.includes(skill)) return category;
  }
  return "Other";
}

function getSkillImportance(
  skill: string,
  allJobSkills: string[]
): "critical" | "important" | "nice-to-have" {
  // First 30% of skills listed are critical, next 40% important, rest nice-to-have
  const index = allJobSkills.indexOf(skill);
  const totalSkills = allJobSkills.length;
  if (totalSkills === 0) return "nice-to-have";

  const position = index / totalSkills;
  if (position < 0.3) return "critical";
  if (position < 0.7) return "important";
  return "nice-to-have";
}

function generateSkillSuggestion(skill: string): string {
  const suggestions: Record<string, string> = {
    "python": "Add Python to your skills. Consider showcasing Python projects on GitHub.",
    "javascript": "JavaScript is fundamental. Highlight any web development experience.",
    "typescript": "TypeScript is increasingly required. Consider converting a JS project to TS.",
    "react": "React is highly in-demand. Build a portfolio project using React.",
    "node.js": "Node.js backend experience is valuable. Consider building a REST API project.",
    "aws": "AWS certifications (Cloud Practitioner, Solutions Architect) can strengthen your profile.",
    "docker": "Docker knowledge is essential for DevOps roles. Try containerizing your projects.",
    "kubernetes": "Kubernetes skills are premium. Consider K8s certifications or lab projects.",
    "machine learning": "ML experience is critical. Showcase projects on Kaggle or GitHub.",
    "sql": "SQL is foundational for most data roles. Highlight database query experience.",
    "git": "Git proficiency is expected. Ensure your GitHub shows regular commit activity.",
    "agile": "Agile/Scrum experience matters. Mention sprint-based team projects.",
    "ci/cd": "CI/CD pipeline experience is increasingly expected. Mention GitHub Actions or Jenkins.",
  };

  return suggestions[skill] ||
    `Consider adding ${skill} to your skillset. Online courses and hands-on projects can help demonstrate proficiency.`;
}

function buildCategoryBreakdown(
  jobSkills: string[],
  matchedSkills: MatchedSkill[]
): CategoryBreakdown[] {
  const categories = new Map<string, { matched: Set<string>; total: Set<string> }>();

  jobSkills.forEach((skill) => {
    const cat = getSkillCategory(skill);
    if (!categories.has(cat)) {
      categories.set(cat, { matched: new Set(), total: new Set() });
    }
    categories.get(cat)!.total.add(skill);
  });

  matchedSkills.forEach((ms) => {
    const cat = ms.category;
    if (categories.has(cat)) {
      categories.get(cat)!.matched.add(ms.skill);
    }
  });

  return Array.from(categories.entries()).map(([category, data]) => ({
    category,
    matched: data.matched.size,
    total: data.total.size,
    percentage: data.total.size > 0 ? (data.matched.size / data.total.size) * 100 : 0,
    skills: Array.from(data.total).map((name) => ({
      name,
      matched: data.matched.has(name),
    })),
  }));
}

// Parse job description text to extract required skills
export function extractJobSkills(jobDescText: string): string[] {
  const allSkills: string[] = [];
  const lowerText = jobDescText.toLowerCase();

  // Check against known tech skills
  const TECH_SKILLS_FLAT = Object.values(SKILL_CATEGORIES).flat();
  for (const skill of TECH_SKILLS_FLAT) {
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escapedSkill}\\b`, "i");
    if (regex.test(lowerText) && !allSkills.includes(skill)) {
      allSkills.push(skill);
    }
  }

  return allSkills;
}
