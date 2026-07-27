from abc import ABC, abstractmethod

class ProviderError(Exception):
    pass

class BaseProvider(ABC):

    @abstractmethod
    def generate(self, prompt: str) -> str:
        pass

    