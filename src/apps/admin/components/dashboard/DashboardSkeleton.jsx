import Skeleton from "../../../../components/shared/Skeleton";
import "../dashboard/DashboardComponents.css";

const DashboardSkeleton = () => {
    return (
        <div className="dashboard-page">
            {/* Header Skeleton */}
            <div className="dashboard-header">
                <div>
                    <Skeleton variant="rect" width={160} height={28} style={{ marginBottom: 12, borderRadius: 14 }} />
                    <Skeleton variant="text" width={220} height={28} style={{ marginBottom: 8 }} />
                    <Skeleton variant="text" width={300} height={16} />
                </div>
                <div className="quick-stats-bar">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="quick-stats-wrapper">
                            {i > 0 && <div className="quick-stats-divider" />}
                            <div className="quick-stat-item" style={{ gap: 8 }}>
                                <Skeleton variant="rect" width={28} height={28} style={{ borderRadius: 6 }} />
                                <div>
                                    <Skeleton variant="text" width={50} height={10} style={{ marginBottom: 4 }} />
                                    <Skeleton variant="text" width={35} height={18} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="dashboard-grid">
                {/* Left Column */}
                <div className="dashboard-left">
                    {/* Revenue Card */}
                    <Skeleton variant="rect" width="100%" height={120} style={{ borderRadius: 16 }} />

                    {/* Goal Card */}
                    <Skeleton variant="rect" width="100%" height={192} style={{ borderRadius: 16 }} />

                    {/* Trend Chart */}
                    <Skeleton variant="rect" width="100%" height={320} style={{ borderRadius: 16 }} />
                </div>

                {/* Right Column */}
                <div className="dashboard-right">
                    {/* Overview Chart */}
                    <Skeleton variant="rect" width="100%" height={350} style={{ borderRadius: 16 }} />

                    {/* Top Restaurants */}
                    <div style={{ padding: 24, background: "white", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                            <Skeleton variant="text" width={140} height={20} />
                            <Skeleton variant="text" width={80} height={16} />
                        </div>
                        <div style={{ display: "flex", gap: 16 }}>
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                                    <Skeleton variant="circle" width={64} height={64} />
                                    <Skeleton variant="text" width={70} height={12} />
                                    <Skeleton variant="text" width={50} height={12} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activity List */}
                    <div style={{ padding: 24, background: "white", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                            <Skeleton variant="text" width={160} height={22} />
                            <Skeleton variant="text" width={80} height={16} />
                        </div>
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: i < 4 ? 20 : 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <Skeleton variant="rect" width={40} height={40} style={{ borderRadius: 12 }} />
                                    <div>
                                        <Skeleton variant="text" width={200} height={14} style={{ marginBottom: 4 }} />
                                        <Skeleton variant="text" width={100} height={12} />
                                    </div>
                                </div>
                                <Skeleton variant="text" width={60} height={12} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
