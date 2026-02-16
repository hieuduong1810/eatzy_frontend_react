import { X, ShieldCheck, Mail, Phone, Calendar, MapPin, Clock, ShoppingBag, CreditCard, Star, ChevronRight } from "lucide-react";
import "./CustomerDetail.css";

const CustomerDetail = ({ customer, onClose }) => {
    if (!customer) return null;

    // Helper to extract nested user data safely
    const user = customer.user || {};

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="customer-detail-overlay" onClick={onClose}>
            <div className="customer-detail-container" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="customer-header-bar">
                    <div className="header-left">
                        <h2 className="dossier-title">CUSTOMER DOSSIER</h2>
                        <div className="account-id-chip">
                            <span className="chip-label">ACCOUNT ID:</span>
                            <span className="chip-value">{String(customer.id).padStart(6, '0')}</span>
                        </div>
                    </div>
                </div>

                <div className="customer-body-wrapper">
                    {/* Main Content Grid */}
                    <div className="customer-content-grid">

                        {/* Left Column - Identity */}
                        <div className="cust-card profile-card">
                            <div className="profile-image-container">
                                <img
                                    src={user.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "Customer")}&background=f3f4f6&color=6b7280`}
                                    alt="Profile"
                                    className="profile-img"
                                />
                                {/* Verified Badge */}
                                <div className="verified-badge">
                                    <ShieldCheck size={14} />
                                </div>
                            </div>

                            <h3 className="profile-name">{user.name || "Unknown Customer"}</h3>
                            <div className="profile-role">PLATFORM CUSTOMER</div>

                            <div className="contact-list">
                                <div className="contact-item">
                                    <Phone size={16} className="text-green-600" />
                                    <span>{user.phoneNumber || "No phone provided"}</span>
                                </div>
                                <div className="contact-item">
                                    <Mail size={16} className="text-green-600" />
                                    <span>{user.email || "No email provided"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Details */}
                        <div className="cust-card details-card">
                            <div className="info-row">
                                <div className="info-icon-box">
                                    <Calendar size={20} />
                                </div>
                                <div className="info-content">
                                    <span className="info-label">BIRTHDAY</span>
                                    <div className="info-value">{user.dob ? formatDate(user.dob) : "June 1, 1999"}</div>
                                </div>
                            </div>

                            <div className="info-row">
                                <div className="info-icon-box">
                                    <MapPin size={20} />
                                </div>
                                <div className="info-content">
                                    <span className="info-label">HOMETOWN</span>
                                    <div className="info-value">{customer.hometown || "Quảng Ngãi"}</div>
                                </div>
                            </div>

                            <div className="info-row">
                                <div className="info-icon-box">
                                    <Clock size={20} />
                                </div>
                                <div className="info-content">
                                    <span className="info-label">MEMBER SINCE</span>
                                    <div className="info-value">{formatDate(user.createdAt) || "N/A"}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="customer-stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon-circle blue">
                                <ShoppingBag size={20} />
                            </div>
                            <div className="stat-data">
                                <div className="stat-value">--</div>
                                <div className="stat-label">TOTAL ORDERS</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon-circle green">
                                <CreditCard size={20} />
                            </div>
                            <div className="stat-data">
                                <div className="stat-value">--</div>
                                <div className="stat-label">TOTAL SPENT</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon-circle orange">
                                <Star size={20} />
                            </div>
                            <div className="stat-data">
                                <div className="stat-value">--</div>
                                <div className="stat-label">REVIEW COUNT</div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Security */}
                    <div className="security-footer">
                        <div className="security-content-left" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(132, 204, 22, 0.15)', color: '#84cc16', borderRadius: '18px', border: '1px solid rgba(132, 204, 22, 0.1)', flexShrink: 0 }}>
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 4px', fontFamily: 'Oswald, sans-serif', fontSize: '18px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>SECURITY & PRIVACY</h4>
                                <p className="security-text">
                                    Hồ sơ khách hàng này được bảo vệ bởi chính sách bảo mật của Eatzy. Các thay đổi về trạng thái tài khoản sẽ được ghi lại trong nhật ký hệ thống.
                                </p>
                            </div>
                        </div>
                        <button className="customer-close-btn" onClick={onClose}>
                            CLOSE DOSSIER <ChevronRight size={18} strokeWidth={3} />
                        </button>
                    </div>
                </div>

            </div>
        </div >
    );
};

export default CustomerDetail;
