import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import AuthLayout from "../../../components/shared/AuthLayout";
import authApi from "../../../api/authApi";

const CustomerRegisterPage = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validate = () => {
        const errors = {};
        if (!name.trim()) errors.name = "Vui lòng nhập họ tên";
        if (!email.trim()) errors.email = "Vui lòng nhập email";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Email không hợp lệ";
        if (!password) errors.password = "Vui lòng nhập mật khẩu";
        else if (password.length < 6) errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        if (password !== confirmPassword) errors.confirmPassword = "Mật khẩu xác nhận không khớp";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validate()) return;

        setIsLoading(true);
        try {
            await authApi.register({ name, email, password });
            setIsSuccess(true);
        } catch (err) {
            const message =
                err.response?.data?.message || err.response?.data?.error ||
                "Đăng ký thất bại, vui lòng thử lại";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <AuthLayout
                appName="Khách hàng"
                badgeColor="linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))"
                subtitle="Đặt đồ ăn yêu thích, giao nhanh tận nơi"
            >
                <div style={{ textAlign: "center", padding: "var(--space-8) 0" }}>
                    <div style={{
                        width: 72, height: 72, borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto var(--space-6)",
                        boxShadow: "0 8px 30px rgba(120, 200, 65, 0.3)",
                        animation: "cardSlideUp 0.5s ease forwards"
                    }}>
                        <CheckCircle size={36} color="white" strokeWidth={2.5} />
                    </div>
                    <h2 className="auth-form-title" style={{ textAlign: "center", marginBottom: "var(--space-3)" }}>
                        Đăng ký thành công!
                    </h2>
                    <p className="auth-form-subtitle" style={{ marginBottom: "var(--space-8)" }}>
                        Tài khoản của bạn đã được tạo thành công
                    </p>
                    <button
                        className="auth-submit-btn"
                        onClick={() => navigate("../login")}
                        style={{ maxWidth: 280, margin: "0 auto" }}
                    >
                        Đăng nhập ngay
                    </button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            appName="Khách hàng"
            badgeColor="linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))"
            subtitle="Đặt đồ ăn yêu thích, giao nhanh tận nơi"
        >
            <button className="auth-back-btn" onClick={() => navigate("../login")}>
                <ArrowLeft size={18} />
                <span>Quay lại đăng nhập</span>
            </button>

            <div className="auth-form-header">
                <h2 className="auth-form-title">Đăng ký tài khoản</h2>
                <p className="auth-form-subtitle">Tạo tài khoản để bắt đầu đặt đồ ăn</p>
            </div>

            {error && (
                <div className="auth-error-alert">
                    <div className="auth-error-icon">!</div>
                    <span className="auth-error-text">{error}</span>
                </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <div className="auth-input-group">
                    <label className="auth-input-label">Họ và tên</label>
                    <input
                        type="text"
                        className={`auth-input ${fieldErrors.name ? "input-error" : ""}`}
                        placeholder="Nguyễn Văn A"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                    />
                    {fieldErrors.name && <p className="auth-field-error">{fieldErrors.name}</p>}
                </div>

                <div className="auth-input-group">
                    <label className="auth-input-label">Email</label>
                    <input
                        type="email"
                        className={`auth-input ${fieldErrors.email ? "input-error" : ""}`}
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        disabled={isLoading}
                    />
                    {fieldErrors.email && <p className="auth-field-error">{fieldErrors.email}</p>}
                </div>

                <div className="auth-input-group">
                    <label className="auth-input-label">Mật khẩu</label>
                    <div className="auth-password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            className={`auth-input ${fieldErrors.password ? "input-error" : ""}`}
                            placeholder="Tối thiểu 6 ký tự"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
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
                    {fieldErrors.password && <p className="auth-field-error">{fieldErrors.password}</p>}
                </div>

                <div className="auth-input-group">
                    <label className="auth-input-label">Xác nhận mật khẩu</label>
                    <div className="auth-password-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className={`auth-input ${fieldErrors.confirmPassword ? "input-error" : ""}`}
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="auth-password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {fieldErrors.confirmPassword && <p className="auth-field-error">{fieldErrors.confirmPassword}</p>}
                </div>

                <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <div className="auth-spinner"></div>
                            <span>Đang tạo tài khoản...</span>
                        </>
                    ) : (
                        "Đăng ký"
                    )}
                </button>
            </form>

            <div className="auth-links">
                <span className="auth-links-text">Đã có tài khoản?</span>
                <Link to="../login" className="auth-links-action">Đăng nhập</Link>
            </div>
        </AuthLayout>
    );
};

export default CustomerRegisterPage;
