const OnlineStatusBadge = ({ online }) => {
    return (
        <div className={`driver-status-badge ${online ? "driver-status-badge--online" : ""}`}>
            <span className={`driver-status-dot ${online ? "driver-status-dot--online" : "driver-status-dot--offline"}`} />
            <span>{online ? "Bạn đang online." : "Bạn đang offline."}</span>
        </div>
    );
};

export default OnlineStatusBadge;
