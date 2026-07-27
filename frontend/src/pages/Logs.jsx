import { useEffect, useMemo, useState } from "react";

import { fetchLogs } from "../services/api";
import { getModelDisplayName } from "../utils/modelNames";
import { getTaskDisplayName } from "../utils/taskNames";

import "../styles/logs.css";

export default function Logs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [timeFilter, setTimeFilter] = useState("all");

   useEffect(() => {
    async function loadLogs() {
        try {
            const data = await fetchLogs(1000);
            console.log(
                "LOGS:",
                data
            );
            setLogs(data);
        }
        catch(err){
            console.error(
                "Failed loading logs:",
                err
            );
        }
        finally {
            setLoading(false);
        }
    }
    loadLogs();
    const interval = setInterval(
        loadLogs,
        5000
    );
    return () => clearInterval(interval);
}, []);

    function checkTime(log) {
        if(timeFilter === "all") {
            return true;
        }
        const logTime = new Date(log.timestamp);
        const now = new Date();
        const diff = now.getTime() - logTime.getTime();
        switch(timeFilter) {
            case "1h":
                return diff <= 60 * 60 * 1000;

            case "6h":
                return diff <= 6 * 60 * 60 * 1000;

            case "24h":
                return diff <= 24 * 60 * 60 * 1000;

            case "7d":
                return diff <= 7 * 24 * 60 * 60 * 1000;

            default:
                return true;
        }
    }

    function getTask(log) {
        const planner =
            log.explainability
            ?.steps
            ?.find(
                step =>
                step.step === "intent_planner"
            );

        if(planner?.execution_plan) {
            return planner.execution_plan
                .map(
                    item =>
                    getTaskDisplayName(item.task)
                )
                .join(", ");
        }

        return getTaskDisplayName(
            log.task_type
        );
    }

    function getDecision(log) {
        const source =
            log.routing_reason ||
            log.explainability?.decision_source ||
            log.decision_source;

        switch(source) {
            case "business_rules":
                return "Business Rules";

            case "task_classifier":
                return "Task Classifier";

            case "ollama_classifier":
                return "Ollama Classifier";

            case "forced_model_rule":
                return "Forced Model";

            default:
                return "-";
        }
    }

    function getModels(log) {
        let models = [];
        if(log.model_used) {
            models.push(
                ...log.model_used.split(",")
            );
        }

        if(log.selected_model) {
            models.push(
                ...log.selected_model.split(",")
            );
        }

        if(log.explainability?.selected_model) {
            models.push(
                ...log.explainability.selected_model.split(",")
            );
        }

        const router =
            log.explainability
            ?.steps
            ?.find(
                step =>
                step.step === "router"
            );

        router?.routing_plan?.forEach(item => {
            if(item.model) {
                models.push(item.model);
            }
        });

        models = [
            ...new Set(
                models
                .filter(Boolean)
                .map(
                    model =>
                    model.trim()
                )
            )
        ];

        if(models.length === 0) {
            return "N/A";
        }

        return [
            ...new Set(
                models.map(
                    model =>
                    getModelDisplayName(model)
                )
            )
        ].join(", ");
    }

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const searchMatch =
    search.trim() === ""
    ||
    (log.query || "")
    .toLowerCase()
    .includes(
        search.toLowerCase()
    );
            const statusMatch =
                statusFilter === "all"
                ||
                log.status === statusFilter;

            const timeMatch = checkTime(log);

            return (
                searchMatch &&
                statusMatch &&
                timeMatch
            );
        });
    }, [
        logs,
        search,
        statusFilter,
        timeFilter
    ]);

    return (
        <div className="logs-page">
            <div className="logs-header">
                <h1>
                    Request Logs
                </h1>
                <div className="logs-toolbar">
                    <input
                        type="text"
                        placeholder="🔍 Search Query..."
                        value={search}
                        onChange={
                            e =>
                            setSearch(e.target.value)
                        }
                        className="search-box"
                    />
                    <select
                        value={statusFilter}
                        onChange={
                            e =>
                            setStatusFilter(e.target.value)
                        }
                    >
                        <option value="all">
                            All Requests
                        </option>
                        <option value="success">
                            Success
                        </option>
                        <option value="failed">
                            Failed
                        </option>
                    </select>

                    <select
                        value={timeFilter}
                        onChange={
                            e =>
                            setTimeFilter(e.target.value)
                        }
                    >
                        <option value="all">
                            All Time
                        </option>
                        <option value="1h">
                            Last Hour
                        </option>
                        <option value="6h">
                            Last 6 Hours
                        </option>
                        <option value="24h">
                            Last 24 Hours
                        </option>
                        <option value="7d">
                            Last 7 Days
                        </option>
                    </select>
                </div>
            </div>

            <div className="logs-card">
                {
                    loading
                    ?
                    <p>
                        Loading...
                    </p>
                    :
                    <table className="logs-table">
                        <thead>
                            <tr>
                                <th>
                                    Time
                                </th>
                                <th>
                                    Query
                                </th>
                                <th>
                                    Task
                                </th>
                                <th>
                                    Decision
                                </th>
                                <th>
                                    Model
                                </th>
                                <th>
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            filteredLogs.map(log => (
                                <tr
                                    key={log.request_id}
                                    onClick={
                                        () =>
                                        setSelectedLog(log)
                                    }
                                >
                                    <td>
                                        {
                                            new Date(
                                                log.timestamp
                                            )
                                            .toLocaleTimeString(
                                                [],
                                                {
                                                    hour:"2-digit",
                                                    minute:"2-digit"
                                                }
                                            )
                                        }
                                    </td>
                                    <td title={log.query || ""}>
                                        {
                                            log.query
                                            ?
                                            (
                                                log.query.length > 45
                                                ?
                                                log.query.substring(0,45) + "..."
                                                :
                                                log.query
                                            )
                                            :
                                            "N/A"
                                        }
                                    </td>
                                    <td>
                                        {getTask(log)}
                                    </td>
                                    <td>
                                        {getDecision(log)}
                                    </td>
                                    <td>
                                        {getModels(log)}
                                    </td>
                                    <td>
                                        <span
                                            className={
                                                log.status === "success"
                                                ?
                                                "status-success"
                                                :
                                                "status-failed"
                                            }
                                        >
                                            {
                                                log.status === "success"
                                                ?
                                                "Success"
                                                :
                                                "Failed"
                                            }
                                        </span>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                }
            </div>
        </div>
    );
}