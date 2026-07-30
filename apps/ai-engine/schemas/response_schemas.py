from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class FindingItem(BaseModel):
    type: str
    message: str
    category: str

class PillarScoreResponse(BaseModel):
    score: float
    weight: float
    weighted_score: float
    label: str
    color: str
    findings: List[FindingItem]

class ScoreBreakdownResponse(BaseModel):
    overall: int
    grade: str
    label: str
    pillars: Dict[str, PillarScoreResponse]

class OptimizationSuggestionResponse(BaseModel):
    id: str
    category: str
    priority: str
    title: str
    description: str
    original: Optional[str] = None
    suggested: Optional[str] = None
    section: str

class EvaluationResponse(BaseModel):
    analysis_id: str
    composite_score: int
    grade: str
    extracted_skills: List[str]
    score_breakdown: ScoreBreakdownResponse
    missing_skills: List[Dict[str, Any]]
    suggestions: List[OptimizationSuggestionResponse]
    redacted_pii_count: int
