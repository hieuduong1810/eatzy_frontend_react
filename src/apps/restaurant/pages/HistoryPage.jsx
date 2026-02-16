import { useState, useEffect } from "react";
import { Search, Eye, Filter, Download, History, CheckCircle, XCircle, AlertCircle, ChefHat, User, Clock, MapPin, X } from "lucide-react";
import restaurantAppApi from "../../../api/restaurant/restaurantAppApi";
import Modal from "../../../components/shared/Modal";
import PageHeader from "../../../components/shared/PageHeader";
import DataTable from "../../../components/shared/DataTable";
import "../RestaurantApp.css";
import "./HistoryPage.css";

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
};

const HistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailOrder, setDetailOrder] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = {
                page: 1,
                size: 50,
                sort: "createdAt,desc"
            };

            const res = await restaurantAppApi.getMyOrders(params);
            const data = res.data?.result || res.data?.data?.result || [];

            const mapped = data.map(o => ({
                id: o.id,
                customer: {
                    name: o.customer?.name || "Khách lẻ",
                    avatar: o.customer?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(o.customer?.name || "C")}&background=random`,
                    phone: o.customer?.phoneNumber || "N/A"
                },
                items: o.orderItems?.map(i => ({
                    name: i.dish?.name || "Món ăn",
                    quantity: i.quantity,
                    price: i.price
                })) || [],
                totalAmount: o.totalAmount,
                status: o.orderStatus === "COMPLETED" ? "DELIVERED" : o.orderStatus,
                paymentMethod: o.paymentMethod,
                createdAt: o.createdAt,

                // Fields for OrderDetailView
                netIncome: o.restaurantNetEarning || 0,
                deliveryFee: o.deliveryFee || 0,
                platformFee: o.restaurantCommissionAmount || 0,
                deliveryAddress: o.deliveryAddress,
                restaurantName: o.restaurant?.name || "My Restaurant",
                restaurantAddress: o.restaurant?.address,
                distance: o.distance,
                customerName: o.customer?.name,
                discountAmount: o.discountAmount || 0,
                subtotal: (o.totalAmount || 0) - (o.deliveryFee || 0) + (o.discountAmount || 0),

                driver: {
                    name: o.driver?.name,
                    phone: o.driver?.phoneNumber,
                    vehicle: o.driver?.vehicleType, // or vehicleDetails if preferred
                    plate: o.driver?.vehicleLicensePlate
                },

                raw: o
            }));

            setOrders(mapped);

        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const columns = [
        {
            key: "id", label: "ORDER ID", width: "100px",
            render: (id) => <span style={{ fontWeight: 700, color: '#6B7280' }}>#{id}</span>
        },
        {
            key: "customer", label: "CUSTOMER", width: "250px",
            render: (_, row) => (
                <div className="res-info-cell">
                    <div className="res-img-wrapper">
                        <img src={row.customer.avatar} alt="" className="res-img" />
                    </div>
                    <div className="res-details">
                        <div className="res-name">{row.customer.name}</div>
                        <div className="res-meta">{row.customer.phone}</div>
                    </div>
                </div>
            )
        },
        {
            key: "items", label: "ITEMS",
            render: (_, row) => (
                <div className="res-contact-cell">
                    <div className="res-contact-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {row.items.slice(0, 2).map((i, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span className="qty-badge-sm">{i.quantity}x</span>
                                <span className="item-name-table">{i.name}{idx < Math.min(row.items.length, 2) - 1 || row.items.length > 2 ? ',' : ''}</span>
                            </div>
                        ))}
                        {row.items.length > 2 && <span style={{ color: '#6B7280', fontSize: '13px' }}>...</span>}
                    </div>
                    <div className="res-meta" style={{ marginTop: '6px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.5px' }}>
                        {row.items.reduce((s, i) => s + i.quantity, 0)} items total
                    </div>
                </div>
            )
        },
        {
            key: "createdAt", label: "DATE", width: "150px",
            render: (date) => (
                <div className="res-details">
                    <span style={{ fontWeight: 600, color: '#374151' }}>{new Date(date).toLocaleDateString("vi-VN")}</span>
                    <span className="res-meta">{new Date(date).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            )
        },
        {
            key: "totalAmount", label: "TOTAL", width: "150px",
            render: (amount, row) => (
                <div className="res-details">
                    <span className="amount-text">{formatVnd(amount)}</span>
                    <span className="payment-method">{row.paymentMethod}</span>
                </div>
            )
        },
        {
            key: "status", label: "STATUS", width: "160px",
            render: (status) => {
                const conf = statusConfig[status] || { label: status, className: "default", icon: AlertCircle };
                const Icon = conf.icon;
                return (
                    <span className={`status-badge ${conf.className}`}>
                        <Icon size={14} strokeWidth={2.5} />
                        {conf.label}
                    </span>
                );
            }
        },
        {
            key: "actions", label: "ACTIONS", width: "80px", align: "right", sortable: false,
            render: (_, row) => (
                <div className="res-actions">
                    <button
                        className="btn-icon-action primary"
                        onClick={() => setDetailOrder(row)}
                        title="View Details"
                    >
                        <Eye size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="resto-page">
            <div className="history-page-header">
                <div>
                    <div className="history-badge">
                        <History size={14} /> ORDER RECORDS
                    </div>
                    <h1 className="history-title">ORDER HISTORY</h1>
                    <p className="history-subtitle">
                        View and manage your past order records. <span className="history-count">({orders.length} orders)</span>
                    </p>
                </div>
                {/* Actions kept for functionality */}
                <div className="history-actions">
                    <button className="btn btn-secondary" style={{ gap: '8px', display: 'flex', alignItems: 'center' }}>
                        <Filter size={16} /> Filter
                    </button>
                    <button className="btn btn-primary" style={{ background: '#111827', border: 'none', gap: '8px', display: 'flex', alignItems: 'center' }}>
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={orders}
                searchPlaceholder="Tìm kiếm đơn hàng..."
                emptyMessage={loading ? "Đang tải..." : "Không tìm thấy đơn hàng nào"}
                onRowClick={(row) => setDetailOrder(row)}
            />

            {/* Detail Modal */}
            <HistoryOrderModal
                isOpen={!!detailOrder}
                onClose={() => setDetailOrder(null)}
                order={detailOrder}
            />
        </div>
    );
};

const HistoryOrderModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    const date = new Date(order.createdAt);
    const dateStr = date.toLocaleDateString("vi-VN");
    const timeStr = date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

    const statusConf = statusConfig[order.status] || { label: order.status, className: "default", icon: AlertCircle };
    const StatusIcon = statusConf.icon;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="lg" hideHeader={true}>
            {/* Custom Header matching screenshot */}
            <div className="hm-header">
                <div>
                    <h2 className="hm-title">ORDER DETAILS</h2>
                    <div className="hm-meta-row">
                        <span className="hm-id-badge">ORD-{order.id}</span>
                        <span className="hm-time"><Clock size={14} /> {timeStr} {dateStr}</span>
                    </div>
                </div>
                <div className="hm-header-right">
                    <span className={`status-badge ${statusConf.className}`}>
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
                            <div className="hm-user-name">{order.customer?.name}</div>
                            <div className="hm-user-phone">
                                <span className="hm-sub-label">PHONE</span>
                                {order.customer?.phone}
                            </div>
                        </div>
                    </div>
                    <div className="hm-card">
                        <div className="hm-card-header-sm">
                            <div className="hm-icon-circle"><ChefHat size={16} /></div>
                            <span className="hm-card-label">DRIVER</span>
                        </div>
                        <div className="hm-user-info">
                            <div className="hm-user-name">{order.driver?.name || "Chưa có tài xế"}</div>
                            <div className="hm-user-details-row">
                                <div>
                                    <span className="hm-sub-label">VEHICLE</span>
                                    <div>{order.driver?.vehicle || "-"}</div>
                                    {order.driver?.plate && <div className="hm-plate-number">{order.driver?.plate}</div>}
                                </div>
                                <div>
                                    <span className="hm-sub-label">PHONE</span>
                                    <div>{order.driver?.phone || "-"}</div>
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
                                <div className="hm-stop-name">{order.restaurantName}</div>
                                <div className="hm-stop-address">{order.restaurantAddress}</div>
                            </div>
                            <div className="hm-stop" style={{ marginTop: '24px' }}>
                                <span className="hm-stop-label dropoff">DROP OFF</span>
                                <div className="hm-stop-name">{order.customerName}</div>
                                <div className="hm-stop-address">{order.deliveryAddress}</div>
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
                    <div className="hm-card-header flex justify-between">
                        <div className="flex items-center gap-2"><div className="hm-icon-box"><History size={16} /></div> Order Items</div>
                        <span className="hm-badge-black">{order.items?.length} items</span>
                    </div>
                    <div className="hm-items-list">
                        {order.items?.map((item, idx) => (
                            <div key={idx} className="hm-item-row">
                                <div className="hm-item-qty">{item.quantity}x</div>
                                <div className="hm-item-details">
                                    <div className="hm-item-name">{item.name}</div>
                                    <div className="hm-item-opt">Standard option</div>
                                </div>
                                <div className="hm-item-price">{formatVnd(item.price * item.quantity)}</div>
                            </div>
                        ))}
                    </div>

                    {/* Payment Summary inside Items card or separate? Screenshot shows inside basic white card maybe?
                       Actually screenshot 3 shows "Subtotal... Total" below items.
                    */}
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

export default HistoryPage;
