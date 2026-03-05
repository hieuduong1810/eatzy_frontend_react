import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import OrderNotification from '../components/shared/notifications/OrderNotification';
import '../components/shared/notifications/OrderNotification.css';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const hideNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const showNotification = useCallback((title, message, type = "info") => {
        const id = Date.now() + Math.random();

        const newNotif = {
            id,
            title,
            message,
            type,
            timestamp: Date.now()
        };

        setNotifications((prev) => [newNotif, ...prev]);

        // Auto hide after 5 seconds
        setTimeout(() => {
            hideNotification(id);
        }, 5000);
    }, [hideNotification]);

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification }}>
            {children}
            <div className="cust-notif-container">
                {notifications.map((notif) => (
                    <OrderNotification
                        key={notif.id}
                        title={notif.title}
                        message={notif.message}
                        type={notif.type}
                        timestamp={notif.timestamp}
                        onClose={() => hideNotification(notif.id)}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
