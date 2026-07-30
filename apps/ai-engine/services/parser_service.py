import re
from typing import List, Dict, Any, Set

# Comprehensive Tech Skills Registry
TECH_SKILLS = {
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust", "ruby",
    "php", "swift", "kotlin", "scala", "r", "sql", "nosql", "graphql",
    "react", "react.js", "next.js", "angular", "vue", "vue.js", "svelte", "nuxt",
    "node.js", "express", "fastapi", "django", "flask", "spring boot", "rails",
    "mongodb", "postgresql", "mysql", "sqlite", "redis", "elasticsearch", "qdrant",
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible", "jenkins",
    "github actions", "ci/cd", "linux", "nginx", "machine learning", "deep learning",
    "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "nlp", "spacy",
    "langchain", "openai", "llm", "rag", "tableau", "power bi", "grafana", "dbt",
    "snowflake", "bigquery", "spark", "kafka", "jest", "cypress", "playwright", "pytest",
    "git", "github", "jira", "agile", "scrum", "microservices", "rest api", "oauth"
}

ACTION_VERBS = {
    "achieved", "administered", "analyzed", "architected", "automated", "built",
    "collaborated", "configured", "created", "debugged", "delivered", "deployed",
    "designed", "developed", "documented", "engineered", "established", "evaluated",
    "executed", "generated", "implemented", "improved", "increased", "initiated",
    "integrated", "launched", "led", "managed", "mentored", "migrated", "monitored",
    "optimized", "orchestrated", "organized", "planned", "programmed", "proposed",
    "reduced", "refactored", "resolved", "scaled", "secured", "spearheaded",
    "streamlined", "supervised", "tested", "trained", "transformed", "utilized"
}

class ResumeParserService:
    @staticmethod
    def parse_resume_text(text: str) -> Dict[str, Any]:
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        lower_text = text.lower()
        
        # Skill extraction via entity matching
        found_skills: Set[str] = set()
        for skill in TECH_SKILLS:
            escaped = re.escape(skill)
            if re.search(rf'\b{escaped}\b', lower_text):
                found_skills.add(skill)
                
        # Bullet points extraction
        bullets = [
            line for line in lines
            if line.startswith(("•", "-", "●", "*", "1.", "2.", "3.")) or
            (len(line) > 30 and not any(line.lower().startswith(h) for h in ["summary:", "skills:", "education:", "contact:"]))
        ]
        
        # Action verb density
        action_verb_count = 0
        for b in bullets:
            clean_line = re.sub(r'^[\s•\-*●\d.]+', '', b).strip()
            words = clean_line.split()
            first_word = re.sub(r'[^a-zA-Z]', '', words[0].lower()) if words else ""
            if first_word in ACTION_VERBS:
                action_verb_count += 1
                
        # Quantified metrics search (percentages, numbers, users, etc.)
        metric_pattern = re.compile(r'(\d+[%xX]|\$[\d,.]+|\b\d+\s*k\b|\b\d+\s*m\b|\d+\+?\s*(users|clients|projects|reduction|increase|improvement|latency|time)?)', re.IGNORECASE)
        quantified_bullets = [b for b in bullets if metric_pattern.search(b)]
        
        return {
            "raw_text": text,
            "skills": sorted(list(found_skills)),
            "word_count": len(text.split()),
            "bullet_count": len(bullets),
            "action_verb_count": action_verb_count,
            "quantified_bullet_count": len(quantified_bullets),
            "has_summary": bool(re.search(r'\b(summary|profile|objective|overview)\b', lower_text)),
            "has_experience": bool(re.search(r'\b(experience|history|employment)\b', lower_text)),
            "has_education": bool(re.search(r'\b(education|university|degree|academic)\b', lower_text)),
            "has_skills_section": bool(re.search(r'\b(skills|technologies|competencies)\b', lower_text))
        }
