import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useAuthStore } from '../stores/authStore';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const clientRef = useRef(null);
    const { token, user } = useAuthStore();

    useEffect(() => {
        // If no token, don't connect
        if (!token) {
            return;
        }

        // If already connected, don't reconnect (unless token changed, which useEffect handles)
        if (clientRef.current && clientRef.current.active) {
            return;
        }

        let socket;
        try {
            socket = new SockJS('https://eatzy-be.hoanduong.net/ws?token=' + token);
        } catch (error) {
            console.error("Failed to create SockJS instance:", error);
            return;
        }

        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log('STOMP: ' + str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: (frame) => {
                console.log('Connected to WebSocket');
                setIsConnected(true);

                // Subscribe to user-specific queue for orders
                stompClient.subscribe('/user/queue/orders', (message) => {
                    if (message.body) {
                        const notification = JSON.parse(message.body);
                        console.log('Received order notification:', notification);
                        // You can add a toast notification here or dispatch an event
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
                setIsConnected(false);
            }
        });

        stompClient.activate();
        clientRef.current = stompClient;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
                setIsConnected(false);
            }
        };
    }, [token]);

    return (
        <WebSocketContext.Provider value={{ client: clientRef.current, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
