import re
from typing import Tuple

class PIIRedactor:
    """
    Guardrail service to strip Personally Identifiable Information (PII)
    from resume text before processing or sending to external LLM providers.
    """
    EMAIL_REGEX = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')
    PHONE_REGEX = re.compile(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}')
    SSN_REGEX = re.compile(r'\b\d{3}-\d{2}-\d{4}\b')

    @classmethod
    def redact_text(cls, text: str) -> Tuple[str, int]:
        redacted_count = 0
        
        # Redact emails
        emails = cls.EMAIL_REGEX.findall(text)
        redacted_count += len(emails)
        text = cls.EMAIL_REGEX.sub('[REDACTED_EMAIL]', text)
        
        # Redact phone numbers
        phones = cls.PHONE_REGEX.findall(text)
        redacted_count += len(phones)
        text = cls.PHONE_REGEX.sub('[REDACTED_PHONE]', text)
        
        # Redact SSNs
        ssns = cls.SSN_REGEX.findall(text)
        redacted_count += len(ssns)
        text = cls.SSN_REGEX.sub('[REDACTED_SSN]', text)
        
        return text, redacted_count
