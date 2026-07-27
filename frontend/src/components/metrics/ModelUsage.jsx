import { useApp } from "../../context/AppContext";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";
import { getModelDisplayName } from "../../utils/modelNames";

export default function ModelUsage() {
    const { logs } = useApp();
    const modelCounts = {};

logs.forEach(log => {
    const models = (log.selected_model || "")
        .split(",")
        .map(m => m.trim())
        .filter(Boolean);

    models.forEach(model => {
        const display =
            getModelDisplayName(model);

        modelCounts[display] =
            (modelCounts[display] || 0) + 1;
    });
});

    const data = Object.entries(modelCounts).map(
    ([model, count]) => ({
        model,
        count
    })
);

    return (
        <div className="model-card">
            <div className="card-title">
                <h2>Model Usage</h2>
                <span>
                    Distribution of gateway model selection
                </span>
            </div>
            {
                data.length === 0 ?
                <div className="empty-chart">
                    No model usage available.
                </div>
                :
                <ResponsiveContainer
                    width="100%"
                    height={320}
                >
                    <BarChart
                        data={data}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                        />
                        <XAxis
                            dataKey="model"
                        />
                        <YAxis
                            allowDecimals={false}
                        />
                        <Tooltip />
                        <Bar
                            dataKey="count"
                            radius={[8,8,0,0]}
                            fill="#3b82f6"
                        />
                    </BarChart>
                </ResponsiveContainer>
            }
        </div>
    );
}