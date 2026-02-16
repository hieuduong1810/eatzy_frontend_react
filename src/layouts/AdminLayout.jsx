import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../apps/admin/components/AdminSidebar";
import "./AdminLayout.css";
import { useWebSocket } from "../contexts/WebSocketContext";
import OrderNotification from "../components/shared/notifications/OrderNotification";
import "../components/shared/notifications/OrderNotification.css";

const AdminLayout = () => {
    const { client, isConnected } = useWebSocket();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (!client || !isConnected) return;

        // Admin might subscribe to a general admin queue or specific topics
        // For now, let's subscribe to /topic/orders (if it exists) or just user queue
        const subscription = client.subscribe('/user/queue/orders', (message) => {
            if (message.body) {
                const notif = JSON.parse(message.body);

                let title = "System Notification";
                let msg = "";
                let type = "info";

                if (notif.type === 'NEW_ORDER') {
                    title = "New Order Created";
                    msg = `Order #${notif.data.id} created`;
                    type = "info";
                }

                if (msg) {
                    setNotification({
                        title,
                        message: msg,
                        type,
                        timestamp: Date.now()
                    });
                    setTimeout(() => setNotification(null), 5000);
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [client, isConnected]);

    return (
        <div className="admin-root">
            {notification && (
                <OrderNotification
                    title={notification.title}
                    message={notification.message}
                    type={notification.type}
                    timestamp={notification.timestamp}
                    onClose={() => setNotification(null)}
                />
            )}
            <AdminSidebar />
            <div className="admin-main">
                <header className="admin-header">
                    <h2 className="admin-header-title">Admin Dashboard</h2>
                    <div className="admin-header-actions">
                        {/* Add header actions here if needed */}
                        <div className="admin-user-info">
                            <span>Admin User</span>
                        </div>
                    </div>
                </header>
                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
