import { useState, useEffect } from "react";
import { Lock, Unlock, MapPin, Phone, Trash2, Filter, Pencil, Users } from "lucide-react";
import PageHeader from "../../../components/shared/PageHeader";
import DataTable from "../../../components/shared/DataTable";
import StatusBadge from "../../../components/shared/StatusBadge";
import customerApi from "../../../api/admin/customerApi";
import CustomerDetail from "../components/customers/CustomerDetail";
import EditCustomerModal from "../components/customers/EditCustomerModal";
import "./ManagementPages.css";

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailModal, setDetailModal] = useState({ open: false, data: null });
    const [editModal, setEditModal] = useState({ open: false, data: null });

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const data = await customerApi.getAllCustomers();
                setCustomers(data);
            } catch (error) {
                console.error("Failed to fetch customers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const columns = [
        {
            key: "identity", label: "CUSTOMER IDENTITY", width: "350px",
            render: (_, row) => (
                <div className="res-info-cell">
                    <div className="res-img-wrapper">
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(row.user?.name || "Customer")}&background=random`}
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
                <div className={`badge-unlocked ${row.user?.isActive ? '' : 'locked'}`}>
                    {row.user?.isActive ? <Unlock size={12} strokeWidth={3} /> : <Lock size={12} strokeWidth={3} />}
                    {row.user?.isActive ? "UNLOCKED" : "LOCKED"}
                </div>
            ),
        },
        {
            key: "actions", label: "ACTIONS", sortable: false, align: "right", width: "140px",
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

    return (
        <div className="management-page">
            <PageHeader
                title="CUSTOMER BASE"
                subtitle="View user profiles, order history, and manage account statuses."
                badge="CUSTOMER CONSOLE"
                badgeColor="green"
                BadgeIcon={Users}
                action={
                    <button className="btn btn-secondary"><Filter size={16} /> Bộ lọc</button>
                }
            />
            <DataTable
                columns={columns}
                data={customers}
                loading={loading}
                searchPlaceholder="Tìm kiếm khách hàng..."
                onRowClick={(row) => setDetailModal({ open: true, data: row })}
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
        </div>
    );
};
export default CustomersPage;
