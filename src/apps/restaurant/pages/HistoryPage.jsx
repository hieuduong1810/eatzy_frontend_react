import { useState, useEffect } from "react";
import { Search, Eye, Filter, Download, History, CheckCircle, XCircle, AlertCircle, ChefHat, User, Clock, MapPin, X } from "lucide-react";
import restaurantAppApi from "../../../api/restaurant/restaurantAppApi";
import Modal from "../../../components/shared/Modal";
import PageHeader from "../../../components/shared/PageHeader";
import DataTable from "../../../components/shared/DataTable";
import "../RestaurantApp.css";
import "./HistoryPage.css";

import OrderDetailModal from "../components/OrderDetailModal";

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

const HistoryPage = () => {
    const [orders, setOrders] = useState([]);


    // Pagination & Loading state
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const [detailOrder, setDetailOrder] = useState(null);

    const fetchOrders = async (pageNum) => {
        try {
            const params = {
                page: pageNum,
                size: 15,
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
                    price: i.priceAtPurchase || 0,
                    options: i.orderItemOptions || []
                })) || [],
                totalAmount: o.totalAmount,
                status: o.orderStatus === "COMPLETED" ? "DELIVERED" : o.orderStatus,
                paymentMethod: o.paymentMethod || "COD",
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
                    vehicle: o.driver?.vehicleType,
                    plate: o.driver?.vehicleLicensePlate
                },
                raw: o
            }));

            if (pageNum === 1) {
                setOrders(mapped);
            } else {
                setOrders(prev => [...prev, ...mapped]);
            }

            if (mapped.length < 15) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

        } catch (error) {
            console.error("Failed to fetch orders", error);
        }
    };

    useEffect(() => {
        const init = async () => {
            setInitialLoading(true);
            await fetchOrders(1);
            setInitialLoading(false);
        };
        init();
    }, []);

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 &&
                hasMore &&
                !isFetchingMore &&
                !initialLoading
            ) {
                setIsFetchingMore(true);
                setPage(prev => {
                    const nextPage = prev + 1;
                    fetchOrders(nextPage).finally(() => {
                        setIsFetchingMore(false);
                    });
                    return nextPage;
                });
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, isFetchingMore, initialLoading]);

    // Skeleton Component
    const OrderSkeleton = () => (
        <div className="skeleton-row">
            <div className="skeleton-block" style={{ width: '60px' }}></div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div className="skeleton-circle"></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div className="skeleton-block" style={{ width: '80px', height: '10px' }}></div>
                    <div className="skeleton-block" style={{ width: '100px' }}></div>
                </div>
            </div>
            <div className="skeleton-block" style={{ width: '100px' }}></div>
            <div className="skeleton-block" style={{ width: '80px' }}></div>
            <div className="skeleton-block" style={{ width: '80px' }}></div>
            <div className="skeleton-block" style={{ width: '80px', borderRadius: '100px' }}></div>
            <div className="skeleton-block" style={{ width: '32px', height: '32px' }}></div>
        </div>
    );

    return (
        <div className="resto-page history-page-wrapper">
            <div className="history-page-header">
                <div>
                    <div className="history-badge">
                        <History size={14} /> ORDER RECORDS
                    </div>
                    <h1 className="history-title" style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.03em', fontFamily: 'sans-serif' }}>ORDER HISTORY</h1>
                    <div className="history-subtitle">
                        View and manage your past order records. <span className="history-count">({orders.length} orders)</span>
                    </div>
                </div>
            </div>

            <div className="hp-section-card">
                {/* Internal Header matching screenshot */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div className="history-title-wrapper">
                        <h1 className="history-inner-title">ORDERS</h1>
                        <div className="history-subtitle">
                            History of your customers' orders and their status
                        </div>
                    </div>
                    {/* Actions */}
                    <div className="history-actions" style={{ paddingBottom: 0 }}>
                        <button className="btn-icon-circle">
                            <Search size={20} color="#374151" />
                        </button>
                        <button className="btn-icon-circle">
                            <Filter size={20} color="#374151" />
                        </button>
                        <button className="btn-export">
                            <Download size={18} /> EXPORT
                        </button>
                    </div>
                </div>

                <div className="hp-table-container">
                    <div className="hp-table-header">
                        <div>Order ID</div>
                        <div>Customer</div>
                        <div>Items</div>
                        <div>Date</div>
                        <div>Total</div>
                        <div>Status</div>
                        <div style={{ textAlign: 'center' }}>Actions</div>
                    </div>

                    <div>
                        {initialLoading ? (
                            Array(5).fill(0).map((_, i) => <OrderSkeleton key={`init-skel-${i}`} />)
                        ) : orders.length > 0 ? (
                            <>
                                {orders.map((row) => {
                                    const date = new Date(row.createdAt);
                                    const conf = statusConfig[row.status] || { label: row.status, className: "default", icon: AlertCircle };
                                    const Icon = conf.icon;

                                    return (
                                        <div
                                            key={row.id}
                                            className="hp-row-item"
                                            onClick={() => setDetailOrder(row)}
                                        >
                                            {/* ID */}
                                            <div className="hp-col-id">
                                                <span className="hp-id-badge">#{row.id}</span>
                                            </div>

                                            {/* Customer */}
                                            <div className="hp-col-customer">
                                                <div className="hp-customer-avatar">
                                                    <img src={row.customer.avatar} alt="" />
                                                </div>
                                                <div className="hp-customer-info">
                                                    <div className="hp-customer-name">{row.customer.name}</div>
                                                    <div className="hp-customer-phone">{row.customer.phone}</div>
                                                </div>
                                            </div>

                                            {/* Items */}
                                            {/* Items */}
                                            <div className="hp-col-items">
                                                <div className="hp-items-wrapper">
                                                    {row.items.map((i, idx) => (
                                                        <div key={idx} className="hp-item-entry">
                                                            <span className="hp-item-qty">{i.quantity}x</span>
                                                            <span className="hp-item-name">{i.name}{idx < row.items.length - 1 ? ',' : ''}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="hp-items-total">{row.items.length} ITEMS TOTAL</div>
                                            </div>

                                            {/* Date */}
                                            <div className="hp-col-date">
                                                <span className="hp-date-val">{date.toLocaleDateString("en-GB")}</span>
                                                <span className="hp-time-val"><Clock size={10} /> {date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
                                            </div>

                                            {/* Total */}
                                            <div className="hp-col-amount">
                                                <span className="hp-amount-val">{formatVnd(row.totalAmount)}</span>
                                                <span className="hp-payment-method">{row.paymentMethod}</span>
                                            </div>

                                            {/* Status */}
                                            <div>
                                                <span className={`hp-status-badge ${conf.className}`}>
                                                    <Icon size={14} strokeWidth={2.5} /> {conf.label}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <button
                                                    className="hp-action-btn"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {isFetchingMore && (
                                    Array(2).fill(0).map((_, i) => <OrderSkeleton key={`more-skel-${i}`} />)
                                )}
                            </>
                        ) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Không tìm thấy đơn hàng nào</div>
                        )}
                    </div>
                </div>

                {/* End of list indicator */}
                {!hasMore && !initialLoading && orders.length > 0 && (
                    <div style={{ textAlign: 'center', padding: '30px 0', color: '#9ca3af', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{ background: '#e5e7eb', borderRadius: '50%', padding: '4px', color: 'white' }}><CheckCircle size={16} /></div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Đã hiển thị tất cả dữ liệu</div>
                        <div style={{ fontSize: '11px', color: '#9ca3af' }}>Tổng cộng {orders.length} mục</div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <OrderDetailModal
                isOpen={!!detailOrder}
                onClose={() => setDetailOrder(null)}
                order={detailOrder}
            />
        </div>
    );
};

export default HistoryPage;


