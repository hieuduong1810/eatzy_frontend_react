import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Store,
    Truck,
    Users,
    Settings,
    User,
    LogOut,
    Wallet,
    ShieldCheck,
    Ticket,
} from "lucide-react";
import { authActions } from "../../stores/authStore";
import authApi from "../../api/authApi";
import NavItem from "./NavItem";
import "./Sidebar.css";

const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, text: "Tổng quan" },
    { id: "restaurants", icon: Store, text: "Quản lý cửa hàng" },
    { id: "drivers", icon: Truck, text: "Quản lý tài xế" },
    { id: "customers", icon: Users, text: "Quản lý khách hàng" },
    { id: "finance", icon: Wallet, text: "Tài chính" },
    { id: "promotions", icon: Ticket, text: "Chương trình khuyến mãi" },
    { id: "system-config", icon: Settings, text: "Cấu hình hệ thống" },
    { id: "permissions", icon: ShieldCheck, text: "Quản lý phân quyền" },
];

import { useNotification } from "../../contexts/NotificationContext";

import SlideConfirmModal from "./SlideConfirmModal";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [hovered, setHovered] = useState(false);
    const { showNotification } = useNotification();

    // Logout Modal State
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Derive active section from path
    const pathSegments = location.pathname.split("/");
    const activeSection = pathSegments[pathSegments.length - 1] || "dashboard";

    const handleNav = (sectionId) => {
        navigate(`../${sectionId}`);
    };

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
    };

    const processLogout = async () => {
        setIsLoggingOut(true);
        try {
            await Promise.all([
                authApi.logout(),
                new Promise(resolve => setTimeout(resolve, 1000))
            ]);
        } catch (error) {
            console.error("Logout user failed", error);
        } finally {
            authActions.logout();
            showNotification("Đăng xuất thành công!", "Hẹn gặp lại", "success");
            navigate("/login");
            setIsLoggingOut(false);
            setIsLogoutModalOpen(false);
        }
    };

    const handleProfileClick = () => {
        navigate("../profile");
    };

    return (
        <div
            className={`sidebar ${hovered ? "expanded" : "collapsed"}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Animated liquid background */}
            <div className="sidebar-bg-effect" />

            {/* Profile section */}
            <div className="sidebar-profile" onClick={handleProfileClick}>
                <div className="sidebar-profile-hover-overlay" />
                <div className="sidebar-avatar">
                    <User size={22} />
                </div>
                {hovered && (
                    <div className="sidebar-profile-info">
                        <p className="sidebar-profile-name">Super Admin</p>
                        <p className="sidebar-profile-email">admin@eatzy.com</p>
                    </div>
                )}
            </div>

            {/* Navigation items */}
            <div className="sidebar-nav">
                <div className="sidebar-nav-label">
                    {hovered ? "Quản trị hệ thống" : "SA"}
                </div>

                {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <NavItem
                            key={item.id}
                            icon={<IconComponent size={20} strokeWidth={2.3} />}
                            text={item.text}
                            expanded={hovered}
                            active={activeSection === item.id}
                            onClick={() => handleNav(item.id)}
                        />
                    );
                })}
            </div>

            {/* Bottom section - Logout */}
            <div className="sidebar-bottom">
                <NavItem
                    icon={<LogOut size={20} strokeWidth={2.3} />}
                    text="Đăng xuất"
                    expanded={hovered}
                    active={false}
                    onClick={handleLogout}
                    isLogout
                />
            </div>

            <SlideConfirmModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={processLogout}
                title="Đăng xuất"
                description="Bạn có chắc chắn muốn đăng xuất khỏi quản trị?"
                isLoading={isLoggingOut}
                type="danger"
            />
        </div>
    );
};

export default Sidebar;
