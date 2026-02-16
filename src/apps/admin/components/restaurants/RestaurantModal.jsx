import { useState, useEffect } from "react";
import { X, Play, Pause, Clock, Lock, MapPin, Phone, Percent, Image, Upload, CheckCircle } from "lucide-react";
import "./RestaurantModal.css";

const RestaurantModal = ({ isOpen, onClose, restaurant = null }) => {
    const isEditMode = !!restaurant;

    // Default initial state
    const initialState = {
        name: "",
        phone: "",
        commission: "10",
        address: "",
        description: "",
        status: "open",
        avatarUrl: null,
        coverUrl: null
    };

    const [formData, setFormData] = useState(initialState);

    // Initialize data on open
    useEffect(() => {
        if (isOpen) {
            if (restaurant) {
                setFormData({
                    name: restaurant.name || "",
                    phone: restaurant.contactPhone || "",
                    commission: restaurant.commissionRate || "10",
                    address: restaurant.address || "",
                    description: restaurant.description || "",
                    status: restaurant.status || "open", // assuming status field exists or default to open
                    avatarUrl: restaurant.avatarUrl,
                    coverUrl: restaurant.coverImageUrl
                });
            } else {
                setFormData(initialState);
            }
        }
    }, [isOpen, restaurant]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        console.log("Submitting:", formData);
        onClose();
    };

    return (
        <div className="res-modal-overlay" onClick={onClose}>
            <div className="res-modal-container" onClick={e => e.stopPropagation()}>

                {/* LEFT: FORM */}
                <div className="res-modal-form">
                    <div className="res-modal-header">
                        <div>
                            <h2 className="res-modal-title">{isEditMode ? "EDIT PARTNER" : "ADD NEW PARTNER"}</h2>
                            <div className="res-modal-subtitle">Configure restaurant identity and operational rules.</div>
                        </div>
                        {isEditMode && (
                            <div className="res-id-badge">ID: #{restaurant.id}</div>
                        )}
                    </div>

                    {/* Status */}
                    <div className="form-section">
                        <div className="form-section-title">
                            <CheckCircle size={14} /> Operating Status
                        </div>
                        <div className="status-grid">
                            <button
                                className={`status-btn ${formData.status === 'open' ? 'active' : ''}`}
                                onClick={() => handleChange('status', 'open')}
                            >
                                <Play size={20} />
                                <span>OPEN</span>
                            </button>
                            <button
                                className={`status-btn ${formData.status === 'closed' ? 'active' : ''}`}
                                onClick={() => handleChange('status', 'closed')}
                            >
                                <Pause size={20} />
                                <span>CLOSED</span>
                            </button>
                            <button
                                className={`status-btn ${formData.status === 'pending' ? 'active' : ''}`}
                                onClick={() => handleChange('status', 'pending')}
                            >
                                <Clock size={20} />
                                <span>PENDING</span>
                            </button>
                            <button
                                className={`status-btn ${formData.status === 'locked' ? 'active' : ''}`}
                                onClick={() => handleChange('status', 'locked')}
                            >
                                <Lock size={20} />
                                <span>LOCKED</span>
                            </button>
                        </div>
                    </div>

                    {/* Identity */}
                    <div className="form-section">
                        <div className="form-section-title">
                            <MapPin size={14} /> Identity & Contact
                        </div>

                        <div className="input-group">
                            <label className="input-label">Restaurant Name</label>
                            <input
                                className="res-input large-text"
                                placeholder="E.G. THE PIZZA COMPANY"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        </div>

                        <div className="input-row">
                            <div className="input-group">
                                <label className="input-label">Contact Phone</label>
                                <div className="icon-input-wrapper">
                                    <Phone size={18} className="input-icon" />
                                    <input
                                        className="res-input with-icon"
                                        placeholder="0901234567"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Commission Rate</label>
                                <div className="icon-input-wrapper">
                                    <Percent size={18} className="input-icon" />
                                    <input
                                        className="res-input with-icon"
                                        placeholder="10"
                                        value={formData.commission}
                                        onChange={(e) => handleChange('commission', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Store Address</label>
                            <div className="icon-input-wrapper">
                                <MapPin size={18} className="input-icon" />
                                <input
                                    className="res-input with-icon"
                                    placeholder="Street address, district, city..."
                                    value={formData.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-section">
                        <div className="form-section-title">
                            <CheckCircle size={14} /> Additional Information
                        </div>
                        <textarea
                            className="res-textarea"
                            placeholder="Tell us more about this restaurant, its specialty, and brand story..."
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </div>

                    {/* Visual Assets */}
                    <div className="form-section">
                        <div className="form-section-title">
                            <Image size={14} /> Visual Assets
                        </div>
                        <div className="assets-grid">
                            <div className="asset-upload-box">
                                {formData.avatarUrl ? (
                                    <img src={formData.avatarUrl} className="asset-preview-img" alt="logo" />
                                ) : (
                                    <>
                                        <Upload size={32} strokeWidth={1.5} />
                                        <div className="upload-label">Select Logo</div>
                                    </>
                                )}
                            </div>
                            <div className="asset-upload-box">
                                {formData.coverUrl ? (
                                    <img src={formData.coverUrl} className="asset-preview-img" alt="cover" />
                                ) : (
                                    <>
                                        <Upload size={32} strokeWidth={1.5} />
                                        <div className="upload-label">Select Cover</div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: PREVIEW */}
                <div className="res-modal-preview">
                    <div>
                        <div className="preview-header">
                            <div className="preview-label">LIVE PREVIEW</div>
                            <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
                        </div>

                        {/* Preview Card */}
                        <div className="preview-card">
                            <div className="pc-cover">
                                {formData.coverUrl && <img src={formData.coverUrl} alt="" />}
                                <div className="pc-status-tag">
                                    <div className="pc-status-dot"></div>
                                    {formData.status}
                                </div>
                            </div>
                            <div className="pc-body">
                                <img
                                    src={formData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || "Rest")}&background=random`}
                                    className="pc-avatar" alt=""
                                />
                                <div className="pc-info">
                                    <div>
                                        <h3 className="pc-name">{formData.name || "NEW PARTNER NAME"}</h3>
                                        <div className="pc-address">
                                            <MapPin size={12} />
                                            {formData.address || "ADDRESS NOT SET"}
                                        </div>
                                    </div>
                                    <div className="pc-commission">
                                        <span className="pc-comm-label">COMMISSION</span>
                                        <div className="pc-comm-val">{formData.commission}%</div>
                                    </div>
                                </div>
                                <div className="pc-rating">
                                    <div className="pc-stars">
                                        {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                                    </div>
                                    <span>5.0</span>
                                    <span>•</span>
                                    <span>0 REVIEWS</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="preview-action">
                        <button className={`launch-btn ${formData.name ? 'ready' : ''}`} onClick={handleSubmit}>
                            {isEditMode ? "SAVE CHANGES" : "LAUNCH RESTAURANT"}
                            <CheckCircle size={24} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RestaurantModal;
