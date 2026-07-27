import { useApp } from "../../context/AppContext";
import { getModelDisplayName } from "../../utils/modelNames";

import {
  Scale,
  Brain,
  Bot,
  ClipboardList,
  GitBranch,
  Cloud
} from "lucide-react";

const pipelineSteps = [
  {
    key: "business_rules",
    label: "Business Rules",
    icon: Scale
  },
  {
    key: "task_classifier",
    label: "Task Classifier",
    icon: Brain
  },
  {
    key: "ollama_classifier",
    label: "Ollama Routing",
    icon: Bot
  },
  {
    key: "intent_planner",
    label: "Intent Planner",
    icon: ClipboardList
  },
  {
    key: "router",
    label: "Model Router",
    icon: GitBranch
  },
  {
    key: "provider",
    label: "Provider",
    icon: Cloud
  }
];

export default function ExecutionPipeline() {
  const { latest } = useApp();

  function getBackendStep(key) {
    return (
      latest?.explainability?.steps?.find(
        s => s.step === key
      ) || null
    );
  }

  function getValue(key) {
    const step = getBackendStep(key);

    if (!step)
      return "Waiting";

    switch (key) {
      case "business_rules":
      case "task_classifier":
      case "ollama_classifier":
        return step.status;

      case "intent_planner":
        return `${step.execution_plan?.length || 0} Task`;

      case "router":
        return step.routing_plan?.[0]?.model
          ? getModelDisplayName(step.routing_plan[0].model)
          : "Completed";

      case "provider":
        return step.status;

      default:
        return "Completed";
    }
  }

  function getClass(value) {
    if (value === "Selected")
      return "selected";

    if (value === "Rejected")
      return "rejected";

    if (value === "Waiting")
      return "waiting";

    return "completed";
  }

  return (
    <div className="execution-card">
      <div className="execution-header">
        <div>
          <h2>Execution Pipeline</h2>

          <p>
            Live AI request processing workflow
          </p>
        </div>

        <div className="live-indicator">
          <span className="live-dot"></span>
          Live
        </div>
      </div>

      <div className="pipeline-horizontal">
        {
          pipelineSteps.map((step, index) => {
            const Icon = step.icon;
            const value = getValue(step.key);

            return (
              <>
                <div
                  className="pipeline-node"
                  key={step.key}
                >
                  <div className={`node-circle ${getClass(value)}`}>
                    <Icon size={22} />
                  </div>

                  <h4>
                    {step.label}
                  </h4>

                  <span className={`node-status ${getClass(value)}`}>
                    {value}
                  </span>
                </div>
                {
                  index !== pipelineSteps.length - 1 &&
                  <div className="pipeline-line" />
                }
              </>
            );
          })
        }
      </div>
    </div>
  );
}