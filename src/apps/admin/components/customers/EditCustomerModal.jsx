import { useState, useEffect } from "react";
import { X, User, Phone, Mail, MapPin, Calendar, Save, FilePenLine, CheckCircle } from "lucide-react";
import "./EditCustomerModal.css";

const EditCustomerModal = ({ isOpen, onClose, customer }) => {
    const [formData, setFormData] = useState({
        name: "",
        hometown: "",
        dob: ""
    });

    useEffect(() => {
        if (customer && isOpen) {
            setFormData({
                name: customer.user?.name || "",
                hometown: customer.hometown || "",
                dob: customer.user?.dob ? new Date(customer.user.dob).toISOString().split('T')[0] : ""
            });
        }
    }, [customer, isOpen]);

    if (!isOpen || !customer) return null;

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        console.log("Saving customer:", { id: customer.id, ...formData });
        onClose();
    };

    return (
        <div className="ec-modal-overlay" onClick={onClose}>
            <div className="ec-modal-container" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="ec-modal-header">
                    <div className="ec-header-left">
                        <div className="ec-icon-box">
                            <FilePenLine size={24} />
                        </div>
                        <div className="ec-title-group">
                            <h2>EDIT CUSTOMER</h2>
                            <span className="ec-account-id">ACCOUNT ID: #{String(customer.id).padStart(2, '0')}</span>
                        </div>
                    </div>
                    <button className="ec-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="ec-modal-body">

                    {/* General Information */}
                    <div className="ec-card">
                        <div className="ec-section-title">
                            <div className="ec-section-indicator" />
                            <span>GENERAL INFORMATION</span>
                        </div>

                        <div className="ec-form-group">
                            <label className="ec-label">FULL NAME</label>
                            <div className="ec-input-wrapper">
                                <User size={18} className="ec-input-icon" />
                                <input
                                    className="ec-input"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="Enter full name"
                                />
                            </div>
                        </div>

                        <div className="ec-row">
                            <div className="ec-form-group">
                                <label className="ec-label">PHONE (READ-ONLY)</label>
                                <div className="ec-input-wrapper">
                                    <Phone size={18} className="ec-input-icon" />
                                    <input
                                        className="ec-input"
                                        value={customer.user?.phoneNumber || "N/A"}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="ec-form-group">
                                <label className="ec-label">EMAIL (READ-ONLY)</label>
                                <div className="ec-input-wrapper">
                                    <Mail size={18} className="ec-input-icon" />
                                    <input
                                        className="ec-input"
                                        value={customer.user?.email || "N/A"}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Details */}
                    <div className="ec-card">
                        <div className="ec-section-title">
                            <div className="ec-section-indicator" />
                            <span>PERSONAL DETAILS</span>
                        </div>

                        <div className="ec-row">
                            <div className="ec-form-group">
                                <label className="ec-label">HOMETOWN</label>
                                <div className="ec-input-wrapper">
                                    <MapPin size={18} className="ec-input-icon" />
                                    <input
                                        className="ec-input"
                                        value={formData.hometown}
                                        onChange={(e) => handleChange('hometown', e.target.value)}
                                        placeholder="City or Region"
                                    />
                                </div>
                            </div>
                            <div className="ec-form-group">
                                <label className="ec-label">DATE OF BIRTH</label>
                                <div className="ec-input-wrapper">
                                    <Calendar size={18} className="ec-input-icon" />
                                    <input
                                        type="date"
                                        className="ec-input"
                                        value={formData.dob}
                                        onChange={(e) => handleChange('dob', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="ec-disclaimer">
                        Thay đổi tên sẽ cập nhật hồ sơ người dùng chính. Các trường thông tin Email và Số điện thoại chỉ có thể thay đổi bởi bộ phận kỹ thuật để đảm bảo tính xác thực.
                    </p>
                </div>

                {/* Footer */}
                <div className="ec-modal-footer">
                    <button className="ec-save-btn active" onClick={handleSubmit}>
                        <Save size={20} />
                        SAVE CHANGES
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EditCustomerModal;
