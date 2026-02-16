import { useState, useEffect } from "react";

import AdminSidebar from "../components/shared/Sidebar";
import "./AdminLayout.css";
import { useWebSocket } from "../contexts/WebSocketContext";
import { useNotification } from "../contexts/NotificationContext";

const AdminLayout = ({ children }) => {
    const { client, isConnected } = useWebSocket();
    const { showNotification } = useNotification();

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
                    showNotification(title, msg, type);
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [client, isConnected, showNotification]);

    return (
        <div className="admin-root">
            <AdminSidebar />
            <div className="admin-main">
                <header className="admin-header">
                </header>
                <div className="admin-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
