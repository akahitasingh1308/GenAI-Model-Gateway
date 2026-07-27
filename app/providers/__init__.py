from app.config import ConfigLoader
from app.providers.mock_fast import MockFastProvider
from app.providers.mock_premium import MockPremiumProvider
from app.providers.mock_failure import MockFailureProvider
from app.providers.ollama_adapter import OllamaProvider

class ProviderFactory:

    @staticmethod
    def get_provider(model_name):

        config = ConfigLoader()
        models = config.get_models()["models"]

        model_info = models.get(model_name)

        if model_info is None:
            return None

        provider = model_info["provider"]

        if provider == "mock":

            providers = {
                "mock_fast": MockFastProvider,
                "mock_premium": MockPremiumProvider,
                "mock_failure": MockFailureProvider,
            }

            provider_class = providers.get(model_name)

            if provider_class:
                return provider_class()

        elif provider == "ollama":

            return OllamaProvider(model_info["model_name"])

        return None


        