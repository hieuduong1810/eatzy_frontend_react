import { useState, useMemo } from "react";
import { X, Package, User, MapPin, Truck, CheckCircle2, Circle } from "lucide-react";
import DeliveryMapView from "./DeliveryMapView";
import "../CustomerApp.css";

const trackingSteps = [
    { label: "Chờ xác nhận", icon: Circle },
    { label: "Đã đặt", icon: CheckCircle2 },
    { label: "Có tài xế", icon: User },
    { label: "Đang giao", icon: Truck },
    { label: "Thành công", icon: CheckCircle2 },
];

export default function CurrentOrderOverlay({ isOpen, onClose, orders = [], driverLocations = {} }) {
    // If no orders passed or empty array, return empty view
    const [selectedId, setSelectedId] = useState(orders[0]?.id || null);

    // Update selectedId if orders changes and current selectedId is not in the list
    useMemo(() => {
        if (orders.length > 0 && (!selectedId || !orders.find(o => o.id === selectedId))) {
            setSelectedId(orders[0].id);
        }
    }, [orders]);

    const selectedOrder = orders.find((o) => o.id === selectedId) || orders[0];

    if (!isOpen) return null;

    // Helper to calculate total items from OrderItems list
    const totalItems = selectedOrder?.orderItems?.reduce((s, i) => s + i.quantity, 0) || 0;

    // Helper to map status to tracking step (0-4)
    const getTrackingStep = (status) => {
        switch (status) {
            case "PENDING": return 0; // Chờ xác nhận
            case "CONFIRMED":
            case "PREPARING": return 1; // Đã đặt/Chuẩn bị
            case "DRIVER_ASSIGNED":
            case "READY":
            case "READY_FOR_PICKUP": return 2; // Có tài xế/Tài xế đang lấy
            case "PICKED_UP":
            case "ARRIVED":
            case "DELIVERING": return 3; // Đang giao
            case "DELIVERED": return 4; // Thành công
            default: return 0;
        }
    };

    const step = selectedOrder ? getTrackingStep(selectedOrder.orderStatus) : 0;

    // Helper for formatting currency
    const formatVnd = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="co-overlay-bg" onClick={onClose}>
            <div className="co-overlay-panel" onClick={(e) => e.stopPropagation()}>
                {/* ── Header ── */}
                <div className="co-overlay-header">
                    <div className="co-sidebar-header-icon">
                        <Package size={20} />
                    </div>
                    <div>
                        <h2 className="co-sidebar-title">ĐƠN HIỆN TẠI</h2>
                        <span className="co-sidebar-count">{orders.length} đơn đang hoạt động</span>
                    </div>
                    <button className="co-close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                {orders.length === 0 ? (
                    <div className="co-overlay-empty">
                        <Package size={40} />
                        <h3>Không có đơn hàng đang hoạt động</h3>
                        <p>Đặt ngay để theo dõi đơn hàng tại đây</p>
                    </div>
                ) : (
                    <div className="co-overlay-body">
                        {/* ── Left: Order List ── */}
                        <div className="co-overlay-list">
                            {orders.map((order) => {
                                const isActive = selectedId === order.id;
                                // Determine label based on status
                                let statusLabel = "ĐANG XỬ LÝ";
                                const s = order.orderStatus;
                                if (s === "PENDING") statusLabel = "CHỜ XÁC NHẬN";
                                else if (s === "CONFIRMED" || s === "PREPARING") statusLabel = "ĐANG CHUẨN BỊ";
                                else if (s === "DRIVER_ASSIGNED") statusLabel = "CÓ TÀI XẾ";
                                else if (s === "READY" || s === "READY_FOR_PICKUP") statusLabel = "ĐANG LẤY HÀNG";
                                else if (s === "PICKED_UP" || s === "DELIVERING" || s === "ARRIVED") statusLabel = "ĐANG GIAO";

                                return (
                                    <div
                                        key={order.id}
                                        className={`co-order-card ${isActive ? "co-order-card--active" : ""}`}
                                        onClick={() => setSelectedId(order.id)}
                                    >
                                        <div className="co-order-card-top">
                                            {/* Assuming backend ID is enough, or generate a code */}
                                            <span className="co-order-code">#{order.id}</span>
                                            <div>
                                                <h4 className="co-order-name">{order.restaurant?.name || "Nhà hàng"}</h4>
                                                <span className="co-order-total">{formatVnd(order.totalAmount)}</span>
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

                        {/* ── Center: Mapbox Map ── */}
                        <div className="co-overlay-map">
                            {(() => {
                                const pickupLoc = selectedOrder?.restaurant ? {
                                    lat: selectedOrder.restaurant.latitude,
                                    lng: selectedOrder.restaurant.longitude
                                } : null;
                                const dropoffLoc = selectedOrder?.deliveryLatitude ? {
                                    lat: selectedOrder.deliveryLatitude,
                                    lng: selectedOrder.deliveryLongitude
                                } : null;
                                const driverLoc = driverLocations?.current ? {
                                    lat: driverLocations.current.latitude,
                                    lng: driverLocations.current.longitude
                                } : null;

                                // Determine route points / waypoints
                                let waypoints = []; // If empty, DeliveryMapView falls back to pickup->dropoff or whatever

                                if (driverLoc) {
                                    const status = selectedOrder.orderStatus;
                                    // Statuses where driver is going to restaurant
                                    const isPickingUp = ["DRIVER_ASSIGNED", "CONFIRMED", "PREPARING", "READY", "READY_FOR_PICKUP", "On the way to restaurant", "Arrived at restaurant"].includes(status);
                                    // Statuses where driver is delivering to customer
                                    const isDelivering = ["PICKED_UP", "DELIVERING", "Picked up order", "Arrived at delivery location"].includes(status);

                                    if (isPickingUp) {
                                        // Route: Driver -> Pickup -> Dropoff (2 segments: Gray + Green)
                                        waypoints = [driverLoc, pickupLoc, dropoffLoc];
                                    } else if (isDelivering) {
                                        // Route: Driver -> Dropoff (1 segment: Green, active delivery path)
                                        waypoints = [driverLoc, dropoffLoc];
                                    }
                                } else {
                                    // No driver, just show Restaurant -> Dropoff
                                    waypoints = [pickupLoc, dropoffLoc];
                                }

                                return (
                                    <DeliveryMapView
                                        pickup={pickupLoc}
                                        dropoff={dropoffLoc}
                                        driverLocation={driverLoc}
                                        waypoints={waypoints}
                                        showRoute={true}
                                    />
                                );
                            })()}
                        </div>

                        {/* ── Right: Tracking Details ── */}
                        <div className="co-overlay-details">
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
                                        {selectedOrder?.driver?.name || "Đang chờ phân công..."}
                                    </span>
                                    {selectedOrder?.driver && (
                                        <div className="co-info-vehicle">
                                            <span className="co-vehicle-type">{selectedOrder.driver.vehicleType || "Xe máy"}</span>
                                            <span className="co-vehicle-plate">{selectedOrder.driver.vehicleLicensePlate}</span>
                                        </div>
                                    )}
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
                                            <span className="co-route-point-name">{selectedOrder?.restaurant?.name}</span>
                                            <span className="co-route-point-addr">{selectedOrder?.restaurant?.address}</span>
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
                                    {selectedOrder?.orderItems?.map((item, i) => (
                                        <div key={i} className="co-detail-item">
                                            <div className="co-detail-item-info">
                                                <div className="co-detail-item-main">
                                                    <span className="co-detail-item-qty">{item.quantity}x</span>
                                                    <span className="co-detail-item-name">{item.dish?.name}</span>
                                                </div>
                                                {item.orderItemOptions?.length > 0 && (
                                                    <div className="co-detail-item-options">
                                                        {item.orderItemOptions.map(opt => opt.menuOption?.name).join(", ")}
                                                    </div>
                                                )}
                                            </div>
                                            {/* item.priceAtPurchase is per unit */}
                                            <span className="co-detail-item-price">{formatVnd(item.priceAtPurchase * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="co-detail-summary">
                                    <div className="co-detail-row"><span>Tạm tính</span><span>{formatVnd(selectedOrder?.subtotal || 0)}</span></div>
                                    <div className="co-detail-row"><span>Phí giao hàng</span><span>{formatVnd(selectedOrder?.deliveryFee || 0)}</span></div>
                                    {selectedOrder?.discountAmount > 0 && (
                                        <div className="co-detail-row co-detail-row--discount"><span>Giảm giá</span><span>-{formatVnd(selectedOrder.discountAmount)}</span></div>
                                    )}
                                    <div className="co-detail-row co-detail-row--total"><span>Tổng cộng</span><span>{formatVnd(selectedOrder?.totalAmount || 0)}</span></div>
                                </div>

                                <div className="co-guarantee">
                                    <CheckCircle2 size={16} />
                                    <span>Đơn hàng được bảo vệ bởi <strong>Eatzy Guarantee</strong>. <a href="#">Tìm hiểu</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
