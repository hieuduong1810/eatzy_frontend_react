import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Clock, ShoppingBag, ChefHat, Truck, MapPin, X, CheckCircle, User, AlertCircle, Power, ClipboardList } from "lucide-react";
import restaurantAppApi from "../../../api/restaurant/restaurantAppApi";
import Modal from "../../../components/shared/Modal";
import { useWebSocket } from "../../../contexts/WebSocketContext";
import "./OrdersPage.css";
import SlideConfirmModal from "../../../components/shared/SlideConfirmModal";

const formatVnd = (n) => Intl.NumberFormat("vi-VN").format(n) + "đ";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRestaurantOpen, setIsRestaurantOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const [isTogglingStatus, setIsTogglingStatus] = useState(false);

    const { client, isConnected } = useWebSocket();
    // ... (keep useEffects)

    // ... (keep fetch functions)

    const handleToggleStatus = () => {
        setIsConfirmOpen(true);
    };

    const handleConfirmToggle = async () => {
        setIsTogglingStatus(true);
        try {
            if (isRestaurantOpen) {
                // Closing - wait for API and minimum 1s delay
                await Promise.all([
                    restaurantAppApi.closeRestaurant(),
                    new Promise(resolve => setTimeout(resolve, 1000))
                ]);
                setIsRestaurantOpen(false);
            } else {
                // Opening - wait for API and minimum 1s delay
                await Promise.all([
                    restaurantAppApi.openRestaurant(),
                    new Promise(resolve => setTimeout(resolve, 1000))
                ]);
                setIsRestaurantOpen(true);
            }
            setIsConfirmOpen(false);
        } catch (error) {
            console.error("Failed to toggle restaurant status:", error);
            toast.error("Failed to update status");
        } finally {
            setIsTogglingStatus(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchRestaurantStatus();
        // Optional: Set interval for polling
        const interval = setInterval(() => {
            fetchOrders();
        }, 30000); // 30s
        return () => clearInterval(interval);
    }, []);

    // WebSocket Effect
    useEffect(() => {
        if (!client || !isConnected) return;

        console.log("OrdersPage: Subscribing to /user/queue/orders");
        const subscription = client.subscribe('/user/queue/orders', (message) => {
            if (message.body) {
                const notification = JSON.parse(message.body);
                console.log('OrdersPage received:', notification);

                // Handle various order updates
                if (['NEW_ORDER', 'ORDER_STATUS_CHANGED', 'ORDER_ASSIGNED', 'ORDER_UPDATE'].includes(notification.type)) {
                    // Refresh orders list
                    fetchOrders();

                    // Play sound for NEW_ORDER only
                    if (notification.type === 'NEW_ORDER') {
                        const audio = new Audio('/sounds/notification.mp3');
                        audio.play().catch(e => console.log("Audio play failed", e));
                    }

                    // Show toast
                    // const msg = notification.message || `Order #${notification.orderId} updated`;
                    // toast.info(msg, {
                    //     position: "top-right",
                    //     autoClose: 5000,
                    //     hideProgressBar: false,
                    //     closeOnClick: true,
                    //     pauseOnHover: true,
                    //     draggable: true,
                    // });
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [client, isConnected]);

    const fetchRestaurantStatus = async () => {
        try {
            const res = await restaurantAppApi.getMyRestaurant();
            if (res && res.data) {
                const data = res.data.data || res.data;
                setIsRestaurantOpen(data.status === "OPEN");
            }
        } catch (error) {
            console.error("Failed to fetch restaurant status:", error);
        }
    };

    const fetchOrders = async () => {
        try {
            const filterQuery = "orderStatus~'PENDING' or orderStatus~'PLACED' or orderStatus~'PREPARING' or orderStatus~'DRIVER_ASSIGNED' or orderStatus~'READY'";
            const response = await restaurantAppApi.getMyOrders({ filter: filterQuery, size: 100 });
            if (response && response.data) {
                const responseData = response.data.data || response.data;
                const rawOrders = responseData.result || [];

                // Normalize data
                const normalizedOrders = rawOrders.map(o => ({
                    ...o,
                    customerName: o.customer?.name || "Unknown",
                    customerPhone: o.customer?.phoneNumber,
                    total: o.totalAmount,
                    status: o.orderStatus,
                    items: o.orderItems?.map(oi => ({
                        quantity: oi.quantity,
                        name: oi.dish?.name,
                        price: oi.dish?.price,
                        options: oi.orderItemOptions?.map(opt => opt.menuOption?.name).filter(Boolean) || []
                    })) || []
                }));

                setOrders(normalizedOrders);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            if (newStatus === "CONFIRMED") {
                await restaurantAppApi.acceptOrder(orderId);
            } else if (newStatus === "READY") {
                await restaurantAppApi.markOrderAsReady(orderId);
            } else {
                await restaurantAppApi.updateOrderStatus(orderId, newStatus);
            }
            // Optimistic update or refetch
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            handleCloseModal();
            fetchOrders(); // Refresh to be sure
            // toast.success(`Order #${orderId} updated successfully!`);
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Failed to update order status");
        }
    };



    // Columns configuration
    const columns = [
        {
            key: "PENDING",
            title: "PENDING",
            statusFilter: (s) => ["NEW", "PENDING", "PLACED"].includes(s),
            icon: ClipboardList,
            colorTheme: "yellow",
            emptyText: "Không có đơn hàng mới"
        },
        {
            key: "IN_PROGRESS",
            title: "IN PROGRESS",
            statusFilter: (s) => ["CONFIRMED", "PREPARING", "DRIVER_ASSIGNED"].includes(s),
            icon: ChefHat,
            colorTheme: "blue",
            emptyText: "Không có đơn đang chuẩn bị"
        },
        {
            key: "WAITING",
            title: "WAITING FOR DRIVER",
            statusFilter: (s) => ["READY", "READY_FOR_PICKUP"].includes(s),
            icon: Truck,
            colorTheme: "lime",
            emptyText: "Chưa có đơn chờ tài xế"
        }
    ];

    if (loading && orders.length === 0) return <div className="p-8">Loading orders...</div>;

    return (
        <div className="resto-orders-page">
            <div className="resto-page-header-row">
                <div>
                    <div className="live-orders-badge">
                        <ClipboardList size={12} /> LIVE ORDERS
                    </div>
                    <h1 className="resto-page-title">RESTAURANT</h1>
                    <p className="resto-page-subtitle">Manage incoming orders and kitchen workflow.</p>
                </div>
                <button
                    className={`btn-store-status ${isRestaurantOpen ? 'active' : 'closed'}`}
                    onClick={handleToggleStatus}
                >
                    <Power size={20} />
                    <span>{isRestaurantOpen ? 'Open' : 'Closed'}</span>
                </button>
            </div>

            <div className="kanban-board">
                {columns.map((col) => {
                    const colOrders = orders.filter(o => col.statusFilter(o.status));
                    return (
                        <div key={col.key} className={`kanban-column`}>
                            <div className="kanban-col-header-wrapper">
                                <div className={`kanban-col-header border-${col.colorTheme}`}>
                                    <h3 className="kanban-col-title">{col.title}</h3>
                                    <div className={`kanban-col-count bg-${col.colorTheme}`}>
                                        {colOrders.length}
                                    </div>
                                </div>
                            </div>
                            <div className="kanban-col-body custom-scrollbar">
                                {colOrders.length > 0 ? (
                                    colOrders.map(order => (
                                        <OrderCard key={order.id} order={order} onClick={() => handleOrderClick(order)} />
                                    ))
                                ) : (
                                    <div className="empty-state-column">
                                        <div className="opacity-30"><col.icon size={64} /></div>
                                        <div className="text-sm text-gray-400">{col.emptyText}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedOrder && (
                <OrderModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    order={selectedOrder}
                    onUpdateStatus={handleStatusUpdate}
                />
            )}

            <SlideConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmToggle}
                title={isRestaurantOpen ? "Tắt ứng dụng" : "Mở ứng dụng"}
                description={isRestaurantOpen
                    ? "Tắt ứng dụng sẽ ngừng nhận đơn hàng mới. Bạn có chắc chắn muốn đóng cửa hàng không?"
                    : "Bạn có chắc chắn muốn mở cửa hàng để bắt đầu nhận đơn hàng mới không?"}
                isLoading={isTogglingStatus}
                type={isRestaurantOpen ? "warning" : "success"}
            />
        </div>
    );
};

const OrderCard = ({ order, onClick }) => {
    const date = new Date(order.createdAt);
    const timeStr = date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const dateStr = date.toLocaleDateString("vi-VN");

    return (
        <div className="order-card" onClick={onClick}>
            <div className="order-card-header">
                <div>
                    <span className="order-id-label">ORDER ID</span>
                    <span className="order-id-value">#{order.id}</span>
                </div>
                <span className="items-badge">{order.items ? order.items.length : 0} Items</span>
            </div>

            <div className="customer-row">
                <div className="customer-avatar-small">
                    <User size={16} />
                </div>
                <div>
                    <span className="customer-label-small">CUSTOMER</span>
                    <div className="customer-name-small">{order.customerName || "Vãng lai"}</div>
                </div>
            </div>

            <div className="address-row">
                <MapPin size={14} className="address-icon" />
                <div>
                    <span className="address-label">DELIVERY ADDRESS</span>
                    <div className="address-text line-clamp-2">{order.deliveryAddress}</div>
                </div>
            </div>

            {order.items && order.items.length > 0 && (
                <div className="order-preview-items">
                    {order.items.slice(0, 2).map((item, i) => (
                        <div key={i} className="preview-item">
                            <span className="preview-qty">{item.quantity}x</span>
                            <span>{item.name}</span>
                        </div>
                    ))}
                    {order.items.length > 2 && (
                        <div className="text-xs text-gray-500 mt-1">+{order.items.length - 2} more items...</div>
                    )}
                </div>
            )}

            <div className="card-footer">
                <div className="flex items-center gap-1"><Clock size={12} /> {dateStr} {timeStr}</div>
                <div className="order-total-price">{formatVnd(order.total)}</div>
            </div>
        </div>
    );
};

const OrderModal = ({ isOpen, onClose, order, onUpdateStatus }) => {
    if (!isOpen || !order) return null;

    const date = new Date(order.createdAt);
    const dateTimeStr = `${date.toLocaleDateString("vi-VN")} ${date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;

    // Determine content based on status
    const isPending = order.status === "NEW" || order.status === "PENDING";
    const isInProgress = order.status === "CONFIRMED" || order.status === "PREPARING" || order.status === "DRIVER_ASSIGNED";
    const isWaiting = order.status === "READY" || order.status === "READY_FOR_PICKUP";

    // Calculate Restaurant Net Earning (Generic 10% commission logic or use backend if available)
    // Assuming 10% commission
    const commission = order.total * 0.1;
    const netEarning = order.total - commission;

    const OrderTitle = (
        <div>
            <span className="order-detail-label">ORDER DETAILS</span>
            <h2 className="order-detail-id">#{order.id}</h2>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={OrderTitle} size="xl">
            {/* Removed local header */}

            <div className="modal-body-layout">
                {/* Left Column: Info & Items */}
                <div className="modal-left-col">
                    <div className="info-row-grid">
                        <div className="info-box">
                            <div className="info-box-icon"><User size={20} /></div>
                            <div className="info-box-content">
                                <span className="info-label">CUSTOMER</span>
                                <div className="info-value">{order.customerName}</div>
                                <div className="info-sub">{order.customerPhone || "0912345678"}</div>
                            </div>
                        </div>
                        <div className="info-box">
                            <div className="info-box-icon"><Clock size={20} /></div>
                            <div className="info-box-content">
                                <span className="info-label">ORDER TIME</span>
                                <div className="info-value">{dateTimeStr}</div>
                            </div>
                        </div>
                    </div>

                    <div className="info-box">
                        <div className="info-box-icon"><MapPin size={20} /></div>
                        <div className="info-box-content">
                            <span className="info-label">DELIVERY ADDRESS</span>
                            <div className="info-value line-clamp-2">{order.deliveryAddress}</div>
                        </div>
                    </div>

                    <div className="modal-items-section">
                        <div className="modal-section-title">ORDER ITEMS ({order.items?.length})</div>
                        <div className="order-items-list">
                            {order.items?.map((item, i) => (
                                <div key={i} className="modal-item-row">
                                    <div className="item-left">
                                        <span className="item-qty-badge">{item.quantity}x</span>
                                        <div>
                                            <span className="item-name">{item.name}</span>
                                            {item.options && item.options.length > 0 && (
                                                <div className="item-options-text">
                                                    {item.options.join(", ")}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="item-right">
                                        <div className="item-total-price">{formatVnd(item.price * item.quantity)}</div>
                                        {/* Assuming item.price is unit price */}
                                        <div className="item-unit-price">{formatVnd(item.price)} / item</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Payment & Actions */}
                <div className="modal-right-col">
                    <div className="payment-summary-card">
                        <div className="payment-title">PAYMENT SUMMARY</div>
                        <div className="payment-content">
                            <div className="payment-row">
                                <span>Subtotal</span>
                                <span>{formatVnd(order.total)}</span>
                            </div>
                            <div className="payment-row">
                                <span>Delivery Fee</span>
                                <span>{formatVnd(order.deliveryFee || 38209)}</span>
                            </div>
                            <div className="payment-row discount">
                                <span>Discount</span>
                                <span>-{formatVnd(order.discountAmount || 15000)}</span>
                            </div>

                            <div className="sep-dashed"></div>

                            <div className="payment-row total-row">
                                <span>Total</span>
                                <span>{formatVnd(order.total)}</span>
                            </div>

                            <div className="net-earning-box">
                                <span>RESTAURANT NET EARNING</span>
                                <span>{formatVnd(netEarning)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions-container">
                        {isPending && (
                            <>
                                <button className="btn-confirm-order" onClick={() => onUpdateStatus(order.id, "CONFIRMED")}>
                                    <CheckCircle size={18} /> Confirm Order
                                </button>
                                <button className="btn-reject-order" onClick={() => onUpdateStatus(order.id, "CANCELLED")}>
                                    <X size={18} /> Reject Order
                                </button>
                            </>
                        )}

                        {isInProgress && (
                            <button className="btn-mark-ready" onClick={() => onUpdateStatus(order.id, "READY")}>
                                Mark as Ready <CheckCircle size={18} />
                            </button>
                        )}

                        {isWaiting && (
                            <div className="waiting-driver-msg">
                                Waiting for driver...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default OrdersPage;
