import "./MetricCard.css";

const MetricCard = ({ label, value, subValue, trend, color = "blue", icon }) => {
    return (
        <div className={`metric-card ${color}`}>
            {/* Glass bubbles */}
            <div className="metric-card-bubble-1" />
            <div className="metric-card-bubble-2" />

            {/* Header */}
            <div className="metric-card-header">
                <div className="metric-card-icon">{icon}</div>
                <div className="metric-card-trend">
                    <span>
                        {trend > 0 ? "+" : ""}
                        {trend}%
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="metric-card-body">
                <h3 className="metric-card-label">{label}</h3>
                <div className="metric-card-value">{value}</div>
                <p className="metric-card-sub">{subValue}</p>
            </div>
        </div>
    );
};

export default MetricCard;
