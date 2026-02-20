import { useState, useEffect } from "react";
import { Clock, Store, CheckCircle2, XCircle, MapPin, DollarSign, ChevronLeft, Package } from "lucide-react";
import { mockDriverHistory } from "../data/mockDriverData";
import driverAppApi from "../../../api/driver/driverAppApi";
import "../DriverApp.css";
import OrderDetailView from "../components/OrderDetailView";
import Modal from "../../../components/shared/Modal";

const formatVnd = (n) => Intl.NumberFormat("vi-VN").format(n) + "đ";

const HistoryCard = ({ order, onClick }) => {
    const isDelivered = order.status === "DELIVERED";
    const date = new Date(order.createdAt || 0);
    const dateStr = date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    const timeStr = date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

    return (
        <div className="history-card" onClick={onClick}>
            <div className="history-card-header">
                <div className="history-card-left">
                    <div className="history-card-icon"><Store size={22} /></div>
                    <div>
                        <h3 className="history-card-name">{order.restaurantName}</h3>
                        <span className="history-card-code">#{order.code}</span>
                    </div>
                </div>
                <div className={`history-card-earnings ${isDelivered ? "positive" : ""}`}>
                    {isDelivered ? `+${formatVnd(order.earnings)}` : "0đ"}
                </div>
            </div>

            {/* Route */}
            <div className="history-card-route">
                <div className="history-card-route-line" />
                <div className="history-card-route-point">
                    <div className="history-route-dot history-route-dot--pickup" />
                    <p className="history-route-text">{order.restaurantName}</p>
                </div>
                <div className="history-card-route-point">
                    <div className="history-route-dot history-route-dot--dropoff" />
                    <p className="history-route-text">{order.deliveryAddress}</p>
                </div>
            </div>

            {/* Footer */}
            <div className="history-card-footer">
                <div className="history-card-time">
                    <Clock size={14} />
                    <span>{timeStr}, {dateStr}</span>
                </div>
                {isDelivered ? (
                    <div className="history-status-badge history-status-badge--delivered">
                        <CheckCircle2 size={14} />
                        <span>COMPLETED</span>
                    </div>
                ) : (
                    <div className="history-status-badge history-status-badge--cancelled">
                        <XCircle size={14} />
                        <span>{order.status === 'DRIVER_ASSIGNED' ? 'ONGOING' : 'CANCELLED'}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const HistoryPage = () => {
    const [filter, setFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await driverAppApi.getMyOrders();
                // Handle different response structures result vs data.result
                const result = response.data?.data?.result || response.data?.result || [];

                // Map API response to UI model
                const mappedOrders = result.map(order => ({
                    id: order.id,
                    code: order.id.toString(), // Using ID as code for now
                    restaurantName: order.restaurant?.name || "Nhà hàng",
                    restaurantAddress: order.restaurant?.address || "---",
                    customerName: order.customer?.name || "Khách hàng",
                    deliveryAddress: order.deliveryAddress,
                    status: order.orderStatus,
                    earnings: order.driverNetEarning || 0,
                    netIncome: order.driverNetEarning || 0, // For OrderDetailView
                    createdAt: order.createdAt,
                    items: order.orderItems ? order.orderItems.map(item => ({
                        name: item.dish?.name || item.name || "---",
                        quantity: item.quantity,
                        price: item.priceAtPurchase || 0
                    })) : [],
                    subtotal: order.subtotal || 0,
                    total: order.totalAmount || 0,
                    totalAmount: order.totalAmount || 0, // For OrderDetailView
                    distance: order.distance || 0,
                    duration: order.totalTripDuration || 0,
                    deliveryFee: order.deliveryFee || 0,
                    discount: order.discount || 0,
                    discountAmount: order.discountAmount || 0,
                    platformFee: order.platformFee || 0,
                    driverCommissionAmount: order.driverCommissionAmount || 0
                }));

                setOrders(mappedOrders.filter(o =>
                    ["DELIVERED", "CANCELLED", "REJECTED", "COMPLETED", "REFUSED"].includes(o.status)
                ));
            } catch (error) {
                console.error("Failed to fetch driver history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const filtered = filter === "all"
        ? orders
        : orders.filter((o) => o.status === filter.toUpperCase());

    const totalEarnings = orders.filter((o) => o.status === "DELIVERED").reduce((s, o) => s + o.earnings, 0);

    if (loading) {
        return <div className="driver-page flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="driver-page">
            <div className="driver-page-header">
                <h1 className="driver-page-title">Lịch sử giao hàng</h1>
            </div>
            <div className="driver-page-scroll">
                {/* Stats */}
                <div className="history-stats">
                    <div className="history-stat">
                        <span className="history-stat-value">{orders.length}</span>
                        <span className="history-stat-label">Tổng đơn</span>
                    </div>
                    <div className="history-stat">
                        <span className="history-stat-value">{orders.filter((o) => o.status === "DELIVERED").length}</span>
                        <span className="history-stat-label">Hoàn thành</span>
                    </div>
                    <div className="history-stat">
                        <span className="history-stat-value history-stat-value--primary">{formatVnd(totalEarnings)}</span>
                        <span className="history-stat-label">Thu nhập</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="history-filters">
                    {[
                        { key: "all", label: "Tất cả" },
                        { key: "delivered", label: "Hoàn thành" },
                        { key: "cancelled", label: "Đã huỷ" },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            className={`history-filter-btn ${filter === key ? "history-filter-btn--active" : ""}`}
                            onClick={() => setFilter(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Cards */}
                <div className="history-cards">
                    {filtered.map((order) => (
                        <HistoryCard key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
                    ))}
                    {filtered.length === 0 && (
                        <div className="history-empty">Không có đơn hàng nào</div>
                    )}
                </div>
            </div>

            {/* Modal Detail */}
            {selectedOrder && (
                <Modal
                    isOpen={!!selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    title={`Chi tiết đơn #${selectedOrder.code}`}
                >
                    <OrderDetailView order={selectedOrder} />
                </Modal>
            )}
        </div>
    );
};

export default HistoryPage;
