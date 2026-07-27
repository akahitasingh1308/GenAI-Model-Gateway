import { useApp } from "../../context/AppContext";
import { getModelDisplayName } from "../../utils/modelNames";
import { getTaskDisplayName } from "../../utils/taskNames";

export default function GatewaySummary() {
    const { logs } = useApp();

    const taskCounts = {};
    const modelCounts = {};

    let failures = 0;

    logs.forEach(log => {
        // Count tasks
        taskCounts[log.task_type] =
            (taskCounts[log.task_type] || 0) + 1;

        // Count models
        const models = (log.selected_model || "")
            .split(",")
            .map(model => model.trim())
            .filter(Boolean);

        models.forEach(model => {
            const display = getModelDisplayName(model);
            modelCounts[display] =
                (modelCounts[display] || 0) + 1;
        });

        // Count failures
        if (log.status !== "success") {
            failures++;
        }
    });

    const mostUsedTask =
        Object.entries(taskCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    const mostUsedModel =
        Object.entries(modelCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    return (
        <div className="summary-card">
            <div className="card-title">
                <h2>Gateway Performance Summary</h2>
                <span>
                    Overall gateway insights
                </span>
            </div>

            <div className="summary-grid">
                <div className="summary-item">
                    <span>Most Used Task</span>
                    <strong>
                        {mostUsedTask === "-"
                            ? "-"
                            : getTaskDisplayName(mostUsedTask)}
                    </strong>
                </div>

                <div className="summary-item">
                    <span>Most Used Model</span>
                    <strong>{mostUsedModel}</strong>
                </div>

                <div className="summary-item">
                    <span>Total Failures</span>
                    <strong>{failures}</strong>
                </div>

                <div className="summary-item">
                    <span>Total Task Types</span>
                    <strong>{Object.keys(taskCounts).length}</strong>
                </div>
            </div>
        </div>
    );

}