import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import DriverApp from "./apps/driver/DriverApp.jsx";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import { WebSocketProvider } from "./contexts/WebSocketContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <NotificationProvider>
                <WebSocketProvider>
                    <DriverApp />
                </WebSocketProvider>
            </NotificationProvider>
        </BrowserRouter>
    </React.StrictMode>
);
