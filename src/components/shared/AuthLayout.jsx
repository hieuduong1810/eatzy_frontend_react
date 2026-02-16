import "./AuthLayout.css";
import { UtensilsCrossed } from "lucide-react";

/**
 * AuthLayout - shared layout for login/register pages.
 * Left side: branding/illustration, right side: form content.
 *
 * @param {{ children: React.ReactNode, appName: string, badgeColor: string, subtitle?: string }} props
 */
const AuthLayout = ({ children, appName = "Eatzy", badgeColor = "var(--color-primary-dark)", subtitle }) => {
    return (
        <div className="auth-page">
            <div className="auth-card">
                {/* Left side - Branding */}
                <div className="auth-branding">
                    <div className="auth-branding-content">
                        <div className="auth-logo">
                            <UtensilsCrossed size={40} strokeWidth={2} />
                        </div>
                        <h1 className="auth-brand-title">Eatzy</h1>
                        <p className="auth-brand-subtitle">
                            {subtitle || "Nền tảng giao đồ ăn thông minh, nhanh chóng và tiện lợi"}
                        </p>
                    </div>
                    <div className="auth-branding-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                {/* Right side - Form */}
                <div className="auth-form-section">
                    <div className="auth-app-badge" style={{ background: badgeColor }}>
                        {appName}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
