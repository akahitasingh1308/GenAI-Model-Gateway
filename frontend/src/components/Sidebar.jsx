import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiTerminal,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiServer,
  FiWifi,
  FiCpu
} from "react-icons/fi";

const navItems = [
  {
    path: "/",
    label: "Gateway Overview",
    icon: <FiGrid />
  },
  {
    path: "/playground",
    label: "Gateway Console",
    icon: <FiTerminal />
  },
  {
    path: "/logs",
    label: "Request Logs",
    icon: <FiFileText />
  },
  {
    path: "/metrics",
    label: "Metrics",
    icon: <FiBarChart2 />
  },
  {
    path: "/settings",
    label: "Settings",
    icon: <FiSettings />
  }
];

export default function Sidebar() {
  return (
    <aside style={sidebar}>
      <div>
        <div style={logoBox}>
          <div style={logoCircle}>
            AI
          </div>
          <div>
            <h2 style={title}>
              GenAI Model Gateway
            </h2>
            <p style={subtitle}>
              Model Routing Console
            </p>
          </div>
        </div>

        <div style={menu}>
          {
            navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({isActive}) => ({
                  ...link,
                  background:
                    isActive
                    ?
                    "#2563eb"
                    :
                    "transparent",
                  color:
                    isActive
                    ?
                    "white"
                    :
                    "#9ca3af"
                })}
              >
                <span style={iconStyle}>
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            ))
          }
        </div>
      </div>

      <div style={footer}>
        <div style={statusCard}>
          <div style={statusRow}>
            <FiServer />
            <span>
              Gateway Endpoint
            </span>
          </div>
          <strong style={{color:"#60a5fa"}}>
            POST /chat
          </strong>
        </div>

        <div style={statusCard}>
          <div style={statusRow}>
            <FiWifi />
            <span>
              Status
            </span>
          </div>
          <strong style={{color:"#22c55e"}}>
            ● Online
          </strong>
        </div>

        <div style={statusCard}>
          <div style={statusRow}>
            <FiCpu />
            <span>
              Simulation
            </span>
          </div>
          <strong style={{color:"#a78bfa"}}>
            Enabled*
          </strong>
        </div>
        <p style={footnote}>
          * Simulated providers are used during development.
        </p>
      </div>
    </aside>
  );
}

const sidebar = {
  width:245,
  minHeight:"100vh",
  background:"#18181b",
  borderRight:"1px solid #252932",
  display:"flex",
  flexDirection:"column",
  justifyContent:"space-between",
  padding:"24px",
  boxSizing:"border-box"
};

const logoBox = {
  display:"flex",
  gap:10,
  alignItems:"center"
};

const logoCircle = {
  width:40,
  height:40,
  borderRadius:12,
  background:"#2563eb",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  fontWeight:700,
  color:"white",
  fontSize:17
};

const title = {
  margin:0,
  color:"white",
  fontSize:18,
  whiteSpace:"nowrap"
};

const subtitle = {
  color:"#a1a1aa",
  marginTop:3,
  fontSize:15,
  whiteSpace:"nowrap"
};

const menu = {
  display:"flex",
  flexDirection:"column",
  gap:6,
  marginTop:28
};

const link = {
  display:"flex",
  alignItems:"center",
  gap:12,
  padding:"13px 15px",
  borderRadius:10,
  textDecoration:"none",
  transition:".2s",
  fontWeight:600,
  fontSize:14,
  whiteSpace:"nowrap"
};

const iconStyle = {
  fontSize:18,
  display:"flex",
  alignItems:"center"
};

const footer = {
  borderTop:"1px solid #252932",
  paddingTop:18,
  marginTop:"auto"
};

const statusCard = {
  background:"#27272a",
  border:"1px solid #3f3f46",
  borderRadius:10,
  padding:10,
  marginBottom:10
};

const statusRow = {
  display:"flex",
  gap:7,
  alignItems:"center",
  color:"#94a3b8",
  marginBottom:6,
  fontSize:11
};

const footnote = {
  color:"#9ca3af",
  fontSize:10,
  lineHeight:1.4,
  marginTop:8
};
