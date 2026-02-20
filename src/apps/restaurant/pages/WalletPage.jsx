import { useState, useEffect } from "react";
import { Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, Clock, Building2, Search, Filter, Download, FileText, CheckCircle2, AlertCircle, CheckCircle, XCircle, ChefHat, User, MapPin, X, History } from "lucide-react";
import restaurantAppApi from "../../../api/restaurant/restaurantAppApi";
import "../RestaurantApp.css";

import "./WalletPage.css";
import OrderDetailModal from "../components/OrderDetailModal";

const formatVnd = (n) => Intl.NumberFormat("vi-VN").format(Math.abs(n)) + "đ";

const txTypeConfig = {
    EARNING: { icon: TrendingUp, color: "#16A34A", bg: "#F0FDF4", label: "Doanh thu" },
    DEPOSIT: { icon: ArrowUpRight, color: "#2563EB", bg: "#EFF6FF", label: "Nạp tiền" },
    WITHDRAWAL: { icon: ArrowUpRight, color: "#EF4444", bg: "#FEF2F2", label: "Rút tiền" },
    PAYMENT: { icon: TrendingUp, color: "#F59E0B", bg: "#FFFBEB", label: "Thanh toán" },
    REFUND: { icon: ArrowUpRight, color: "#16A34A", bg: "#F0FDF4", label: "Hoàn tiền" },
};

