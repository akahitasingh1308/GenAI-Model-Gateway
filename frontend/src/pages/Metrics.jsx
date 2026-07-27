import { getModelDisplayName } from "../utils/modelNames";
import { getTaskDisplayName } from "../utils/taskNames";

import "../styles/metrics.css";

import MetricsHeader from "../components/metrics/MetricsHeader";
import PerformanceOverview from "../components/metrics/PerformanceOverview";
import RequestDistribution from "../components/metrics/RequestDistribution";
import TaskDistribution from "../components/metrics/TaskDistribution";
import ModelUsage from "../components/metrics/ModelUsage";
import GatewaySummary from "../components/metrics/GatewaySummary";

export default function Metrics(){
    return(
        <div className="metrics-page">
            <MetricsHeader />
            <PerformanceOverview />
            <div className="metrics-row">
                <RequestDistribution />
                <TaskDistribution />
            </div>
            <ModelUsage />
            <GatewaySummary />
            
        </div>  
    );
}