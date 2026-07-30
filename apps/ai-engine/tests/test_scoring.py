import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.parser_service import ResumeParserService
from services.vector_service import VectorService
from services.scoring_service import PythonScoringEngine
from services.pii_redactor import PIIRedactor

def test_pii_redactor():
    sample_text = "John Doe, email: john.doe@example.com, phone: 555-123-4567"
    redacted, count = PIIRedactor.redact_text(sample_text)
    assert "[REDACTED_EMAIL]" in redacted
    assert "[REDACTED_PHONE]" in redacted
    assert count == 2

def test_parser_service():
    sample_cv = """
    John Doe
    Summary: Experienced Senior Full-Stack Engineer skilled in Python, React, and Node.js.
    Experience:
    - Developed scalable microservices using FastAPI and Docker, improving latency by 40%.
    - Built responsive web interfaces using Next.js and TypeScript serving 50k monthly active users.
    Skills: Python, JavaScript, React, Next.js, Node.js, FastAPI, Docker, PostgreSQL
    """
    result = ResumeParserService.parse_resume_text(sample_cv)
    assert "python" in result["skills"]
    assert "react" in result["skills"]
    assert "docker" in result["skills"]
    assert result["action_verb_count"] >= 2
    assert result["quantified_bullet_count"] >= 2

def test_vector_similarity():
    candidate_skills = ["python", "react", "fastapi", "docker"]
    job_skills = ["python", "react", "fastapi", "kubernetes", "aws"]
    similarity, matched, missing = VectorService.match_skills(candidate_skills, job_skills)
    assert similarity > 0.0
    assert len(matched) == 3
    assert len(missing) == 2

def test_scoring_engine():
    parsed = {
        "has_skills_section": True,
        "has_experience": True,
        "word_count": 450,
        "bullet_count": 6,
        "action_verb_count": 5,
        "quantified_bullet_count": 3
    }
    score_result = PythonScoringEngine.compute_score(
        parsed_data=parsed,
        similarity_score=0.8,
        matched_count=4,
        total_job_skills=5,
        github_username="octocat"
    )
    assert score_result["overall"] >= 80
    assert score_result["grade"] in ["A", "A+"]
