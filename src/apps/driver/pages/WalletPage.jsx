import { useState, useEffect } from "react";
import { Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown, CircleDollarSign, Clock, X, ChevronRight, ChevronLeft, CheckCircle2, XCircle, MapPin, Package, DollarSign, User, Truck, FileText } from "lucide-react";
import driverAppApi from "../../../api/driver/driverAppApi";
import Modal from "../../../components/shared/Modal";
import "../DriverApp.css";
import OrderDetailView from "../components/OrderDetailView";

const formatVnd = (n) => Intl.NumberFormat("vi-VN").format(Math.abs(n)) + "đ";

const txTypeConfig = {
    EARNING: { icon: TrendingUp, label: "Thu nhập", color: "#16A34A", bg: "#F0FDF4" },
    DEPOSIT: { icon: ArrowDownLeft, label: "Nạp tiền", color: "#2563EB", bg: "#EFF6FF" },
    WITHDRAWAL: { icon: ArrowUpRight, label: "Rút tiền", color: "#EF4444", bg: "#FEF2F2" },
    PAYMENT: { icon: TrendingDown, label: "Thanh toán", color: "#F59E0B", bg: "#FFFBEB" },
    REFUND: { icon: ArrowDownLeft, label: "Hoàn tiền", color: "#16A34A", bg: "#F0FDF4" },
};

const statusConfig = {
    COMPLETED: { label: "Hoàn tất", color: "#16A34A" },
    PENDING: { label: "Đang xử lý", color: "#F59E0B" },
    FAILED: { label: "Thất bại", color: "#EF4444" },
};

const TransactionCard = ({ tx, onClick }) => {
    // Basic mapping based on transactionType from backend
    // If backend returns types that don't match keys exactly, fallback to EARNING or generic
    const typeKey = tx.transactionType ? tx.transactionType.toUpperCase() : "EARNING";
    const cfg = txTypeConfig[typeKey] || txTypeConfig.EARNING;

    const Icon = cfg.icon;
    const isPositive = tx.amount >= 0;
    const date = new Date(tx.createdAt || tx.transactionDate);
    const timeStr = date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const dateStr = date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    const st = statusConfig[tx.status] || statusConfig.COMPLETED;

    return (
        <div className="tx-card" onClick={onClick}>
            <div className="tx-card-icon" style={{ background: cfg.bg, color: cfg.color }}>
                <Icon size={20} />
            </div>
            <div className="tx-card-info">
                <div className="tx-card-desc">{tx.description || cfg.label}</div>
                <div className="tx-card-meta">
                    <Clock size={12} />
                    <span>{timeStr}, {dateStr}</span>
                    <span className="tx-status" style={{ color: st.color }}>· {st.label}</span>
                </div>
            </div>
            <div className={`tx-card-amount ${isPositive ? "tx-amount-positive" : "tx-amount-negative"}`}>
                {isPositive ? "+" : "-"}{formatVnd(tx.amount)}
            </div>
        </div>
    );
};

