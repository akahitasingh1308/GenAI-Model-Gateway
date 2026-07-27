import "../gateway.css";
import { getModelDisplayName } from "../utils/modelNames";
import { getTaskDisplayName } from "../utils/taskNames";

export default function GatewayDecision({ latest }) {
  const getStep = (name) =>
    latest?.explainability?.steps?.find(
      step => step.step === name
    );

  const businessRule = getStep("business_rules");
  const classifier = getStep("task_classifier");
  const ollama = getStep("ollama_classifier");

  const executionPlan =
    latest?.explainability?.steps
      ?.find(
        step => step.step === "intent_planner"
      )
      ?.execution_plan || [];

  const tasks = executionPlan.map(
    item => getTaskDisplayName(item.task)
  );

  const models = [
    ...new Set(
      String(latest?.model_used || "")
        .split(",")
        .map(model => model.trim())
        .filter(Boolean)
    )
  ];

  return (
    <div className="gateway-decision">
      <div className="decision-section">
        <h4>Request Analysis</h4>
        {[
          {
            title: "Business Rules",
            data: businessRule
          },
          {
            title: "Task Classifier",
            data: classifier
          },
          {
            title: "Ollama",
            data: ollama
          }
        ].map((item, index) => (
          <div
            key={index}
            className="decision-stage"
          >

            <div className="stage-header">
              <span className="decision-title">
                {item.title}
              </span>
              <span
                className={`stage-status ${(item.data?.status || "").toLowerCase()}`}
              >
                {item.data?.status || "-"}
              </span>
            </div>

            <div className="stage-reason">
              {item.data?.task_type && (
                <div>
                  <strong>Task:</strong>{" "}
                  {getTaskDisplayName(item.data.task_type)}
                </div>
              )}

              {item.data?.confidence !== undefined && (
                <div>
                  <strong>Confidence:</strong>{" "}
                  {(item.data.confidence * 100).toFixed(1)}%
                </div>
              )}

              {item.data?.threshold !== undefined && (
                <div>
                  <strong>Threshold:</strong>{" "}
                  {(item.data.threshold * 100).toFixed(0)}%
                </div>
              )}
              <div>
                {item.data?.reason || "-"}
              </div>
            </div>
          </div>
        ))}
      </div>
      
<h4 className="gateway-execution-title">
    Gateway Execution
</h4>

<div className="decision-row">
  <span className="decision-title">
    Task
  </span>
  <div className="decision-models">
    {
      tasks.length > 0
        ? tasks.map((task, index) => (
            <div
              key={index}
              className="model-name"
            >
              {task}
            </div>
          ))
        :
          (
            <div className="model-name">
              {getTaskDisplayName(latest?.task_type)}
            </div>
          )
    }
  </div>
</div>

<div className="decision-row">
  <span className="decision-title">
    Execution Plan
  </span>
  <span className="decision-value">
    {executionPlan.length}{" "}
    {
      executionPlan.length === 1
        ? "Task"
        : "Tasks"
    }
  </span>
</div>

<div className="decision-row">
  <span className="decision-title">
    Models
  </span>
  <div className="decision-models">
    {
      models.length > 0
        ? models.map((model, index) => (
            <div
              key={index}
              className="model-name"
            >
              {getModelDisplayName(model)}
            </div>
          ))
        :
          (
            <div className="model-name">
              N/A
            </div>
          )
    }
  </div>
</div>

<div className="decision-row">
  <span className="decision-title">
    Status
  </span>
  <div className="decision-models">
    <span className="status-success">
      Success
    </span>
  </div>
</div>
</div>
);
}
