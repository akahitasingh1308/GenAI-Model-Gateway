import "../gateway.css";
import { getModelDisplayName } from "../utils/modelNames";
import { getTaskDisplayName } from "../utils/taskNames";

export default function GatewayFlow({ steps }) {
  const getStep = (name) =>
    steps?.find(step => step.step === name);

  const planner = getStep("intent_planner");

  const executionPlan =
    planner?.execution_plan || [];

  const task =
    executionPlan.length > 0
      ? getTaskDisplayName(executionPlan[0].task)
      : "-";

  const router = getStep("router");

  const sourceMap = {
    business_rules: "Business Rules",
    task_classifier: "Task Intelligence",
    ollama_classifier: "Ollama Routing",
    forced_model_rule: "Forced Model"
  };

  const source =
    sourceMap[router?.decision_source] || "-";

  const models = [
    ...new Set(
      (router?.routing_plan || [])
        .map(item => item.model)
        .filter(Boolean)
    )
  ];

  const routing =
    models.length > 0
      ? models
          .map(model => getModelDisplayName(model))
          .join(", ")
      : "-";

  const provider = getStep("provider");

  const providerStatus =
    provider?.status === "success"
      ? "Completed"
      : provider?.status || "-";

  return (
    <div className="flow-box">
      <h3>Execution Trace</h3>
      <div className="dashboard-card">
        <div className="activity-row">
          <span>Task</span>
          <strong>{task}</strong>
        </div>

        <div className="activity-row">
          <span>Source</span>
          <strong>{source}</strong>
        </div>

        <div className="activity-row">
          <span>Planning</span>
          <strong>
            {executionPlan.length}{" "}
            {executionPlan.length === 1 ? "Task" : "Tasks"}
          </strong>
        </div>

        <div className="activity-row">
          <span>Routing</span>
          <strong>{routing}</strong>
        </div>

        <div className="activity-row">
          <span>Provider</span>
          <strong>{routing}</strong>
        </div>

        <div className="activity-row">
          <span>Status</span>
          <strong>{providerStatus}</strong>
        </div>
      </div>
    </div>
  );
}
