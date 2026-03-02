import { useState, useEffect } from "react";
import { Lock, Unlock, MapPin, Phone, Trash2, Filter, Pencil, Users } from "lucide-react";
import PageHeader from "../../../components/shared/PageHeader";
import DataTable from "../../../components/shared/DataTable";
import StatusBadge from "../../../components/shared/StatusBadge";
import customerApi from "../../../api/admin/customerApi";
import userApi from "../../../api/admin/userApi";
import CustomerDetail from "../components/customers/CustomerDetail";
import EditCustomerModal from "../components/customers/EditCustomerModal";
import CustomerFilterModal from "../components/customers/CustomerFilterModal";
import SlideConfirmModal from "../../../components/shared/SlideConfirmModal";
import { useNotification } from "../../../contexts/NotificationContext";
import "./ManagementPages.css";

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailModal, setDetailModal] = useState({ open: false, data: null });
    const [editModal, setEditModal] = useState({ open: false, data: null });
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [currentFilter, setCurrentFilter] = useState('ALL');
    const { showNotification } = useNotification();

    // Delete Modal State
    const [deleteModal, setDeleteModal] = useState({ open: false, data: null, loading: false, success: false });

    // Lock Modal State
    const [lockModal, setLockModal] = useState({ open: false, data: null, loading: false, success: false });

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            // In real app, pass currentFilter to API
            const data = await customerApi.getAllCustomers();
            setCustomers(data);
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [currentFilter]);

    const handleFilterApply = (filter) => {
        setCurrentFilter(filter);
        console.log("Customer Filter Applied:", filter);
    };

    const handleDeleteClick = (e, row) => {
        e.stopPropagation();
        setDeleteModal({ open: true, data: row, loading: false });
    };

    const handleDeleteConfirm = async () => {
        setDeleteModal(prev => ({ ...prev, loading: true }));
        try {
            await customerApi.deleteCustomer(deleteModal.data.id);
            setDeleteModal(prev => ({ ...prev, loading: false, success: true }));
            showNotification("Thành công", `Đã xóa khách hàng ${deleteModal.data.user?.name}`, "success");
            fetchCustomers();
            setTimeout(() => {
                setDeleteModal({ open: false, data: null, loading: false, success: false });
            }, 1000);
        } catch (error) {
            showNotification("Lỗi", "Không thể xóa khách hàng. Vui lòng thử lại.", "danger");
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
            fetchCustomers();
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
            key: "identity", label: "CUSTOMER IDENTITY", width: "350px",
            render: (_, row) => (
                <div className="res-info-cell">
                    <div className="res-img-wrapper">
                        <img
                            src={
                                row.user?.gender === 'MALE'
                                    ? "https://res.cloudinary.com/durzk8qz6/image/upload/v1771570306/j60o3m9wx7tlugcpsnqt.png"
                                    : row.user?.gender === 'FEMALE'
                                        ? "https://res.cloudinary.com/durzk8qz6/image/upload/v1771570306/zepig5ru2gxx4ruxfwnw.avif"
                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(row.user?.name || "Customer")}&background=random`
                            }
                            alt=""
                            className="res-img"
                        />
                        <div className={`res-status-dot ${row.user?.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>
                    <div className="res-details">
                        <div className="res-name">
                            {row.user?.name || "Unknown Customer"}
                        </div>
                        <div className="res-meta">
                            <Phone size={12} className="mr-1" />
                            <span>{row.user?.phoneNumber || "NO PHONE"}</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: "location", label: "LOCATION",
            render: (_, row) => (
                <div className="res-contact-cell">
                    <div className="res-contact-row" style={{ color: '#15803D', fontWeight: 600 }}>
                        <MapPin size={14} className="res-contact-icon" style={{ color: '#16A34A' }} />
                        <span>{row.hometown || row.user?.address || "N/A"}</span>
                    </div>
                    <div className="res-contact-row" style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280' }}>
                        <span>HOMETOWN REGION</span>
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
            key: "actions", label: "ACTIONS", sortable: false, align: "right", width: "140px",
            render: (_, row) => (
                <div className="res-actions">
                    <button className="btn-icon-action yellow" title="Lock/Unlock" onClick={(e) => handleLockClick(e, row)}>
                        <Lock size={16} />
                    </button>
                    <button className="btn-icon-action green" title="Edit" onClick={(e) => {
                        e.stopPropagation();
                        setEditModal({ open: true, data: row });
                    }}>
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
                title="CUSTOMER BASE"
                subtitle="View user profiles, order history, and manage account statuses."
                badge="CUSTOMER CONSOLE"
                badgeColor="green"
                BadgeIcon={Users}
                action={
                    <button className="btn btn-secondary" onClick={() => setFilterModalOpen(true)}>
                        <Filter size={16} /> Bộ lọc {currentFilter !== 'ALL' && '(1)'}
                    </button>
                }
            />
            <DataTable
                columns={columns}
                data={customers}
                loading={loading}
                searchPlaceholder="Tìm kiếm khách hàng (Tên, SĐT, Địa chỉ)..."
                searchKeys={['user.name', 'user.phoneNumber', 'user.email', 'hometown', 'user.address']}
                onRowClick={(row) => setDetailModal({ open: true, data: row })}
            />

            {/* Filter Modal */}
            <CustomerFilterModal
                isOpen={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                onApply={handleFilterApply}
                currentFilter={currentFilter}
            />

            {/* Detail Modal */}
            {detailModal.open && (
                <CustomerDetail
                    customer={detailModal.data}
                    onClose={() => setDetailModal({ open: false, data: null })}
                />
            )}

            {/* Edit Modal */}
            <EditCustomerModal
                isOpen={editModal.open}
                onClose={() => setEditModal({ open: false, data: null })}
                customer={editModal.data}
            />

            {/* Delete Confirmation Modal */}
            <SlideConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, data: null, loading: false, success: false })}
                onConfirm={handleDeleteConfirm}
                title="Xác nhận xóa"
                description={`Bạn có chắc chắn muốn xóa khách hàng ${deleteModal.data?.user?.name}? Hành động này không thể hoàn tác.`}
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

export default CustomersPage;
