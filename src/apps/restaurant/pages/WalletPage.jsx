import { useState, useEffect } from "react";
import { Wallet, ArrowUpRight, TrendingUp, Clock, Building2 } from "lucide-react";
import restaurantAppApi from "../../../api/restaurant/restaurantAppApi";
import "../RestaurantApp.css";

import "./WalletPage.css";

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
    const [loading, setLoading] = useState(true);

    // Mock bank account for now
    const bankAccount = {
        bankName: "Vietcombank",
        accountNumber: "**** 1234",
        holderName: "NHÀ HÀNG EATZY"
    };

    useEffect(() => {
        const fetchWalletData = async () => {
            setLoading(true);
            try {
                const [walletRes, txRes] = await Promise.all([
                    restaurantAppApi.getMyWallet(),
                    restaurantAppApi.getMyTransactions({ page: 1, size: 20, sort: "createdAt,desc" })
                ]);

                // Handle Wallet Balance
                const walletData = walletRes.data;
                if (walletData && walletData.data) {
                    setBalance(walletData.data.balance || 0);
                }

                // Handle Transactions
                const txData = txRes.data?.result || txRes.data?.data?.result || [];
                if (Array.isArray(txData)) {
                    setTransactions(txData);

                    // Calculate today's earnings
                    const today = new Date().toDateString();
                    const todayEarningsVal = txData
                        .filter(tx =>
                            (tx.transactionType === "EARNING" || tx.transactionType === "earning") &&
                            new Date(tx.createdAt).toDateString() === today &&
                            (tx.status === "COMPLETED" || tx.status === "SUCCESS")
                        )
                        .reduce((sum, tx) => sum + tx.amount, 0);

                    setTodayEarnings(todayEarningsVal);

                    // Calculate pending balance
                    // Note: Restaurant revenue might go to pending first depending on logic, 
                    // for now assuming PENDING transactions are pending balance.
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

        fetchWalletData();
    }, []);

    if (loading) {
        return <div className="resto-page flex items-center justify-center">Loading...</div>;
    }

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

            {/* Transactions */}
            <div className="resto-wallet-tx-section">
                <h3 className="resto-wallet-tx-title">Lịch sử giao dịch</h3>
                <div className="resto-wallet-tx-list">
                    {transactions.length > 0 ? (
                        transactions.map((tx) => {
                            const typeKey = tx.transactionType ? tx.transactionType.toUpperCase() : "EARNING";
                            const cfg = txTypeConfig[typeKey] || txTypeConfig.EARNING;
                            const Icon = cfg.icon;
                            // Check backend response for amount, ensure it converts to number
                            const amount = Number(tx.amount) || 0;
                            const isPositive = amount >= 0;
                            const date = new Date(tx.createdAt || tx.transactionDate);
                            let statusLabel = "Thất bại";
                            let statusClass = "resto-wallet-tx-status--fail";

                            if (tx.status === "COMPLETED" || tx.status === "SUCCESS") {
                                statusLabel = "Thành công";
                                statusClass = "resto-wallet-tx-status--ok";
                            } else if (tx.status === "PENDING") {
                                statusLabel = "Đang xử lý";
                                statusClass = "resto-wallet-tx-status--pending";
                            }

                            return (
                                <div key={tx.id} className="resto-wallet-tx-card">
                                    <div className="resto-wallet-tx-icon" style={{ background: cfg.bg, color: cfg.color }}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="resto-wallet-tx-info">
                                        <div className="resto-wallet-tx-desc">{tx.description || cfg.label}</div>
                                        <div className="resto-wallet-tx-meta">
                                            <Clock size={12} />
                                            <span>
                                                {date.toLocaleDateString("vi-VN")} {date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                            <span className={`resto-wallet-tx-status ${statusClass}`}>
                                                · {statusLabel}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`resto-wallet-tx-amount ${isPositive ? "resto-wallet-tx-amount--pos" : "resto-wallet-tx-amount--neg"}`}>
                                        {isPositive ? "+" : "-"}{formatVnd(amount)}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-4 text-gray-500">Chưa có giao dịch nào</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
