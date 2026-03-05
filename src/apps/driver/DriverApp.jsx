import { Routes, Route, Navigate } from "react-router-dom";
import DriverLayout from "../../layouts/DriverLayout";
import ProtectedRoute from "../../components/shared/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import WalletPage from "./pages/WalletPage";
import ProfilePage from "./pages/ProfilePage";

const DriverApp = () => {
    console.log("DriverApp Render. Path:", window.location.pathname);
    return (
        <Routes>
            {/* Public routes */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Protected routes with layout */}
            <Route path="/" element={<ProtectedRoute loginPath="/login"><DriverLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="home" replace />} />
                <Route path="home" element={<HomePage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    );
};

export default DriverApp;
