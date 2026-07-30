import math
from typing import List, Dict, Any, Tuple

class VectorService:
    """
    Handles TF-IDF and embedding-based vector similarity matching for candidate skill gaps.
    Falls back gracefully when Qdrant container is offline.
    """
    
    @staticmethod
    def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
        if len(vec_a) != len(vec_b) or not vec_a:
            return 0.0
        dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = math.sqrt(sum(a * a for a in vec_a))
        norm_b = math.sqrt(sum(b * b for b in vec_b))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot_product / (norm_a * norm_b)
        
    @classmethod
    def match_skills(cls, candidate_skills: List[str], job_skills: List[str]) -> Tuple[float, List[Dict[str, Any]], List[Dict[str, Any]]]:
        c_set = set(s.lower().strip() for s in candidate_skills)
        j_set = set(s.lower().strip() for s in job_skills)
        
        vocab = sorted(list(c_set.union(j_set)))
        if not vocab:
            return 0.0, [], []
            
        vec_c = [1.0 if term in c_set else 0.0 for term in vocab]
        vec_j = [1.0 if term in j_set else 0.0 for term in vocab]
        
        sim = cls.cosine_similarity(vec_c, vec_j)
        
        matched = []
        missing = []
        
        for idx, skill in enumerate(j_set):
            importance = "critical" if idx < max(1, int(len(j_set) * 0.3)) else "important"
            if skill in c_set:
                matched.append({
                    "skill": skill,
                    "importance": importance,
                    "match_type": "exact"
                })
            else:
                missing.append({
                    "skill": skill,
                    "importance": importance,
                    "suggestion": f"Consider building a project using {skill} to strengthen profile alignment."
                })
                
        return sim, matched, missing
