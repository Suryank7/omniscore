// OmniScore AI — In-Memory Data Store
// Provides a lightweight JSON-based persistence layer for analyses and job descriptions.
// No external database required — data persists in memory during the server session.

import { generateId } from "./utils";

export interface StoredAnalysis {
  id: string;
  createdAt: string;
  fileName: string;
  fileSize: number;
  rawText: string;
  parsedResume: unknown;
  skillMatch: unknown | null;
  scoreBreakdown: unknown;
  optimizations: unknown[];
  jobDescriptionId: string | null;
  githubUsername: string | null;
  githubMetrics: unknown | null;
}

export interface StoredJobDescription {
  id: string;
  createdAt: string;
  title: string;
  company: string;
  rawText: string;
  extractedSkills: string[];
}

// In-memory store (resets on server restart)
const analyses: Map<string, StoredAnalysis> = new Map();
const jobDescriptions: Map<string, StoredJobDescription> = new Map();

// Pre-seed with sample job descriptions
const SAMPLE_JOB_DESCRIPTIONS: Omit<StoredJobDescription, "id" | "createdAt">[] = [
  {
    title: "Senior Full-Stack Developer",
    company: "Tech Corp",
    rawText: `We're looking for a Senior Full-Stack Developer to join our team.

Requirements:
- 5+ years of experience with JavaScript/TypeScript
- Strong experience with React.js and Next.js
- Backend experience with Node.js and Express
- Database experience with PostgreSQL and MongoDB
- Experience with REST APIs and GraphQL
- Proficiency in Git and CI/CD pipelines
- Experience with Docker and Kubernetes
- AWS or GCP cloud services experience
- Familiarity with Agile/Scrum methodologies
- Strong problem-solving and communication skills

Nice to have:
- Experience with Redis and caching strategies
- Knowledge of microservices architecture
- Experience with Terraform
- Contributions to open-source projects`,
    extractedSkills: [
      "javascript", "typescript", "react", "next.js", "node.js", "express",
      "postgresql", "mongodb", "rest api", "graphql", "git", "ci/cd",
      "docker", "kubernetes", "aws", "agile", "scrum", "redis",
      "microservices", "terraform",
    ],
  },
  {
    title: "Data Scientist",
    company: "AI Solutions Inc",
    rawText: `Join our data science team to build cutting-edge ML models.

Requirements:
- Master's or PhD in Computer Science, Statistics, or related field
- 3+ years of Python programming experience
- Strong foundation in Machine Learning and Deep Learning
- Experience with TensorFlow or PyTorch
- Proficiency in Pandas, NumPy, and Scikit-learn
- SQL and database querying experience
- Experience with NLP or Computer Vision
- Knowledge of data visualization (Tableau, Power BI)
- Familiarity with cloud platforms (AWS, GCP)
- Experience with Git version control

Nice to have:
- Experience with LLMs and Generative AI
- Knowledge of MLOps and model deployment
- Experience with Spark or distributed computing
- Published research papers`,
    extractedSkills: [
      "python", "machine learning", "deep learning", "tensorflow", "pytorch",
      "pandas", "numpy", "scikit-learn", "sql", "nlp", "computer vision",
      "tableau", "power bi", "aws", "gcp", "git", "llm", "generative ai",
      "spark",
    ],
  },
  {
    title: "Frontend Engineer",
    company: "Design Studio",
    rawText: `We need a talented Frontend Engineer passionate about beautiful UIs.

Requirements:
- 3+ years of React.js experience
- Strong TypeScript skills
- Experience with Next.js or Gatsby
- CSS mastery (Tailwind CSS, Styled Components, SASS)
- Experience with state management (Redux, Zustand)
- Knowledge of testing frameworks (Jest, Cypress, Playwright)
- Experience with RESTful APIs and GraphQL
- Git proficiency
- Strong understanding of responsive design and accessibility (WCAG)
- Experience with Figma for design handoff

Nice to have:
- Experience with React Native for mobile
- Animation libraries (Framer Motion, GSAP)
- Performance optimization experience
- Experience with Storybook`,
    extractedSkills: [
      "react", "typescript", "next.js", "gatsby", "tailwindcss",
      "styled components", "sass", "css", "jest", "cypress", "playwright",
      "rest api", "graphql", "git", "figma", "react native",
      "html",
    ],
  },
  {
    title: "DevOps Engineer",
    company: "Cloud Dynamics",
    rawText: `We're hiring a DevOps Engineer to build and maintain our cloud infrastructure.

Requirements:
- 4+ years experience in DevOps/SRE roles
- Expert-level AWS (EC2, ECS, EKS, Lambda, S3, RDS)
- Strong Docker and Kubernetes experience
- Infrastructure as Code with Terraform or CloudFormation
- CI/CD pipeline management (GitHub Actions, Jenkins, GitLab CI)
- Linux system administration
- Monitoring and observability (Prometheus, Grafana, Datadog)
- Scripting with Python, Bash, or Go
- Database management (PostgreSQL, MySQL, Redis)
- Strong networking and security knowledge

Nice to have:
- Experience with service mesh (Istio)
- Chaos engineering experience
- Certifications (AWS Solutions Architect, CKA)`,
    extractedSkills: [
      "aws", "docker", "kubernetes", "terraform", "github actions",
      "jenkins", "linux", "python", "bash", "go",
      "postgresql", "mysql", "redis", "nginx", "ci/cd",
      "grafana",
    ],
  },
];

// Initialize with sample data
function seedData() {
  if (jobDescriptions.size === 0) {
    SAMPLE_JOB_DESCRIPTIONS.forEach((jd) => {
      const id = generateId();
      jobDescriptions.set(id, {
        id,
        createdAt: new Date().toISOString(),
        ...jd,
      });
    });
  }
}
seedData();

// === Analysis CRUD ===
export function saveAnalysis(data: Omit<StoredAnalysis, "id" | "createdAt">): StoredAnalysis {
  const analysis: StoredAnalysis = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...data,
  };
  analyses.set(analysis.id, analysis);
  return analysis;
}

export function getAnalysis(id: string): StoredAnalysis | null {
  return analyses.get(id) || null;
}

export function listAnalyses(): StoredAnalysis[] {
  return Array.from(analyses.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function deleteAnalysis(id: string): boolean {
  return analyses.delete(id);
}

// === Job Description CRUD ===
export function saveJobDescription(
  data: Omit<StoredJobDescription, "id" | "createdAt">
): StoredJobDescription {
  const jd: StoredJobDescription = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...data,
  };
  jobDescriptions.set(jd.id, jd);
  return jd;
}

export function getJobDescription(id: string): StoredJobDescription | null {
  return jobDescriptions.get(id) || null;
}

export function listJobDescriptions(): StoredJobDescription[] {
  return Array.from(jobDescriptions.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function deleteJobDescription(id: string): boolean {
  return jobDescriptions.delete(id);
}
