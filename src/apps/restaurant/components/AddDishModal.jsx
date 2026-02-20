import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, GripVertical, Image as ImageIcon, Save } from 'lucide-react';
import SlideConfirmModal from '../../../components/shared/SlideConfirmModal';
import './AddDishModal.css';

const AddDishModal = ({ isOpen, onClose, categories, onSave, dish }) => {
    // Dish State
    const [dishName, setDishName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(''); // Raw input, convert to number on save
    const [initialStock, setInitialStock] = useState(0);
    const [categoryId, setCategoryId] = useState(categories && categories.length > 0 ? categories[0].id : '');
    const [imagePreview, setImagePreview] = useState(null);

    // Options State
    // Structure: [{ id: 1, name: '', min: 0, max: 1, options: [{ id: 1, name: '', price: 0 }] }]
    const [optionGroups, setOptionGroups] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (dish) {
                // Populate state from existing dish
                setDishName(dish.name || '');
                setDescription(dish.description || '');
                setPrice(dish.price || '');
                setInitialStock(dish.availabilityQuantity || 0);
                setCategoryId(dish.category?.id || (categories && categories.length > 0 ? categories[0].id : ''));
                setImagePreview(dish.imageUrl || null);

                // Map existing options to local state structure
                if (dish.menuOptionGroups) {
                    setOptionGroups(dish.menuOptionGroups.map(group => ({
                        id: group.id || Date.now(),
                        name: group.name,
                        min: group.minChoices,
                        max: group.maxChoices,
                        options: (group.menuOptions || []).map(opt => ({
                            id: opt.id || Date.now(),
                            name: opt.name,
                            price: opt.priceAdjustment
                        }))
                    })));
                } else {
                    setOptionGroups([]);
                }

            } else {
                // Reset state for new dish
                setDishName('');
                setDescription('');
                setPrice('');
                setInitialStock(0);
                setImagePreview(null);
                setOptionGroups([]);
                if (categories && categories.length > 0) {
                    setCategoryId(categories[0].id);
                }
            }
        }
    }, [isOpen, categories, dish]);

    if (!isOpen) return null;

    // handlers
    const addOptionGroup = () => {
        setOptionGroups([...optionGroups, {
            id: Date.now(),
            name: '',
            min: 0,
            max: 1,
            options: [{ id: Date.now() + 1, name: '', price: 0 }]
        }]);
    };

    const removeOptionGroup = (groupId) => {
        setOptionGroups(optionGroups.filter(g => g.id !== groupId));
    };

    const updateGroupField = (groupId, field, value) => {
        setOptionGroups(optionGroups.map(g =>
            g.id === groupId ? { ...g, [field]: value } : g
        ));
    };

    const addOptionToGroup = (groupId) => {
        setOptionGroups(optionGroups.map(g => {
            if (g.id === groupId) {
                return {
                    ...g,
                    options: [...g.options, { id: Date.now(), name: '', price: 0 }]
                };
            }
            return g;
        }));
    };

    const removeOptionFromGroup = (groupId, optionId) => {
        setOptionGroups(optionGroups.map(g => {
            if (g.id === groupId) {
                return {
                    ...g,
                    options: g.options.filter(o => o.id !== optionId)
                };
            }
            return g;
        }));
    };

    const updateOptionField = (groupId, optionId, field, value) => {
        setOptionGroups(optionGroups.map(g => {
            if (g.id === groupId) {
                const newOptions = g.options.map(o =>
                    o.id === optionId ? { ...o, [field]: value } : o
                );
                return { ...g, options: newOptions };
            }
            return g;
        }));
    };

    const handleSaveClick = () => {
        // Basic validation could go here
        setShowConfirm(true);
    };

    const processSave = async () => {
        setIsSaving(true);
        // Simulate API delay if onSave isn't async, or just UX delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Validation and Save logic here...
        console.log({ dishName, description, price, optionGroups });
        if (onSave) {
            onSave();
        }
        setIsSaving(false);
        setShowConfirm(false);
        onClose();
    };

    return (
        <div className="adm-overlay">
            <div className="adm-modal">
                {/* Header currently empty/minimal or part of the split layout? 
                   Screenshot shows layout split from top to bottom roughly. 
                   Actually image 1 shows "DANH MỤC MÓN" on left sidebar.
                   Image 2 shows right side "TUỲ CHỌN MÓN".
                   So it's a full Split View Modal.
                */}

                {/* LEFT PANE - Dish Info */}
                <div className="adm-left-pane">
                    <div className="adm-form-group">
                        <label className="adm-label">DANH MỤC MÓN</label>
                        <div className="adm-select-wrapper">
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="adm-select"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="adm-form-group">
                        <label className="adm-label">TÊN MÓN</label>
                        <input
                            type="text"
                            className="adm-input-lg"
                            placeholder="NHẬP TÊN MÓN..."
                            value={dishName}
                            onChange={(e) => setDishName(e.target.value)}
                        />
                    </div>

                    <div className="adm-form-group">
                        <label className="adm-label">MÔ TẢ</label>
                        <textarea
                            className="adm-textarea"
                            placeholder="Mô tả món ăn..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="adm-form-group">
                        <label className="adm-label">GIÁ GỐC (VNĐ)</label>
                        <input
                            type="number"
                            className="adm-input"
                            placeholder="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <div className="adm-form-group">
                        <div className="adm-stock-card">
                            <div className="adm-stock-header">
                                <label className="adm-label">SỐ LƯỢNG BAN ĐẦU</label>
                                <span className="adm-stock-val-lg">{initialStock}</span>
                            </div>
                            <div className="adm-stock-actions">
                                <div className="adm-stock-btn-group">
                                    <button className="adm-stock-btn-lg" onClick={() => setInitialStock(s => Math.max(0, s - 10))}>-10</button>
                                    <button className="adm-stock-btn-lg" onClick={() => setInitialStock(s => Math.max(0, s - 1))}>-1</button>
                                </div>
                                <div className="adm-stock-btn-group">
                                    <button className="adm-stock-btn-lg" onClick={() => setInitialStock(s => s + 1)}>+1</button>
                                    <button className="adm-stock-btn-lg" onClick={() => setInitialStock(s => s + 10)}>+10</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="adm-form-group">
                        <label className="adm-label">HÌNH ẢNH MÓN ĂN</label>
                        <div className="adm-image-upload-wrapper">
                            {imagePreview ? (
                                <div className="adm-image-preview">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                    <button
                                        className="adm-remove-image-btn"
                                        onClick={() => setImagePreview(null)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="adm-image-placeholder">
                                    <ImageIcon size={48} className="text-gray-300 mb-2" />
                                    <span className="text-gray-400 text-sm">Tải ảnh lên</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <button className="adm-btn-create" onClick={handleSaveClick}>
                        <Save size={20} />
                        <span>{dish ? 'LƯU THAY ĐỔI' : 'TẠO MÓN'}</span>
                    </button>

                    <SlideConfirmModal
                        isOpen={showConfirm}
                        onClose={() => setShowConfirm(false)}
                        onConfirm={processSave}
                        title={dish ? 'Cập nhật món ăn' : 'Tạo món ăn mới'}
                        description={`Bạn có chắc chắn muốn ${dish ? 'cập nhật thông tin' : 'tạo mới'} món ăn này không?`}
                        isLoading={isSaving}
                        type="info"
                    />
                </div>

                {/* RIGHT PANE - Options */}
                <div className="adm-right-pane">
                    <div className="adm-rp-header">
                        <div className="flex-1">
                            <h2 className="adm-rp-title">TUỲ CHỌN MÓN</h2>
                            <p className="adm-rp-subtitle">Quản lý các nhóm tùy chọn (Size, Topping...)</p>
                        </div>
                        <div className="adm-rp-actions">
                            <button className="adm-btn-add-group" onClick={addOptionGroup}>
                                <Plus size={16} /> THÊM NHÓM
                            </button>
                            <button className="adm-btn-close" onClick={onClose}>
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="adm-rp-content">
                        {optionGroups.length === 0 ? (
                            <div className="adm-empty-state">
                                <p>Chưa có nhóm tùy chọn nào</p>
                                <p className="adm-empty-sub">Bấm "Thêm nhóm" để bắt đầu</p>
                            </div>
                        ) : (
                            <div className="adm-groups-list">
                                {optionGroups.map((group, idx) => (
                                    <div key={group.id} className="adm-group-card">
                                        <div className="adm-group-header">
                                            <div className="adm-drag-handle"><GripVertical size={16} /></div>
                                            <input
                                                type="text"
                                                className="adm-group-name-input"
                                                placeholder="Nhóm tùy chọn mới"
                                                value={group.name}
                                                onChange={(e) => updateGroupField(group.id, 'name', e.target.value)}
                                                autoFocus={idx === optionGroups.length - 1}
                                            />
                                            <button className="adm-btn-del-group" onClick={() => removeOptionGroup(group.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        {/* User explicitly asked to remove "Đặt làm phân loại" (Set as category) text. 
                                            So we only show Min/Max inputs here. */}
                                        <div className="adm-group-controls">
                                            {/* Removed "Đặt làm phân loại" button/text */}
                                            <div className="flex-1"></div>
                                            <div className="adm-limit-ctrl">
                                                <span>TỐI THIỂU</span>
                                                <input
                                                    type="number"
                                                    className="adm-input-sm"
                                                    value={group.min}
                                                    onChange={(e) => updateGroupField(group.id, 'min', parseInt(e.target.value) || 0)}
                                                />
                                            </div>
                                            <div className="adm-limit-ctrl">
                                                <span>TỐI ĐA</span>
                                                <input
                                                    type="number"
                                                    className="adm-input-sm"
                                                    value={group.max}
                                                    onChange={(e) => updateGroupField(group.id, 'max', parseInt(e.target.value) || 1)}
                                                />
                                            </div>
                                        </div>

                                        <div className="adm-options-list">
                                            {group.options.map(opt => (
                                                <div key={opt.id} className="adm-option-row">
                                                    <div className="adm-drag-handle-sm"><GripVertical size={14} /></div>
                                                    <input
                                                        type="text"
                                                        className="adm-opt-name-input"
                                                        placeholder="Tùy chọn mới"
                                                        value={opt.name}
                                                        onChange={(e) => updateOptionField(group.id, opt.id, 'name', e.target.value)}
                                                    />
                                                    <div className="adm-opt-price-wrapper">
                                                        <input
                                                            type="number"
                                                            className="adm-opt-price-input"
                                                            placeholder="0"
                                                            value={opt.price}
                                                            onChange={(e) => updateOptionField(group.id, opt.id, 'price', e.target.value)}
                                                        />
                                                        <span className="adm-currency">₫</span>
                                                    </div>
                                                    <button className="adm-btn-del-opt" onClick={() => removeOptionFromGroup(group.id, opt.id)}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button className="adm-btn-add-opt" onClick={() => addOptionToGroup(group.id)}>
                                                <Plus size={14} /> Thêm lựa chọn
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddDishModal;
