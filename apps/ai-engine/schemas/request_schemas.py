from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ResumeAnalysisRequest(BaseModel):
    resume_text: str = Field(..., description="Raw text of candidate CV")
    target_job_text: Optional[str] = Field(None, description="Optional target job description text")
    github_username: Optional[str] = Field(None, description="Optional GitHub handle for proof of work")

class JobVectorizationRequest(BaseModel):
    job_id: str = Field(..., description="Unique job identifier")
    title: str = Field(..., description="Job title")
    company: Optional[str] = Field("", description="Company name")
    requirements_text: str = Field(..., description="Full text of job requirements")
