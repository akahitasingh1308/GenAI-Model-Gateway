import requests

class OllamaClassifier:

    def __init__(self):
        self.url = "http://localhost:11434/api/generate"
        self.model = "llama3.2:latest"

    def classify(self, query: str):

        prompt = f"""
You are a routing classifier for an AI gateway system.

Classify the query into ONLY ONE of these categories:

- code_generation
- sql_generation
- summarization
- classification
- short_qa
- reasoning
- data_extraction

Rules:
- Return ONLY the label
- No explanation
- No punctuation
- No extra text

Query:
{query}
"""

        response = requests.post(
            self.url,
            json={
                "model": self.model,
                "prompt": prompt,
                "stream": False
            }
        )

        result = response.json()["response"].strip().lower()

        return result
    
