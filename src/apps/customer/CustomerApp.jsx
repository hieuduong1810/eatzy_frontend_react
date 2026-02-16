import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import CustomerLayout from "../../layouts/CustomerLayout";
import ProtectedRoute from "../../components/shared/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";
import OrdersPage from "./pages/OrdersPage";
import CurrentOrderPage from "./pages/CurrentOrderPage";
import ProfilePage from "./pages/ProfilePage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import CheckoutPage from "./pages/CheckoutPage";

// import { WebSocketProvider } from "../../contexts/WebSocketContext";
// import { NotificationProvider } from "../../contexts/NotificationContext";

const WithCustomerLayout = ({ children }) => (
    <ProtectedRoute loginPath="/login">
        <CustomerLayout>{children}</CustomerLayout>
    </ProtectedRoute>
);

const CustomerApp = () => {
    console.log("CustomerApp Rendering. Path:", window.location.pathname);
    return (
        <CartProvider>
            <Routes>
                {/* Public routes */}
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

                {/* Protected routes with layout */}
                <Route index element={<Navigate to="home" replace />} />
                <Route path="/home" element={<WithCustomerLayout><HomePage /></WithCustomerLayout>} />
                <Route path="/favorites" element={<WithCustomerLayout><FavoritesPage /></WithCustomerLayout>} />
                <Route path="/orders" element={<WithCustomerLayout><OrdersPage /></WithCustomerLayout>} />
                <Route path="/current-order" element={<WithCustomerLayout><CurrentOrderPage /></WithCustomerLayout>} />
                <Route path="/profile" element={<WithCustomerLayout><ProfilePage /></WithCustomerLayout>} />
                <Route path="/restaurant/:slug" element={<WithCustomerLayout><RestaurantDetailPage /></WithCustomerLayout>} />
                <Route path="checkout" element={<ProtectedRoute loginPath="/login"><CheckoutPage /></ProtectedRoute>} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="../home" replace />} />
            </Routes>
        </CartProvider>
    );
};

export default CustomerApp;
