import { useApp } from "../../context/AppContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function RequestDistribution() {
  const { logs } = useApp();
  console.log("Logs:", logs);
  console.log("Success:", logs.filter(log => log.status === "success").length);

  const success = logs.filter(log => log.status === "success").length;
  const failed = logs.length - success;

  const data = [
    {
      name: "Success",
      value: success
    },
    {
      name: "Failed",
      value: failed
    }
  ];

  const COLORS = [
    "#22c55e",
    "#ef4444"
  ];

  return (
    <div className="distribution-card">
      <div className="card-title">
        <h2>Request Distribution</h2>
        <span>
          Success vs failed requests
        </span>
      </div>

      <div className="distribution-content">
        <ResponsiveContainer
        width="50%"
        height={260}
        >
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
            >
              {
                data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))
              }
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="distribution-legend">
          {
            data.map((item, index) => (
              <div
                key={item.name}
                className="legend-item"
              >
                <span
                  className="legend-dot"
                  style={{
                    background: COLORS[index]
                  }}
                />
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.value} Requests</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}