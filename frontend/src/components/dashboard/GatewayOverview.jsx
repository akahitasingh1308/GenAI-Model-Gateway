export default function GatewayOverview({ stats }) {
    const cards = [
        {
            title:"Total Requests",
            value:stats.total_requests,
            subtitle:"Requests handled"
        },
        {
            title:"Success Rate",
            value:`${stats.success_rate}%`,
            subtitle:"Healthy"
        },
        {
            title:"Failed Requests",
            value:stats.failed_requests,
            subtitle:"Requires attention"
        },
        {
            title:"Active Models",
            value:"3",
            subtitle:"Online"
        }
    ];

    return (
        <div className="overview-grid">
            {
                cards.map((card,index)=>(
                    <div 
                    className="overview-card"
                    key={index}
                    >
                        <p>{card.title}</p>
                        <h2>{card.value}</h2>
                        <span>{card.subtitle}</span>
                    </div>
                ))
            }
        </div>
    );
}