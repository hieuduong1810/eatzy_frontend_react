import { ShoppingBag, Store, Truck, Users, Tag } from "lucide-react";
import "./DashboardComponents.css";

const DashboardHeader = ({ title, subtitle, stats, badge, badgeColor = "green", BadgeIcon = Tag }) => {
    const quickStats = [
        { icon: ShoppingBag, label: "Đơn mới", value: stats.activeOrders, colorClass: "qs-blue" },
        { icon: Store, label: "Cửa hàng", value: stats.totalRestaurants, colorClass: "qs-orange" },
        { icon: Truck, label: "Tài xế", value: stats.activeDrivers, colorClass: "qs-purple" },
        { icon: Users, label: "Khách hàng", value: stats.totalCustomers, colorClass: "qs-green" },
    ];

    return (
        <div className="dashboard-header">
            <div>
                {badge && (
                    <div className={`header-badge-pill ${badgeColor}`} style={{ marginBottom: '8px' }}>
                        <BadgeIcon size={12} />
                        <span>{badge}</span>
                    </div>
                )}
                <h1 className="header-title-modern">{title}</h1>
                <p className="header-subtitle-modern">{subtitle}</p>
            </div>

            <div className="quick-stats-bar">
                {quickStats.map((qs, idx) => {
                    const Icon = qs.icon;
                    return (
                        <div key={idx} className="quick-stats-wrapper">
                            {idx > 0 && <div className="quick-stats-divider" />}
                            <div className={`quick-stat-item ${qs.colorClass}`}>
                                <div className="quick-stat-icon">
                                    <Icon size={16} />
                                </div>
                                <div className="quick-stat-info">
                                    <span className="quick-stat-label">{qs.label}</span>
                                    <span className="quick-stat-value">{qs.value?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DashboardHeader;
