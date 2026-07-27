import { useState, useEffect } from "react";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import GatewayOverview from "../components/dashboard/GatewayOverview";
import ExecutionPipeline from "../components/dashboard/ExecutionPipeline";
import LatestRequest from "../components/dashboard/LatestRequest";
import DecisionAnalytics from "../components/dashboard/DecisionAnalytics";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";

import "../styles/dashboard.css";

export default function Dashboard() {
    const [stats, setStats] = useState({
        total_requests: 0,
        success_rate: 0,
        failed_requests: 0
    });

    useEffect(() => {
    const fetchLogs = async () => {
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/logs?limit=1000"
            );

            const data = await response.json();
            const logs = data.logs || [];
            const totalRequests = logs.length;
            const successRequests = logs.filter(
                log => log.status === "success"
            ).length;

            const failedRequests = logs.filter(
                log => log.status === "failed"
            ).length;

            const successRate = totalRequests > 0
                ? ((successRequests / totalRequests) * 100).toFixed(1)
                : "0.0";

            setStats({
                total_requests: totalRequests,
                success_rate: successRate,
                failed_requests: failedRequests
            });

        } catch(error) {
            console.error(
                "Failed to fetch logs:",
                error
            );
        }
    };

    fetchLogs();
    const interval = setInterval(
        fetchLogs,
        5000
    );
    return () => clearInterval(interval);
}, []);

    return (
        <div className="gateway-dashboard">
            <DashboardHeader />
            <GatewayOverview 
                stats={stats}
            />
            <ExecutionPipeline />
            <div className="dashboard-row">
                <LatestRequest />
                <DecisionAnalytics />
            </div>
            <ActivityTimeline />
        </div>
    );
}