import { useApp } from "../../context/AppContext";

export default function GatewayHealth() {
    const { logs } = useApp();

    const totalRequests = logs.length;

    const successfulRequests =
        logs.filter(
            log => log.status === "success"
        ).length;

    const successRate =
        totalRequests === 0
        ?
        100
        :
        Math.round(
            (successfulRequests / totalRequests) * 100
        );

    const failedRequests =
        totalRequests - successfulRequests;

    let healthStatus = "Excellent";

    if(successRate < 90){
        healthStatus = "Needs Attention";
    }
    else if(successRate < 98){
        healthStatus = "Stable";
    }

    return (
        <div className="dashboard-card health-card">
            <div className="card-header">
                <h2>
                    Gateway Reliability
                </h2>
            </div>

            <div className="health-score">
                <h1>
                    {successRate}%
                </h1>

                <span>
                    {healthStatus}
                </span>
            </div>

            <div className="health-checks">
                <div>
                    ✓ Successful Requests
                    <strong>
                        {successfulRequests}
                    </strong>
                </div>

                <div>
                    ✓ Failed Requests
                    <strong>
                        {failedRequests}
                    </strong>
                </div>

                <div>
                    ✓ Gateway Status
                    <strong>
                        Healthy
                    </strong>
                </div>
            </div>
        </div>
    );
}