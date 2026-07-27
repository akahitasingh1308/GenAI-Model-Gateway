from app.providers.base import BaseProvider

class MockFailureProvider(BaseProvider):

    def generate(self, prompt: str) -> str:
        raise Exception("Mock provider failed.")


        