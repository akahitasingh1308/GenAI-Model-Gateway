from datetime import datetime
from app.business_rules import BusinessRules
from app.providers import ProviderFactory
from app.router import ModelRouter
from app.schemas import ChatRequest, ChatResponse, Explainability
from app.ollama_classifier import OllamaClassifier
from app.intent_planner import IntentPlanner
from app.response_builder import ResponseBuilder
from app.classifier import TaskClassifier
from app.config import ConfigLoader


def get_provider_name(model):

    mapping = {
        "mock_fast": "Fast Response Model",
        "mock_premium": "Reasoning Model",
        "mock_failure": "Fallback Model"
    }

    return mapping.get(model, model)

class GatewayService:

    def __init__(self):
        self.rules = BusinessRules()
        self.classifier = TaskClassifier()
        self.ollama_classifier = OllamaClassifier()
        self.intent_planner = IntentPlanner()
        self.response_builder = ResponseBuilder()
        self.router = ModelRouter()
        self.config = ConfigLoader()

        self.stats = {
            "total_requests": 0,
            "success": 0,
            "failed": 0
        }

    def handle_chat(
        self,
        request: ChatRequest,
        persist: bool = False,
        timestamp: str | None = None
    ):

        query = request.query
        trace_steps = []

        self.stats["total_requests"] += 1

        # Task Identification Pipeline
        task_type = self.rules.determine_task_type(request)
        classifier_used = "none"
        decision_source = "none"

        # Step 1 : Business Rules
        if task_type:
            classifier_used = "business_rules"
            decision_source = "business_rules"

            trace_steps.append({
                "step": "business_rules",
                "status": "Selected",
                "task_type": task_type,
                "reason": "Task identified using business rules"
            })

            trace_steps.append({
                "step": "task_classifier",
                "status": "Skipped",
                "reason": "Business rules already identified the task"
            })

            trace_steps.append({
                "step": "ollama_classifier",
                "status": "Skipped",
                "reason": "Task already identified by business rules"
            })
            
        else:
            trace_steps.append({
                "step": "business_rules",
                "status": "Rejected",
                "reason": "No business rule matched the query"
            })

            # Step 2 : ML Classifier

            result = self.classifier.classify(query)

            threshold = self.config.get_classifier_threshold()

            if (
                result["task"] is not None
                and result["confidence"] >= threshold
            ):
                
                task_type = result["task"]
                
                classifier_used = "task_classifier"
                decision_source = "task_classifier"

                trace_steps.append({
                    "step": "task_classifier",
                    "status": "Selected",
                    "task_type": task_type,
                    "confidence": result["confidence"],
                    "threshold": threshold,
                    "reason": "Classifier confidence exceeded threshold"
                })

                trace_steps.append({
                    "step": "ollama_classifier",
                    "status": "Skipped",
                    "reason": "Classifier confidently identified the task"
                })

            else:

                trace_steps.append({
                    "step": "task_classifier",
                    "status": "Rejected",
                    "prediction": result["task"],
                    "confidence": result["confidence"],
                    "threshold": threshold,
                    "reason": "Classifier confidence below threshold"
                })

                # Step 3 : Ollama
                task_type = self.ollama_classifier.classify(query)

                classifier_used = "ollama_classifier"
                decision_source = "ollama_classifier"

                trace_steps.append({
                    "step": "ollama_classifier",
                    "status": "Selected",
                    "task_type": task_type,
                    "reason": "Used as fallback after classifier rejection"
                })

        if not task_type:
            task_type = "short_qa"
            
            trace_steps.append({
                "step": "fallback_task",
                "task_type": task_type,
                "reason": "No task identified. Using default task."
            })

        # intent planning logic
        execution_plan = self.intent_planner.create_plan(
            query=query,
            task_type=task_type
        )

        trace_steps.append({
            "step": "intent_planner",
            "execution_plan": execution_plan
        })

        # routing logic
        forced_model = self.rules.determine_model(request)

        if forced_model:

            routing_plan = []

            for step in execution_plan:

                routing_plan.append({
                    "task": step["task"],
                    "model": forced_model,
                    "reason": "Forced Model Rule"
                })

            fallback_models = []
            decision_source = "forced_model_rule"
            forced_model_flag = True

        else:

            routing_plan, fallback_models = self.router.route(execution_plan)

            for step in routing_plan:
                if step["model"] == "mock_fast":
                    step["reason"] = "Fast response model selected"

                elif step["model"] == "mock_premium":
                    step["reason"] = "Reasoning model selected"
                    
                elif step["model"] == "mock_failure":
                    step["reason"] = "Fallback model selected"
                
                else:
                    step["reason"] = "Router decision"

            forced_model_flag = False

        trace_steps.append({
            "step": "router",
            "routing_plan": routing_plan,
            "fallback_models": fallback_models,
            "decision_source": decision_source
        })

        # provider execution logic
        responses = []
        status = "success"

        for step in routing_plan:

            model = step["model"]

            provider = ProviderFactory.get_provider(model)

            try:

                if provider:

                    output = provider.generate(query)

                    responses.append({
                        "task": step["task"],
                        "model": model,
                        "reason": step["reason"],
                        "response": output
                    })

                else:

                    responses.append({
                        "task": step["task"],
                        "model": model,
                        "response": "Provider unavailable"
                    })

                    status = "failed"

            except Exception as e:

                print(e)

                responses.append({
                    "task": step["task"],
                    "model": model,
                    "response": "Provider Error"
                })

                status = "error"

        if status == "success":
            self.stats["success"] += 1
        else:
            self.stats["failed"] += 1

        trace_steps.append({
            "step": "provider",
            "responses": responses,
            "status": status
        })

        provider_response = self.response_builder.build(responses)

        # metadata logic
        priority = self.rules.determine_priority(request)
        latency = self.rules.determine_latency(request)
        application = self.rules.determine_application(request)

        if timestamp is None:
            timestamp = datetime.now().isoformat()

        if persist:
            print("Saving request to database...")
        else:
            print("Persistence skipped.")

        execution_summary = []
        
        for item in routing_plan:
            execution_summary.append({
                "task": item["task"],
                "model": item["model"],
                "reason": item["reason"]
            })
            
        trace_steps.append({
            "step": "execution_summary",
            "tasks": execution_summary
        })
        
        providers = list({
            item["model"]
            for item in routing_plan
        })

        explainability = Explainability(
            classifier_used=classifier_used,
            forced_model=forced_model_flag,
            selected_model=", ".join(
                step["model"] for step in routing_plan
            ),
            provider=(
                get_provider_name(providers[0])
                if len(providers) == 1
                else "Multiple Providers"
            ),
            steps=trace_steps,
            decision_source=decision_source
        )

        return ChatResponse(
            user_id=request.user_id,
            application=application,
            query=query,
            response=provider_response,
            task_type=task_type,
            model_used=", ".join(
                step["model"] for step in routing_plan
            ),
            priority=priority.value,
            max_latency_ms=latency,
            timestamp=timestamp,
            status=status,
            explainability=explainability
        )

    