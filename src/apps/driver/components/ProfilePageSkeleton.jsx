import Skeleton from "../../../components/shared/Skeleton";

const ProfilePageSkeleton = () => {
    return (
        <div className="driver-page">
            <div className="driver-page-header">
                <Skeleton variant="text" width={120} height={24} />
            </div>
            <div className="driver-page-scroll">
                {/* Profile Card */}
                <div style={{
                    background: "white",
                    borderRadius: 20,
                    padding: 24,
                    textAlign: "center",
                    marginBottom: 16,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
                }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                        <Skeleton variant="circle" width={80} height={80} />
                    </div>
                    <Skeleton variant="text" width={140} height={20} style={{ margin: "0 auto 8px" }} />
                    <Skeleton variant="text" width={100} height={14} style={{ margin: "0 auto 20px" }} />

                    <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
                        {[0, 1, 2].map((i) => (
                            <div key={i} style={{ textAlign: "center" }}>
                                <Skeleton variant="text" width={40} height={20} style={{ margin: "0 auto 4px" }} />
                                <Skeleton variant="text" width={60} height={12} style={{ margin: "0 auto" }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Card */}
                <div style={{
                    background: "white",
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 16,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
                }}>
                    {[0, 1, 2].map((i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 2 ? "1px solid #f3f4f6" : "none" }}>
                            <Skeleton variant="rect" width={20} height={20} style={{ borderRadius: 4 }} />
                            <Skeleton variant="text" width={180} height={14} />
                        </div>
                    ))}
                </div>

                {/* Menu Items */}
                <div style={{
                    background: "white",
                    borderRadius: 16,
                    padding: 4,
                    marginBottom: 16,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
                }}>
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14 }}>
                            <Skeleton variant="rect" width={36} height={36} style={{ borderRadius: 10 }} />
                            <div style={{ flex: 1 }}>
                                <Skeleton variant="text" width={100} height={14} style={{ marginBottom: 4 }} />
                                <Skeleton variant="text" width={160} height={12} />
                            </div>
                            <Skeleton variant="rect" width={18} height={18} style={{ borderRadius: 4 }} />
                        </div>
                    ))}
                </div>

                {/* Logout Button */}
                <Skeleton variant="rect" width="100%" height={48} style={{ borderRadius: 12 }} />
            </div>
        </div>
    );
};

export default ProfilePageSkeleton;
