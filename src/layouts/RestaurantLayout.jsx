import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import RestaurantSidebar from "../apps/restaurant/components/RestaurantSidebar";
import { useWebSocket } from "../contexts/WebSocketContext";
import { useNotification } from "../contexts/NotificationContext";
import "./RestaurantLayout.css";

const RestaurantLayout = ({ children }) => {
    const { client, isConnected } = useWebSocket();
    const { showNotification } = useNotification();

    useEffect(() => {
        if (!client || !isConnected) return;

        console.log("RestaurantLayout: Subscribing to /user/queue/orders");
        const subscription = client.subscribe('/user/queue/orders', (message) => {
            if (message.body) {
                const notif = JSON.parse(message.body);
                console.log("Restaurant received:", notif);

                // New Order for Restaurant
                if (notif.type === 'NEW_ORDER') {
                    showNotification("New Order!", notif.message, "success");
                } else if (notif.type === 'ORDER_STATUS_CHANGED') {
                    showNotification("Order Update", notif.message, "info");
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [client, isConnected, showNotification]);

    return (
        <div className="resto-root">
            <RestaurantSidebar />

            {/* Main content */}
            <div className="resto-main">
                <Outlet />
            </div>
        </div>
    );
};

export default RestaurantLayout;
