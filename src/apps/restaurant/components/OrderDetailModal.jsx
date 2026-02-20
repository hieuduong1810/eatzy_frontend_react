import React from 'react';
import { X, Clock, User, ChefHat, MapPin, CheckCircle, XCircle, History, AlertCircle, Download, Package } from 'lucide-react';
import Modal from "../../../components/shared/Modal";
import "../pages/HistoryPage.css"; // Reuse HistoryPage CSS for now

const formatVnd = (n) => Intl.NumberFormat("vi-VN").format(n || 0) + "đ";

const statusConfig = {
    DELIVERED: { label: "Hoàn thành", className: "success", icon: CheckCircle },
    COMPLETED: { label: "Hoàn thành", className: "success", icon: CheckCircle },
    CANCELLED: { label: "Đã huỷ", className: "error", icon: XCircle },
    REJECTED: { label: "Từ chối", className: "error", icon: XCircle },
    PENDING: { label: "Chờ xử lý", className: "warning", icon: AlertCircle },
    PREPARING: { label: "Đang chuẩn bị", className: "warning", icon: ChefHat },
    READY: { label: "Sẵn sàng", className: "warning", icon: CheckCircle },
    PICKED_UP: { label: "Đang giao", className: "warning", icon: CheckCircle },
    DRIVER_ASSIGNED: { label: "Đã có tài xế", className: "driver-assigned", icon: User },
};

const OrderDetailModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    const date = new Date(order.createdAt);
    const dateStr = date.toLocaleDateString("vi-VN");
    const timeStr = date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

    const statusConf = statusConfig[order.status] || { label: order.status, className: "default", icon: AlertCircle };
    const StatusIcon = statusConf.icon;

    // Helper to safe access nested props
    const customerName = order.customerName || order.customer?.name || "Khách lẻ";
    const customerPhone = order.customer?.phone || order.customerPhone || "N/A";
    const driverName = order.driver?.name || "Chưa có tài xế";
    const driverVehicle = order.driver?.vehicle || "-";
    const driverPlate = order.driver?.plate || "";
    const driverPhone = order.driver?.phone || "-";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="lg" hideHeader={true}>
            {/* Custom Header */}
            <div className="hm-header">
                <div>
                    <h2 className="hm-title">ORDER DETAILS</h2>
                    <div className="hm-meta-row">
                        <span className="hm-id-badge">ORD-{order.id}</span>
                        <span className="hm-time"><Clock size={14} /> {timeStr} {dateStr}</span>
                    </div>
                </div>
                <div className="hm-header-right">
                    <span className={`hp-status-badge ${statusConf.className}`}>
                        <StatusIcon size={14} strokeWidth={2.5} />
                        {statusConf.label}
                    </span>
                    <button onClick={onClose} className="hm-close-btn">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
            </div>

            <div className="hm-body">
                {/* Customer & Driver Row */}
                <div className="hm-row-grid">
                    <div className="hm-card">
                        <div className="hm-card-header-sm">
                            <div className="hm-icon-circle"><User size={16} /></div>
                            <span className="hm-card-label">CUSTOMER</span>
                        </div>
                        <div className="hm-user-info">
                            <div className="hm-user-name">{customerName}</div>
                            <div className="hm-user-phone">
                                <span className="hm-sub-label">PHONE</span>
                                {customerPhone}
                            </div>
                        </div>
                    </div>
                    <div className="hm-card">
                        <div className="hm-card-header-sm">
                            <div className="hm-icon-circle"><ChefHat size={16} /></div>
                            <span className="hm-card-label">DRIVER</span>
                        </div>
                        <div className="hm-user-info">
                            <div className="hm-user-name">{driverName}</div>
                            <div className="hm-user-details-row">
                                <div>
                                    <span className="hm-sub-label">VEHICLE</span>
                                    <div>{driverVehicle}</div>
                                    {driverPlate && <div className="hm-plate-number">{driverPlate}</div>}
                                </div>
                                <div>
                                    <span className="hm-sub-label">PHONE</span>
                                    <div>{driverPhone}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delivery Route */}
                <div className="hm-card">
                    <div className="hm-card-header">
                        <MapPin size={18} /> Delivery Route
                    </div>
                    <div className="hm-route-container">
                        <div className="hm-timeline">
                            <div className="hm-dot pickup"></div>
                            <div className="hm-line"></div>
                            <div className="hm-dot dropoff"></div>
                        </div>
                        <div className="hm-route-details">
                            <div className="hm-stop">
                                <span className="hm-stop-label pickup">PICK UP</span>
                                <div className="hm-stop-name">{order.restaurantName || "My Restaurant"}</div>
                                <div className="hm-stop-address">{order.restaurantAddress || ""}</div>
                            </div>
                            <div className="hm-stop" style={{ marginTop: '24px' }}>
                                <span className="hm-stop-label dropoff">DROP OFF</span>
                                <div className="hm-stop-name">{customerName}</div>
                                <div className="hm-stop-address">{order.deliveryAddress || ""}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Guarantee Banner */}
                <div className="hm-guarantee-banner">
                    <div className="hm-shield-icon"><CheckCircle size={16} /></div>
                    <span>This order is protected by Eatzy Guarantee. <span className="hm-link">Learn more</span></span>
                </div>

                {/* Order Items */}
                <div className="hm-card">
                    <div className="hm-card-header flex justify-between items-center" style={{ marginBottom: '24px' }}>
                        <div className="flex items-center gap-3">
                            <div className="hm-icon-box"><Package size={16} /></div>
                            Order Items
                        </div>
                        <span className="hm-badge-black">{order.items?.length || 0} items</span>
                    </div>
                    <div className="hm-items-list">
                        {order.items?.map((item, idx) => (
                            <div key={idx} className="hm-item-row">
                                <div className="hm-item-qty">{item.quantity}x</div>
                                <div className="hm-item-details">
                                    <div className="hm-item-name">{item.name}</div>
                                    <div className="hm-item-opt">
                                        {item.options && item.options.length > 0
                                            ? item.options.map(opt => opt.menuOption?.name).join(', ')
                                            : "Standard option"}
                                    </div>
                                </div>
                                <div className="hm-item-price">{formatVnd(item.price)}</div>
                            </div>
                        ))}
                    </div>

                    <div className="hm-payment-section">
                        <div className="hm-pay-row">
                            <span>Subtotal</span>
                            <span>{formatVnd(order.subtotal || order.totalAmount)}</span>
                        </div>
                        <div className="hm-pay-row">
                            <span>Delivery Fee</span>
                            <span>{formatVnd(order.deliveryFee)}</span>
                        </div>
                        <div className="hm-pay-row discount">
                            <span>Discount</span>
                            <span>-{formatVnd(order.discountAmount)}</span>
                        </div>
                        <div className="hm-pay-row method">
                            <span>Payment Method <span className="hm-method-badge">{order.paymentMethod}</span></span>
                            <span className="hm-method-text">{order.paymentMethod}</span>
                        </div>
                        <div className="hm-sep"></div>
                        <div className="hm-total-row">
                            <span>Total Amount</span>
                            <span>{formatVnd(order.totalAmount)}</span>
                        </div>
                        <div className="hm-date-sub">{dateStr}</div>
                    </div>
                </div>

                {/* Profit Info */}
                <div className="hm-card">
                    <div className="hm-card-header">
                        <div className="hm-icon-box"><Download size={16} /></div> Profit Information
                    </div>
                    <div className="hm-profit-content">
                        <div className="hm-pay-row">
                            <span>Order Subtotal</span>
                            <span>{formatVnd(order.totalAmount)}</span>
                        </div>
                        <div className="hm-pay-row">
                            <span>Platform Commission ({(order.platformFee / order.totalAmount * 100).toFixed(0)}%)</span>
                            <span className="text-red-500">-{formatVnd(order.platformFee)}</span>
                        </div>
                        <div className="hm-sep"></div>
                        <div className="hm-pay-row net-income">
                            <span>Net Income</span>
                            <span>{formatVnd(order.netIncome)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default OrderDetailModal;
