import { useState, useEffect } from "react";
import { Plus, Filter, Tag, Clock, Store, Play, Pause, Pencil, Trash2, Truck } from "lucide-react";
import PageHeader from "../../../components/shared/PageHeader";
import DataTable from "../../../components/shared/DataTable";
import promotionApi from "../../../api/admin/promotionApi";
import PromotionModal from "../components/promotions/PromotionModal";
import "./PromotionsPage.css";

const PromotionsPage = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState({ open: false, data: null });

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        setLoading(true);
        try {
            const data = await promotionApi.getAllPromotions();
            setPromotions(data);
        } catch (error) {
            console.error("Failed to fetch promotions", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getStatus = (promo) => {
        if (!promo.active) return { label: "PAUSED", class: "paused" };
        const now = new Date();
        const start = new Date(promo.startDate);
        const end = new Date(promo.endDate);

        if (now < start) return { label: "SCHEDULED", class: "paused" };
        if (now > end) return { label: "EXPIRED", class: "paused" };
        return { label: "RUNNING", class: "running" };
    };

    const columns = [
        {
            key: "code", label: "CAMPAIGN", width: "300px",
            render: (_, row) => {
                const isShipping = row.discountType === "SHIPPING" || row.code.includes("FREESHIP");
                const status = getStatus(row);
                return (
                    <div className="promo-cell-main">
                        <div className={`promo-icon-box small ${status.class === 'running' ? 'running' : ''}`}>
                            {isShipping ? <Truck size={18} /> : <Tag size={18} />}
                        </div>
                        <div className="promo-info">
                            <h4>{row.code}</h4>
                            <div className="promo-desc">{row.description}</div>
                        </div>
                    </div>
                );
            }
        },
        {
            key: "value", label: "VALUE", width: "150px",
            render: (_, row) => (
                <div className="promo-cell-value">
                    {row.discountType === "PERCENTAGE" ? (
                        <>
                            <div className="promo-value-text">{row.discountValue}%</div>
                            <span className="promo-type-sub">PERCENTAGE</span>
                        </>
                    ) : row.discountType === "FIXED" ? (
                        <>
                            <div className="promo-value-text">{row.discountValue?.toLocaleString()}đ</div>
                            <span className="promo-type-sub">FIXED AMOUNT</span>
                        </>
                    ) : (
                        <>
                            <div className="promo-value-text">FREE</div>
                            <span className="promo-type-sub">SHIPPING</span>
                        </>
                    )}
                    <div className="promo-min-sub">MIN: {row.minOrderValue?.toLocaleString()}đ</div>
                </div>
            )
        },
        {
            key: "usage", label: "USAGE", width: "200px",
            render: (_, row) => {
                const used = row.remainingUsage !== undefined ? (row.totalQuantity - row.remainingQuantity) : 0;
                const total = row.totalQuantity || 0;
                const percent = total > 0 ? (used / total) * 100 : 0;

                return (
                    <div className="promo-cell-usage">
                        <div className="usage-text-row">
                            <span className="usage-val">{used} used</span>
                            <span className="usage-max"> / {total}</span>
                        </div>
                        <div className="usage-bar small">
                            <div className="usage-fill" style={{ width: `${percent}%` }}></div>
                        </div>
                    </div>
                );
            }
        },
        {
            key: "duration", label: "DURATION & SCOPE",
            render: (_, row) => (
                <div className="promo-cell-meta">
                    <div className="meta-row">
                        <Clock size={12} />
                        <span>{formatDate(row.startDate)} - {formatDate(row.endDate)}</span>
                    </div>
                    <div className="meta-row restaurants">
                        <Store size={12} />
                        <span>{row.restaurants?.length || 0} RESTAURANTS</span>
                    </div>
                </div>
            )
        },
        {
            key: "status", label: "STATUS", width: "120px",
            render: (_, row) => {
                const status = getStatus(row);
                return (
                    <div className={`status-badge small ${status.class}`}>
                        <div className="status-dot"></div>
                        {status.label}
                    </div>
                );
            }
        },
        {
            key: "actions", label: "ACTIONS", width: "140px", sortable: false,
            render: (_, row) => {
                const status = getStatus(row);
                return (
                    <div className="promo-cell-actions">
                        <button className={`action-btn small toggle ${status.class === 'running' ? '' : 'paused'}`}>
                            {status.class === 'running' ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                        <button className="action-btn small edit" onClick={(e) => {
                            e.stopPropagation();
                            setModalState({ open: true, data: row });
                        }}>
                            <Pencil size={14} />
                        </button>
                        <button className="action-btn small delete" onClick={(e) => {
                            e.stopPropagation();
                            // Logic for delete
                        }}>
                            <Trash2 size={14} />
                        </button>
                    </div>
                );
            }
        }
    ];

    return (
        <div className="management-page">
            <PageHeader
                title="Promotions Management"
                subtitle="Manage your restaurant campaigns and vouchers"
                actions={
                    <>
                        <button className="btn btn-secondary"><Filter size={16} /> Filter</button>
                        <button className="btn btn-primary" onClick={() => setModalState({ open: true, data: null })}>
                            <Plus size={16} /> Create Campaign
                        </button>
                    </>
                }
            />

            <div className="promotions-table-wrapper">
                <DataTable
                    columns={columns}
                    data={promotions}
                    searchPlaceholder="Search campaigns..."
                    isLoading={loading}
                    onRowClick={(row) => setModalState({ open: true, data: row })}
                />
            </div>

            <PromotionModal
                isOpen={modalState.open}
                onClose={() => {
                    setModalState({ open: false, data: null });
                    fetchPromotions();
                }}
                promotion={modalState.data}
            />
        </div>
    );
};

export default PromotionsPage;
