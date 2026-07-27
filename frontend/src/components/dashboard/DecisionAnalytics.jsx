import { useApp } from "../../context/AppContext";

export default function DecisionAnalytics() {

    const { logs } = useApp();

    const stats = {
        businessRules: 0,
        taskClassifier: 0,
        ollamaRouting: 0,
        success: 0,
        failed: 0
    };

    logs.forEach(log => {

        const decision =
            log.routing_reason ||
            log.decision_source ||
            log.explainability?.decision_source;

        switch (decision) {

            case "business_rules":
                stats.businessRules++;
                break;

            case "task_classifier":
                stats.taskClassifier++;
                break;

            case "ollama_classifier":
                stats.ollamaRouting++;
                break;

            default:
                break;
        }

        if (log.status === "success") {
            stats.success++;
        } else {
            stats.failed++;
        }

    });

    const decisions =
        stats.businessRules +
        stats.taskClassifier +
        stats.ollamaRouting;

    const business =
        decisions
            ? Math.round((stats.businessRules / decisions) * 100)
            : 0;

    const classifier =
        decisions
            ? Math.round((stats.taskClassifier / decisions) * 100)
            : 0;

    const ollama =
        decisions
            ? 100 - business - classifier
            : 0;

    return (

        <div className="analytics-card">

            <div className="section-title">

                <h2>Decision Analytics</h2>

                <span>Gateway decision trends</span>

            </div>

            <div className="distribution">

                <div
                    className="segment business"
                    style={{ width: `${business}%` }}
                />

                <div
                    className="segment classifier"
                    style={{ width: `${classifier}%` }}
                />

                <div
                    className="segment ollama"
                    style={{ width: `${ollama}%` }}
                />

            </div>

            <div className="legend">

                <div>
                    <span className="dot business"></span>
                    Business Rules
                    <strong>{business}%</strong>
                </div>

                <div>
                    <span className="dot classifier"></span>
                    Task Intelligence
                    <strong>{classifier}%</strong>
                </div>

                <div>
                    <span className="dot ollama"></span>
                    Ollama Routing
                    <strong>{ollama}%</strong>
                </div>

            </div>

            <div className="analytics-metrics">

                <div>
                    <span>Rule Matches</span>
                    <h3>{stats.businessRules}</h3>
                </div>

                <div>
                    <span>Task Classifications</span>
                    <h3>{stats.taskClassifier}</h3>
                </div>

                <div>
                    <span>Ollama Decisions</span>
                    <h3>{stats.ollamaRouting}</h3>
                </div>

                <div>
                    <span>Successful Requests</span>
                    <h3>{stats.success}</h3>
                </div>

                <div>
                    <span>Failed Requests</span>
                    <h3>{stats.failed}</h3>
                </div>

            </div>

        </div>

    );

}