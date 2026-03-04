import React from "react";
import { X, FileText, Pencil } from "lucide-react";
import "./EditGeneralInfoModal.css";

const EditGeneralInfoModal = ({ isOpen, onClose, onSave, formData, setFormData }) => {
    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="egim-overlay" onClick={onClose}>
            <div className="egim-container" onClick={(e) => e.stopPropagation()}>
                <div className="egim-header">
                    <div className="egim-header-left">
                        <div className="egim-icon-box">
                            <FileText size={20} className="text-blue-500" />
                        </div>
                        <h2 className="egim-title">EDIT GENERAL INFO</h2>
                    </div>
                    <div className="egim-header-actions">
                        <button className="egim-save-btn" onClick={onSave} title="Save changes">
                            <FileText size={20} color="#6B7280" />
                        </button>
                        <button className="egim-close-btn" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="egim-content">
                    <div className="egim-field">
                        <label className="egim-label">STORE NAME</label>
                        <div className="egim-input-wrapper">
                            <input
                                type="text"
                                className="egim-input"
                                name="name"
                                value={formData.name || ""}
                                onChange={handleChange}
                            />
                            <Pencil size={14} className="egim-field-icon" />
                        </div>
                    </div>

                    <div className="egim-field">
                        <label className="egim-label">DESCRIPTION</label>
                        <div className="egim-input-wrapper">
                            <textarea
                                className="egim-textarea"
                                name="description"
                                value={formData.description || ""}
                                onChange={handleChange}
                                rows={4}
                            />
                            <Pencil size={14} className="egim-field-icon" />
                        </div>
                    </div>

                    <div className="egim-row">
                        <div className="egim-field">
                            <label className="egim-label">PHONE NUMBER</label>
                            <div className="egim-input-wrapper">
                                <input
                                    type="text"
                                    className="egim-input"
                                    name="phone"
                                    value={formData.phone || ""}
                                    onChange={handleChange}
                                />
                                <Pencil size={14} className="egim-field-icon" />
                            </div>
                        </div>

                        <div className="egim-field">
                            <label className="egim-label">EMAIL</label>
                            <div className="egim-input-wrapper">
                                <input
                                    type="email"
                                    className="egim-input"
                                    name="email"
                                    value={formData.email || ""}
                                    onChange={handleChange}
                                />
                                <Pencil size={14} className="egim-field-icon" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditGeneralInfoModal;
