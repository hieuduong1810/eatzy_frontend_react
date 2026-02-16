import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import OrderNotification from '../components/shared/notifications/OrderNotification';
import '../components/shared/notifications/OrderNotification.css';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);
    const timeoutRef = useRef(null);

    const showNotification = useCallback((title, message, type = "info") => {
        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setNotification({
            title,
            message,
            type,
            timestamp: Date.now()
        });

        // Auto hide after 5 seconds
        timeoutRef.current = setTimeout(() => {
            setNotification(null);
            timeoutRef.current = null;
        }, 5000);
    }, []);

    const hideNotification = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setNotification(null);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification }}>
            {children}
            {notification && (
                <OrderNotification
                    title={notification.title}
                    message={notification.message}
                    type={notification.type}
                    timestamp={notification.timestamp}
                    onClose={hideNotification}
                />
            )}
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
