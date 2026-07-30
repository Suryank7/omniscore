import os

class Settings:
    PROJECT_NAME: str = "OmniScore AI Engine"
    API_V1_STR: str = "/api/v1"
    
    # Qdrant Vector DB Settings
    QDRANT_HOST: str = os.getenv("QDRANT_HOST", "localhost")
    QDRANT_PORT: int = int(os.getenv("QDRANT_PORT", "6333"))
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    
    # Embedding Model Settings
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"
    VECTOR_SIZE: int = 384
    
    # LLM & API Keys (Optional)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")

settings = Settings()
