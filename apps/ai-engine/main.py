import uuid
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any

from config import settings
from schemas.request_schemas import ResumeAnalysisRequest, JobVectorizationRequest
from schemas.response_schemas import EvaluationResponse, ScoreBreakdownResponse
from services.pii_redactor import PIIRedactor
from services.parser_service import ResumeParserService
from services.vector_service import VectorService
from services.scoring_service import PythonScoringEngine

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="FastAPI Microservice for OmniScore AI — Providing NLP parsing, Qdrant vector skill matching, PII stripping, and Explainable AI scoring.",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Health"])
async def health_check() -> Dict[str, str]:
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "qdrant_url": settings.QDRANT_URL
    }

@app.post(
    f"{settings.API_V1_STR}/analyze-resume",
    response_model=EvaluationResponse,
    tags=["Analysis Engine"],
    status_code=status.HTTP_200_OK
)
async def analyze_resume(request: ResumeAnalysisRequest):
    if not request.resume_text or len(request.resume_text.strip()) < 30:
        raise HTTPException(
            status_code=400,
            detail="Resume text is too short to perform AI analysis."
        )

    # Step 1: PII Masking Guardrail
    redacted_text, pii_count = PIIRedactor.redact_text(request.resume_text)

    # Step 2: NLP Entity & Structure Parsing
    parsed_data = ResumeParserService.parse_resume_text(redacted_text)

    # Step 3: Skill Vector Similarity Matching
    job_skills = []
    if request.target_job_text:
        job_parsed = ResumeParserService.parse_resume_text(request.target_job_text)
        job_skills = job_parsed["skills"]

    similarity, matched_skills, missing_skills = VectorService.match_skills(
        parsed_data["skills"], job_skills
    )

    # Step 4: Compute Explainable 4-Pillar Composite Score
    score_breakdown = PythonScoringEngine.compute_score(
        parsed_data=parsed_data,
        similarity_score=similarity,
        matched_count=len(matched_skills),
        total_job_skills=len(job_skills),
        github_username=request.github_username
    )

    # Step 5: Optimization Suggestions Generator
    suggestions = []
    sug_idx = 1
    if not parsed_data["has_skills_section"]:
        suggestions.append({
            "id": f"opt-{sug_idx}",
            "category": "ats",
            "priority": "high",
            "title": "Add a Dedicated Technical Skills Section",
            "description": "ATS parsers look for a dedicated 'Skills' section header to index your capabilities.",
            "section": "Skills"
        })
        sug_idx += 1

    for missing in missing_skills:
        if missing["importance"] == "critical":
            suggestions.append({
                "id": f"opt-{sug_idx}",
                "category": "keywords",
                "priority": "high",
                "title": f"Add Missing Critical Skill: {missing['skill']}",
                "description": missing["suggestion"],
                "section": "Skills / Experience"
            })
            sug_idx += 1

    analysis_id = str(uuid.uuid4())

    return EvaluationResponse(
        analysis_id=analysis_id,
        composite_score=score_breakdown["overall"],
        grade=score_breakdown["grade"],
        extracted_skills=parsed_data["skills"],
        score_breakdown=score_breakdown,
        missing_skills=missing_skills,
        suggestions=suggestions,
        redacted_pii_count=pii_count
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
