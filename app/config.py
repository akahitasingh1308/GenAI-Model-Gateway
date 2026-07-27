import yaml

class ConfigLoader:

    def __init__(self):

        with open("config/models.yaml", "r") as file:
            self.models = yaml.safe_load(file)

        with open("config/routing_rules.yaml", "r") as file:
            self.routing = yaml.safe_load(file)

        self.use_mock = True
    
    def is_mock_enabled(self):
        return self.use_mock
    
    def get_routing(self):
        return self.routing
    
    def get_models(self):
        return self.models
    
    def get_classifier_threshold(self):
        return self.routing.get(
            "classifier", {}
        ).get(
            "confidence_threshold",
            0.80
        )



