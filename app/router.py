from app.config import ConfigLoader

class ModelRouter:

    def __init__(self):
        config = ConfigLoader()
        
        routing_config = config.get_routing()
        
        self.routing_map = routing_config["routing"]
        self.fallback_models = routing_config["fallback"]
        
        print("Routing loaded:", self.routing_map)

    def route(self, plan):

        routing_plan = []

        for step in plan:

            task = step["task"]

            rule = self.routing_map.get(task)

            if rule:
                primary_model = rule["primary"]
            else:
                print(f"Unknown task: {task}, using fallback model.")
                primary_model = "mock_fast"

            routing_plan.append({
                "task": task,
                "model": primary_model
            })

        return routing_plan, self.fallback_models






            