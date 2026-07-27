import "../styles/header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-title">
        <h1>Dashboard</h1>
        <p>Monitor your AI Gateway in real time</p>
      </div>

      <div className="header-right">
        <div className="health">
          🟢 Gateway Healthy
        </div>
        <div className="avatar">
          A
        </div>
      </div>
    </header>
  );
}

