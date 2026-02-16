import { useState, useEffect } from "react";
import { X, Globe, Store, Check, Ticket, DollarSign, Percent, Truck, CheckCircle } from "lucide-react";
import promotionApi from "../../../../api/admin/promotionApi";
import restaurantApi from "../../../../api/admin/restaurantApi";
import "./PromotionModal.css";

const PromotionModal = ({ isOpen, onClose, promotion }) => {
    const isEditMode = !!promotion;

    const [formData, setFormData] = useState({
        code: "",
        description: "",
        discountType: "PERCENTAGE", // PERCENTAGE, FIXED, SHIPPING
        discountValue: 0,
        minOrderValue: 0,
        maxDiscountAmount: 0,
        totalQuantity: 100,
        usageLimitPerUser: 1,
        startDate: "",
        endDate: ""
    });

    const [scope, setScope] = useState('GLOBAL'); // 'GLOBAL', 'SELECT'
    const [selectedRestaurants, setSelectedRestaurants] = useState(new Set());
    const [restaurantList, setRestaurantList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchRestaurants();
            if (promotion) {
                // Populate data
                setFormData({
                    code: promotion.code || "",
                    description: promotion.description || "",
                    discountType: promotion.discountType || "PERCENTAGE",
                    discountValue: promotion.discountValue || 0,
                    minOrderValue: promotion.minOrderValue || 0,
                    maxDiscountAmount: promotion.maxDiscountAmount || 0,
                    totalQuantity: promotion.totalQuantity || 100,
                    usageLimitPerUser: promotion.usageLimitPerUser || 1,
                    startDate: promotion.startDate ? new Date(promotion.startDate).toISOString().split('T')[0] : "",
                    endDate: promotion.endDate ? new Date(promotion.endDate).toISOString().split('T')[0] : ""
                });

                // Determine Scope
                if (promotion.restaurants && promotion.restaurants.length > 0) {
                    setScope('SELECT');
                    setSelectedRestaurants(new Set(promotion.restaurants.map(r => r.id)));
                } else {
                    setScope('GLOBAL');
                    setSelectedRestaurants(new Set());
                }
            } else {
                // Reset
                setFormData({
                    code: "",
                    description: "",
                    discountType: "PERCENTAGE",
                    discountValue: 0,
                    minOrderValue: 0,
                    maxDiscountAmount: 0,
                    totalQuantity: 100,
                    usageLimitPerUser: 1,
                    startDate: "",
                    endDate: ""
                });
                setScope('GLOBAL');
                setSelectedRestaurants(new Set());
            }
        }
    }, [isOpen, promotion]);

    const fetchRestaurants = async () => {
        try {
            const data = await restaurantApi.getAllRestaurants();
            setRestaurantList(data);
        } catch (error) {
            console.error("Failed to fetch restaurants");
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleRestaurant = (id) => {
        const newSet = new Set(selectedRestaurants);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedRestaurants(newSet);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                ...formData,
                // Only include restaurantIds if scope is SELECT
                restaurantIds: scope === 'SELECT' ? Array.from(selectedRestaurants) : []
            };

            if (isEditMode) {
                await promotionApi.updatePromotion(promotion.id, payload);
            } else {
                if (scope === 'GLOBAL') {
                    await promotionApi.createGlobalPromotion(payload);
                } else {
                    await promotionApi.createSpecificPromotion({
                        ...payload,
                        restaurantIds: Array.from(selectedRestaurants)
                    });
                }
            }
            onClose();
        } catch (error) {
            console.error("Failed to save promotion", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const filteredRestaurants = restaurantList.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pm-modal-overlay" onClick={onClose}>
            <div className="pm-modal-container" onClick={e => e.stopPropagation()}>

                {/* LEFT PANEL - FORM */}
                <div className="pm-left-panel">
                    <div className="pm-header">
                        <div className="pm-title">
                            <h2>{isEditMode ? "EDIT CAMPAIGN" : "NEW CAMPAIGN"}</h2>
                            <p>Thiết lập chiến dịch khuyến mãi cho hệ thống Eatzy.</p>
                        </div>
                        <button className="pm-close-btn" onClick={onClose}><X size={20} /></button>
                    </div>

                    {/* IDENTITY */}
                    <div>
                        <div className="pm-section-label">
                            <div className="pm-section-indicator" />
                            <span>CAMPAIGN IDENTITY</span>
                        </div>
                        <div className="pm-form-group">
                            <label className="pm-label">CAMPAIGN CODE</label>
                            <input
                                className="pm-input"
                                placeholder="E.G. EATZYFLASH24"
                                value={formData.code}
                                onChange={e => handleChange('code', e.target.value.toUpperCase())}
                            />
                        </div>
                        <div className="pm-form-group">
                            <label className="pm-label">DESCRIPTION</label>
                            <textarea
                                className="pm-textarea"
                                placeholder="Mô tả về chương trình khuyến mãi và điều khoản áp dụng..."
                                value={formData.description}
                                onChange={e => handleChange('description', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* VALUE & CONSTRAINTS - LOCKED IN EDIT MODE */}
                    <div className={isEditMode ? "pm-locked-content" : ""}>
                        <div className="pm-section-label">
                            <div className="pm-section-indicator" />
                            <div className="pm-locked-header">
                                <span>VALUE & CONSTRAINTS</span>
                                {isEditMode && <div className="pm-locked-badge">LOCKED IN EDIT MODE</div>}
                            </div>
                        </div>

                        <div className="pm-form-group">
                            <div className="pm-row" style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <label className="pm-label">DISCOUNT TYPE</label>
                                    <div className="pm-type-selector">
                                        <button
                                            className={`pm-type-btn ${formData.discountType === 'PERCENTAGE' ? 'active' : ''}`}
                                            onClick={() => handleChange('discountType', 'PERCENTAGE')}
                                        >
                                            <Percent size={20} />
                                            <span>PERCENTAGE</span>
                                        </button>
                                        <button
                                            className={`pm-type-btn ${formData.discountType === 'FIXED' ? 'active' : ''}`}
                                            onClick={() => handleChange('discountType', 'FIXED')}
                                        >
                                            <DollarSign size={20} />
                                            <span>FIXED AMOUNT</span>
                                        </button>
                                        <button
                                            className={`pm-type-btn ${formData.discountType === 'SHIPPING' ? 'active' : ''}`}
                                            onClick={() => handleChange('discountType', 'SHIPPING')}
                                        >
                                            <Truck size={20} />
                                            <span>FREE SHIP</span>
                                        </button>
                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="pm-label">DISCOUNT VALUE</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            className="pm-input"
                                            type="number"
                                            value={formData.discountValue}
                                            onChange={e => handleChange('discountValue', parseFloat(e.target.value))}
                                        />
                                        <span style={{ position: 'absolute', right: '20px', top: '16px', fontWeight: 'bold', color: '#9ca3af' }}>
                                            {formData.discountType === 'PERCENTAGE' ? '%' : 'đ'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pm-form-group">
                            <div className="pm-row" style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <label className="pm-label">MIN ORDER VALUE</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            className="pm-input"
                                            type="number"
                                            value={formData.minOrderValue}
                                            onChange={e => handleChange('minOrderValue', parseFloat(e.target.value))}
                                        />
                                        <span style={{ position: 'absolute', right: '20px', top: '16px', fontWeight: 'bold', color: '#9ca3af' }}>đ</span>
                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="pm-label">MAX DISCOUNT AMOUNT</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            className="pm-input"
                                            type="number"
                                            value={formData.maxDiscountAmount}
                                            onChange={e => handleChange('maxDiscountAmount', parseFloat(e.target.value))}
                                        />
                                        <span style={{ position: 'absolute', right: '20px', top: '16px', fontWeight: 'bold', color: '#9ca3af' }}>đ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TIMELINE & SCOPE - Unlocked in Edit? User didn't specify locking this, assume unlocked */}
                    {/* User screenshot shows Scope before Timeline. Let's move Scope up or down. 
                       Screenshot 1: Identity -> Value
                       Screenshot 2: Value
                       Screenshot 3: Scope
                       Screenshot 4: Scope -> Timeline
                       Order: Identity -> Value -> Scope -> Timeline
                    */}

                    {/* APPLICATION SCOPE */}
                    <div>
                        <div className="pm-section-label">
                            <div className="pm-section-indicator" />
                            <span>APPLICATION SCOPE</span>
                        </div>
                        <div className="pm-scope-selector">
                            <div
                                className={`pm-scope-card ${scope === 'GLOBAL' ? 'active' : ''}`}
                                onClick={() => setScope('GLOBAL')}
                            >
                                <div className="pm-scope-icon-box"><Globe size={24} /></div>
                                <div className="pm-scope-info">
                                    <h4>GLOBAL SCOPE</h4>
                                    <p>Áp dụng cho mọi cửa hàng trên hệ thống</p>
                                </div>
                                <CheckCircle className="pm-check-indicator" size={20} />
                            </div>
                            <div
                                className={`pm-scope-card ${scope === 'SELECT' ? 'active' : ''}`}
                                onClick={() => setScope('SELECT')}
                            >
                                <div className="pm-scope-icon-box"><Store size={24} /></div>
                                <div className="pm-scope-info">
                                    <h4>SELECT RESTAURANTS</h4>
                                    <p>Chỉ áp dụng cho các cửa hàng được chọn</p>
                                </div>
                                <CheckCircle className="pm-check-indicator" size={20} />
                            </div>
                        </div>

                        {scope === 'SELECT' && (
                            <>
                                <input
                                    className="pm-res-search-input"
                                    placeholder="Search restaurants by name..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#9ca3af', textTransform: 'uppercase' }}>
                                        {selectedRestaurants.size} SELECTED
                                    </div>
                                    <button
                                        style={{ background: 'none', border: 'none', fontSize: '11px', fontWeight: '800', color: '#9ca3af', textTransform: 'uppercase', cursor: 'pointer' }}
                                        onClick={() => setSelectedRestaurants(new Set())}
                                    >
                                        CLEAR SELECTION
                                    </button>
                                </div>
                                <div className="pm-restaurant-list">
                                    {filteredRestaurants.map(res => (
                                        <div
                                            key={res.id}
                                            className={`pm-res-item ${selectedRestaurants.has(res.id) ? 'selected' : ''}`}
                                            onClick={() => toggleRestaurant(res.id)}
                                        >
                                            <div className="pm-checkbox">
                                                {/* No inner check icon needed for circle style, or maybe strictly follow design? */}
                                                {/* User image shows just a big circle, empty or maybe filled/checked? */}
                                                {/* I'll keep it simple: empty circle when not selected, green circle when selected? */}
                                                {/* In CSS I styled .selected .pm-checkbox to be green. */}
                                            </div>
                                            <div className="pm-res-info">
                                                <h5>{res.name}</h5>
                                                <span>PARTNER RESTAURANT</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* TIMELINE & LIMITS */}
                    <div>
                        <div className="pm-section-label">
                            <div className="pm-section-indicator" />
                            <span>TIMELINE & LIMITS</span>
                        </div>
                        <div className="pm-form-group">
                            <div className="pm-row" style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <label className="pm-label">START DATE</label>
                                    <input
                                        className="pm-input"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={e => handleChange('startDate', e.target.value)}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="pm-label">END DATE</label>
                                    <input
                                        className="pm-input"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={e => handleChange('endDate', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pm-form-group">
                            <div className="pm-row" style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <label className="pm-label">TOTAL QUANTITY</label>
                                    <input
                                        className="pm-input"
                                        type="number"
                                        value={formData.totalQuantity}
                                        onChange={e => handleChange('totalQuantity', parseInt(e.target.value))}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="pm-label">USAGE LIMIT PER USER</label>
                                    <input
                                        className="pm-input"
                                        type="number"
                                        value={formData.usageLimitPerUser}
                                        onChange={e => handleChange('usageLimitPerUser', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL - PREVIEW */}
                <div className="pm-right-panel">
                    <div className="pm-ticket">
                        <div className="pm-ticket-icon">
                            <Ticket size={32} />
                        </div>
                        <h3 className="pm-ticket-code">{formData.code || "CODE"}</h3>
                        <div className="pm-ticket-value">
                            {formData.discountType === 'SHIPPING' ? 'FREE SHIP' :
                                formData.discountType === 'FIXED' ? `GIẢM ${formData.discountValue?.toLocaleString()}đ` :
                                    `GIẢM ${formData.discountValue}%`}
                        </div>
                        <div className={`pm-ticket-desc ${formData.description ? 'filled' : ''}`}>
                            {formData.description || "Chưa có mô tả cho chiến dịch này..."}
                        </div>
                        <div className="pm-ticket-divider"></div>
                        <div className="pm-ticket-stats">
                            <div className="pm-stat-item">
                                <span className="pm-stat-label">QUANTITY</span>
                                <div className="pm-stat-value">{formData.totalQuantity}</div>
                            </div>
                            <div className="pm-stat-item">
                                <span className="pm-stat-label">USAGE LIMIT / USER</span>
                                <div className="pm-stat-value">{formData.usageLimitPerUser}</div>
                            </div>
                        </div>
                        <div className="pm-progress-wrapper">
                            <div className="pm-progress-label">
                                <span>THỜI HẠN CHIẾN DỊCH</span>
                                <span>{formData.endDate ? "CÓ THỜI HẠN" : "KHÔNG GIỚI HẠN"}</span>
                            </div>
                            <div className="pm-progress-bar">
                                <div className="pm-progress-fill"></div>
                            </div>
                        </div>
                    </div>

                    <button className="pm-submit-btn" onClick={handleSubmit} disabled={loading}>
                        {loading ? "SAVING..." : (isEditMode ? "SAVE CHANGES" : "LAUNCH CAMPAIGN")}
                        {!loading && <CheckCircle size={24} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromotionModal;
