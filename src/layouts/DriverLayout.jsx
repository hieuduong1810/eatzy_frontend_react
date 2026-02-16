import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, History, Wallet, User } from "lucide-react";
import { useWebSocket } from "../contexts/WebSocketContext";
import OrderNotification from "../components/shared/notifications/OrderNotification";
import "../components/shared/notifications/OrderNotification.css";
import "./DriverLayout.css";

const tabs = [
    { id: "home", label: "Home", path: "home", Icon: Home },
    { id: "history", label: "History", path: "history", Icon: History },
    { id: "wallet", label: "Wallet", path: "wallet", Icon: Wallet },
    { id: "profile", label: "Profile", path: "profile", Icon: User },
];

const DriverLayout = ({ children }) => {
    const location = useLocation();
    const { client, isConnected } = useWebSocket();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (!client || !isConnected) return;

        const subscription = client.subscribe('/user/queue/orders', (message) => {
            if (message.body) {
                const notif = JSON.parse(message.body);

                let title = "Order Update";
                let msg = "";
                let type = "info";

                if (notif.type === 'ORDER_ASSIGNED') {
                    title = "New Order Offer";
                    msg = "You have a new delivery request!";
                    type = "info";
                } else if (notif.type === 'ORDER_STATUS_CHANGED') {
                    title = "Order Status Update";
                    msg = `Order #${notif.data.id} is now ${notif.data.orderStatus}`;
                    type = "info";
                }

                if (msg) {
                    setNotification({
                        title,
                        message: msg,
                        type,
                        timestamp: Date.now()
                    });

                    // Auto hide
                    setTimeout(() => setNotification(null), 5000);
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [client, isConnected]);

    return (
        <div className="driver-root">
            {notification && (
                <OrderNotification
                    title={notification.title}
                    message={notification.message}
                    type={notification.type}
                    timestamp={notification.timestamp}
                    onClose={() => setNotification(null)}
                />
            )}
            <div className="driver-content">{children}</div>
            <div className="driver-bottombar-wrapper">
                <nav className="driver-bottombar">
                    {tabs.map(({ id, label, path, Icon }) => {
                        const active = location.pathname.endsWith(`/${path}`);
                        return (
                            <NavLink key={id} to={`/${path}`} className={`driver-tab ${active ? "driver-tab--active" : ""}`}>
                                <div className="driver-tab-inner">
                                    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                                    {active && <span className="driver-tab-label">{label}</span>}
                                </div>
                                {active && <div className="driver-tab-bg" />}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default DriverLayout;
