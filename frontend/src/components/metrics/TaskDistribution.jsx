import { useApp } from "../../context/AppContext";

export default function TaskDistribution() {
    const { logs } = useApp();

    const taskCounts = {};

    logs.forEach(log => {
        const task = log.task_type || "Unknown";
        taskCounts[task] = (taskCounts[task] || 0) + 1;
    });

    const data = Object.entries(taskCounts)
        .map(([task, count]) => ({
            task,
            count
        }))
        .sort((a, b) => b.count - a.count);

    const max = Math.max(...data.map(item => item.count), 1);

    return (
        <div className="task-card">
            <div className="card-title">
                <h2>Task Distribution</h2>
                <span>
                    Most frequently processed task types
                </span>
            </div>

            <div className="task-list">
                {
                    data.length === 0 ?
                        <div className="empty-chart">
                            No task data available.
                        </div>
                    :
                    data.map(item => (
                        <div
                            key={item.task}
                            className="task-row"
                        >
                            <div className="task-info">
                                <span className="task-name">
                                    {item.task.replace("_"," ")}
                                </span>
                                <span className="task-count">
                                    {item.count}
                                </span>
                            </div>

                            <div className="task-bar">
                                <div
                                    className="task-fill"
                                    style={{
                                        width: `${(item.count/max)*100}%`
                                    }}
                                />
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}