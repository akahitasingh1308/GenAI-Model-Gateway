import { useState } from "react";
import { chatRequest } from "../services/api";
import { useApp } from "../context/AppContext";
import GatewayDecision from "../components/GatewayDecision";

import "../styles/playground.css";

export default function Playground() {
  const [query, setQuery] = useState("");;
  const { latest, setLatest, setLogs } = useApp();

  async function handleSend() {
    if (!query.trim()) return;
    const payload = {
      user_id: "user-" + Math.random().toString(36).substring(2, 10),
      application: "simulation",
      query,
      priority: "high",
      task_type: "auto",
      max_latency_ms: 5000,
      force_model: null
    };
    try {
      const data = await chatRequest(payload);
      setLatest(data);
      setLogs(prev => [...prev, data]);
      setQuery("");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="gateway-page">
      <div className="page-header">
        <h1>Gateway Console</h1>
      </div>

      <div className="config-card">
        <h3>Request Configuration</h3>
        <div className="request-options">
          <div className="gateway-info">
  <div className="gateway-info-card">
    <span className="info-label">
      Gateway Mode
    </span>
    <strong className="info-value">
      Simulation
    </strong>
  </div>

  <div className="gateway-info-card">
    <span className="info-label">
      Routing Mode
    </span>
    <strong className="info-value">
      Automatic
    </strong>
  </div>

</div>
        </div>
        <div className="query-section">
          <label>Query</label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="gateway-textarea"
            placeholder="Example: Summarize this report and generate Python code..."
          />
        </div>

        <div className="action-row">
          <button
            className="reset-btn"
            onClick={() => setQuery("")}
          >
            Reset
          </button>
          <button
            className="execute-btn"
            onClick={handleSend}
          >
            ▶ Execute Request
          </button>
        </div>
      </div>
      {latest && (
        <div className="result-card">

  <div className="execution-header">
    <div>
      <h2>Request Completed</h2>
      <p className="execution-subtitle">
        The request was successfully analyzed, routed, and executed through the AI Gateway.
      </p>
    </div>
  </div>

  <GatewayDecision latest={latest} />
  <div className="response-card">
            <div className="response-section">
              <h3>Original Request</h3>
              <p>{latest.query}</p>
            </div>

            <div className="response-section">
              <h3>Generated Response</h3>
              <p>{latest.response}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
