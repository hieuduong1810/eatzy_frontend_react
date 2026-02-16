import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import CustomerApp from "./apps/customer/CustomerApp.jsx";
import { WebSocketProvider } from "./contexts/WebSocketContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <WebSocketProvider>
                <CustomerApp />
            </WebSocketProvider>
        </BrowserRouter>
    </React.StrictMode>
);
