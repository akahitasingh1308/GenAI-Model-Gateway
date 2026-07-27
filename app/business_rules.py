from app.schemas import ChatRequest

class BusinessRules:

    def determine_task_type(self, request: ChatRequest):

        query = request.query.lower()

        # SQL
        if "sql" in query:
            return "sql_generation"

        # Summarization
        if "summarize" in query or "summary" in query:
            return "summarization"

        # Data Extraction
        if "extract" in query:
            return "data_extraction"

        # Everything else goes to Ollama
        return None

    def determine_model(self, request: ChatRequest):
        return request.force_model

    def determine_priority(self, request: ChatRequest):
        return request.priority

    def determine_latency(self, request: ChatRequest):
        return request.max_latency_ms

    def determine_application(self, request: ChatRequest):
        return request.application


















    