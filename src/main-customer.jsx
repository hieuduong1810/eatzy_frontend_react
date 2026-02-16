import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import CustomerApp from "./apps/customer/CustomerApp.jsx";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import { WebSocketProvider } from "./contexts/WebSocketContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <NotificationProvider>
                <WebSocketProvider>
                    <CustomerApp />
                </WebSocketProvider>
            </NotificationProvider>
        </BrowserRouter>
    </React.StrictMode>
);
