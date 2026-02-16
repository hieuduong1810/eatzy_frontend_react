import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    ShoppingCart,
    UtensilsCrossed,
    History,
    Star,
    Store,
    BarChart3,
    Wallet,
    LogOut,
    User,
} from "lucide-react";
import NavItem from "../../../components/shared/NavItem";
import "../../../components/shared/Sidebar.css";
import { authActions } from "../../../stores/authStore";
import restaurantAppApi from "../../../api/restaurant/restaurantAppApi";

const menuItems = [
    { id: "orders", icon: ShoppingCart, text: "Đơn hàng" },
    { id: "menu", icon: UtensilsCrossed, text: "Thực đơn" },
    { id: "history", icon: History, text: "Lịch sử đơn hàng" },
    { id: "reviews", icon: Star, text: "Đánh giá" },
    { id: "store", icon: Store, text: "Cửa hàng" },
    { id: "reports", icon: BarChart3, text: "Báo cáo" },
    { id: "wallet", icon: Wallet, text: "Ví cửa hàng" },
];

const RestaurantSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [hovered, setHovered] = useState(false);
    const [restaurant, setRestaurant] = useState(null);

    const pathSegments = location.pathname.split("/");
    const activeSection = pathSegments[pathSegments.length - 1] || "orders";

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const res = await restaurantAppApi.getMyRestaurant();
                if (res && res.data) {
                    setRestaurant(res.data.data || res.data);
                }
            } catch (error) {
                console.error("Failed to fetch restaurant profile", error);
            }
        };
        fetchRestaurant();
    }, []);

    const handleNav = (sectionId) => {
        navigate(`../${sectionId}`);
    };

    const handleLogout = () => {
        authActions.logout();
        navigate("/login");
    };

    const handleProfileClick = () => {
        navigate("../store");
    };

    return (
        <div
            className={`sidebar ${hovered ? "expanded" : "collapsed"}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="sidebar-bg-effect" />

            <div className="sidebar-profile" onClick={handleProfileClick}>
                <div className="sidebar-profile-hover-overlay" />
                <div className="sidebar-avatar">
                    <User size={22} />
                </div>
                {hovered && (
                    <div className="sidebar-profile-info">
                        <p className="sidebar-profile-name">{restaurant?.name || "Nhà hàng"}</p>
                        <p className="sidebar-profile-email">{restaurant?.owner?.email || "restaurant@eatzy.vn"}</p>
                    </div>
                )}
            </div>

            <div className="sidebar-nav">
                <div className="sidebar-nav-label">
                    {hovered ? "Quản lý nhà hàng" : "QL"}
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
        </div>
    );
};

export default RestaurantSidebar;
