import { useState, useEffect } from "react";
import { Lock, Unlock, MapPin, Phone, Trash2, ExternalLink, Plus, Filter, Eye, Pencil, Star } from "lucide-react";
import PageHeader from "../../../components/shared/PageHeader";
import DataTable from "../../../components/shared/DataTable";
import StatusBadge from "../../../components/shared/StatusBadge";
import restaurantApi from "../../../api/admin/restaurantApi";
import RestaurantDetail from "../components/restaurants/RestaurantDetail";
import RestaurantModal from "../components/restaurants/RestaurantModal";
import "./ManagementPages.css";

const formatCurrency = (val) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", notation: "compact" }).format(val);

const RestaurantsPage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailModal, setDetailModal] = useState({ open: false, data: null });
    const [editModal, setEditModal] = useState({ open: false, data: null });

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const data = await restaurantApi.getAllRestaurants();
                setRestaurants(data);
            } catch (error) {
                console.error("Failed to fetch restaurants:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    const columns = [
        {
            key: "info", label: "RESTAURANT INFO", width: "300px",
            render: (_, row) => (
                <div className="res-info-cell">
                    <div className="res-img-wrapper">
                        <img
                            src={row.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=random`}
                            alt=""
                            className="res-img"
                        />
                        <div className="res-status-dot" />
                    </div>
                    <div className="res-details">
                        <div className="res-name">
                            {row.name}
                            <ExternalLink size={12} className="res-link-icon" />
                        </div>
                        <div className="res-meta">
                            <span>ID: {row.id}</span>
                            <span className="res-meta-divider">|</span>
                            <span>OWNER: {row.owner?.name || "N/A"}</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: "contact", label: "LOCATION & CONTACT", width: "250px",
            render: (_, row) => (
                <div className="res-contact-cell">
                    <div className="res-contact-row">
                        <MapPin size={14} className="res-contact-icon" />
                        <span className="res-contact-text" title={row.address}>{row.address}</span>
                    </div>
                    <div className="res-contact-row">
                        <Phone size={14} className="res-contact-icon" />
                        <span>{row.contactPhone}</span>
                    </div>
                </div>
            ),
        },
        {
            key: "performance", label: "PERFORMANCE",
            render: (_, row) => (
                <div className="res-perf-cell">
                    <div className="res-rating-badge">
                        <Star size={12} fill="currentColor" strokeWidth={0} />
                        {row.averageRating || "0.0"}
                    </div>
                    <div className="res-reviews">
                        <span className="res-reviews-count">{row.reviewCount || 0} REVIEWS</span>
                        <div className="res-reviews-dots">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className={`res-dot ${i < Math.round(row.averageRating || 0) ? 'filled' : ''}`} />
                            ))}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: "commission", label: "COMMISSION",
            render: (_, row) => <span className="res-commission">{row.commissionRate || 10}%</span>,
        },
        {
            key: "status", label: "STATUS",
            render: (_, row) => (
                <div className="badge-unlocked">
                    <Unlock size={12} strokeWidth={3} />
                    UNLOCKED
                </div>
            ),
        },
        {
            key: "actions", label: "ACTIONS", sortable: false, align: "right",
            render: (_, row) => (
                <div className="res-actions">
                    <button className="btn-icon-action yellow" title="Lock/Unlock" onClick={(e) => e.stopPropagation()}>
                        <Lock size={16} />
                    </button>
                    <button className="btn-icon-action green" title="Edit" onClick={(e) => {
                        e.stopPropagation();
                        setEditModal({ open: true, data: row });
                    }}>
                        <Pencil size={16} />
                    </button>
                    <button className="btn-icon-action red" title="Delete" onClick={(e) => e.stopPropagation()}>
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    if (loading) {
        return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="management-page">
            <PageHeader
                title="Quản lý cửa hàng"
                subtitle={`Tổng cộng ${restaurants.length} cửa hàng trên hệ thống`}
                actions={
                    <>
                        <button className="btn btn-secondary"><Filter size={16} /> Bộ lọc</button>
                        <button className="btn btn-primary" onClick={() => setEditModal({ open: true, data: null })}>
                            <Plus size={16} /> Thêm cửa hàng
                        </button>
                    </>
                }
            />

            <DataTable
                columns={columns}
                data={restaurants}
                searchPlaceholder="Tìm kiếm cửa hàng..."
                onRowClick={(row) => setDetailModal({ open: true, data: row })}
            />

            {/* Detail Modal (Read Only Dossier) */}
            {detailModal.open && (
                <RestaurantDetail
                    restaurant={detailModal.data}
                    onClose={() => setDetailModal({ open: false, data: null })}
                />
            )}

            {/* Add/Edit Modal */}
            <RestaurantModal
                isOpen={editModal.open}
                onClose={() => setEditModal({ open: false, data: null })}
                restaurant={editModal.data}
            />
        </div>
    );
};

export default RestaurantsPage;
