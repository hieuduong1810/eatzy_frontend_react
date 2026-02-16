import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "../../../components/shared/AuthLayout";
import authApi from "../../../api/authApi";
import { authActions } from "../../../stores/authStore";
import { useNotification } from "../../../contexts/NotificationContext";

const CustomerLoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "../home";

    const { showNotification } = useNotification();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email.trim()) { setError("Vui lòng nhập email"); return; }
        if (!password.trim()) { setError("Vui lòng nhập mật khẩu"); return; }

        setIsLoading(true);
        try {
            const response = await authApi.login(email, password);
            const data = response.data?.data || response.data;
            const accessToken = data.access_token;
            const user = data.user;

            if (accessToken && user) {
                authActions.setLogin(accessToken, user);
                showNotification("Đăng nhập thành công!", "Chào mừng trở lại", "success");
                navigate(from, { replace: true });
            } else {
                setError("Phản hồi không hợp lệ từ máy chủ");
            }
        } catch (err) {
            const message =
                err.response?.data?.message || err.response?.data?.error ||
                "Email hoặc mật khẩu không chính xác";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            appName="Khách hàng"
            badgeColor="linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))"
            subtitle="Đặt đồ ăn yêu thích, giao nhanh tận nơi"
        >
            <div className="auth-form-header">
                <h2 className="auth-form-title">Đăng nhập</h2>
                <p className="auth-form-subtitle">Chào mừng bạn quay trở lại</p>
            </div>

            {error && (
                <div className="auth-error-alert">
                    <div className="auth-error-icon">!</div>
                    <span className="auth-error-text">{error}</span>
                </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <div className="auth-input-group">
                    <label className="auth-input-label">Email</label>
                    <input
                        type="email"
                        className="auth-input"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        disabled={isLoading}
                    />
                </div>

                <div className="auth-input-group">
                    <label className="auth-input-label">Mật khẩu</label>
                    <div className="auth-password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="auth-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="auth-password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <div className="auth-spinner"></div>
                            <span>Đang đăng nhập...</span>
                        </>
                    ) : (
                        "Đăng nhập"
                    )}
                </button>
            </form>

            <div className="auth-links">
                <span className="auth-links-text">Chưa có tài khoản?</span>
                <Link to="../register" className="auth-links-action">Đăng ký ngay</Link>
            </div>
        </AuthLayout>
    );
};

export default CustomerLoginPage;
