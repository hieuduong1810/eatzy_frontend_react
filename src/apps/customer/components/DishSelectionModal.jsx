import { useState, useEffect } from "react";
import { X, Plus, Minus, Info, AlertCircle, Check, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import "../CustomerAppRedesign.css"; // Reuse existing CSS + new modal styles

export default function DishSelectionModal({ isOpen, onClose, dish, restaurantId }) {
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({}); // { groupId: [optionId1, optionId2] }
    const [totalPrice, setTotalPrice] = useState(0);
    const [isValid, setIsValid] = useState(false);

    // Reset state when dish changes
    useEffect(() => {
        if (isOpen && dish) {
            setQuantity(1);
            setSelectedOptions({});
            setTotalPrice(dish.price);
        }
    }, [isOpen, dish]);

    // Calculate Total Price & Validation
    useEffect(() => {
        if (!dish) return;

        let optionsPrice = 0;
        let valid = true;

        // 1. Calculate Options Price
        Object.keys(selectedOptions).forEach(groupId => {
            const group = dish.menuOptionGroups.find(g => String(g.id) === groupId);
            if (group && group.menuOptions) {
                selectedOptions[groupId].forEach(optId => {
                    const opt = group.menuOptions.find(o => o.id === optId);
                    if (opt) optionsPrice += opt.priceAdjustment;
                });
            }
        });

        // 2. Refresh Total
        setTotalPrice((dish.price + optionsPrice) * quantity);

        // 3. Validate Required Groups
        if (dish.menuOptionGroups) {
            dish.menuOptionGroups.forEach(group => {
                const selectedCount = selectedOptions[group.id]?.length || 0;
                if (group.minChoices > 0 && selectedCount < group.minChoices) {
                    valid = false;
                }
            });
        }
        setIsValid(valid);

    }, [selectedOptions, quantity, dish]);

    if (!isOpen || !dish) return null;

    const handleOptionToggle = (group, option) => {
        setSelectedOptions(prev => {
            const currentSelected = prev[group.id] || [];
            const isSelected = currentSelected.includes(option.id);
            let newSelected = [];

            // Case 1: Radio (Max 1)
            if (group.maxChoices === 1) {
                // If clicking same, allow deselect only if not required (min=0)
                if (isSelected && group.minChoices === 0) {
                    newSelected = [];
                } else {
                    newSelected = [option.id];
                }
            }
            // Case 2: Checkbox (Max > 1)
            else {
                if (isSelected) {
                    newSelected = currentSelected.filter(id => id !== option.id);
                } else {
                    if (currentSelected.length < group.maxChoices) {
                        newSelected = [...currentSelected, option.id];
                    } else {
                        return prev; // Max reached
                    }
                }
            }

            return { ...prev, [group.id]: newSelected };
        });
    };

    const handleAddToCart = () => {
        if (!isValid) return;

        // Construct selected options object for cart
        // Standardize format: { optionName: [itemName, ...], ... } or similar depending on cart logic
        // For simple cart, we might just pass the list of selected option objects
        const finalOptions = [];
        Object.keys(selectedOptions).forEach(groupId => {
            const group = dish.menuOptionGroups.find(g => String(g.id) === groupId);
            if (group && group.menuOptions) {
                selectedOptions[groupId].forEach(optId => {
                    const opt = group.menuOptions.find(o => o.id === optId);
                    if (opt) finalOptions.push({ ...opt, groupName: group.name });
                });
            }
        });

        console.log("Adding to cart:", { restaurantId, dish, selectedOptions, finalOptions });
        addItem(restaurantId, { ...dish, selectedOptions: finalOptions }, quantity);
        onClose();
    };

    const handleScrollToGroup = (e, groupId) => {
        e.preventDefault();
        const element = document.getElementById(`group-${groupId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="cust-modal-overlay" onClick={onClose}>
            <div className="cust-dish-modal" onClick={e => e.stopPropagation()}>

                {/* Close Button mobile usually, but here desktop modal */}
                <button className="cust-modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="cust-dish-modal-content">
                    {/* Left: Image & Info */}
                    <div className="cust-modal-left">
                        {/* Quantity Control (Moved Above Image) */}
                        <div className="cust-modal-qty-panel-top">
                            <div className="cust-qty-ctrl-users">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={20} /></button>
                                <div className="cust-qty-info">
                                    <span className="cust-qty-label">Quantity</span>
                                    <div className="cust-qty-val-row">
                                        <User size={20} fill="currentColor" />
                                        <span className="cust-qty-val-num">{quantity}</span>
                                    </div>
                                    <span className="cust-qty-unit">{quantity > 1 ? 'persons' : 'person'}</span>
                                </div>
                                <button onClick={() => setQuantity(quantity + 1)}><Plus size={20} /></button>
                            </div>
                        </div>

                        <div className="cust-modal-img-wrapper">
                            <img src={dish.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} alt={dish.name} />
                        </div>
                        <div className="cust-modal-info">
                            <h2 className="cust-modal-title">{dish.name}</h2>
                            <p className="cust-modal-desc">{dish.description}</p>
                            <div className="cust-modal-price-orig">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dish.price)}
                            </div>
                        </div>
                    </div>

                    {/* Right: Options */}
                    <div className="cust-modal-right">

                        {/* Option Groups */}
                        <div className="cust-options-scroll">
                            {/* Header for options? */}
                            <div className="cust-options-header-row">
                                {dish.menuOptionGroups && dish.menuOptionGroups.map(group => (
                                    <button
                                        key={group.id}
                                        onClick={(e) => handleScrollToGroup(e, group.id)}
                                        className="cust-opt-anchor"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        {group.name}
                                        {group.minChoices > 0 && <span className="cust-dot-required">•</span>}
                                    </button>
                                ))}
                            </div>

                            {dish.menuOptionGroups && dish.menuOptionGroups.map(group => {
                                const isRequired = group.minChoices > 0;
                                const currentSelected = selectedOptions[group.id] || [];
                                const isSatisfied = currentSelected.length >= group.minChoices;

                                return (
                                    <div key={group.id} id={`group-${group.id}`} className="cust-opt-group">
                                        <div className="cust-opt-group-header">
                                            <div className="cust-opt-group-info">
                                                <h4 className="cust-opt-group-title">{group.name}</h4>
                                                <span className="cust-opt-group-subtitle">
                                                    {group.minChoices > 0 ? `MIN ${group.minChoices}` : 'OPTIONAL'} • MAX {group.maxChoices}
                                                </span>
                                            </div>
                                            <div className={`cust-opt-badge ${isRequired && !isSatisfied ? 'cust-opt-badge--required' : 'cust-opt-badge--optional'}`}>
                                                {isRequired && !isSatisfied ? 'SELECTION REQUIRED' : (isRequired ? 'COMPLETED' : 'OPTIONAL')}
                                            </div>
                                        </div>

                                        <div className="cust-opt-list">
                                            {(group.menuOptions || []).map(option => {
                                                const isSelected = currentSelected.includes(option.id);
                                                return (
                                                    <div
                                                        key={option.id}
                                                        className={`cust-opt-item ${isSelected ? 'cust-opt-item--selected' : ''}`}
                                                        onClick={() => handleOptionToggle(group, option)}
                                                    >
                                                        <div className="cust-opt-item-left">
                                                            <div className={`cust-opt-checkbox ${group.maxChoices === 1 ? 'cust-opt-radio' : ''} ${isSelected ? 'checked' : ''}`}>
                                                                {isSelected && <Check size={14} strokeWidth={4} />}
                                                            </div>
                                                            <span className="cust-opt-name">{option.name}</span>
                                                        </div>
                                                        <span className="cust-opt-price">
                                                            {option.priceAdjustment > 0 ? `+${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(option.priceAdjustment)}` : 'Miễn phí'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer (Total & Add) */}
                        <div className="cust-modal-footer">
                            <button
                                className={`cust-modal-add-btn ${!isValid ? 'disabled' : ''}`}
                                onClick={handleAddToCart}
                                disabled={!isValid}
                            >
                                <Plus size={20} className="cust-add-icon-bg" />
                                <span className="cust-add-text">Thêm vào giỏ hàng</span>
                                <div className="cust-add-total">
                                    <span className="cust-add-total-label">TOTAL</span>
                                    <span className="cust-add-total-price">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
