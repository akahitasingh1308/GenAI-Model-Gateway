export default function GatewayConfiguration() {
    const settings = [
        {
            label: "Simulation Mode",
            value: "Enabled"
        },
        {
            label: "Default Priority",
            value: "Normal"
        },
        {
            label: "Maximum Latency",
            value: "5000 ms"
        }
    ];

    return (
        <div className="settings-card">
            <div className="card-title">
                <h2>Gateway Configuration</h2>
                <span>
                    Runtime gateway configuration
                </span>
            </div>

            <div className="settings-list">
                {
                    settings.map(item => (
                        <div
                            key={item.label}
                            className="setting-row"
                        >
                            <span className="setting-label">
                                {item.label}
                            </span>
                            <span className="setting-value">
                                {item.value}
                            </span>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}