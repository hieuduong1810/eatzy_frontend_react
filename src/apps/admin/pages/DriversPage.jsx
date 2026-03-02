import { useState, useEffect } from "react";
import { Lock, Unlock, MapPin, Phone, Trash2, ExternalLink, Plus, Filter, Eye, Pencil, Star, Bike, CreditCard, Truck } from "lucide-react";
import PageHeader from "../../../components/shared/PageHeader";
import DataTable from "../../../components/shared/DataTable";
import StatusBadge from "../../../components/shared/StatusBadge";
import Modal from "../../../components/shared/Modal";
import driverApi from "../../../api/admin/driverApi";
import userApi from "../../../api/admin/userApi";
import DriverDetail from "../components/drivers/DriverDetail";
import DriverFilterModal from "../components/drivers/DriverFilterModal";
import SlideConfirmModal from "../../../components/shared/SlideConfirmModal";
import { useNotification } from "../../../contexts/NotificationContext";
import "./ManagementPages.css";

const formatCurrency = (val) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", notation: "compact" }).format(val);

const DriversPage = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailModal, setDetailModal] = useState({ open: false, data: null });
    const [createModal, setCreateModal] = useState(false);
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [currentFilters, setCurrentFilters] = useState({});
    const { showNotification } = useNotification();

    // Delete Modal State
    const [deleteModal, setDeleteModal] = useState({ open: false, data: null, loading: false, success: false });

    // Lock Modal State
    const [lockModal, setLockModal] = useState({ open: false, data: null, loading: false, success: false });

    const fetchDrivers = async () => {
        setLoading(true);
        try {
            // In a real app, pass filters to API here
            const data = await driverApi.getAllDrivers();
            setDrivers(data);
        } catch (error) {
            console.error("Failed to fetch drivers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, [currentFilters]);

    const handleFilterApply = (filters) => {
        setCurrentFilters(filters);
        // Logic to re-fetch or filter data locally would go here
        console.log("Filters applied:", filters);
    };

    const handleDeleteClick = (e, row) => {
        e.stopPropagation();
        setDeleteModal({ open: true, data: row, loading: false });
    };

    const handleDeleteConfirm = async () => {
        setDeleteModal(prev => ({ ...prev, loading: true }));
        try {
            await driverApi.deleteDriver(deleteModal.data.id);
            setDeleteModal(prev => ({ ...prev, loading: false, success: true }));
            showNotification("Thành công", `Đã xóa tài xế ${deleteModal.data.user?.name}`, "success");
            fetchDrivers();
            setTimeout(() => {
                setDeleteModal({ open: false, data: null, loading: false, success: false });
            }, 1000);
        } catch (error) {
            showNotification("Lỗi", "Không thể xóa tài xế. Vui lòng thử lại.", "danger");
            setDeleteModal(prev => ({ ...prev, loading: false }));
        }
    };

    const handleLockClick = (e, row) => {
        e.stopPropagation();
        setLockModal({ open: true, data: row, loading: false });
    };

    const handleLockConfirm = async () => {
        setLockModal(prev => ({ ...prev, loading: true }));
        const currentStatus = lockModal.data.user?.isActive;
        try {
            await userApi.updateUserActiveStatus(lockModal.data.user?.id, !currentStatus);
            setLockModal(prev => ({ ...prev, loading: false, success: true }));
            showNotification(
                "Thành công",
                `Đã ${!currentStatus ? 'mở khóa' : 'khóa'} tài khoản ${lockModal.data.user?.name}`,
                "success"
            );
            fetchDrivers();
            setTimeout(() => {
                setLockModal({ open: false, data: null, loading: false, success: false });
            }, 1000);
        } catch (error) {
            showNotification("Lỗi", "Không thể cập nhật trạng thái người dùng. Vui lòng thử lại.", "danger");
            setLockModal(prev => ({ ...prev, loading: false }));
        }
    };

    const columns = [
        {
            key: "identity", label: "DRIVER IDENTITY", width: "300px",
            render: (_, row) => (
                <div className="res-info-cell">
                    <div className="res-img-wrapper">
                        <img
                            src={row.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.user?.name || "Driver")}&background=random`}
                            alt=""
                            className="res-img"
                        />
                        <div className={`res-status-dot ${row.status !== 'AVAILABLE' ? 'closed' : ''}`} />
                    </div>
                    <div className="res-details">
                        <div className="res-name">
                            {row.user?.name || "Unknown Driver"}
                            <div className="badge-verified">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 0L1.5 2V5.5C1.5 8.5 3.5 11 6 12C8.5 11 10.5 8.5 10.5 5.5V2L6 0Z" fill="#16A34A" />
                                    <path d="M4 6L5.5 7.5L8 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <div className="res-meta">
                            <span style={{ textTransform: 'lowercase' }}>{row.user?.email || "No email"}</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: "fleet", label: "FLEET & COD", width: "250px",
            render: (_, row) => (
                <div className="res-contact-cell">
                    <div className="res-contact-row" style={{ color: '#15803D', fontWeight: 600 }}>
                        <Bike size={14} className="res-contact-icon" style={{ color: '#16A34A' }} />
                        <span>{row.vehicle_license_plate || "N/A"}</span>
                    </div>
                    <div className="res-contact-row" style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280' }}>
                        <span>
                            {(row.vehicle_brand || row.vehicle_model)
                                ? `${row.vehicle_brand || ''} ${row.vehicle_model || ''}`
                                : (row.vehicleDetails || "Chưa cập nhật")}
                        </span>
                    </div>
                    <div className="res-contact-row mt-1">
                        <div className="cod-badge">
                            COD LIMIT: {formatCurrency(row.codLimit || 2000000)}
                        </div>
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
                        {row.averageRating || "5.0"}
                    </div>
                    <div className="res-reviews">
                        <span className="res-reviews-count" style={{ fontSize: '14px', color: '#111827' }}>{row.completedTrips || 0}</span>
                        <span className="res-reviews-count" style={{ fontSize: '9px' }}>TOTAL TRIPS</span>
                    </div>
                </div>
            ),
        },
        {
            key: "status", label: "STATUS",
            render: (_, row) => (
                <div className={`badge-unlocked ${!row.user?.isActive ? 'locked' : ''}`}>
                    {row.user?.isActive ? <Unlock size={12} strokeWidth={3} /> : <Lock size={12} strokeWidth={3} />}
                    {row.user?.isActive ? "UNLOCKED" : "LOCKED"}
                </div>
            ),
        },
        {
            key: "actions", label: "ACTIONS", sortable: false, align: "right",
            render: (_, row) => (
                <div className="res-actions">
                    <button className="btn-icon-action yellow" title="Lock/Unlock" onClick={(e) => handleLockClick(e, row)}>
                        <Lock size={16} />
                    </button>
                    <button className="btn-icon-action green" title="Edit" onClick={() => setDetailModal({ open: true, data: row })}>
                        <Pencil size={16} />
                    </button>
                    <button className="btn-icon-action red" title="Delete" onClick={(e) => handleDeleteClick(e, row)}>
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="management-page">
            <PageHeader
                title="DRIVER FLEET"
                subtitle="Monitor active drivers, manage registrations and track delivery performance."
                badge="OPERATION CONSOLE"
                badgeColor="green"
                BadgeIcon={Truck}
                action={
                    <>
                        <button className="btn btn-secondary" onClick={() => setFilterModalOpen(true)}>
                            <Filter size={16} /> Bộ lọc {Object.keys(currentFilters).some(k => currentFilters[k] !== 'ALL' && currentFilters[k].length > 0) && '(1)'}
                        </button>
                        <button className="btn btn-primary" onClick={() => setCreateModal(true)}>
                            <Plus size={16} /> Thêm tài xế
                        </button>
                    </>
                }
            />

            <DataTable
                columns={columns}
                data={drivers}
                loading={loading}
                searchPlaceholder="Tìm kiếm tài xế (Tên, Biển số, Xe)..."
                searchKeys={['user.name', 'vehicle_license_plate', 'vehicle_brand', 'vehicle_model']}
                onRowClick={(row) => setDetailModal({ open: true, data: row })}
            />

            {/* Filter Modal */}
            <DriverFilterModal
                isOpen={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                onApply={handleFilterApply}
                currentFilters={currentFilters}
            />

            {/* Detail Modal */}
            {detailModal.open && (
                <DriverDetail
                    driver={detailModal.data}
                    onClose={() => setDetailModal({ open: false, data: null })}
                />
            )}

            {/* Create Modal */}
            <Modal
                isOpen={createModal}
                onClose={() => setCreateModal(false)}
                title="Thêm tài xế mới"
                subtitle="Điền thông tin tài xế"
                size="lg"
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setCreateModal(false)}>Huỷ</button>
                        <button className="btn btn-primary" onClick={() => setCreateModal(false)}>Tạo tài xế</button>
                    </>
                }
            >
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Họ tên</label>
                        <input className="form-input" placeholder="Nhập tên tài xế" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input className="form-input" type="email" placeholder="email@example.com" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Số điện thoại</label>
                        <input className="form-input" placeholder="0901234567" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">CCCD/CMND</label>
                        <input className="form-input" placeholder="Nhập số CCCD" />
                    </div>
                </div>
                <div className="detail-section-title mt-4 mb-2">Thông tin xe</div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Biển số xe</label>
                        <input className="form-input" placeholder="59X1-123.45" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Loại xe</label>
                        <input className="form-input" placeholder="VD: Honda Wave" />
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <SlideConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, data: null, loading: false, success: false })}
                onConfirm={handleDeleteConfirm}
                title="Xác nhận xóa"
                description={`Bạn có chắc chắn muốn xóa tài xế ${deleteModal.data?.user?.name}? Hành động này không thể hoàn tác.`}
                isLoading={deleteModal.loading}
                isSuccess={deleteModal.success}
                successTitle="Thành công"
                type="danger"
            />

            {/* Lock Confirmation Modal */}
            <SlideConfirmModal
                isOpen={lockModal.open}
                onClose={() => setLockModal({ open: false, data: null, loading: false, success: false })}
                onConfirm={handleLockConfirm}
                title={lockModal.data?.user?.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                description={`Bạn có chắc chắn muốn ${lockModal.data?.user?.isActive ? 'khóa' : 'mở khóa'} tài khoản của ${lockModal.data?.user?.name}?`}
                isLoading={lockModal.loading}
                isSuccess={lockModal.success}
                successTitle="Thành công"
                type={lockModal.data?.user?.isActive ? "danger" : "warning"}
            />
        </div>
    );
};

export default DriversPage;
