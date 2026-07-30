import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatScore(score: number): string {
  return Math.round(score).toString();
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "var(--color-emerald)";
  if (score >= 60) return "var(--color-amber)";
  if (score >= 40) return "var(--color-orange)";
  return "var(--color-crimson)";
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Outstanding";
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 60) return "Good";
  if (score >= 50) return "Average";
  if (score >= 40) return "Below Average";
  return "Needs Improvement";
}

export function getScoreGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 40) return "D";
  return "F";
}

// Cosine similarity between two vectors
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// TF-IDF-like vectorization for skill matching
export function buildTermVector(terms: string[], vocabulary: string[]): number[] {
  const termCounts: Record<string, number> = {};
  terms.forEach((t) => {
    const lower = t.toLowerCase().trim();
    termCounts[lower] = (termCounts[lower] || 0) + 1;
  });
  return vocabulary.map((v) => termCounts[v.toLowerCase().trim()] || 0);
}

// Extract unique vocabulary from multiple term arrays
export function buildVocabulary(...termArrays: string[][]): string[] {
  const vocab = new Set<string>();
  termArrays.forEach((arr) =>
    arr.forEach((t) => vocab.add(t.toLowerCase().trim()))
  );
  return Array.from(vocab).sort();
}

// Delay helper
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Generate unique ID
export function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : 
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}
