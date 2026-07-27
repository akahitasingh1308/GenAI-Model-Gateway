export default function ModelConfiguration() {
    const models = [
    {
        title: "Lite Chat Model",
        model: "Mock Fast Provider",
        purpose: "Handles lightweight requests."
    },
    {
        title: "Reasoning Model",
        model: "Mock Premium Provider",
        purpose: "Handles complex reasoning tasks."
    },
    {
        title: "Fallback Model",
        model: "Ollama 3.2",
        purpose: "Used when the primary model fails."
    }
    ];

    return (
        <div className="settings-card">
            <div className="card-title">
                <h2>Model Configuration</h2>
                <span>
                    Models available for request routing
                </span>
            </div>

            <div className="model-grid">
                {
                    models.map(model => (
                        <div
                            key={model.title}
                            className="model-item"
                        >
                            <span className="model-title">
                                {model.title}
                            </span>
                            <h3>
                                {model.model}
                            </h3>
                            <p>
                                {model.purpose}
                            </p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}