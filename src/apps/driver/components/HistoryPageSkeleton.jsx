import Skeleton from "../../../components/shared/Skeleton";

const HistoryPageSkeleton = () => {
    return (
        <div className="driver-page">
            <div className="driver-page-header">
                <Skeleton variant="text" width={180} height={24} />
            </div>
            <div className="driver-page-scroll">
                {/* Stats */}
                <div className="history-stats">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="history-stat">
                            <Skeleton variant="text" width={50} height={24} style={{ marginBottom: 4 }} />
                            <Skeleton variant="text" width={60} height={14} />
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="history-filters">
                    {[0, 1, 2].map((i) => (
                        <Skeleton key={i} variant="rect" width={80} height={34} style={{ borderRadius: 99 }} />
                    ))}
                </div>

                {/* Cards */}
                <div className="history-cards">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} style={{
                            background: "white",
                            borderRadius: 16,
                            padding: 16,
                            marginBottom: 12,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
                        }}>
                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <Skeleton variant="rect" width={40} height={40} style={{ borderRadius: 12 }} />
                                    <div>
                                        <Skeleton variant="text" width={120} height={16} style={{ marginBottom: 4 }} />
                                        <Skeleton variant="text" width={60} height={12} />
                                    </div>
                                </div>
                                <Skeleton variant="text" width={70} height={18} />
                            </div>

                            {/* Route */}
                            <div style={{ paddingLeft: 8, marginBottom: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                    <Skeleton variant="circle" width={10} height={10} />
                                    <Skeleton variant="text" width="70%" height={14} />
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <Skeleton variant="circle" width={10} height={10} />
                                    <Skeleton variant="text" width="60%" height={14} />
                                </div>
                            </div>

                            {/* Footer */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Skeleton variant="text" width={100} height={14} />
                                <Skeleton variant="rect" width={90} height={24} style={{ borderRadius: 99 }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HistoryPageSkeleton;
