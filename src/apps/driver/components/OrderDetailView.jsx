import React from 'react';
import { MapPin, Package } from 'lucide-react';

const formatVnd = (n) => Intl.NumberFormat("vi-VN").format(n) + "đ";

const OrderDetailView = ({ order }) => {
    if (!order) return null;

    return (
        <div className="dm-container">
            {/* Top Stats Banner */}
            <div className="dm-stats-banner">
                <div className="dm-stat-col">
                    <span className="dm-stat-label">THU NHẬP</span>
                    <span className="dm-stat-value text-green-500">
                        {order.netIncome ? formatVnd(order.netIncome) : (order.earnings ? formatVnd(order.earnings) : "---")}
                    </span>
                </div>
                <div className="dm-stat-divider"></div>
                <div className="dm-stat-col">
                    <span className="dm-stat-label">KHOẢNG CÁCH</span>
                    <span className="dm-stat-value">{order.distance || 0}km</span>
                </div>
                <div className="dm-stat-divider"></div>
                <div className="dm-stat-col">
                    <span className="dm-stat-label">LOẠI ĐƠN</span>
                    <span className="dm-stat-value">FOOD</span>
                </div>
            </div>

            {/* Delivery Route */}
            <div className="dm-card dm-route-card">
                <div className="dm-card-title-row">
                    <div className="dm-icon-circle"><MapPin size={16} /></div>
                    <span className="dm-card-title">DELIVERY ROUTE</span>
                </div>

                <div className="dm-route-content">
                    {/* Visual Timeline */}
                    <div className="dm-route-timeline">
                        <div className="dm-rt-dot pickup"></div>
                        <div className="dm-rt-line"></div>
                        <div className="dm-rt-dot dropoff"></div>
                    </div>

                    {/* Text Details */}
                    <div className="dm-route-details">
                        <div className="dm-route-stop">
                            <div className="dm-stop-label">LẤY TẠI</div>
                            <div className="dm-stop-name">{order.restaurantName}</div>
                            <div className="dm-stop-address">{order.restaurantAddress}</div>
                        </div>
                        <div className="dm-route-stop" style={{ marginTop: '24px' }}>
                            <div className="dm-stop-label" style={{ color: '#EF4444' }}>GIAO ĐẾN</div>
                            <div className="dm-stop-name">{order.customerName}</div>
                            <div className="dm-stop-address">{order.deliveryAddress}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inventory Card */}
            <div className="dm-card dm-inventory-card">
                <div className="dm-card-title-row">
                    <div className="dm-icon-circle"><Package size={16} /></div>
                    <span className="dm-card-title">ORDER INVENTORY</span>
                </div>

                <div className="dm-items-list">
                    {order.items?.map((item, idx) => (
                        <div key={idx} className="dm-item-row">
                            <div className="dm-item-qty">{item.quantity}x</div>
                            <div className="dm-item-name">{item.name}</div>
                            <div className="dm-item-price">{formatVnd(item.price * item.quantity)}</div>
                        </div>
                    ))}
                </div>

                <div className="dm-summary">
                    <div className="dm-sum-row">
                        <span>Order Subtotal</span>
                        <span>{formatVnd(order.subtotal || 0)}</span>
                    </div>
                    <div className="dm-sum-row">
                        <span>Shipping Fee</span>
                        <span>{formatVnd(order.deliveryFee || 0)}</span>
                    </div>
                    {(order.discount > 0 || order.discountAmount > 0) && (
                        <div className="dm-sum-row discount">
                            <span className="text-green-600">Voucher</span>
                            <span className="text-green-600">-{formatVnd(order.discountAmount || order.discount)}</span>
                        </div>
                    )}

                    <div className="dm-total-row">
                        <span className="dm-total-label">Total Amount</span>
                        <span className="dm-total-val">{formatVnd(order.totalAmount || 0)}</span>
                    </div>
                </div>
            </div>

            {/* Payment Audit (Dark Card) */}
            <div className="dm-audit-card">
                <div className="dm-audit-title">PAYMENT AUDIT</div>

                <div className="dm-audit-content">
                    <div className="dm-audit-row">
                        <span>DELIVERY FEE</span>
                        <span>{formatVnd(order.deliveryFee || 0)}</span>
                    </div>
                    <div className="dm-audit-row commission">
                        <div className="flex items-center gap-2">
                            <span>SYSTEM COMMISSION</span>
                            <span className="dm-badge-commission">20%</span>
                        </div>
                        <span className="text-red-400">-{formatVnd(order.driverCommissionAmount || order.platformFee || 0)}</span>
                    </div>
                </div>

                <div className="dm-audit-footer">
                    <div className="dm-audit-net">
                        <span className="dm-net-label">YOUR NET INCOME</span>
                        <span className="dm-net-val">
                            {formatVnd(order.netIncome ? Math.abs(order.netIncome) : (order.earnings ? Math.abs(order.earnings) : 0))}
                        </span>
                    </div>
                    <div className="dm-badge-success-solid">SUCCESS</div>
                </div>
            </div>

            <div style={{ height: '20px' }}></div>
        </div>
    );
};

export default OrderDetailView;
