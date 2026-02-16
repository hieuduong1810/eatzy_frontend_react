import { Routes, Route, Navigate } from "react-router-dom";
import RestaurantLayout from "../../layouts/RestaurantLayout";
import ProtectedRoute from "../../components/shared/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OrdersPage from "./pages/OrdersPage";
import MenuPage from "./pages/MenuPage";
import HistoryPage from "./pages/HistoryPage";
import ReviewsPage from "./pages/ReviewsPage";
import StorePage from "./pages/StorePage";
import ReportsPage from "./pages/ReportsPage";
import WalletPage from "./pages/WalletPage";

/**
 * RestaurantLayout uses {children} pattern (not <Outlet />),
 * so we wrap each page individually inside the layout.
 */
const WithRestaurantLayout = ({ children }) => (
    <ProtectedRoute loginPath="/login">
        <RestaurantLayout>{children}</RestaurantLayout>
    </ProtectedRoute>
);

import { WebSocketProvider } from "../../contexts/WebSocketContext";

const RestaurantApp = () => {
    return (
        <WebSocketProvider>
            <Routes>
                {/* Public routes */}
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

                {/* Protected routes with layout */}
                <Route path="orders" element={<WithRestaurantLayout><OrdersPage /></WithRestaurantLayout>} />
                <Route path="menu" element={<WithRestaurantLayout><MenuPage /></WithRestaurantLayout>} />
                <Route path="history" element={<WithRestaurantLayout><HistoryPage /></WithRestaurantLayout>} />
                <Route path="reviews" element={<WithRestaurantLayout><ReviewsPage /></WithRestaurantLayout>} />
                <Route path="store" element={<WithRestaurantLayout><StorePage /></WithRestaurantLayout>} />
                <Route path="reports" element={<WithRestaurantLayout><ReportsPage /></WithRestaurantLayout>} />
                <Route path="wallet" element={<WithRestaurantLayout><WalletPage /></WithRestaurantLayout>} />
                <Route path="*" element={<Navigate to="../orders" replace />} />
            </Routes>
        </WebSocketProvider>
    );
};

export default RestaurantApp;
