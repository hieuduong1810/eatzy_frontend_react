import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Home, History, Heart, User, Truck, ShoppingBag, Search, X, MapPin, Package, Menu, LogOut, ArrowLeft } from "lucide-react";
import { useCart } from "../apps/customer/context/CartContext";
import { useWebSocket } from "../contexts/WebSocketContext";
import CartOverlay from "../apps/customer/components/CartOverlay";
import CurrentOrderOverlay from "../apps/customer/components/CurrentOrderOverlay";
import LocationPickerModal from "../apps/customer/components/LocationPickerModal"; // Import Modal
import { useNotification } from "../contexts/NotificationContext";
import { mockOrders } from "../apps/customer/data/mockCustomerData";
import { useAuthStore, authActions } from "../stores/authStore";
import { useLocationStore } from "../stores/locationStore";
import authApi from "../api/authApi";
import customerApi from "../api/customer/customerApi";
import "./CustomerLayout.css";

import SlideConfirmModal from "../components/shared/SlideConfirmModal";

const CustomerLayout = ({ children }) => {
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

    // Logout Modal State
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Active order is now managed by state and API
    // const activeOrder = ... (removed mock)

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
        return () => window.removeEventListener("scroll", handleScroll, { passive: true });
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
            console.error("Logout failed", error);
        } finally {
            authActions.logout();
            showNotification("Đăng xuất thành công!", "Hẹn gặp lại", "success");
            handleCloseMenu();
            navigate("/login");
            setIsLoggingOut(false);
            setIsLogoutModalOpen(false);
        }
    };

    // WebSocket for notifications
    const { client, isConnected } = useWebSocket();
    const { showNotification } = useNotification();
    const [driverLocations, setDriverLocations] = useState({}); // Stores latest driver locations

    useEffect(() => {
        if (!client || !isConnected) return;

        console.log("CustomerLayout: Subscribing to /user/queue/orders");
        const orderSub = client.subscribe('/user/queue/orders', (message) => {
            if (message.body) {
                const notif = JSON.parse(message.body);
                console.log("Customer received:", notif);

                // Show notification
                let title = "Order Update";
                let msg = "";
                let type = "info";

                if (notif.type === "ORDER_UPDATE") {
                    title = "Cập nhật đơn hàng";
                    msg = notif.message;
                    type = "info";
                } else if (notif.type === "ORDER_STATUS_CHANGED") {
                    title = "Trạng thái đơn hàng";
                    const status = notif.data?.orderStatus;
                    msg = `Đơn hàng của bạn đã chuyển sang trạng thái: ${status}`;
                    type = "success";

                    // Refresh active order logic here
                    fetchActiveOrder();
                }

                if (msg) {
                    showNotification(title, msg, type);
                }
            }
        });

        // Subscribe to driver location updates
        const locationSub = client.subscribe('/user/queue/driver-location', (message) => {
            if (message.body) {
                const locUpdate = JSON.parse(message.body);
                console.log("Driver Location Update:", locUpdate);
                // We use a simple object/map if we had orderId, but here we just have lat/lng
                // Since this is "Current Order", we can assume it applies to the active driver.
                // Depending on backend implementation, this might need driverId. 
                // For now, let's store it as 'currentDriverLocation'
                setDriverLocations(prev => ({ ...prev, current: locUpdate }));
            }
        });

        return () => {
            orderSub.unsubscribe();
            locationSub.unsubscribe();
        };
    }, [client, isConnected]);

    // Fetch active orders on mount and auth change
    const [activeOrders, setActiveOrders] = useState([]);

    const fetchActiveOrder = async () => {
        if (!isAuthenticated) {
            setActiveOrders([]);
            return;
        }
        try {
            const res = await customerApi.getMyCurrentOrders();
            // Expected structure: { data: { result: [...] } }
            const orders = res.data?.data?.result || res.data?.result || [];

            setActiveOrders(orders);
        } catch (error) {
            console.error("Failed to fetch active orders:", error);
        }
    };

    useEffect(() => {
        fetchActiveOrder();
    }, [isAuthenticated]);

    // Fetch driver location for active orders (initial load)
    useEffect(() => {
        if (activeOrders.length > 0) {
            activeOrders.forEach(async (order) => {
                const driverId = order.driver?.id;
                // Only fetch if we have a driver and don't have location yet
                if (driverId && !driverLocations.current) {
                    try {
                        const res = await customerApi.getDriverLocation(driverId);
                        // Access data inside res.data.data if wrapped, or fallback to res.data
                        const locationData = res.data?.data || res.data;

                        if (locationData && locationData.latitude && locationData.longitude) {
                            console.log("Fetched initial driver location:", locationData);
                            setDriverLocations(prev => ({
                                ...prev,
                                current: {
                                    latitude: locationData.latitude,
                                    longitude: locationData.longitude,
                                    timestamp: Date.now()
                                }
                            }));
                        }
                    } catch (err) {
                        console.warn("Failed to fetch initial driver location", err);
                    }
                }
            });
        }
    }, [activeOrders]);

    // ... (keep existing useEffect for locationRoute) ...

    return (
        <div className="cust-root">


            {/* ── Desktop/Mobile Header ── */}
            <header className={`cust-header ${isDetailPage ? 'cust-header--detail' : ''}`}>
                <div className="cust-header-inner">
                    {/* ── Left side: Menu, Logo, Location, Search ── */}
                    {isDetailPage ? (
                        <button className="cust-menu-btn" onClick={() => navigate(-1)}>
                            <ArrowLeft size={20} />
                        </button>
                    ) : (
                        <button className="cust-menu-btn" onClick={() => setMenuOpen(true)}>
                            <Menu size={20} />
                        </button>
                    )}

                    <div className="cust-header-logo" onClick={() => navigate('/home')}>
                        <img
                            src="https://res.cloudinary.com/durzk8qz6/image/upload/v1771055848/itc1bfm5hvwdhsmrngt0.png"
                            alt="Eatzy Logo"
                            className="cust-logo-img"
                        />
                    </div>

                    {!isDetailPage && (
                        <>
                            <button className="cust-location-btn" onClick={() => setLocationPickerOpen(true)}>
                                <MapPin size={18} />
                                <div className="cust-location-text">
                                    <span className="cust-location-label">Giao đến</span>
                                    <span className="cust-location-addr">
                                        {userLocation?.address ? userLocation.address.split(',')[0] : "Chọn địa chỉ giao hàng"}
                                    </span>
                                </div>
                            </button>

                            <div className="cust-header-search">
                                <Search size={18} className="cust-search-icon" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm món ăn, nhà hàng..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button className="cust-search-clear" onClick={() => setSearchQuery("")}>
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {/* ── Right side: Current Order + Cart ── */}
                    <div className="cust-header-right">
                        {activeOrders.length > 0 && (
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
                                        {(() => {
                                            if (activeOrders.length > 1) return "Đang xử lý";

                                            const s = activeOrders[0].orderStatus;
                                            if (s === "PENDING") return "Đang chờ nhà hàng";
                                            if (s === "CONFIRMED") return "Nhà hàng đã nhận";
                                            if (s === "PREPARING") return "Đang chuẩn bị";
                                            if (s === "DRIVER_ASSIGNED") return "Tài xế đang đến";
                                            if (s === "READY" || s === "READY_FOR_PICKUP") return "Tài xế đang lấy";
                                            if (s === "PICKED_UP" || s === "DELIVERING") return "Đang giao hàng";
                                            if (s === "ARRIVED") return "Tài xế đã đến";
                                            return "Đang xử lý";
                                        })()}
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

            {/* ── Sidebar Menu ── */}
            {menuOpen && (
                <>
                    <div
                        className={`cust-sidebar-overlay ${isClosing ? 'cust-sidebar-overlay--closing' : ''}`}
                        onClick={handleCloseMenu}
                    />
                    <div className={`cust-sidebar-menu ${isClosing ? 'cust-sidebar-menu--closing' : ''}`}>
                        <div className="cust-sidebar-profile">
                            <div className="cust-sidebar-avatar">
                                <User size={24} />
                            </div>
                            <div className="cust-sidebar-info">
                                <div className="cust-sidebar-name">{user?.name || "Khách hàng"}</div>
                                <div className="cust-sidebar-email">{user?.email || "Chưa đăng nhập"}</div>
                            </div>
                        </div>

                        <div className="cust-sidebar-section">
                            <span className="cust-sidebar-section-label">Menu</span>
                            {menuItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={index}
                                        className="cust-sidebar-item"
                                        onClick={() => handleMenuNav(item.to)}
                                    >
                                        <Icon size={20} />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {isAuthenticated ? (
                            <button className="cust-sidebar-item cust-sidebar-item--logout" onClick={handleLogout}>
                                <LogOut size={20} />
                                <span>Đăng xuất</span>
                            </button>
                        ) : (
                            <button className="cust-sidebar-item" onClick={() => navigate('/login')}>
                                <LogOut size={20} />
                                <span>Đăng nhập</span>
                            </button>
                        )}
                    </div>
                </>
            )}


            {/* ── Main Content ── */}
            <main className="cust-content">
                {children}
            </main>

            {/* ── Modals ── */}
            <CartOverlay isOpen={cartOpen} onClose={() => setCartOpen(false)} />
            <CurrentOrderOverlay
                isOpen={currentOrderOpen}
                onClose={() => setCurrentOrderOpen(false)}
                orders={activeOrders}
                driverLocations={driverLocations}
            />
            <LocationPickerModal isOpen={locationPickerOpen} onClose={() => setLocationPickerOpen(false)} />

            {/* ... (keep mobile nav) ... */}

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

            <SlideConfirmModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={processLogout}
                title="Đăng xuất"
                description="Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng không?"
                isLoading={isLoggingOut}
                type="danger"
            />
        </div >
    );
};

export default CustomerLayout;
