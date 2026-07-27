from app.providers.base import BaseProvider

class MockPremiumProvider(BaseProvider):

    def generate(self, prompt: str) -> str:

        prompt = prompt.lower()

        if "code" in prompt or "python" in prompt:
            return (
                "Mock Premium generated a Python solution:\n"
                "def hello_world():\n"
                "    print('Hello, World!')"
            )

        elif "sql" in prompt or "database" in prompt:
            return (
                "Mock Premium generated the SQL query:\n"
                "SELECT * FROM employees;"
            )

        elif "reason" in prompt or "why" in prompt:
            return (
                "Mock Premium reasoning: Based on the provided information, "
                "the most suitable solution has been selected after evaluating "
                "multiple possibilities."
            )

        else:
            return (
                "Mock Premium Provider processed your request with a detailed response."
            )




        