import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../../components/shared/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "../../layouts/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import RestaurantsPage from "./pages/RestaurantsPage";
import DriversPage from "./pages/DriversPage";
import CustomersPage from "./pages/CustomersPage";
import FinancePage from "./pages/FinancePage";
import PromotionsPage from "./pages/PromotionsPage";
import SystemConfigPage from "./pages/SystemConfigPage";
import PermissionsPage from "./pages/PermissionsPage";

const AdminApp = () => {
    return (
        <Routes>
            <Route path="login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route element={
                <ProtectedRoute loginPath="login">
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="restaurants" element={<RestaurantsPage />} />
                <Route path="drivers" element={<DriversPage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="finance" element={<FinancePage />} />
                <Route path="promotions" element={<PromotionsPage />} />
                <Route path="system-config" element={<SystemConfigPage />} />
                <Route path="permissions" element={<PermissionsPage />} />
                <Route path="profile" element={<div className="page-container"><h1 className="page-title">Hồ sơ cá nhân</h1><p className="page-subtitle">Trang đang phát triển...</p></div>} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AdminApp;
