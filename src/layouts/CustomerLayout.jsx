import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Home, History, Heart, User, Truck, ShoppingBag, Search, X, MapPin, Package, Menu, LogOut } from "lucide-react";
import { useCart } from "../apps/customer/context/CartContext";
import CartOverlay from "../apps/customer/components/CartOverlay";
import CurrentOrderOverlay from "../apps/customer/components/CurrentOrderOverlay";
import LocationPickerModal from "../apps/customer/components/LocationPickerModal"; // Import Modal
import { mockOrders } from "../apps/customer/data/mockCustomerData";
import { useAuthStore, authActions } from "../stores/authStore";
import { useLocationStore } from "../stores/locationStore";
import authApi from "../api/authApi";
import "./CustomerLayout.css";

const CustomerLayout = () => {
    const [cartOpen, setCartOpen] = useState(false);
    const [currentOrderOpen, setCurrentOrderOpen] = useState(false);
    const [locationPickerOpen, setLocationPickerOpen] = useState(false); // New state
    const [menuOpen, setMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { totalItems } = useCart();
    const { user, isAuthenticated } = useAuthStore();
    const { location: userLocation } = useLocationStore(); // Renamed to avoid conflict
    const locationRoute = useLocation();
    const isDetailPage = locationRoute.pathname.includes('/restaurant/');

    // ... (activeOrder logic) ... 
    // Simulate an active order (first PREPARING/DELIVERING order)
    const activeOrder = mockOrders.find(
        (o) => o.status === "PREPARING" || o.status === "DELIVERING"
    );

    // Mobile bottom nav visibility
    const [bottomNavVisible, setBottomNavVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            setBottomNavVisible(y <= lastScrollY.current || y < 30);
            lastScrollY.current = y;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const mobileNavTabs = [
        { id: "orders-active", name: "Current Order", icon: Truck, action: () => setCurrentOrderOpen(true) },
        { id: "history", name: "History", icon: History, to: "orders" },
        { id: "favorites", name: "Favorites", icon: Heart, to: "favorites" },
        { id: "profile", name: "Profile", icon: User, to: "profile" },
        { id: "home", name: "Home", icon: Home, to: "home" },
    ];

    const menuItems = [
        { icon: Home, label: "Trang chủ", to: "home" },
        { icon: History, label: "Lịch sử đơn hàng", to: "orders" },
        { icon: Heart, label: "Yêu thích", to: "favorites" },
    ];

    const handleCloseMenu = () => {
        setIsClosing(true);
        setTimeout(() => {
            setMenuOpen(false);
            setIsClosing(false);
        }, 500);
    };

    const handleMenuNav = (to) => {
        navigate(to);
        handleCloseMenu();
    };

    const handleLogout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            authActions.logout();
            handleCloseMenu();
            navigate("/login");
        }
    };

    return (
        <div className="cust-root">
            {/* ── Desktop/Mobile Header ── */}
            <header className={`cust-header ${isDetailPage ? 'cust-header--detail' : ''}`}>
                <div className="cust-header-inner">
                    {/* Menu Button */}
                    <button className="cust-menu-btn" onClick={() => setMenuOpen(true)}>
                        <Menu size={20} />
                    </button>

                    {/* Logo */}
                    <div className="cust-header-logo" onClick={() => navigate("home")}>
                        <img
                            src="https://res.cloudinary.com/durzk8qz6/image/upload/v1771055848/itc1bfm5hvwdhsmrngt0.png"
                            alt="Eatzy Logo"
                            className="cust-logo-img"
                        />
                    </div>

                    {/* Location Selector */}
                    {!isDetailPage && (
                        <button className="cust-location-btn" onClick={() => setLocationPickerOpen(true)}>
                            <MapPin size={16} />
                            <div className="cust-location-text">
                                <span className="cust-location-label">Giao đến</span>
                                <span className="cust-location-addr">{userLocation?.name || userLocation?.address || "Chọn địa điểm"}</span>
                            </div>
                        </button>
                    )}

                    {/* Search Bar (Desktop) */}
                    {!isDetailPage && (
                        <div className="cust-header-search">
                            <Search size={18} className="cust-search-icon" />
                            <input
                                type="text"
                                placeholder="Tìm nhà hàng, món ăn..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="cust-search-clear" onClick={() => setSearchQuery("")}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    )}

                    {/* ── Right side: Current Order + Cart ── */}
                    <div className="cust-header-right">
                        {activeOrder && (
                            <button
                                className="cust-current-order"
                                onClick={() => setCurrentOrderOpen(true)}
                            >
                                <div className="cust-current-order-icon">
                                    <Package size={16} />
                                    <span className="cust-current-order-pulse" />
                                </div>
                                <div className="cust-current-order-text">
                                    <span className="cust-current-order-label">Đơn hiện tại</span>
                                    <span className="cust-current-order-status">
                                        {activeOrder.status === "PREPARING" ? "Đang chuẩn bị" : "Đang giao"}
                                    </span>
                                </div>
                                <div className="cust-current-order-map">
                                    <div className="cust-current-order-map-dot" />
                                    <svg viewBox="0 0 48 32" className="cust-current-order-map-path">
                                        <path d="M4 28 Q12 4 24 16 Q36 28 44 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </button>
                        )}

                        <button className={`cust-header-cart ${isDetailPage ? 'hidden' : ''}`} onClick={() => setCartOpen(true)}>
                            <ShoppingBag size={20} />
                            {totalItems > 0 && (
                                <span className="cust-cart-count">{totalItems}</span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Sidebar Menu Overlay ── */}
            {menuOpen && (
                <div className={`cust-sidebar-overlay ${isClosing ? 'cust-sidebar-overlay--closing' : ''}`} onClick={handleCloseMenu}>
                    <div className={`cust-sidebar-menu ${isClosing ? 'cust-sidebar-menu--closing' : ''}`} onClick={(e) => e.stopPropagation()}>
                        <div className="cust-sidebar-profile">
                            <div className="cust-sidebar-avatar">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="cust-sidebar-info">
                                <h3 className="cust-sidebar-name">{user?.name || "Khách hàng"}</h3>
                                <span className="cust-sidebar-email">{user?.email || "Chưa đăng nhập"}</span>
                            </div>
                        </div>

                        <div className="cust-sidebar-section">
                            <span className="cust-sidebar-section-label">MENU</span>
                            {menuItems.map((item) => (
                                <button
                                    key={item.to}
                                    className="cust-sidebar-item"
                                    onClick={() => handleMenuNav(item.to)}
                                >
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>

                        {isAuthenticated ? (
                            <button className="cust-sidebar-item cust-sidebar-item--logout" onClick={handleLogout}>
                                <LogOut size={18} />
                                <span>Đăng xuất</span>
                            </button>
                        ) : (
                            <button className="cust-sidebar-item cust-sidebar-item--logout" onClick={() => navigate("/customer/login")}>
                                <User size={18} />
                                <span>Đăng nhập</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* ── Main Content ── */}
            <main className="cust-content">
                <Outlet />
            </main>

            {/* ── Modals ── */}
            <CartOverlay isOpen={cartOpen} onClose={() => setCartOpen(false)} />
            <CurrentOrderOverlay isOpen={currentOrderOpen} onClose={() => setCurrentOrderOpen(false)} />
            <LocationPickerModal isOpen={locationPickerOpen} onClose={() => setLocationPickerOpen(false)} />

            {/* ── Mobile Bottom Nav ── */}
            <nav className={`cust-mobile-nav ${bottomNavVisible ? "" : "cust-mobile-nav--hidden"}`}>
                {mobileNavTabs.map((tab) =>
                    tab.to ? (
                        <NavLink
                            key={tab.id}
                            to={tab.to}
                            end={tab.id === "home"}
                            className={({ isActive }) =>
                                `cust-mobile-nav-btn ${isActive ? "cust-mobile-nav-btn--active" : ""}`
                            }
                        >
                            <tab.icon size={22} strokeWidth={2.5} />
                        </NavLink>
                    ) : (
                        <button key={tab.id} className="cust-mobile-nav-btn" onClick={tab.action}>
                            <tab.icon size={22} strokeWidth={2.5} />
                        </button>
                    )
                )}
            </nav>
        </div>
    );
};

export default CustomerLayout;
