import { useState, useEffect } from "react";
import { Settings, Truck, Wallet, Save, Clock, Activity, Sliders } from "lucide-react";
import PageHeader from "../../../components/shared/PageHeader";
import systemConfigApi from "../../../api/admin/systemConfigApi";
import Modal from "../../../components/shared/Modal";
import "./ManagementPages.css";

const SystemConfigPage = () => {
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState(null);
    const [editValue, setEditValue] = useState("");

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        setLoading(true);
        try {
            const response = await systemConfigApi.getAllConfigs({ size: 100 });
            const data = response.data?.data?.result || response.data?.result || [];
            setConfigs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch configs:", error);
            setConfigs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (config) => {
        setSelectedConfig(config);
        setEditValue(config.configValue);
        setEditModalOpen(true);
    };

    const handleSave = async () => {
        if (!selectedConfig) return;
        try {
            await systemConfigApi.updateConfig({
                ...selectedConfig,
                configValue: editValue,
                lastUpdatedBy: null // Backend handles this usually
            });
            setEditModalOpen(false);
            fetchConfigs();
        } catch (error) {
            console.error("Failed to update config:", error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const formatValue = (key, value) => {
        if (key.includes('RATE')) return `${value}%`;
        if (key.includes('FEE')) return `${parseInt(value).toLocaleString('vi-VN')}đ`;
        if (key.includes('DISTANCE')) return `${value}km`;
        if (key.includes('RADIUS')) return `${value}km`;
        if (key.includes('TIMEOUT_SEC')) return `${value}s`;
        if (key.includes('TIMEOUT_MINUTES')) return `${value} phút`;
        if (key === 'MAINTENANCE_MODE') return value === 'true' ? 'Đang bật' : 'Đang tắt';
        return value;
    };

    // Vietnamese labels for config keys
    const configLabels = {
        'RESTAURANT_COMMISSION_RATE': 'Hoa hồng quán',
        'DRIVER_COMMISSION_RATE': 'Hoa hồng tài xế',
        'DELIVERY_BASE_FEE': 'Phí ship cơ bản',
        'DELIVERY_BASE_DISTANCE': 'Khoảng cách cơ bản',
        'DELIVERY_PER_KM_FEE': 'Phí mỗi km thêm',
        'DELIVERY_MIN_FEE': 'Phí ship tối thiểu',
        'DRIVER_SEARCH_RADIUS_KM': 'Bán kính tìm tài xế',
        'DRIVER_ACCEPT_TIMEOUT_SEC': 'TG tài xế chấp nhận',
        'MAX_RESTAURANT_DISTANCE_KM': 'Khoảng cách tối đa',
        'RESTAURANT_RESPONSE_TIMEOUT_MINUTES': 'TG quán phản hồi',
        'DRIVER_ASSIGNMENT_TIMEOUT_MINUTES': 'TG tìm tài xế',
        'SUPPORT_HOTLINE': 'Hotline hỗ trợ',
        'MAINTENANCE_MODE': 'Chế độ bảo trì',
    };

    // Icon map per group
    const groupIcons = {
        'FINANCIAL & COMMISSION': Wallet,
        'DELIVERY CONFIG': Truck,
        'SYSTEM OPERATION': Activity,
        'TIMEOUTS': Clock,
        'GENERAL CONFIG': Sliders,
    };


    // Grouping Logic
    const groups = {
        'FINANCIAL & COMMISSION': configs.filter(c =>
            c.configKey.includes('COMMISSION') ||
            c.configKey.includes('FINANCE')
        ),
        'DELIVERY CONFIG': configs.filter(c =>
            c.configKey.includes('DELIVERY') ||
            c.configKey.includes('_FEE') && !c.configKey.includes('COMMISSION')
        ),
        'SYSTEM OPERATION': configs.filter(c =>
            (c.configKey.includes('RADIUS') ||
                c.configKey.includes('DISTANCE')) &&
            !c.configKey.includes('DELIVERY_BASE_DISTANCE')
        ),
        'TIMEOUTS': configs.filter(c =>
            c.configKey.includes('TIMEOUT')
        ),
        'GENERAL CONFIG': configs.filter(c =>
            !c.configKey.includes('COMMISSION') &&
            !c.configKey.includes('FINANCE') &&
            !c.configKey.includes('DELIVERY') &&
            !c.configKey.includes('_FEE') &&
            !c.configKey.includes('RADIUS') &&
            (!c.configKey.includes('DISTANCE') || c.configKey.includes('DELIVERY_BASE_DISTANCE')) && // exclude if distance but allow base distance (delivered captured above)
            !c.configKey.includes('TIMEOUT')
        )
    };

    return (
        <div className="management-page">
            <PageHeader
                title="SYSTEM CONFIGURATION"
                subtitle="Manage detailed system settings, commission rates, and operational parameters."
                badge="SYSTEM CONSOLE"
                badgeColor="green"
                BadgeIcon={Settings}
            />

            <div className="system-config-container">
                {loading ? (
                    // Skeleton for System Config
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="config-section">
                            <div className="config-section-header">
                                <div className="section-title-wrapper" style={{ gap: 12 }}>
                                    <div style={{ width: 20, height: 20, background: '#e5e7eb', borderRadius: 4 }}></div>
                                    <div style={{ width: 150, height: 24, background: '#e5e7eb', borderRadius: 4 }}></div>
                                </div>
                            </div>
                            <div className="config-grid">
                                {[...Array(4)].map((_, j) => (
                                    <div key={j} className="config-card" style={{ height: 140 }}>
                                        <div className="config-card-header">
                                            <div style={{ width: '60%', height: 16, background: '#e5e7eb', borderRadius: 4 }}></div>
                                        </div>
                                        <div className="config-card-body">
                                            <div style={{ width: '80%', height: 20, background: '#e5e7eb', borderRadius: 4, marginBottom: 8 }}></div>
                                            <div style={{ width: '40%', height: 16, background: '#e5e7eb', borderRadius: 4 }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    Object.entries(groups).map(([groupName, groupItems]) => {
                        if (groupItems.length === 0) return null;

                        const Icon = groupIcons[groupName] || Settings;

                        // Determine color theme based on group
                        let colorTheme = "gray";
                        if (groupName.includes("FINANCIAL")) colorTheme = "green";
                        else if (groupName.includes("DELIVERY")) colorTheme = "blue";
                        else if (groupName.includes("SYSTEM")) colorTheme = "indigo";
                        else if (groupName.includes("TIMEOUT")) colorTheme = "orange";

                        return (
                            <div key={groupName} className="config-section sys-financial-section">
                                <div className="config-section-header">
                                    <div className="section-title-wrapper">
                                        <div className={`icon-box-soft ${colorTheme}`}>
                                            <Icon size={20} />
                                        </div>
                                        <h3 className="section-title-modern">{groupName}</h3>
                                    </div>
                                    <span className="section-badge-black">{groupItems.length} ITEMS</span>
                                </div>

                                <div className="sys-financial-grid">
                                    {groupItems.map(config => (
                                        <div key={config.id} className="sys-financial-card" onClick={() => handleEdit(config)}>
                                            <div className="sys-card-header">
                                                <span className="sys-key-label">{config.configKey}</span>
                                                <h4 className="sys-card-title">{configLabels[config.configKey] || config.configKey}</h4>
                                            </div>

                                            <div className="sys-card-body">
                                                <div className="sys-value-group">
                                                    <span className="sys-label-tiny">VALUE</span>
                                                    <div className="sys-value-huge">{formatValue(config.configKey, config.configValue)}</div>
                                                </div>
                                                <div className="sys-meta-group">
                                                    <span className="sys-label-tiny">LAST UPDATE</span>
                                                    <div className="sys-date-text">{formatDate(config.updatedAt)}</div>
                                                </div>
                                            </div>

                                            <div className="sys-card-footer">
                                                <p className="sys-desc-text">{config.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title={`Edit ${selectedConfig?.configKey}`} size="md">
                <div className="form-group">
                    <label className="form-label">Configuration Value</label>
                    <input
                        className="form-input"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                    />
                    <p className="text-sm text-gray-500 mt-2">{selectedConfig?.description}</p>
                </div>
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default SystemConfigPage;
