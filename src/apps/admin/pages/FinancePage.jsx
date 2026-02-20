import { useState, useEffect } from "react";
import { Filter, Download, Eye, Wallet, Calendar, CheckCircle, XCircle } from "lucide-react";
import PageHeader from "../../../components/shared/PageHeader";
import DataTable from "../../../components/shared/DataTable";
import StatusBadge from "../../../components/shared/StatusBadge";
import Modal from "../../../components/shared/Modal";
import TransactionDetail from "../components/finance/TransactionDetail";
import financeApi from "../../../api/admin/financeApi";
import "./ManagementPages.css";

const formatCurrency = (val) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
};

const FinancePage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailModal, setDetailModal] = useState({ open: false, data: null });

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await financeApi.getAllTransactions();
                // Sort by ID descending (newest first)
                setTransactions([...data].sort((a, b) => b.id - a.id));
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const columns = [
        {
            key: "transaction", label: "TRANSACTION & ENTITY", width: "350px",
            render: (_, row) => (
                <div className="res-info-cell">
                    <div className="res-img-wrapper" style={{
                        background: row.amount >= 0 ? '#DCFCE7' : '#FEE2E2',
                        border: `1px solid ${row.amount >= 0 ? '#BBF7D0' : '#FECACA'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px'
                    }}>
                        <Wallet size={20} color={row.amount >= 0 ? '#15803D' : '#991B1B'} />
                    </div>
                    <div className="res-details">
                        <div className="res-name">
                            {`TX-${row.id}`}
                            <span className="cod-badge" style={{
                                marginLeft: '8px',
                                background: row.amount >= 0 ? '#DCFCE7' : '#FEE2E2',
                                color: row.amount >= 0 ? '#15803D' : '#991B1B',
                                border: `1px solid ${row.amount >= 0 ? '#BBF7D0' : '#FECACA'}`,
                                borderRadius: '6px'
                            }}>
                                {row.transactionType || "TRANSACTION"}
                            </span>
                        </div>
                        <div className="res-meta">
                            <span>{row.wallet?.user?.name || "Unknown User"}</span>
                            <span className="res-meta-divider">•</span>
                            <span style={{ textTransform: 'none' }}>{row.description || "No description"}</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: "financial", label: "FINANCIAL IMPACT",
            render: (_, row) => (
                <div className="res-contact-cell">
                    <div className="res-contact-row" style={{
                        color: row.amount >= 0 ? '#15803D' : '#EF4444',
                        fontWeight: 700,
                        fontSize: '15px'
                    }}>
                        <span>{row.amount >= 0 ? "+" : ""}{formatCurrency(row.amount)}</span>
                    </div>
                    <div className="res-contact-row" style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', marginTop: '4px' }}>
                        <span>RUNNING BALANCE: {formatCurrency(row.balanceAfter || 0)}</span>
                    </div>
                </div>
            ),
        },
        {
            key: "timeline", label: "TIMELINE",
            render: (_, row) => (
                <div className="res-contact-cell">
                    <div className="res-contact-row" style={{ fontWeight: 600, color: '#374151' }}>
                        <Calendar size={14} className="res-contact-icon" />
                        <span>{formatDate(row.createdAt).split(' ')[1]}</span>
                    </div>
                    <div className="res-contact-row" style={{ fontSize: '11px', color: '#6B7280' }}>
                        <span>{formatDate(row.createdAt).split(' ')[0]}</span>
                    </div>
                </div>
            ),
        },
        {
            key: "status", label: "SETTLEMENT STATUS",
            render: (_, row) => (
                <div className={`badge-unlocked ${row.status === 'SUCCESS' ? '' : 'locked'}`}
                    style={{
                        background: row.status === 'SUCCESS' ? '#ECFCCB' : '#F3F4F6',
                        color: row.status === 'SUCCESS' ? '#4D7C0F' : '#6B7280',
                        borderColor: row.status === 'SUCCESS' ? '#D9F99D' : '#E5E7EB'
                    }}>
                    {row.status === 'SUCCESS' ? <CheckCircle size={12} strokeWidth={3} /> : <XCircle size={12} strokeWidth={3} />}
                    {row.status || "UNKNOWN"}
                </div>
            ),
        },
        {
            key: "actions", label: "ACTIONS", sortable: false, align: "right", width: "100px",
            render: (_, row) => (
                <div className="res-actions">
                    <button className="btn-icon-action green" title="View Details" onClick={() => setDetailModal({ open: true, data: row })}>
                        <Eye size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="management-page">
            <PageHeader
                title="FINANCIAL REPORTS"
                subtitle="Track revenue, commission earnings, and payout status."
                badge="FINANCE CONSOLE"
                badgeColor="green"
                BadgeIcon={Wallet}
                action={
                    <>
                        <button className="btn btn-secondary"><Filter size={16} /> Bộ lọc</button>
                        <button className="btn btn-secondary"><Download size={16} /> Xuất báo cáo</button>
                    </>
                }
            />

            {/* Summary cards could be added here if backend supports it */}
            <div className="finance-summary">
                <div className="finance-summary-card">
                    <span className="finance-summary-label">Tổng giao dịch</span>
                    <span className="finance-summary-value">
                        {loading ? <div style={{ height: 24, width: 60, background: '#e5e7eb', borderRadius: 4 }}></div> : transactions.length}
                    </span>
                </div>
                <div className="finance-summary-card">
                    <span className="finance-summary-label">Dòng tiền vào</span>
                    <span className="finance-summary-value positive">
                        {loading ? <div style={{ height: 24, width: 100, background: '#e5e7eb', borderRadius: 4 }}></div> : formatCurrency(transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0))}
                    </span>
                </div>
                <div className="finance-summary-card">
                    <span className="finance-summary-label">Dòng tiền ra</span>
                    <span className="finance-summary-value negative">
                        {loading ? <div style={{ height: 24, width: 100, background: '#e5e7eb', borderRadius: 4 }}></div> : formatCurrency(Math.abs(transactions.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0)))}
                    </span>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={transactions}
                loading={loading}
                searchPlaceholder="Tìm kiếm giao dịch..."
                onRowClick={(row) => setDetailModal({ open: true, data: row })}
            />

            {/* Detail Modal */}
            {
                detailModal.open && (
                    <TransactionDetail
                        transaction={detailModal.data}
                        onClose={() => setDetailModal({ open: false, data: null })}
                    />
                )
            }
        </div >
    );
};

export default FinancePage;
