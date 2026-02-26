import React, { useState, useEffect } from 'react';
import { X, Check, Filter, CheckCircle, Clock, AlertCircle, CheckSquare, ArrowDownLeft, ArrowUpRight, CreditCard, RotateCcw, DollarSign, Wallet } from 'lucide-react';
import './FinanceFilterModal.css';

const FinanceFilterModal = ({ isOpen, onClose, onApply, currentFilters = {} }) => {
    // Default filters
    const [scope, setScope] = useState(currentFilters.scope || []);
    const [classification, setClassification] = useState(currentFilters.classification || []);

    useEffect(() => {
        if (isOpen) {
            setScope(currentFilters.scope || []);
            setClassification(currentFilters.classification || []);
        }
    }, [isOpen, currentFilters]);

    if (!isOpen) return null;

    const handleApply = () => {
        onApply({ scope, classification });
        onClose();
    };

    const toggleScope = (value) => {
        if (scope.includes(value)) {
            setScope(scope.filter(item => item !== value));
        } else {
            setScope([...scope, value]); // Multi-select allowed based on UI checks? Or single? Screenshot shows radio-like circles but multiple sections available. Let's assume multi-select for filtering usually.
            // Actually, screenshot shows "round" checks which often imply single select or specific styling. But for filtering status, multi-select is better. Let's stick to multi for now unless user complains.
            // Wait, screenshot 1 shows 'Success' unchecked but 'All'? No 'All'. 
            // Let's implement toggle.
        }
    };

    const toggleClass = (value) => {
        if (classification.includes(value)) {
            setClassification(classification.filter(item => item !== value));
        } else {
            setClassification([...classification, value]);
        }
    };

    return (
        <div className="filter-modal-overlay">
            <div className="filter-modal-content finance-filter-content">
                {/* Header */}
                <div className="finance-filter-header">
                    <div className="finance-header-left">
                        <div className="finance-header-icon">
                            <Filter size={20} color="white" />
                        </div>
                        <div className="finance-header-text">
                            <h2>LEDGER FILTERING</h2>
                            <span>FINANCE</span>
                        </div>
                    </div>
                    <div className="finance-header-actions">
                        <button className="btn-finance-apply" onClick={handleApply}>
                            <Check size={16} strokeWidth={3} />
                            APPLY FILTERS
                        </button>
                        <button className="btn-finance-close" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="finance-filter-body">
                    {/* Settlement Scope Section */}
                    <div className="filter-section">
                        <div className="section-header">
                            <div className="section-icon-wrapper blue">
                                <CheckCircle size={20} />
                            </div>
                            <div className="section-title-group">
                                <h3>SETTLEMENT SCOPE</h3>
                                <p>FILTER BY TRANSACTION STATE</p>
                            </div>
                        </div>
                        <div className="scope-grid">
                            {[
                                { id: 'SUCCESS', label: 'Success', icon: CheckCircle },
                                { id: 'PENDING', label: 'Pending', icon: Clock },
                                { id: 'FAILED', label: 'Failed', icon: AlertCircle },
                                { id: 'COMPLETED', label: 'Completed', icon: CheckSquare }
                            ].map((item) => (
                                <div
                                    key={item.id}
                                    className={`scope-card ${scope.includes(item.id) ? 'active' : ''}`}
                                    onClick={() => toggleScope(item.id)}
                                >
                                    <div className="scope-icon">
                                        <item.icon size={18} />
                                    </div>
                                    <span className="scope-label">{item.label}</span>
                                    <div className="scope-check">
                                        {scope.includes(item.id) && <div className="scope-dot" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Transaction Class Section */}
                    <div className="filter-section">
                        <div className="section-header">
                            <div className="section-icon-wrapper green">
                                <DollarSign size={20} />
                            </div>
                            <div className="section-title-group">
                                <h3>TRANSACTION CLASS</h3>
                                <p>SELECT LEDGER CATEGORIES</p>
                            </div>
                        </div>
                        <div className="class-grid">
                            {[
                                { id: 'DEPOSIT', label: 'Deposit', sub: 'INBOUND FUNDS', icon: ArrowDownLeft },
                                { id: 'WITHDRAWAL', label: 'Withdrawal', sub: 'OUTBOUND PAYOUTS', icon: ArrowUpRight },
                                { id: 'PAYMENT', label: 'Payment', sub: 'SALE TRANSACTIONS', icon: CreditCard },
                                { id: 'REFUND', label: 'Refund', sub: 'CREDITED REVERSALS', icon: RotateCcw },
                                { id: 'EARNING', label: 'Earning', sub: 'COMMISSION ACCRUALS', icon: CheckCircle },
                                { id: 'TOPUP', label: 'Top Up', sub: 'BALANCE REPLENISHMENT', icon: Wallet }
                            ].map((item) => (
                                <div
                                    key={item.id}
                                    className={`class-card ${classification.includes(item.id) ? 'active' : ''}`}
                                    onClick={() => toggleClass(item.id)}
                                >
                                    <div className="class-check-indicator">
                                        {classification.includes(item.id) && <div className="class-dot" />}
                                    </div>
                                    <div className="class-icon-wrapper">
                                        <item.icon size={20} />
                                    </div>
                                    <div className="class-info">
                                        <span className="class-label">{item.label}</span>
                                        <span className="class-sub">{item.sub}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceFilterModal;
