import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X, Filter, CheckCircle2, XCircle, Clock, MapPin, Store, LayoutGrid } from "lucide-react";
import customerApi from "../../../api/customer/customerApi";
import OrderDetailModal from "../components/OrderDetailModal"; // Import Modal
import "../CustomerApp.css";
import "./OrdersPage.css";

const statusFilters = [
    { value: "ALL", label: "Tất cả", icon: LayoutGrid },
    { value: "DELIVERED", label: "Hoàn thành", icon: CheckCircle2 },
    { value: "CANCELLED", label: "Đã hủy", icon: XCircle },
];

const statusConfig = {
    DELIVERED: { color: "#166534", label: "COMPLETED", icon: CheckCircle2 },
    CANCELLED: { color: "#991B1B", label: "CANCELLED", icon: XCircle },
    REJECTED: { color: "#991B1B", label: "REJECTED", icon: XCircle },
    PREPARING: { color: "#854D0E", label: "PREPARING", icon: Clock },
    DELIVERING: { color: "#1E40AF", label: "ON DELIVERY", icon: Clock },
    PENDING: { color: "#92400E", label: "PENDING", icon: Clock },
};

export default function OrdersPage() {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null); // Modal State

    useEffect(() => {
        fetchOrders();
    }, []);

    // Show success toast if navigated from checkout
    useEffect(() => {
        if (window.history.state?.usr?.successOrder && window.history.state?.usr?.orderId) {
            // We can use a library like react-toastify here, or a simple alert for now if not available
            // But based on user request "hiện thông báo", let's try to notify.
            // Since I don't see toastify imported in OrdersPage, I will use alert or just console for now, 
            // but user asked for notification. 
            // I'll add a simple alert for now as a placeholder for "Success Notification"
            alert(`Order #${window.history.state.usr.orderId} placed successfully!`);
            // Clear state to prevent showing again on refresh
            window.history.replaceState({}, document.title);
        }
    }, []);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await customerApi.getMyOrders();
            console.log("Orders API:", response.data);
            // API returns { data: { result: [...] } }
            setOrders(response.data?.data?.result || []);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredOrders = useMemo(() => {
        let result = [...orders]; // Create a copy to avoid mutating state
        if (statusFilter !== "ALL") {
            if (statusFilter === "CANCELLED") {
                result = result.filter((o) => o.orderStatus === "CANCELLED" || o.orderStatus === "REJECTED");
            } else {
                result = result.filter((o) => o.orderStatus === statusFilter);
            }
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (o) =>
                    o.restaurant.name.toLowerCase().includes(q) ||
                    (o.id && o.id.toString().includes(q))
            );
        }
        // Sort by date desc (Newest first)
        return result.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
        });
    }, [orders, statusFilter, searchQuery]);

    const handleSearch = (e) => { if (e.key === "Enter") setSearchQuery(searchValue); };

    const formatVnd = (price) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return `${d.getDate()} thg ${d.getMonth() + 1}`;
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    return (
        <div className="cust-page cust-page--fullheight">
            <div className="cust-page-scroll">
                <div className="cust-container">
                    {/* ── Header ── */}
                    <div className="cust-page-header">
                        <button className="cust-back-btn" onClick={() => navigate(-1)}>
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="cust-page-title">ORDER HISTORY</h1>
                            <p className="cust-page-subtitle">Your past delicious meals</p>
                        </div>
                    </div>

                    {/* ── Toolbar ── */}
                    <div className="cust-sticky-toolbar cust-toolbar-orders">
                        <div className="cust-filter-row">
                            <div className="cust-filter-icon"><Filter size={18} /></div>
                            <div className="cust-filter-pills">
                                {statusFilters.map((f) => {
                                    const Icon = f.icon;
                                    const isActive = statusFilter === f.value;
                                    let pillClass = "cust-pill";
                                    if (isActive) {
                                        pillClass += f.value === "CANCELLED" ? " cust-pill--danger" : f.value === "ALL" ? " cust-pill--dark" : " cust-pill--primary";
                                    }
                                    return (
                                        <button key={f.value} className={pillClass} onClick={() => setStatusFilter(f.value)}>
                                            <Icon size={14} /> {f.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="cust-toolbar-search cust-toolbar-search--right">
                            <Search size={18} className="cust-toolbar-search-icon" />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                            {searchValue && (
                                <button className="cust-toolbar-clear" onClick={() => { setSearchValue(""); setSearchQuery(""); }}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── Orders List ── */}
                    <div className="cust-grid-content">
                        {isLoading ? (
                            <div className="cust-loading-list">
                                {[1, 2, 3].map((n) => <div key={n} className="cust-loading-item" />)}
                            </div>
                        ) : filteredOrders.length > 0 ? (
                            <div className="cust-orders-list">
                                {filteredOrders.map((order) => {
                                    const status = statusConfig[order.orderStatus] || statusConfig.PENDING;
                                    const StatusIcon = status.icon;
                                    const items = order.orderItems || [];
                                    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
                                    const itemsOverview = items.map(i => i.dish?.name).filter(Boolean).join(", ");
                                    // Default image if none
                                    const bgImage = order.restaurant.imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80";

                                    return (
                                        <div
                                            key={order.id}
                                            className="cust-history-card"
                                            onClick={() => handleOrderClick(order)} // Click to open modal
                                        >
                                            <div className="cust-history-bg" style={{ backgroundImage: `url(${bgImage})` }} />
                                            <div className="cust-history-overlay">

                                                {/* Top Badges */}
                                                <div className="cust-history-badges">
                                                    <div className="cust-history-status" style={{ color: status.color }}>
                                                        <StatusIcon size={16} strokeWidth={2.5} />
                                                        <span>{status.label}</span>
                                                    </div>
                                                    <div className="cust-history-count">
                                                        {totalItems} MÓN
                                                    </div>
                                                </div>

                                                {/* Main Info */}
                                                <div className="cust-history-content">
                                                    <div className="cust-history-price-label">Total:</div>
                                                    <div className="cust-history-price">{formatVnd(order.totalAmount)}</div>
                                                    <h3 className="cust-history-name">{order.restaurant.name}</h3>
                                                    <div className="cust-history-address">
                                                        <MapPin size={14} />
                                                        <span>{order.restaurant.address}</span>
                                                    </div>

                                                    <div className="cust-history-details">
                                                        <div className="cust-history-col">
                                                            <span className="cust-history-val">{totalItems} món</span>
                                                            <span className="cust-history-label">QUANTITY</span>
                                                        </div>
                                                        <div className="cust-history-col" style={{ flex: 1, overflow: 'hidden' }}>
                                                            <span className="cust-history-items">{itemsOverview}</span>
                                                            <span className="cust-history-label">ITEMS OVERVIEW</span>
                                                        </div>
                                                    </div>

                                                    <div className="cust-history-footer">
                                                        <button
                                                            className="cust-history-visit"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`../restaurant/${order.restaurant.id}`); // Using ID as slug might be safer if slug missing
                                                            }}
                                                        >
                                                            <Store size={16} />
                                                            <span>{order.restaurant.name.toUpperCase()}</span>
                                                        </button>
                                                        <div className="cust-history-date">
                                                            <Clock size={16} />
                                                            <span>{formatDate(order.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="cust-empty-state">
                                <div className="cust-empty-icon">
                                    <Clock size={40} />
                                </div>
                                <h3>No orders found</h3>
                                <p>You haven't placed any orders yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Detail Modal */}
            <OrderDetailModal
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                order={selectedOrder}
            />
        </div>
    );
}