const WalletPage = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [todayEarnings, setTodayEarnings] = useState(0);
    const [pendingBalance, setPendingBalance] = useState(0);

    // Pagination state
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const [detailOrder, setDetailOrder] = useState(null);

    // Mock bank account for now
    const bankAccount = {
        bankName: "Vietcombank",
        accountNumber: "**** 1234",
        holderName: "NHÀ HÀNG EATZY"
    };

    const fetchTransactions = async (pageNum) => {
        try {
            const res = await restaurantAppApi.getMyTransactions({ page: pageNum, size: 15, sort: "createdAt,desc" });
            const newTx = res.data?.result || res.data?.data?.result || [];

            if (pageNum === 1) {
                setTransactions(newTx);
            } else {
                setTransactions(prev => [...prev, ...newTx]);
            }

            // Check if we have more data
            if (newTx.length < 15) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        }
    };

    useEffect(() => {
        const initData = async () => {
            setInitialLoading(true);
            try {
                // Fetch wallet info
                const walletRes = await restaurantAppApi.getMyWallet();
                const walletData = walletRes.data;
                if (walletData && walletData.data) {
                    setBalance(walletData.data.balance || 0);
                }

                // Fetch first page of transactions
                await fetchTransactions(1);
            } catch (error) {
                console.error("Failed to fetch initial wallet data:", error);
            } finally {
                setInitialLoading(false);
            }
        };

        initData();
    }, []);

    // Effect to calculate stats when transactions change
    useEffect(() => {
        if (transactions.length > 0) {
            // Calculate today's earnings
            const today = new Date().toDateString();
            const todayEarningsVal = transactions
                .filter(tx =>
                    (tx.transactionType === "EARNING" || tx.transactionType === "earning") &&
                    new Date(tx.createdAt).toDateString() === today &&
                    (tx.status === "COMPLETED" || tx.status === "SUCCESS")
                )
                .reduce((sum, tx) => sum + tx.amount, 0);

            setTodayEarnings(todayEarningsVal);

            // Calculate pending balance (heuristic based on PENDING status)
            const pending = transactions
                .filter(tx => tx.status === "PENDING")
                .reduce((sum, tx) => sum + tx.amount, 0);
            setPendingBalance(pending);
        }
    }, [transactions]);

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
                    fetchTransactions(nextPage).finally(() => {
                        setIsFetchingMore(false);
                    });
                    return nextPage;
                });
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, isFetchingMore, initialLoading]);

    const handleRowClick = async (tx) => {
        if (tx.orderId) {
            try {
                // Fetch order details
                const res = await restaurantAppApi.getOrder(tx.orderId);
                const o = res.data?.result || res.data?.data;

                // Map to format that Modal expects, if needed, or if API returns 'o' in compatible format
                // Mapping same as HistoryPage
                const mapped = {
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
                };
                setDetailOrder(mapped);
            } catch (e) {
                console.error("Failed to load order details", e);
            }
        }
    };

    // Skeleton Component
    const TransactionSkeleton = () => (
        <div className="skeleton-row">
            <div className="skeleton-block" style={{ width: '80px' }}></div>
            <div className="skeleton-col-type">
                <div className="skeleton-circle"></div>
                <div className="skeleton-col-info">
                    <div className="skeleton-block" style={{ width: '60px', height: '10px' }}></div>
                    <div className="skeleton-block" style={{ width: '120px' }}></div>
                </div>
            </div>
            <div className="skeleton-col-info">
                <div className="skeleton-block" style={{ width: '80px' }}></div>
                <div className="skeleton-block" style={{ width: '50px', height: '10px' }}></div>
            </div>
            <div className="skeleton-block" style={{ width: '100px' }}></div>
            <div className="skeleton-block" style={{ width: '80px', borderRadius: '100px' }}></div>
            <div className="skeleton-block" style={{ width: '32px', height: '32px' }}></div>
        </div>
    );

    return (
        <div className="resto-page">
            <div className="resto-page-header">
                <div>
                    <div className="wp-header-badge">
                        <Wallet size={14} /> FINANCIAL HUB
                    </div>
                    <h1 className="wp-header-title">MY WALLET</h1>
                    <div className="wp-header-subtitle">
                        Manage earnings, payouts, and bank details overview.
                        <span className="wp-header-count">({transactions.length} transactions)</span>
                    </div>
                </div>
            </div>

            <div className="resto-wallet-grid">
                {/* Balance Card */}
                <div className="resto-wallet-balance-card">
                    <div className="resto-wallet-bg-icon"><Wallet size={100} /></div>
                    <div className="resto-wallet-content">
                        <p className="resto-wallet-label">Số dư khả dụng</p>
                        <h2 className="resto-wallet-amount">{formatVnd(balance)}</h2>
                        <div className="resto-wallet-stats">
                            <div className="resto-wallet-stat">
                                <span className="resto-wallet-stat-label">Hôm nay</span>
                                <span className="resto-wallet-stat-val">{formatVnd(todayEarnings)}</span>
                            </div>
                            <div className="resto-wallet-stat">
                                <span className="resto-wallet-stat-label">Đang chờ</span>
                                <span className="resto-wallet-stat-val resto-wallet-stat-val--pending">{formatVnd(pendingBalance)}</span>
                            </div>
                        </div>
                        <div className="resto-wallet-actions">
                            <button className="resto-wallet-btn resto-wallet-btn--withdraw">
                                <ArrowUpRight size={16} /> Rút tiền
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bank Account */}
                <div className="resto-wallet-bank-card">
                    <div className="resto-wallet-bank-header">
                        <Building2 size={20} />
                        <span>Tài khoản ngân hàng</span>
                    </div>
                    <div className="resto-wallet-bank-body">
                        <div className="resto-wallet-bank-row"><span>Ngân hàng</span><strong>{bankAccount.bankName}</strong></div>
                        <div className="resto-wallet-bank-row"><span>Số TK</span><strong>{bankAccount.accountNumber}</strong></div>
                        <div className="resto-wallet-bank-row"><span>Chủ TK</span><strong>{bankAccount.holderName}</strong></div>
                    </div>
                </div>
            </div>

            {/* Transactions Table Section */}
            <div className="wp-tx-section">
                <div className="wp-section-card">
                    <div className="wp-tx-header">
                        <div className="wp-tx-title-group">
                            <div className="wp-tx-title">TRANSACTIONS</div>
                            <div className="wp-tx-subtitle">History of your earnings and payouts</div>
                        </div>
                        <div className="wp-tx-controls">
                            <button className="wp-control-btn"><Search size={18} /></button>
                            <button className="wp-control-btn"><Filter size={18} /></button>
                            <button className="wp-export-btn"><Download size={16} /> EXPORT</button>
                        </div>
                    </div>

                    <div className="wp-table-container">
                        <div className="wp-table-header">
                            <div>Transaction ID</div>
                            <div>Type & Description</div>
                            <div>Date</div>
                            <div>Amount</div>
                            <div>Status</div>
                            <div style={{ textAlign: 'center' }}>Actions</div>
                        </div>

                        <div className="wp-table-body">
                            {initialLoading ? (
                                // Show multiple skeletons on initial load
                                Array(5).fill(0).map((_, i) => <TransactionSkeleton key={`init-skel-${i}`} />)
                            ) : transactions.length > 0 ? (
                                <>
                                    {transactions.map((tx) => {
                                        const typeKey = tx.transactionType ? tx.transactionType.toUpperCase() : "EARNING";
                                        const cfg = txTypeConfig[typeKey] || txTypeConfig.EARNING;
                                        const Icon = cfg.icon;
                                        const amount = Number(tx.amount) || 0;
                                        const isPositive = amount >= 0;
                                        const date = new Date(tx.createdAt || tx.transactionDate);

                                        let statusLabel = "Thất bại";
                                        let statusClass = "fail";
                                        let StatusIcon = AlertCircle;

                                        if (tx.status === "COMPLETED" || tx.status === "SUCCESS") {
                                            statusLabel = "Thành công";
                                            statusClass = "success";
                                            StatusIcon = CheckCircle2;
                                        } else if (tx.status === "PENDING") {
                                            statusLabel = "Đang xử lý";
                                            statusClass = "pending";
                                            StatusIcon = Clock;
                                        }

                                        return (
                                            <div
                                                key={tx.id}
                                                className="wp-tx-row"
                                                onClick={() => handleRowClick(tx)}
                                                style={{ cursor: tx.orderId ? 'pointer' : 'default' }}>
                                                {/* ID */}
                                                <div className="wp-col-id">
                                                    <span className="wp-id-badge">#{tx.id}</span>
                                                </div>

                                                {/* Type & Desc */}
                                                <div className="wp-col-type">
                                                    <div className="wp-type-icon" style={{ background: cfg.bg, color: cfg.color }}>
                                                        <Icon size={20} />
                                                    </div>
                                                    <div className="wp-type-info">
                                                        <span className="wp-type-label" style={{ color: cfg.color }}>{cfg.label}</span>
                                                        <span className="wp-type-desc">{tx.description || "Giao dịch hệ thống"}</span>
                                                    </div>
                                                </div>

                                                {/* Date */}
                                                <div className="wp-col-date">
                                                    <span className="wp-date-val">{date.toLocaleDateString("en-GB")}</span>
                                                    <span className="wp-time-val"><Clock size={10} /> {date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
                                                </div>

                                                {/* Amount */}
                                                <div className="wp-col-amount">
                                                    <div className={`wp-icon-box ${isPositive ? "pos" : "neg"}`}>
                                                        {isPositive ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                                    </div>
                                                    <div className="wp-amt-wrapper">
                                                        <span className={`wp-amount-val ${isPositive ? "pos" : "neg"}`}>
                                                            {isPositive ? "+" : ""}{formatVnd(amount)}
                                                        </span>
                                                        {/* Placeholder for balance history if available, else hidden or mock */}
                                                        <span className="wp-balance-hint">Bal: {formatVnd(balance)}</span>
                                                    </div>
                                                </div>

                                                {/* Status */}
                                                <div>
                                                    <span className={`wp-status-badge ${statusClass}`}>
                                                        <StatusIcon size={14} /> {statusLabel}
                                                    </span>
                                                </div>

                                                {/* Actions */}
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <button className="wp-action-btn">
                                                        <FileText size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Show skeleton when fetching more */}
                                    {isFetchingMore && (
                                        Array(2).fill(0).map((_, i) => <TransactionSkeleton key={`more-skel-${i}`} />)
                                    )}
                                </>
                            ) : (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Không có giao dịch nào</div>
                            )}
                        </div>
                    </div>

                    {/* End of list indicator */}
                    {!hasMore && !initialLoading && transactions.length > 0 && (
                        <div style={{ textAlign: 'center', padding: '30px 0', color: '#9ca3af', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ background: '#e5e7eb', borderRadius: '50%', padding: '4px', color: 'white' }}><CheckCircle2 size={16} /></div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Đã hiển thị tất cả dữ liệu</div>
                        </div>
                    )}
                </div>
            </div>

            <OrderDetailModal
                isOpen={!!detailOrder}
                onClose={() => setDetailOrder(null)}
                order={detailOrder}
            />
        </div>
    );
};

export default WalletPage;
