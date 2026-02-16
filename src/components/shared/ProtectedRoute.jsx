import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

/**
 * ProtectedRoute - wraps routes that require authentication.
 * Redirects to the login page if the user is not authenticated.
 * loginPath should be relative (e.g., "login" not "/login").
 * It auto-detects the app prefix from the current URL.
 * 
 * @param {{ children: React.ReactNode, loginPath?: string }} props
 */
const ProtectedRoute = ({ children, loginPath = "login" }) => {
    const { isAuthenticated } = useAuthStore();
    const location = useLocation();

    console.log("ProtectedRoute Debug:", { path: location.pathname, isAuthenticated, loginPath });

    if (!isAuthenticated) {
        let target = loginPath;
        if (!loginPath.startsWith("/")) {
            // Build absolute login path from current location
            // e.g., /admin/dashboard -> /admin/login, /driver/home -> /driver/login
            const pathParts = location.pathname.split("/").filter(Boolean);
            const appPrefix = pathParts.length > 0 ? `/${pathParts[0]}` : "";
            target = `${appPrefix}/${loginPath}`;
        }

        return <Navigate to={target} state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
