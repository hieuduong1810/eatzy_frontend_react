import React, { useState } from 'react';
import { X, CheckCircle, Filter, ShieldCheck, Clock, CheckSquare, Bike, Truck, Lock, Play, Pause, List, FileText, CreditCard, Check } from 'lucide-react';
import './DriverFilterModal.css';

const DriverFilterModal = ({ isOpen, onClose, onApply, currentFilters = {} }) => {
    // State for each filter group
    const [accountStatus, setAccountStatus] = useState('ALL');
    const [operationalStatus, setOperationalStatus] = useState('ALL');
    const [complianceStatus, setComplianceStatus] = useState([]); // Multi-select
    const [fleetType, setFleetType] = useState('ALL');

    // Sync state with props when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setAccountStatus(currentFilters.accountStatus || 'ALL');
            setOperationalStatus(currentFilters.operationalStatus || 'ALL');
            setComplianceStatus(currentFilters.complianceStatus || []);
            setFleetType(currentFilters.fleetType || 'ALL');
        }
    }, [isOpen, currentFilters]);

    if (!isOpen) return null;

    const toggleCompliance = (id) => {
        if (complianceStatus.includes(id)) {
            setComplianceStatus(complianceStatus.filter(c => c !== id));
        } else {
            setComplianceStatus([...complianceStatus, id]);
        }
    };

    const handleApply = () => {
        onApply({
            accountStatus,
            operationalStatus,
            complianceStatus,
            fleetType
        });
        onClose();
    };

    // Helper for rendering option cards
    const OptionCard = ({ id, label, icon: Icon, active, onClick, isMulti = false }) => (
        <div
            className={`filter-option-card ${active ? 'active' : ''} ${id === 'ALL' ? 'all-option' : ''}`}
            onClick={onClick}
        >
            <div className="filter-option-icon">
                {Icon ? <Icon size={18} /> : <div />}
            </div>
            <div className="filter-option-text">{label}</div>
            <div className="filter-check-indicator">
                {active && <Check size={14} color="white" strokeWidth={3} />}
            </div>
        </div>
    );

    return (
        <div className="filter-modal-overlay">
            <div className="filter-modal-content">
                <div className="filter-modal-header">
                    <div className="filter-modal-title-group">
                        <div className="filter-title-icon">
                            <Filter size={24} />
                        </div>
                        <div>
                            <h2 className="filter-modal-title">DRIVER FILTERING</h2>
                            <p className="filter-modal-subtitle">REFINE FLEET OPERATIONS</p>
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
                    <div className="filter-row">
                        {/* Account Trust */}
                        <div className="filter-col">
                            <div className="filter-section-header">
                                <div className="filter-section-icon green">
                                    <ShieldCheck size={18} />
                                </div>
                                <div className="filter-section-info">
                                    <h3>ACCOUNT TRUST</h3>
                                    <p>SECURITY & STATE</p>
                                </div>
                            </div>
                            <OptionCard id="ALL" label="All Accounts" icon={List} active={accountStatus === 'ALL'} onClick={() => setAccountStatus('ALL')} />
                            <OptionCard id="ACTIVE" label="Active (Unlocked)" icon={ShieldCheck} active={accountStatus === 'ACTIVE'} onClick={() => setAccountStatus('ACTIVE')} />
                            <OptionCard id="LOCKED" label="Locked Accounts" icon={Lock} active={accountStatus === 'LOCKED'} onClick={() => setAccountStatus('LOCKED')} />
                        </div>

                        {/* Current Pulse */}
                        <div className="filter-col">
                            <div className="filter-section-header">
                                <div className="filter-section-icon blue">
                                    <Clock size={18} />
                                </div>
                                <div className="filter-section-info">
                                    <h3>CURRENT PULSE</h3>
                                    <p>OPERATIONAL ACTIVITY</p>
                                </div>
                            </div>
                            <OptionCard id="ALL" label="All Status" icon={List} active={operationalStatus === 'ALL'} onClick={() => setOperationalStatus('ALL')} />
                            <OptionCard id="AVAILABLE" label="Ready to Work" icon={Play} active={operationalStatus === 'AVAILABLE'} onClick={() => setOperationalStatus('AVAILABLE')} />
                            <OptionCard id="BUSY" label="Busy (In Delivery)" icon={Truck} active={operationalStatus === 'BUSY'} onClick={() => setOperationalStatus('BUSY')} />
                            <OptionCard id="OFFLINE" label="Offline / Rest" icon={Pause} active={operationalStatus === 'OFFLINE'} onClick={() => setOperationalStatus('OFFLINE')} />
                        </div>

                        {/* Compliance (Multi-select) */}
                        <div className="filter-col">
                            <div className="filter-section-header">
                                <div className="filter-section-icon orange">
                                    <CheckSquare size={18} />
                                </div>
                                <div className="filter-section-info">
                                    <h3>COMPLIANCE</h3>
                                    <p>KYC & DOCUMENT VERIFICATION</p>
                                </div>
                            </div>
                            <OptionCard id="ID_CARD" label="Verified ID Card" icon={FileText} active={complianceStatus.includes('ID_CARD')} onClick={() => toggleCompliance('ID_CARD')} isMulti />
                            <OptionCard id="LICENSE" label="Valid Driving License" icon={Bike} active={complianceStatus.includes('LICENSE')} onClick={() => toggleCompliance('LICENSE')} isMulti />
                            <OptionCard id="BANK" label="Approved Bank Payout" icon={CreditCard} active={complianceStatus.includes('BANK')} onClick={() => toggleCompliance('BANK')} isMulti />
                        </div>
                    </div>

                    <div className="filter-row">
                        {/* Fleet Type */}
                        <div className="filter-col" style={{ maxWidth: '33%' }}>
                            <div className="filter-section-header">
                                <div className="filter-section-icon green">
                                    <Bike size={18} />
                                </div>
                                <div className="filter-section-info">
                                    <h3>FLEET TYPE</h3>
                                    <p>VEHICLE CLASSIFICATION</p>
                                </div>
                            </div>
                            <OptionCard id="GAS_MOTORBIKE" label="Gas Motorcycle" icon={Bike} active={fleetType === 'GAS_MOTORBIKE'} onClick={() => setFleetType('GAS_MOTORBIKE')} />
                            <OptionCard id="ELECTRIC" label="Electric Bike" icon={Truck} active={fleetType === 'ELECTRIC'} onClick={() => setFleetType('ELECTRIC')} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DriverFilterModal;
