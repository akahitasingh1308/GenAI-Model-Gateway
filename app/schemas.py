from enum import Enum
from pydantic import BaseModel

class Priority(str, Enum):
    low = "low"
    normal = "normal"
    high = "high"

class TaskType(str, Enum):
    auto = "auto"
    summarization = "summarization"
    classification = "classification"
    short_qa = "short_qa"
    code_generation = "code_generation"
    sql_generation = "sql_generation"
    email_drafting = "email_drafting"
    data_extraction = "data_extraction"
    reasoning = "reasoning"

class ChatRequest(BaseModel):
    user_id: str
    application: str
    query: str
    priority: Priority = Priority.normal
    task_type: TaskType = TaskType.auto
    max_latency_ms: int = 5000
    force_model: str | None = None

class Explainability(BaseModel):
    classifier_used: str
    forced_model: bool
    selected_model: str | None
    provider: str
    steps: list[dict]
    decision_source: str

class ChatResponse(BaseModel):
    user_id: str
    application: str
    query: str
    response: str | None = None
    task_type: str
    model_used: str
    priority: str
    max_latency_ms: int
    timestamp: str
    status: str
    explainability: Explainability
































    