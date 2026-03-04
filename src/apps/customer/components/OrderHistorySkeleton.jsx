import React from "react";
import "../pages/OrdersPage.css"; // Reuse existing styles for layout

const OrderHistoryCardSkeleton = () => {
    return (
        <div className="cust-history-card" style={{ cursor: "default", background: "#f1f5f9" }}>
            <div className="cust-history-overlay" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.8) 100%)" }}>
                {/* Top Badges */}
                <div className="cust-history-badges">
                    <div className="skeleton-box" style={{ width: "100px", height: "30px", borderRadius: "20px" }} />
                    <div className="skeleton-box" style={{ width: "60px", height: "30px", borderRadius: "20px" }} />
                </div>

                {/* Main Info */}
                <div className="cust-history-content">
                    <div className="skeleton-box" style={{ width: "40px", height: "14px", marginBottom: "8px" }} />
                    <div className="skeleton-box" style={{ width: "70%", height: "40px", marginBottom: "16px" }} />
                    <div className="skeleton-box" style={{ width: "50%", height: "24px", marginBottom: "8px" }} />
                    <div className="skeleton-box" style={{ width: "80%", height: "16px", marginBottom: "20px" }} />

                    <div className="cust-history-details">
                        <div className="cust-history-col">
                            <div className="skeleton-box" style={{ width: "60px", height: "18px", marginBottom: "4px" }} />
                            <div className="skeleton-box" style={{ width: "50px", height: "12px" }} />
                        </div>
                        <div className="cust-history-col" style={{ flex: 1 }}>
                            <div className="skeleton-box" style={{ width: "120px", height: "18px", marginBottom: "4px" }} />
                            <div className="skeleton-box" style={{ width: "80px", height: "12px" }} />
                        </div>
                    </div>

                    <div className="cust-history-footer">
                        <div className="skeleton-box" style={{ width: "130px", height: "36px", borderRadius: "12px" }} />
                        <div className="skeleton-box" style={{ width: "80px", height: "16px" }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrderHistorySkeleton = () => {
    return (
        <div className="cust-orders-list">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <OrderHistoryCardSkeleton key={i} />
            ))}
        </div>
    );
};

export default OrderHistorySkeleton;
