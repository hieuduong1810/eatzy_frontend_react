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

import { WebSocketProvider } from "../../contexts/WebSocketContext";

const CustomerApp = () => {
    console.log("CustomerApp Rendering. Path:", window.location.pathname);
    return (
        <WebSocketProvider>
            <CartProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />

                    {/* Protected: checkout without layout */}
                    <Route
                        path="checkout"
                        element={
                            <ProtectedRoute loginPath="/login">
                                <CheckoutPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected routes with layout */}
                    <Route
                        element={
                            <ProtectedRoute loginPath="/login">
                                <CustomerLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="home" replace />} />
                        <Route path="home" element={<HomePage />} />
                        <Route path="favorites" element={<FavoritesPage />} />
                        <Route path="orders" element={<OrdersPage />} />
                        <Route path="current-order" element={<CurrentOrderPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="restaurant/:slug" element={<RestaurantDetailPage />} />
                    </Route>

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="../home" replace />} />
                </Routes>
            </CartProvider>
        </WebSocketProvider>
    );
};

export default CustomerApp;