// --- Unified Detail Modal ---
const TxDetailModal = ({ tx, onClose }) => {
    const [mode, setMode] = useState("PAYMENT"); // PAYMENT | ORDER
    const [orderDetail, setOrderDetail] = useState(null);
    const [loadingOrder, setLoadingOrder] = useState(false);

    useEffect(() => {
        if (mode === "ORDER" && !orderDetail && tx.order?.id) {
            fetchOrderDetail();
        }
    }, [mode, tx.order]);

    const fetchOrderDetail = async () => {
        setLoadingOrder(true);
        try {
            const res = await driverAppApi.getOrderDetail(tx.order?.id);
            if (res.data && res.data.data) {
                setOrderDetail(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch order detail:", error);
        } finally {
            setLoadingOrder(false);
        }
    };

    if (!tx) return null;

    const date = new Date(tx.createdAt || tx.transactionDate);
    const dateStr = date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    const timeStr = date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const isCompleted = tx.status === "COMPLETED" || tx.status === "SUCCESS";
    const isPositive = tx.amount >= 0;
    const typeKey = tx.transactionType ? tx.transactionType.toUpperCase() : "EARNING";
    const title = txTypeConfig[typeKey]?.label || "Giao dịch";

    // MOCK DATA for Order Details (Fallback)
    const mockOrder = {
        code: tx.order?.id ? tx.order.id.toString() : "---",
        restaurantName: "Cơm Tấm Sài Gòn",
        restaurantAddress: "123 Đường Nguyễn Văn Linh, Q.7",
        customerName: "Nguyễn Văn A",
        customerPhone: "0909123456",
        deliveryAddress: "456 Đường Lê Văn Sỹ, Q.3",
        items: [
            { name: "Cơm Sườn Bì Chả", quantity: 2, price: 50000 },
            { name: "Canh Chua Cá Lóc", quantity: 1, price: 30000 }
        ],
        subtotal: 130000,
        deliveryFee: 15000,
        discount: 0,
        totalAmount: 145000,
        platformFee: 3000,
        paymentMethod: "WALLET",
        netIncome: tx.amount
    };

    // Use fetched order detail OR mock order if missing (for demo purposes as per user request)
    // In real app, we might show valid 'empty' state, but user wants to see the UI.
    const rawOrder = orderDetail || mockOrder;

    const displayOrder = {
        ...rawOrder,
        // Map API response fields to UI expected fields if they exist
        restaurantName: rawOrder.restaurant?.name || rawOrder.restaurantName,
        restaurantAddress: rawOrder.restaurant?.address || rawOrder.restaurantAddress,
        customerName: rawOrder.customer?.name || rawOrder.customerName,
        customerPhone: rawOrder.customer?.phoneNumber || rawOrder.customerPhone,
        deliveryAddress: rawOrder.deliveryAddress || rawOrder.address || "---", // Fallback for address
        items: rawOrder.orderItems ? rawOrder.orderItems.map(item => ({
            name: item.dish?.name || item.name || "---",
            quantity: item.quantity,
            price: item.priceAtPurchase || item.price || 0
        })) : rawOrder.items,

        // Ensure numeric fields are safe
        subtotal: rawOrder.subtotal || 0,
        deliveryFee: rawOrder.deliveryFee || 0,
        discount: rawOrder.discount || 0,
        discountAmount: rawOrder.discountAmount || 0, // API field
        totalAmount: rawOrder.totalAmount || 0,
        platformFee: rawOrder.platformFee || 0,
        driverCommissionAmount: rawOrder.driverCommissionAmount || 0, // API field for system commission
    };



    const renderContent = () => {
        if (mode === "PAYMENT") {
            return (
                <div className="hp-modal-content-wrapper">
                    <div className="hp-info-grid">
                        <div className="hp-info-item">
                            <div className="hp-info-label">Giờ</div>
                            <div className="hp-info-value">{timeStr}</div>
                        </div>
                        <div className="hp-info-item">
                            <div className="hp-info-label">Ngày</div>
                            <div className="hp-info-value">{dateStr}</div>
                        </div>
                        <div className="hp-info-item">
                            <div className="hp-info-label">Loại</div>
                            <div className="hp-info-value">{title}</div>
                        </div>
                    </div>

                    <div className="hp-amount-section">
                        <div className={`hp-amount-val ${isPositive ? "text-green-600" : ""}`} style={{ color: isPositive ? '#16A34A' : '#1A1A1A' }}>
                            {isPositive ? "+" : "-"}{formatVnd(tx.amount)}
                        </div>
                        <div className={`hp-amount-badge ${isCompleted ? "hp-badge-solid-success" : "pending"}`} style={{
                            background: isCompleted ? (isPositive ? '#16A34A' : '#1A1A1A') : '#F3F4F6',
                            color: isCompleted ? 'white' : '#374151',
                            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '99px',
                            fontWeight: '700', textTransform: 'uppercase', fontSize: '12px'
                        }}>
                            {isCompleted ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                            <span>{tx.status}</span>
                        </div>
                    </div>

                    <div className="hp-action-bar" onClick={() => setMode("ORDER")}>
                        <div className="hp-action-left">
                            <div className="hp-action-icon">
                                <FileText size={16} />
                            </div>
                            <div className="hp-action-text">
                                <span className="hp-action-label">Linked Order</span>
                                <span className="hp-action-title">View Order Details</span>
                            </div>
                        </div>
                        <ChevronRight size={20} className="hp-action-arrow" />
                    </div>

                    <div className="hp-details-list">
                        <div className="hp-dl-title">Transaction Details</div>
                        <div className="hp-dl-row">
                            <span>Transaction ID</span>
                            <span>#{tx.id}</span>
                        </div>
                        <div className="hp-dl-row">
                            <span>Description</span>
                            <span>{tx.description}</span>
                        </div>
                        <div className="hp-dl-row">
                            <span>Amount</span>
                            <span style={{ color: isPositive ? '#16A34A' : '#1A1A1A' }}>
                                {isPositive ? "+" : "-"}{formatVnd(tx.amount)}
                            </span>
                        </div>
                        <div className="hp-dl-row">
                            <span>Balance After</span>
                            <span>{tx.balanceAfter ? formatVnd(tx.balanceAfter) : "---"}</span>
                        </div>
                    </div>
                </div>
            );
        } else {
            // ORDER DETAIL MODE
            if (loadingOrder) return <div className="p-8 text-center text-gray-500">Loading order details...</div>;

            return <OrderDetailView order={displayOrder} />;
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={
                <div className="modal-header-content">
                    {mode === "ORDER" && (
                        <button
                            className="hd-back-btn"
                            onClick={() => setMode("PAYMENT")}
                        >
                            <ChevronLeft size={16} /> BACK
                        </button>
                    )}

                    <div className="modal-title-wrapper">
                        <span className="modal-title-text">
                            {mode === "PAYMENT" ? "Payment Details" : "Order Content"}
                        </span>
                        <span className="modal-subtitle-text">
                            #{mode === "PAYMENT" ? tx.id : (displayOrder?.id || displayOrder?.code || tx.order?.id || "---")}
                        </span>
                    </div>
                </div>
            }
        >
            {renderContent()}
        </Modal>
    );
};

const WalletPage = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [todayEarnings, setTodayEarnings] = useState(0);
    const [pendingBalance, setPendingBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    // UI State
    const [selectedTx, setSelectedTx] = useState(null);

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        setLoading(true);
        try {
            const [walletRes, txRes] = await Promise.all([
                driverAppApi.getMyWallet(),
                driverAppApi.getMyTransactions({ page: 1, size: 20, sort: "createdAt,desc" })
            ]);

            // Handle Wallet Balance
            const walletData = walletRes.data;
            if (walletData && walletData.data) {
                setBalance(walletData.data.balance || 0);
            }

            // Handle Transactions
            // ResultPaginationDTO: { meta: ..., result: [...] }
            const txData = txRes.data?.result || txRes.data?.data?.result || [];
            if (Array.isArray(txData)) {
                setTransactions(txData);

                // Calculate today's earnings
                const today = new Date().toDateString();
                const todayEarnings = txData
                    .filter(tx =>
                        (tx.transactionType === "EARNING" || tx.transactionType === "earning") &&
                        new Date(tx.createdAt).toDateString() === today &&
                        tx.status === "COMPLETED"
                    )
                    .reduce((sum, tx) => sum + tx.amount, 0);

                setTodayEarnings(todayEarnings);

                // Calculate pending balance
                const pending = txData
                    .filter(tx => tx.status === "PENDING")
                    .reduce((sum, tx) => sum + tx.amount, 0);
                setPendingBalance(pending);
            }
        } catch (error) {
            console.error("Failed to fetch wallet data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="driver-page flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="driver-page">
            <div className="driver-page-header">
                <h1 className="driver-page-title">Ví Eatzy</h1>
            </div>
            <div className="driver-page-scroll">
                {/* Wallet Overview */}
                <div className="wallet-overview">
                    <div className="wallet-bg-icon"><Wallet size={120} /></div>
                    <div className="wallet-content">
                        <p className="wallet-label">Số dư khả dụng</p>
                        <h2 className="wallet-balance">{formatVnd(balance)}</h2>

                        <div className="wallet-stats-grid">
                            <div className="wallet-stat-item">
                                <p className="wallet-stat-label">Thu nhập hôm nay</p>
                                <p className="wallet-stat-val">{formatVnd(todayEarnings)}</p>
                            </div>
                            <div className="wallet-stat-item">
                                <p className="wallet-stat-label">Đang xử lý</p>
                                <p className="wallet-stat-val wallet-stat-val--pending">{formatVnd(pendingBalance)}</p>
                            </div>
                        </div>

                        <div className="wallet-actions">
                            <button className="wallet-action-btn wallet-action-btn--secondary">
                                <div className="wallet-action-icon wallet-action-icon--topup"><ArrowDownLeft size={16} /></div>
                                Nạp tiền
                            </button>
                            <button className="wallet-action-btn wallet-action-btn--primary">
                                <div className="wallet-action-icon wallet-action-icon--withdraw"><ArrowUpRight size={16} /></div>
                                Rút tiền
                            </button>
                        </div>
                    </div>
                </div>

                {/* Transactions */}
                <div className="tx-section">
                    <h3 className="tx-section-title">Lịch sử giao dịch</h3>
                    <div className="tx-list">
                        {transactions.length > 0 ? (
                            transactions.map((tx) => (
                                <TransactionCard key={tx.id} tx={tx} onClick={() => setSelectedTx(tx)} />
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500">Chưa có giao dịch nào</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedTx && (
                <TxDetailModal
                    tx={selectedTx}
                    onClose={() => setSelectedTx(null)}
                />
            )}
        </div>
    );
};

export default WalletPage;
