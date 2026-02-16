import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RestaurantSidebar from "../apps/restaurant/components/RestaurantSidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWebSocket } from "../contexts/WebSocketContext";
import OrderNotification from "../components/shared/notifications/OrderNotification";
import "../components/shared/notifications/OrderNotification.css";
import "./RestaurantLayout.css";

const RestaurantLayout = ({ children }) => {
    const { client, isConnected } = useWebSocket();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (!client || !isConnected) return;

        console.log("RestaurantLayout: Subscribing to /user/queue/orders");
        const subscription = client.subscribe('/user/queue/orders', (message) => {
            if (message.body) {
                const notif = JSON.parse(message.body);
                console.log("Restaurant received:", notif);

                let title = "Notification";
                let msg = "";
                let type = "info";

                // New Order for Restaurant
                if (notif.type === 'NEW_ORDER') {
                    title = "New Order!";
                    msg = `You received a new order #${notif.data.id}`;
                    type = "success";
                } else if (notif.type === 'ORDER_STATUS_CHANGED') {
                    title = "Order Status Changed";
                    msg = `Order #${notif.data.id} status: ${notif.data.orderStatus}`;
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
        <div className="resto-root">
            {notification && (
                <OrderNotification
                    title={notification.title}
                    message={notification.message}
                    type={notification.type}
                    timestamp={notification.timestamp}
                    onClose={() => setNotification(null)}
                />
            )}
            <RestaurantSidebar />

            {/* Main content */}
            <div className="resto-main">
                {children}
            </div>
            {/* Keep ToastContainer for internal toastify calls if any */}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default RestaurantLayout;
