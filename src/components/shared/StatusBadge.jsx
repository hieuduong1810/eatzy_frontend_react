const STATUS_MAP = {
    active: { label: "Hoạt động", className: "badge badge-success" },
    inactive: { label: "Ngừng", className: "badge badge-danger" },
    pending: { label: "Chờ duyệt", className: "badge badge-warning" },
    open: { label: "Mở cửa", className: "badge badge-success" },
    closed: { label: "Đóng cửa", className: "badge badge-danger" },
    online: { label: "Online", className: "badge badge-success" },
    offline: { label: "Offline", className: "badge badge-danger" },
    busy: { label: "Đang giao", className: "badge badge-warning" },
    completed: { label: "Hoàn thành", className: "badge badge-success" },
    cancelled: { label: "Đã huỷ", className: "badge badge-danger" },
    processing: { label: "Đang xử lý", className: "badge badge-info" },
    expired: { label: "Hết hạn", className: "badge badge-danger" },
    scheduled: { label: "Đã lên lịch", className: "badge badge-info" },
};

const StatusBadge = ({ status }) => {
    const config = STATUS_MAP[status] || { label: status, className: "badge badge-info" };
    return <span className={config.className}>{config.label}</span>;
};

export default StatusBadge;
