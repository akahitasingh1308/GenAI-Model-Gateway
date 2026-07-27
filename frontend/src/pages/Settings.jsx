import "../styles/settings.css";

import SettingsHeader from "../components/settings/SettingsHeader";
import GatewayConfiguration from "../components/settings/GatewayConfiguration";
import RoutingConfiguration from "../components/settings/RoutingConfiguration";
import ModelConfiguration from "../components/settings/ModelConfiguration";
import SystemInformation from "../components/settings/SystemInformation";

export default function Settings() {

    return (
        <div className="settings-page">
            <SettingsHeader />
            <GatewayConfiguration />
            <RoutingConfiguration />
            <ModelConfiguration />
            <SystemInformation />
        </div>
    );
}


