import { Routes, Route, Navigate } from "react-router-dom";
import DriverLayout from "../../layouts/DriverLayout";
import ProtectedRoute from "../../components/shared/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import WalletPage from "./pages/WalletPage";
import ProfilePage from "./pages/ProfilePage";

/**
 * DriverLayout uses {children} pattern (not <Outlet />),
 * so we wrap each page individually inside the layout.
 */
const WithDriverLayout = ({ children }) => (
    <ProtectedRoute loginPath="/driver/login">
        <DriverLayout>{children}</DriverLayout>
    </ProtectedRoute>
);

const DriverApp = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Protected routes with layout */}
            {/* Protected routes with layout */}
            <Route path="/home" element={<WithDriverLayout><HomePage /></WithDriverLayout>} />
            <Route path="/history" element={<WithDriverLayout><HistoryPage /></WithDriverLayout>} />
            <Route path="/wallet" element={<WithDriverLayout><WalletPage /></WithDriverLayout>} />
            <Route path="/profile" element={<WithDriverLayout><ProfilePage /></WithDriverLayout>} />
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    );
};

export default DriverApp;
