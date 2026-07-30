from typing import Dict, Any, List

class PythonScoringEngine:
    """
    Python implementation of OmniScore AI's 4-pillar explainable scoring algorithm.
    Formula: Final Score = (ATS * 0.20) + (SkillMatch * 0.40) + (ProofOfWork * 0.25) + (Impact * 0.15)
    """
    WEIGHT_ATS = 0.20
    WEIGHT_SKILL_MATCH = 0.40
    WEIGHT_PROOF_OF_WORK = 0.25
    WEIGHT_IMPACT = 0.15

    @classmethod
    def compute_score(
        cls,
        parsed_data: Dict[str, Any],
        similarity_score: float,
        matched_count: int,
        total_job_skills: int,
        github_username: str = None
    ) -> Dict[str, Any]:
        # Pillar 1: ATS
        ats_score = 40.0
        ats_findings = []
        if parsed_data.get("has_skills_section"):
            ats_score += 20.0
            ats_findings.append({"type": "positive", "message": "Dedicated Skills section detected", "category": "Structure"})
        if parsed_data.get("has_experience"):
            ats_score += 20.0
            ats_findings.append({"type": "positive", "message": "Work Experience section detected", "category": "Structure"})
        if parsed_data.get("word_count", 0) >= 300:
            ats_score += 20.0
            ats_findings.append({"type": "positive", "message": "Resume length is optimal (>300 words)", "category": "Formatting"})
        ats_score = min(100.0, ats_score)

        # Pillar 2: Skill Match
        if total_job_skills > 0:
            match_pct = (matched_count / total_job_skills) * 100.0
            skill_score = min(100.0, match_pct + (similarity_score * 10.0))
        else:
            skill_score = 50.0
        gap_findings = [
            {"type": "positive" if skill_score >= 70 else "warning", "message": f"{matched_count}/{total_job_skills} skills matched", "category": "Skill Gap"}
        ]

        # Pillar 3: Proof of Work
        pow_score = 50.0
        pow_findings = []
        if github_username:
            pow_score += 35.0
            pow_findings.append({"type": "positive", "message": f"GitHub profile linked: @{github_username}", "category": "Portfolio"})
        else:
            pow_findings.append({"type": "warning", "message": "Connect GitHub for detailed repo proof-of-work scoring", "category": "Portfolio"})
        pow_score = min(100.0, pow_score)

        # Pillar 4: Impact & Language
        bullets = max(1, parsed_data.get("bullet_count", 1))
        verbs = parsed_data.get("action_verb_count", 0)
        quantified = parsed_data.get("quantified_bullet_count", 0)
        
        impact_score = min(100.0, (verbs / bullets * 50.0) + (quantified / bullets * 50.0) + 30.0)
        impact_findings = [
            {"type": "positive" if verbs > 0 else "negative", "message": f"{verbs} bullets start with action verbs", "category": "Action Verbs"},
            {"type": "positive" if quantified > 0 else "warning", "message": f"{quantified} bullets include quantified metrics", "category": "Metrics"}
        ]

        # Composite Score
        overall = int(round(
            (ats_score * cls.WEIGHT_ATS) +
            (skill_score * cls.WEIGHT_SKILL_MATCH) +
            (pow_score * cls.WEIGHT_PROOF_OF_WORK) +
            (impact_score * cls.WEIGHT_IMPACT)
        ))

        grade = "A+" if overall >= 90 else "A" if overall >= 80 else "B+" if overall >= 70 else "B" if overall >= 60 else "C" if overall >= 50 else "D"
        label = "Outstanding" if overall >= 90 else "Excellent" if overall >= 80 else "Strong" if overall >= 70 else "Good" if overall >= 60 else "Average"

        return {
            "overall": overall,
            "grade": grade,
            "label": label,
            "pillars": {
                "ats": {"score": ats_score, "weight": cls.WEIGHT_ATS, "weighted_score": ats_score * cls.WEIGHT_ATS, "label": "ATS Compatibility", "color": "#06B6D4", "findings": ats_findings},
                "skillMatch": {"score": skill_score, "weight": cls.WEIGHT_SKILL_MATCH, "weighted_score": skill_score * cls.WEIGHT_SKILL_MATCH, "label": "Skill Match", "color": "#8B5CF6", "findings": gap_findings},
                "proofOfWork": {"score": pow_score, "weight": cls.WEIGHT_PROOF_OF_WORK, "weighted_score": pow_score * cls.WEIGHT_PROOF_OF_WORK, "label": "Proof of Work", "color": "#F59E0B", "findings": pow_findings},
                "impact": {"score": impact_score, "weight": cls.WEIGHT_IMPACT, "weighted_score": impact_score * cls.WEIGHT_IMPACT, "label": "Impact & Language", "color": "#EC4899", "findings": impact_findings}
            }
        }
