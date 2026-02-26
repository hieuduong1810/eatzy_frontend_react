import React, { useState, useEffect } from 'react';
import { X, Check, Filter, Activity, CheckCircle, Clock, PauseCircle, Tag, Percent, DollarSign, Truck, List } from 'lucide-react';
import './PromotionFilterModal.css';

const PromotionFilterModal = ({ isOpen, onClose, onApply, currentFilters = {} }) => {
    const [executionState, setExecutionState] = useState(currentFilters.executionState || 'ALL');
    const [promoLogic, setPromoLogic] = useState(currentFilters.promoLogic || 'ALL');
    const [minThreshold, setMinThreshold] = useState(currentFilters.minThreshold || '');

    useEffect(() => {
        if (isOpen) {
            setExecutionState(currentFilters.executionState || 'ALL');
            setPromoLogic(currentFilters.promoLogic || 'ALL');
            setMinThreshold(currentFilters.minThreshold || '');
        }
    }, [isOpen, currentFilters]);

    if (!isOpen) return null;

    const handleApply = () => {
        onApply({ executionState, promoLogic, minThreshold });
        onClose();
    };

    return (
        <div className="filter-modal-overlay">
            <div className="filter-modal-content promotion-filter-content">
                {/* Header */}
                <div className="promotion-filter-header">
                    <div className="promotion-header-left">
                        <div className="promotion-header-icon">
                            <Filter size={20} color="white" />
                        </div>
                        <div className="promotion-header-text">
                            <h2>CAMPAIGN FILTERING</h2>
                            <span>PROMOTIONS</span>
                        </div>
                    </div>
                    <div className="promotion-header-actions">
                        <button className="btn-promotion-apply" onClick={handleApply}>
                            <Check size={16} strokeWidth={3} />
                            APPLY FILTERS
                        </button>
                        <div className="header-divider"></div>
                        <button className="btn-promotion-close" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="promotion-filter-body">
                    <div className="promotion-grid-row">
                        {/* Execution State Column */}
                        <div className="filter-section">
                            <div className="section-header">
                                <div className="section-icon-wrapper blue">
                                    <Activity size={20} />
                                </div>
                                <div className="section-title-group">
                                    <h3>EXECUTION STATE</h3>
                                    <p>LIFECYCLE OF CAMPAIGN</p>
                                </div>
                            </div>
                            <div className="promo-options-list">
                                {[
                                    { id: 'ALL', label: 'All Campaigns', icon: List },
                                    { id: 'RUNNING', label: 'Currently Running', icon: CheckCircle },
                                    { id: 'PAUSED', label: 'Paused / Draft', icon: PauseCircle }
                                ].map((item) => (
                                    <div
                                        key={item.id}
                                        className={`promo-option-card ${executionState === item.id ? 'active' : ''}`}
                                        onClick={() => setExecutionState(item.id)}
                                    >
                                        <div className="promo-option-icon">
                                            <item.icon size={18} />
                                        </div>
                                        <div className="promo-option-text">{item.label}</div>
                                        <div className="promo-check-indicator">
                                            {executionState === item.id && <Check size={14} color="white" strokeWidth={3} />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Promotion Logic Column */}
                        <div className="filter-section">
                            <div className="section-header">
                                <div className="section-icon-wrapper lime">
                                    <Tag size={20} />
                                </div>
                                <div className="section-title-group">
                                    <h3>PROMOTION LOGIC</h3>
                                    <p>DISCOUNT STRUCTURAL CLASS</p>
                                </div>
                            </div>
                            <div className="promo-options-list">
                                {[
                                    { id: 'ALL', label: 'All Types', icon: List },
                                    { id: 'PERCENTAGE', label: 'Percentage Off', icon: Percent },
                                    { id: 'FIXED', label: 'Fixed Amount', icon: DollarSign },
                                    { id: 'SHIPPING', label: 'Free Delivery', icon: Truck }
                                ].map((item) => (
                                    <div
                                        key={item.id}
                                        className={`promo-option-card ${promoLogic === item.id ? 'active' : ''}`}
                                        onClick={() => setPromoLogic(item.id)}
                                    >
                                        <div className="promo-option-icon">
                                            <item.icon size={18} />
                                        </div>
                                        <div className="promo-option-text">{item.label}</div>
                                        <div className="promo-check-indicator">
                                            {promoLogic === item.id && <Check size={14} color="white" strokeWidth={3} />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Minimum Threshold Section */}
                    <div className="filter-section full-width">
                        <div className="section-header">
                            <div className="section-icon-wrapper orange">
                                <DollarSign size={20} />
                            </div>
                            <div className="section-title-group">
                                <h3>MINIMUM THRESHOLD</h3>
                                <p>BASKET VALUE FILTER</p>
                            </div>
                        </div>
                        <div className="threshold-input-wrapper">
                            <input
                                type="text"
                                placeholder="Enter min order value..."
                                value={minThreshold}
                                onChange={(e) => setMinThreshold(e.target.value)}
                                className="threshold-input"
                            />
                            <div className="threshold-currency">đ</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromotionFilterModal;
