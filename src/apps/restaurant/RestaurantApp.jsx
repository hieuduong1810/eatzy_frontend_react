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

const RestaurantApp = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Protected routes with layout */}
            <Route path="/" element={<ProtectedRoute loginPath="/login"><RestaurantLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="orders" replace />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="menu" element={<MenuPage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="reviews" element={<ReviewsPage />} />
                <Route path="store" element={<StorePage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="wallet" element={<WalletPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/orders" replace />} />
        </Routes>
    );
};

export default RestaurantApp;
