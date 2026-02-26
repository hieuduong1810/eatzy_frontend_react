import React, { useState } from 'react';
import { X, CheckCircle, Store, Lock, Clock, Play, Pause } from 'lucide-react';
import './RestaurantFilterModal.css';

const RestaurantFilterModal = ({ isOpen, onClose, onApply, currentFilter }) => {
    const [selectedFilter, setSelectedFilter] = useState(currentFilter || 'ALL');

    if (!isOpen) return null;

    const filters = [
        {
            id: 'ALL',
            label: 'All Restaurants',
            desc: 'Complete network overview',
            icon: <div className="filter-icon-box lime"><Store size={20} /></div>,
            activeClass: 'active-lime'
        },
        {
            id: 'OPEN',
            label: 'Open Stores',
            desc: 'Actively accepting orders',
            icon: <div className="filter-icon-box gray"><Play size={20} /></div>,
            activeClass: 'active-blue'
        },
        {
            id: 'CLOSED',
            label: 'Closed Stores',
            desc: 'Currently non-operational',
            icon: <div className="filter-icon-box gray"><Pause size={20} /></div>,
            activeClass: 'active-orange'
        },
        {
            id: 'LOCKED',
            label: 'Locked / Disabled',
            desc: 'Account access restricted',
            icon: <div className="filter-icon-box gray"><Lock size={20} /></div>,
            activeClass: 'active-red'
        },
        {
            id: 'PENDING',
            label: 'Pending Approval',
            desc: 'Awaiting platform vetting',
            icon: <div className="filter-icon-box gray"><Clock size={20} /></div>,
            activeClass: 'active-purple'
        }
    ];

    const handleApply = () => {
        onApply(selectedFilter);
        onClose();
    };

    return (
        <div className="filter-modal-overlay">
            <div className="filter-modal-content">
                <div className="filter-modal-header">
                    <div className="filter-modal-title-group">
                        <div className="filter-title-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="filter-modal-title">MERCHANT FILTERING</h2>
                            <p className="filter-modal-subtitle">REFINE RESTAURANT NETWORK</p>
                        </div>
                    </div>
                    <div className="filter-modal-actions">
                        <button className="btn-apply-filters" onClick={handleApply}>
                            <CheckCircle size={16} />
                            APPLY FILTERS
                        </button>
                        <button className="btn-close-modal" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="filter-modal-body">
                    <div className="filter-section-header">
                        <div className="filter-section-icon">
                            <Store size={16} />
                        </div>
                        <div className="filter-section-info">
                            <h3>STORE OPERATIONS</h3>
                            <p>SELECT MERCHANT STATES</p>
                        </div>
                    </div>

                    <div className="filter-grid">
                        {filters.map(filter => (
                            <div
                                key={filter.id}
                                className={`filter-card ${selectedFilter === filter.id ? filter.activeClass : ''}`}
                                onClick={() => setSelectedFilter(filter.id)}
                            >
                                <div className="filter-card-content">
                                    <div className="filter-card-icon">
                                        {filter.icon}
                                    </div>
                                    <div className="filter-card-text">
                                        <h4>{filter.label}</h4>
                                        <p>{filter.desc}</p>
                                    </div>
                                </div>
                                {selectedFilter === filter.id && (
                                    <div className="filter-check-badge">
                                        <CheckCircle size={14} fill="currentColor" stroke="white" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantFilterModal;
