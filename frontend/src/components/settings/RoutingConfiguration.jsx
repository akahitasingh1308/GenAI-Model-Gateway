export default function RoutingConfiguration() {
    const routing = [
        {
            name: "Business Rules",
            description: "Rule-based request classification",
            status: "Enabled"
        },
        {
            name: "Task Classifier",
            description: "ML-based task prediction",
            status: "Enabled"
        },
        {
            name: "Ollama Fallback",
            description: "Fallback routing when confidence is low",
            status: "Enabled"
        }
    ];

    return (
        <div className="settings-card">
            <div className="card-title">
                <h2>Routing Configuration</h2>
                <span>
                    Gateway routing components
                </span>
            </div>

            <div className="routing-list">
                {
                    routing.map(item => (
                        <div
                            key={item.name}
                            className="routing-row"
                        >
                            <div>
                                <h4>{item.name}</h4>
                                <p>{item.description}</p>
                            </div>

                            <div className="status-enabled">
                                Enabled
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}