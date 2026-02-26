import React, { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, Lock, Unlock, List } from 'lucide-react';
import './CustomerFilterModal.css';

const CustomerFilterModal = ({ isOpen, onClose, onApply, currentFilter = 'ALL' }) => {
    const [selectedFilter, setSelectedFilter] = useState(currentFilter);

    useEffect(() => {
        if (isOpen) {
            setSelectedFilter(currentFilter);
        }
    }, [isOpen, currentFilter]);

    if (!isOpen) return null;

    const handleApply = () => {
        onApply(selectedFilter);
        onClose();
    };

    const filterOptions = [
        { id: 'ALL', label: 'All Customers', icon: List },
        { id: 'UNLOCKED', label: 'Unlocked Only', icon: Unlock },
        { id: 'LOCKED', label: 'Locked Only', icon: Lock },
    ];

    return (
        <div className="filter-modal-overlay">
            <div className="filter-modal-content customer-filter-wrapper">
                {/* Full Width Header */}
                <div className="customer-filter-header">
                    <div className="filter-title-group">
                        <div className="filter-icon-wrapper">
                            <List size={24} color="white" />
                        </div>
                        <h2 className="customer-filter-title">CUSTOMER FILTERS</h2>
                    </div>
                    <div className="header-actions">
                        <button className="btn-apply-filters" onClick={handleApply}>
                            <Check size={16} strokeWidth={3} />
                            APPLY FILTERS
                        </button>
                        <div className="header-divider"></div>
                        <button className="btn-close-modal" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="customer-filter-body-wrapper">
                    {/* Left Column: Filter Options */}
                    <div className="customer-filter-left">
                        <div className="filter-group-header">
                            <div className="group-icon-wrapper">
                                <ShieldCheck size={20} className="text-green-600" />
                            </div>
                            <div>
                                <h3>ACCOUNT STATUS</h3>
                                <p>SELECT USER ACTIVITY STATE</p>
                            </div>
                        </div>

                        <div className="filter-options-list">
                            {filterOptions.map((option) => (
                                <div
                                    key={option.id}
                                    className={`filter-option-card ${selectedFilter === option.id ? 'active' : ''}`}
                                    onClick={() => setSelectedFilter(option.id)}
                                >
                                    <div className="filter-option-icon">
                                        <option.icon size={18} />
                                    </div>
                                    <div className="filter-option-text">{option.label}</div>
                                    <div className="filter-check-indicator">
                                        {selectedFilter === option.id && <Check size={14} color="white" strokeWidth={3} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Insights Card */}
                    <div className="customer-filter-right">
                        <div className="insights-card">
                            <div className="sidebar-icon-wrapper">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <h3 className="sidebar-title">CUSTOMER INSIGHTS</h3>
                            <p className="sidebar-desc">
                                Use these filters to segment your customer base. You can view only active shoppers or identify locked accounts that might need attention.
                            </p>
                            <div className="sidebar-footer">
                                <div className="circles-decoration">
                                    <div className="circle c1"></div>
                                    <div className="circle c2"></div>
                                    <div className="circle c3"></div>
                                </div>
                                <span>ADVANCED SEGMENTATION</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerFilterModal;
