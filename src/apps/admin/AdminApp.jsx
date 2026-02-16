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

// import { WebSocketProvider } from "../../contexts/WebSocketContext";
// import { NotificationProvider } from "../../contexts/NotificationContext";

const WithAdminLayout = ({ children }) => (
    <ProtectedRoute loginPath="/login">
        <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
);

const AdminApp = () => {
    return (
        <Routes>
            <Route path="login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<WithAdminLayout><DashboardPage /></WithAdminLayout>} />
            <Route path="/restaurants" element={<WithAdminLayout><RestaurantsPage /></WithAdminLayout>} />
            <Route path="/drivers" element={<WithAdminLayout><DriversPage /></WithAdminLayout>} />
            <Route path="/customers" element={<WithAdminLayout><CustomersPage /></WithAdminLayout>} />
            <Route path="/finance" element={<WithAdminLayout><FinancePage /></WithAdminLayout>} />
            <Route path="/promotions" element={<WithAdminLayout><PromotionsPage /></WithAdminLayout>} />
            <Route path="/system-config" element={<WithAdminLayout><SystemConfigPage /></WithAdminLayout>} />
            <Route path="/permissions" element={<WithAdminLayout><PermissionsPage /></WithAdminLayout>} />
            <Route path="/profile" element={<WithAdminLayout><div className="page-container"><h1 className="page-title">Hồ sơ cá nhân</h1><p className="page-subtitle">Trang đang phát triển...</p></div></WithAdminLayout>} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AdminApp;
