import { useNavigate } from "react-router-dom";
import { User, CreditCard, ShieldCheck, LogOut, MapPin, Bell, HelpCircle, ChevronRight, Star, ShoppingBag, MessageSquare } from "lucide-react";
import { mockCustomerProfile } from "../data/mockCustomerData";
import "../CustomerApp.css";

const menuSections = [
    {
        title: "Tài khoản",
        items: [
            { icon: User, label: "Thông tin cá nhân", sub: "Chỉnh sửa hồ sơ" },
            { icon: MapPin, label: "Địa chỉ đã lưu", sub: "Nhà riêng, Công ty" },
            { icon: CreditCard, label: "Phương thức thanh toán", sub: "Visa **** 1234" },
        ],
    },
    {
        title: "Ứng dụng",
        items: [
            { icon: Bell, label: "Cài đặt thông báo" },
            { icon: ShieldCheck, label: "Bảo mật & Quyền riêng tư" },
            { icon: HelpCircle, label: "Trung tâm trợ giúp" },
        ],
    },
];

export default function ProfilePage() {
    const navigate = useNavigate();
    const profile = mockCustomerProfile;

    return (
        <div className="cust-page cust-page--fullheight">
            <div className="cust-page-scroll">
                <div className="cust-container cust-profile-container">

                    {/* ── Profile Card ── */}
                    <div className="cust-profile-card">
                        <div className="cust-profile-card-top">
                            <div className="cust-profile-avatar-wrap">
                                <img src={profile.profilePhoto} alt={profile.name} className="cust-profile-avatar" />
                                <span className="cust-profile-tier">{profile.membershipTier}</span>
                            </div>
                            <div className="cust-profile-info">
                                <h2 className="cust-profile-name">{profile.name}</h2>
                                <p className="cust-profile-contact">{profile.phone}</p>
                                <p className="cust-profile-contact">{profile.email}</p>
                            </div>
                        </div>
                        <div className="cust-profile-stats">
                            <div className="cust-profile-stat">
                                <ShoppingBag size={18} />
                                <span className="cust-stat-value">{profile.totalOrders}</span>
                                <span className="cust-stat-label">Đơn hàng</span>
                            </div>
                            <div className="cust-profile-stat">
                                <MessageSquare size={18} />
                                <span className="cust-stat-value">{profile.reviewsCount}</span>
                                <span className="cust-stat-label">Đánh giá</span>
                            </div>
                            <div className="cust-profile-stat">
                                <Star size={18} />
                                <span className="cust-stat-value">{profile.rewardPoints}</span>
                                <span className="cust-stat-label">Điểm thưởng</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Menu Sections ── */}
                    {menuSections.map((section, sIdx) => (
                        <div key={sIdx} className="cust-profile-section">
                            <h3 className="cust-profile-section-title">{section.title}</h3>
                            <div className="cust-profile-menu">
                                {section.items.map((item, i) => (
                                    <button key={i} className="cust-profile-menu-item">
                                        <div className="cust-profile-menu-icon">
                                            <item.icon size={20} />
                                        </div>
                                        <div className="cust-profile-menu-text">
                                            <span className="cust-profile-menu-label">{item.label}</span>
                                            {item.sub && <span className="cust-profile-menu-sub">{item.sub}</span>}
                                        </div>
                                        <ChevronRight size={18} className="cust-profile-menu-arrow" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* ── Logout ── */}
                    <div className="cust-profile-section">
                        <button className="cust-profile-menu-item cust-profile-menu-item--danger">
                            <div className="cust-profile-menu-icon cust-profile-menu-icon--danger">
                                <LogOut size={20} />
                            </div>
                            <div className="cust-profile-menu-text">
                                <span className="cust-profile-menu-label">Đăng xuất</span>
                                <span className="cust-profile-menu-sub">v2.0.1</span>
                            </div>
                            <ChevronRight size={18} className="cust-profile-menu-arrow" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
