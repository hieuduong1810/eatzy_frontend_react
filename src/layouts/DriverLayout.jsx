import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, History, Wallet, User } from "lucide-react";
import { useWebSocket } from "../contexts/WebSocketContext";
import { useNotification } from "../contexts/NotificationContext";
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
    const { showNotification } = useNotification();

    useEffect(() => {
        if (!client || !isConnected) return;

        const subscription = client.subscribe('/user/queue/orders', (message) => {
            if (message.body) {
                const notif = JSON.parse(message.body);

                if (notif.type === 'ORDER_ASSIGNED') {
                    showNotification("New Order Offer", notif.message, "info");
                } else if (notif.type === 'ORDER_STATUS_CHANGED') {
                    showNotification("Order Status Update", notif.message, "info");
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [client, isConnected, showNotification]);

    return (
        <div className="driver-root">

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
