import { useApp } from "../../context/AppContext";

export default function PerformanceOverview() {
    const { logs } = useApp();
    const totalRequests = logs.length;
    const successRequests =
        logs.filter(log => log.status === "success").length;

    const failedRequests = totalRequests - successRequests;

    const successRate =
        totalRequests
            ? ((successRequests / totalRequests) * 100).toFixed(1)
            : "0.0";

    const averageLatency = 420;

    const activeModels = new Set(
        logs.flatMap(log =>
            (log.model_used || "")
            .split(",")
            .map(model => model.trim())
            .filter(Boolean)
        )
    ).size;
    
    const metrics = [
        {
            title: "Total Requests",
            value: totalRequests,
            subtitle: "Processed requests"
        },
        {
            title: "Success Rate",
            value: `${successRate}%`,
            subtitle: `${failedRequests} failed`
        },
        {
            title: "Average Latency",
            value: `${averageLatency} ms`,
            subtitle: "Gateway response"
        },
        {
            title: "Active Models",
            value: activeModels,
            subtitle: "Models utilized"
        }
    ];

    return (
        <div className="metrics-overview">
            {
                metrics.map(metric => (
                    <div
                        key={metric.title}
                        className="metric-card"
                    >
                        <span>{metric.title}</span>
                        <h2>{metric.value}</h2>
                        <p>{metric.subtitle}</p>
                    </div>
                ))
            }
        </div>
    );
}