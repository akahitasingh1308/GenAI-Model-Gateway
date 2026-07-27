export default function SystemInformation() {
    const systemInfo = [
        {
            label: "Gateway Version",
            value: "v1.0.0"
        },
        {
            label: "API Framework",
            value: "FastAPI"
        },
        {
            label: "Routing Engine",
            value: "Business Rules + Task Classifier + Ollama"
        },
        {
            label: "Database Status",
            value: "Connected"
        }
    ];

    return (
        <div className="settings-card">
            <div className="card-title">
                <h2>System Information</h2>
                <span>
                    Application and runtime environment
                </span>
            </div>

            <div className="system-grid">
                {
                    systemInfo.map(item => (
                        <div
                            key={item.label}
                            className="system-item"
                        >
                            <span>
                                {item.label}
                            </span>
                            <strong>
                                {item.value}
                            </strong>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}