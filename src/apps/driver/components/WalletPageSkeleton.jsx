import Skeleton from "../../../components/shared/Skeleton";

const WalletPageSkeleton = () => {
    return (
        <div className="driver-page">
            <div className="driver-page-header">
                <Skeleton variant="text" width={100} height={24} />
            </div>
            <div className="driver-page-scroll">
                {/* Wallet Overview */}
                <div style={{
                    background: "linear-gradient(135deg, #1e293b, #334155)",
                    borderRadius: 20,
                    padding: 24,
                    marginBottom: 20,
                }}>
                    <Skeleton variant="text" width={120} height={14} style={{ marginBottom: 8, opacity: 0.3 }} />
                    <Skeleton variant="text" width={180} height={32} style={{ marginBottom: 20, opacity: 0.3 }} />

                    <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                        {[0, 1].map((i) => (
                            <div key={i}>
                                <Skeleton variant="text" width={100} height={12} style={{ marginBottom: 4, opacity: 0.3 }} />
                                <Skeleton variant="text" width={80} height={18} style={{ opacity: 0.3 }} />
                            </div>
                        ))}
                    </div>

                    <div style={{ display: "flex", gap: 12 }}>
                        <Skeleton variant="rect" width="50%" height={40} style={{ borderRadius: 12, opacity: 0.3 }} />
                        <Skeleton variant="rect" width="50%" height={40} style={{ borderRadius: 12, opacity: 0.3 }} />
                    </div>
                </div>

                {/* Transactions */}
                <Skeleton variant="text" width={160} height={18} style={{ marginBottom: 16 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            background: "white",
                            borderRadius: 14,
                            padding: 14,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                        }}>
                            <Skeleton variant="rect" width={40} height={40} style={{ borderRadius: 12 }} />
                            <div style={{ flex: 1 }}>
                                <Skeleton variant="text" width={140} height={14} style={{ marginBottom: 4 }} />
                                <Skeleton variant="text" width={100} height={12} />
                            </div>
                            <Skeleton variant="text" width={70} height={16} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WalletPageSkeleton;
