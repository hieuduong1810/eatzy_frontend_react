import { useState, useEffect } from "react";
import { Star, Award, Phone, Mail, Bike, Calendar, ChevronRight, HelpCircle, Info, LogOut, UserCircle, Settings } from "lucide-react";
import driverAppApi from "../../../api/driver/driverAppApi";
import "../DriverApp.css";

const menuItems = [
    { icon: UserCircle, label: "Tài khoản", desc: "Cập nhật thông tin cá nhân" },
    { icon: Bike, label: "Phương tiện", desc: "Quản lý xe & giấy tờ" },
    { icon: Settings, label: "Cài đặt", desc: "Thông báo, ngôn ngữ" },
    { icon: HelpCircle, label: "Hỗ trợ", desc: "Liên hệ & FAQ" },
    { icon: Info, label: "Về Eatzy", desc: "Phiên bản 2.0.0" },
];

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const userStr = localStorage.getItem("auth_user");
            if (!userStr) return;
            const user = JSON.parse(userStr);

            const response = await driverAppApi.getMyProfile(user.id);
            const data = response.data?.data || response.data;

            // Map API data to component structure
            if (data) {
                setProfile({
                    profilePhoto: data.profile_photo || "https://via.placeholder.com/150",
                    name: data.user?.name || "Driver",
                    licensePlate: data.vehicle_license_plate || "N/A",
                    rating: data.averageRating || 5.0,
                    totalTrips: data.completedTrips || 0,
                    yearsActive: 1, // Mock or calc from date
                    phone: data.user?.phoneNumber || "N/A",
                    email: data.user?.email || "N/A",
                    joinDate: "01/01/2026" // Mock for now as not in DTO
                });
            }
        } catch (error) {
            console.error("Failed to fetch driver profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await driverAppApi.goOffline();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("access_token");
            localStorage.removeItem("auth_user");
            window.location.href = "/login";
        }
    };

    if (loading) {
        return <div className="driver-page flex items-center justify-center">Loading...</div>;
    }

    if (!profile) {
        return <div className="driver-page flex items-center justify-center">Không tìm thấy thông tin tài xế</div>;
    }

    return (
        <div className="driver-page">
            <div className="driver-page-header">
                <h1 className="driver-page-title">Tài khoản</h1>
            </div>
            <div className="driver-page-scroll">
                {/* Profile Card */}
                <div className="profile-card">
                    <div className="profile-avatar-wrap">
                        <div className="profile-avatar">
                            <img src={profile.profilePhoto} alt={profile.name} onError={(e) => e.target.src = "https://via.placeholder.com/150"} />
                        </div>
                        <div className="profile-avatar-badge">
                            <Star size={14} fill="white" color="white" />
                        </div>
                    </div>

                    <div className="profile-info-center">
                        <h2 className="profile-name">{profile.name}</h2>
                        <div className="profile-plate">
                            <Award size={14} />
                            <span>{profile.licensePlate}</span>
                        </div>
                    </div>

                    <div className="profile-stats-grid">
                        <div className="profile-stat">
                            <div className="profile-stat-value">
                                {profile.rating} <Star size={14} fill="#FACC15" color="#FACC15" />
                            </div>
                            <div className="profile-stat-label">Đánh giá</div>
                        </div>
                        <div className="profile-stat profile-stat--border">
                            <div className="profile-stat-value">{profile.totalTrips}</div>
                            <div className="profile-stat-label">Chuyến xe</div>
                        </div>
                        <div className="profile-stat profile-stat--border">
                            <div className="profile-stat-value">{profile.yearsActive}</div>
                            <div className="profile-stat-label">Năm h.động</div>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="profile-contact-card">
                    <div className="profile-contact-item">
                        <Phone size={16} />
                        <span>{profile.phone}</span>
                    </div>
                    <div className="profile-contact-item">
                        <Mail size={16} />
                        <span>{profile.email}</span>
                    </div>
                    <div className="profile-contact-item">
                        <Calendar size={16} />
                        <span>Tham gia: {profile.joinDate}</span>
                    </div>
                </div>

                {/* Menu */}
                <div className="profile-menu">
                    {menuItems.map(({ icon: Icon, label, desc }, i) => (
                        <button key={i} className="profile-menu-item">
                            <div className="profile-menu-icon"><Icon size={20} /></div>
                            <div className="profile-menu-info">
                                <div className="profile-menu-label">{label}</div>
                                <div className="profile-menu-desc">{desc}</div>
                            </div>
                            <ChevronRight size={18} className="profile-menu-arrow" />
                        </button>
                    ))}
                </div>

                {/* Logout */}
                <button className="profile-logout-btn" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
