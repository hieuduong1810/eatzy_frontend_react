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
                title="System Configuration"
                subtitle="Manage detailed system settings and parameters"
            />

            <div className="system-config-container">
                {Object.entries(groups).map(([groupName, groupItems]) => {
                    if (groupItems.length === 0) return null;

                    const Icon = groupIcons[groupName] || Settings;

                    return (
                        <div key={groupName} className="config-section">
                            <div className="config-section-header">
                                <div className="section-title-wrapper">
                                    <Icon size={20} className="section-icon" />
                                    <h3 className="section-title">{groupName}</h3>
                                </div>
                                <span className="section-badge">{groupItems.length} ITEMS</span>
                            </div>

                            <div className="config-grid">
                                {groupItems.map(config => (
                                    <div key={config.id} className="config-card" onClick={() => handleEdit(config)}>
                                        <div className="config-card-header">
                                            <span className="config-key">{config.configKey}</span>
                                        </div>
                                        <div className="config-card-body">
                                            <h4 className="config-description">{configLabels[config.configKey] || config.description || config.configKey}</h4>
                                            <div className="config-value-wrapper">
                                                <span className="config-value-label">VALUE</span>
                                                <span className="config-value">{formatValue(config.configKey, config.configValue)}</span>
                                            </div>
                                        </div>
                                        <div className="config-card-footer">
                                            <p className="config-note">{config.description || "No additional description"}</p>
                                            <div className="config-meta">
                                                <span>LAST UPDATE</span>
                                                <span>{formatDate(config.updatedAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
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
