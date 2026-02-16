import { ShoppingBag, Store, Truck, Users, AlertCircle } from "lucide-react";

const getIcon = (type) => {
    switch (type?.toLowerCase()) {
        case "order": return ShoppingBag;
        case "restaurant": return Store;
        case "driver": return Truck;
        case "user": return Users;
        default: return AlertCircle;
    }
};

const getIconColorClass = (type) => {
    switch (type?.toLowerCase()) {
        case "order": return "activity-icon-blue";
        case "restaurant": return "activity-icon-orange";
        case "driver": return "activity-icon-purple";
        case "user": return "activity-icon-green";
        default: return "activity-icon-gray";
    }
};

const formatTime = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Vừa xong";
    if (mins < 60) return `${mins} phút trước`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
};

const ActivityList = ({ activities }) => {
    return (
        <div className="activity-list card">
            <div className="activity-list-header">
                <h3 className="activity-list-title">Hoạt động gần đây</h3>
                <button className="activity-list-link">Xem tất cả</button>
            </div>

            <div className="activity-list-items">
                {activities.map((activity) => {
                    const Icon = getIcon(activity.type);
                    const colorClass = getIconColorClass(activity.type);

                    return (
                        <div key={activity.id} className="activity-item">
                            <div className="activity-item-left">
                                <div className={`activity-item-icon ${colorClass}`}>
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <p className="activity-item-desc">{activity.description}</p>
                                    <p className="activity-item-meta">
                                        {activity.type}
                                        {activity.status ? ` • ${activity.status}` : ""}
                                    </p>
                                </div>
                            </div>
                            <div className="activity-item-time">
                                {formatTime(activity.timestamp)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ActivityList;
