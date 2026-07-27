import { useApp } from "../../context/AppContext";
import { getModelDisplayName } from "../../utils/modelNames";
import { getTaskDisplayName } from "../../utils/taskNames";

export default function LatestRequest() {
    const { latest } = useApp();
    if (!latest) {
        return (
            <div className="latest-card">
                <div className="latest-header">
                    <div>
                        <h2>Latest Gateway Request</h2>

                        <span>
                            No requests have been processed yet.
                        </span>
                    </div>
                </div>

                <div className="empty-state">
                    Send a request from the Playground to view routing details.
                </div>
            </div>
        );
    }

    const decisionMap = {
        business_rules: "Business Rules",
        task_classifier: "Task Classifier",
        ollama_classifier: "Ollama Routing"
    };

    const plannerStep =
        latest.explainability?.steps?.find(
            step => step.step === "intent_planner"
        );

    const executionPlan =
        plannerStep?.execution_plan || [];

    const formattedTime =
        new Date(latest.timestamp).toLocaleString();

    return (
        <div className="latest-card">
            <div className="latest-header">
                <div>
                    <h2>Latest Gateway Request</h2>

                    <span>
                        Most recent request processed
                    </span>
                </div>

                <div className={`status-pill ${latest.status}`}>
                    {latest.status.toUpperCase()}
                </div>
            </div>

            <div className="latest-section">
                <label>Query</label>
                <div className="query-box">
                    {latest.query}
                </div>
            </div>

            <div className="latest-section">
                <label>Gateway Decision</label>
                <div className="decision-grid">
                    <div>
                        <span>Task</span>
                        <strong>
                            {getTaskDisplayName(latest.task_type)}
                        </strong>
                    </div>

                    <div>
                        <span>Decision Source</span>
                        <strong>
                            {
                                decisionMap[
                                    latest.explainability?.decision_source
                                ] || "Unknown"
                            }
                        </strong>
                    </div>
                </div>
            </div>

            <div className="latest-section">
                <label>Execution Plan</label>
                <div className="plan-container">
                    {
                        executionPlan.map(task => (
                            <span
                                className="plan-chip"
                                key={task.order}
                            >
                                {getTaskDisplayName(task.task)}
                            </span>
                        ))
                    }
                </div>
            </div>

            <div className="latest-section">
                <label>Request Metadata</label>
                 <div className="metadata-grid">
                    <div>
                        <span>
                            Selected Model
                        </span>
                        <strong>
                            {
                            latest.explainability?.provider || getModelDisplayName(latest.model_used)}
                        </strong>
                    </div>
                        <div>
                            <span>
                                Processed At
                            </span>
                            <strong>
                                {formattedTime}
                            </strong>
                        </div>
                    </div>
                </div>
        </div>
    );
}