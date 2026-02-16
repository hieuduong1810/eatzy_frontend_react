import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { X, Package, User, MapPin, Clock, Truck, CheckCircle2, Circle, ShoppingBag } from "lucide-react";
import { mockOrders, formatVnd } from "../data/mockCustomerData";
import "../CustomerApp.css";

const trackingSteps = [
    { label: "Chờ xác nhận", icon: Circle },
    { label: "Đã đặt", icon: CheckCircle2 },
    { label: "Có tài xế", icon: User },
    { label: "Đang giao", icon: Truck },
    { label: "Thành công", icon: CheckCircle2 },
];

export default function CurrentOrderPage() {
    const navigate = useNavigate();
    const activeOrders = useMemo(
        () => mockOrders.filter((o) => o.status === "PREPARING" || o.status === "DELIVERING"),
        []
    );
    const [selectedId, setSelectedId] = useState(activeOrders[0]?.id || null);
    const selectedOrder = activeOrders.find((o) => o.id === selectedId) || activeOrders[0];

    if (activeOrders.length === 0) {
        return (
            <div className="cust-page cust-page--fullheight">
                <div className="cust-container">
                    <div className="cust-empty-state">
                        <div className="cust-empty-icon"><Package size={40} /></div>
                        <h3>Không có đơn hàng đang hoạt động</h3>
                        <p>Đặt ngay để theo dõi đơn hàng tại đây</p>
                    </div>
                </div>
            </div>
        );
    }

    const totalItems = selectedOrder?.items.reduce((s, i) => s + i.quantity, 0) || 0;
    const step = selectedOrder?.trackingStep ?? 1;

    return (
        <div className="cust-page cust-page--fullheight cust-page--no-pad">
            <div className="co-layout">
                {/* ── Left: Order List ── */}
                <div className="co-sidebar">
                    <div className="co-sidebar-header">
                        <div className="co-sidebar-header-icon">
                            <Package size={20} />
                        </div>
                        <div>
                            <h2 className="co-sidebar-title">CURRENT ORDERS</h2>
                            <span className="co-sidebar-count">{activeOrders.length} active orders</span>
                        </div>
                        <button className="co-close-btn" onClick={() => navigate("/customer")}>
                            <X size={18} />
                        </button>
                    </div>

                    <div className="co-order-list">
                        {activeOrders.map((order) => {
                            const isActive = selectedId === order.id;
                            const statusLabel = order.status === "PREPARING"
                                ? (order.driverName ? "CÓ TÀI XẾ" : "ĐANG CHỜ")
                                : "ĐANG GIAO";
                            return (
                                <div
                                    key={order.id}
                                    className={`co-order-card ${isActive ? "co-order-card--active" : ""}`}
                                    onClick={() => setSelectedId(order.id)}
                                >
                                    <div className="co-order-card-top">
                                        <span className="co-order-code">#{order.code.split("-")[1]}</span>
                                        <div>
                                            <h4 className="co-order-name">{order.restaurant.name}</h4>
                                            <span className="co-order-total">{formatVnd(order.total)}</span>
                                        </div>
                                    </div>
                                    <div className="co-order-status-chip">
                                        <Truck size={12} />
                                        <span>{statusLabel}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Center: Map ── */}
                <div className="co-map">
                    <div className="co-map-placeholder">
                        {/* Placeholder map with route illustration */}
                        <svg viewBox="0 0 600 400" className="co-map-svg">
                            {/* Grid */}
                            <defs>
                                <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="600" height="400" fill="#f0f4f0" />
                            <rect width="600" height="400" fill="url(#mapGrid)" />

                            {/* Roads */}
                            <line x1="0" y1="200" x2="600" y2="200" stroke="#fff" strokeWidth="4" />
                            <line x1="300" y1="0" x2="300" y2="400" stroke="#fff" strokeWidth="4" />
                            <line x1="0" y1="100" x2="600" y2="100" stroke="#fff" strokeWidth="2" />
                            <line x1="0" y1="300" x2="600" y2="300" stroke="#fff" strokeWidth="2" />
                            <line x1="150" y1="0" x2="150" y2="400" stroke="#fff" strokeWidth="2" />
                            <line x1="450" y1="0" x2="450" y2="400" stroke="#fff" strokeWidth="2" />

                            {/* Delivery route */}
                            <path d="M 200 280 L 200 200 L 300 200 L 300 120 L 420 120" stroke="#3B82F6" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 4" />

                            {/* Restaurant marker */}
                            <circle cx="200" cy="280" r="12" fill="#78C841" />
                            <text x="200" y="284" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">🏪</text>

                            {/* Delivery marker */}
                            <circle cx="420" cy="120" r="12" fill="#EF4444" />
                            <text x="420" y="124" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">📍</text>

                            {/* Driver marker (if delivering) */}
                            {selectedOrder?.status === "DELIVERING" && (
                                <>
                                    <circle cx="300" cy="200" r="14" fill="#F59E0B" className="co-driver-pulse" />
                                    <text x="300" y="205" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">🏍️</text>
                                </>
                            )}
                        </svg>
                    </div>
                </div>

                {/* ── Right: Tracking Details ── */}
                <div className="co-details">
                    {/* Tracking Steps */}
                    <div className="co-tracking-card">
                        <div className="co-tracking-steps">
                            {trackingSteps.map((s, i) => {
                                const Icon = s.icon;
                                const isDone = i <= step;
                                const isCurrent = i === step;
                                return (
                                    <div key={i} className={`co-tracking-step ${isDone ? "co-tracking-step--done" : ""} ${isCurrent ? "co-tracking-step--current" : ""}`}>
                                        <div className="co-tracking-step-icon">
                                            <Icon size={16} />
                                        </div>
                                        <span className="co-tracking-step-label">{s.label}</span>
                                        {i < trackingSteps.length - 1 && <div className={`co-tracking-line ${i < step ? "co-tracking-line--done" : ""}`} />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Driver Info */}
                    <div className="co-info-card">
                        <div className="co-info-icon"><User size={18} /></div>
                        <div className="co-info-content">
                            <span className="co-info-label">TÀI XẾ</span>
                            <span className="co-info-value">
                                {selectedOrder?.driverName || "Đang chờ phân công..."}
                            </span>
                        </div>
                    </div>

                    {/* Delivery Route */}
                    <div className="co-route-card">
                        <h4 className="co-route-title">
                            <MapPin size={16} /> Lộ trình giao hàng
                        </h4>
                        <div className="co-route-points">
                            <div className="co-route-point">
                                <div className="co-route-dot co-route-dot--green" />
                                <div>
                                    <span className="co-route-point-label" style={{ color: "#78C841" }}>NHÀ HÀNG</span>
                                    <span className="co-route-point-name">{selectedOrder?.restaurant.name}</span>
                                    <span className="co-route-point-addr">{selectedOrder?.restaurant.address}</span>
                                </div>
                            </div>
                            <div className="co-route-line-v" />
                            <div className="co-route-point">
                                <div className="co-route-dot co-route-dot--red" />
                                <div>
                                    <span className="co-route-point-label" style={{ color: "#EF4444" }}>ĐIỂM GIAO</span>
                                    <span className="co-route-point-name">{selectedOrder?.deliveryAddress}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="co-detail-card">
                        <div className="co-detail-header">
                            <div className="co-detail-header-left">
                                <Package size={16} />
                                <h4>Chi tiết đơn hàng</h4>
                            </div>
                            <span className="co-detail-count">{totalItems} món</span>
                        </div>
                        <div className="co-detail-items">
                            {selectedOrder?.items.map((item, i) => (
                                <div key={i} className="co-detail-item">
                                    <span className="co-detail-item-qty">{item.quantity}x</span>
                                    <span className="co-detail-item-name">{item.name}</span>
                                    <span className="co-detail-item-price">{formatVnd(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="co-detail-summary">
                            <div className="co-detail-row"><span>Tạm tính</span><span>{formatVnd(selectedOrder?.subtotal || 0)}</span></div>
                            <div className="co-detail-row"><span>Phí giao hàng</span><span>{formatVnd(selectedOrder?.deliveryFee || 0)}</span></div>
                            {selectedOrder?.discount > 0 && (
                                <div className="co-detail-row co-detail-row--discount"><span>Giảm giá</span><span>-{formatVnd(selectedOrder.discount)}</span></div>
                            )}
                            <div className="co-detail-row co-detail-row--total"><span>Tổng cộng</span><span>{formatVnd(selectedOrder?.total || 0)}</span></div>
                        </div>

                        {/* Guarantee */}
                        <div className="co-guarantee">
                            <CheckCircle2 size={16} />
                            <span>Đơn hàng được bảo vệ bởi <strong>Eatzy Guarantee</strong>. <a href="#">Tìm hiểu</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
