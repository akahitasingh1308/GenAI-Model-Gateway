export default function DashboardHeader(){

    return (
        <div className="dashboard-header">
            <div>
                <h1>
                    GenAI Model Gateway
                </h1>

                <p>
                    AI Routing & Observability Console
                </p>
            </div>

            <div className="gateway-status">
                <span className="status-dot"></span>
                Healthy
            </div>
        </div>
    );
}