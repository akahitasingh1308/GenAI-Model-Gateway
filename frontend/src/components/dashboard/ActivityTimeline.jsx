import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { getTaskDisplayName } from "../../utils/taskNames";
import { getModelDisplayName } from "../../utils/modelNames";


const decisionMap = {
    business_rules: "Business Rules",
    task_classifier: "Task Classifier",
    ollama_classifier: "Ollama Routing",
    forced_model_rule: "Forced Model"
};

export default function ActivityTimeline() {

    const { logs } = useApp();

    if (!logs.length) {
        return (
            <div className="activity-card">

                <div className="activity-header">
                    <div>
                        <h2>
                            Recent Activity
                        </h2>

                        <span>
                            Latest gateway requests
                        </span>
                    </div>
                </div>
                <div className="activity-empty">
                    No gateway activity yet.
                    <br />
                    Process a request in Playground to begin monitoring activity.
                </div>
            </div>
        );
    }

    function getDecision(log) {
        const source =
            log.routing_reason ||
            log.explainability?.decision_source ||
            log.decision_source;

        return (
            decisionMap[source] ||
            "Unknown"
        );
    }

    function getModel(log) {
        const model =
            log.selected_model ||
            log.model_used;

        if(!model) {
            return "N/A";
        }

        return model
            .split(",")
            .map(
                item =>
                getModelDisplayName(
                    item.trim()
                )
            )
            .join(", ");
    }

    return (

        <div className="activity-card">

            <div className="activity-header">
                <div>
                    <h2>
                        Recent Activity
                    </h2>

                    <span>
                        Latest gateway requests
                    </span>

                </div>

                <Link
                    to="/logs"
                    className="view-all"
                >
                    View All →
                </Link>
            </div>

            <div className="activity-list">
                {
                    logs
                    .slice(0,3)
                    .map(log => (
                        <div
                            className="activity-item"
                            key={log.request_id}
                        >
                            <div className="activity-time">
                                {
                                    new Date(
                                        log.timestamp
                                    )
                                    .toLocaleTimeString(
                                        [],
                                        {
                                            hour:"2-digit",
                                            minute:"2-digit"
                                        }
                                    )
                                }
                            </div>
                            <div className="activity-content">

                                <div className="activity-query">
                                    {log.query}
                                </div>

                                <div className="activity-meta">

                                    <span>
                                        {getTaskDisplayName(log.task_type)}
                                    </span>

                                    <span>
                                        •
                                    </span>

                                    <span>
                                        {getDecision(log)}
                                    </span>

                                    <span>
                                        •
                                    </span>

                                    <span>
                                        {getModel(log)}
                                    </span>
                                </div>
                            </div>

                            <div
                                className={`activity-status ${log.status}`}
                            >
                                {log.status}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}