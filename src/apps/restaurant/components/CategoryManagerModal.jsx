import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, GripVertical, Save } from 'lucide-react';
import SlideConfirmModal from '../../../components/shared/SlideConfirmModal';
import './CategoryManagerModal.css';

const CategoryManagerModal = ({ isOpen, onClose, categories, onSave }) => {
    const [localCategories, setLocalCategories] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Initialize with deep copy to avoid mutating props directly
            setLocalCategories(categories.map(cat => ({
                id: cat.id,
                name: cat.name,
                isNew: false
            })));
        }
    }, [isOpen, categories]);

    const handleAddCategory = () => {
        setLocalCategories([...localCategories, {
            id: `new-${Date.now()}`,
            name: '',
            isNew: true
        }]);
    };

    const handleRemoveCategory = (id) => {
        setLocalCategories(localCategories.map(c => {
            if (c.id === id) {
                // If it's a new category (not saved yet), remove it completely
                if (c.isNew) return null;
                // Otherwise mark as deleted
                return { ...c, isDeleted: true };
            }
            return c;
        }).filter(Boolean));
    };

    const handleRestoreCategory = (id) => {
        setLocalCategories(localCategories.map(c =>
            c.id === id ? { ...c, isDeleted: false } : c
        ));
    };

    const handleNameChange = (id, newName) => {
        setLocalCategories(localCategories.map(c =>
            c.id === id ? { ...c, name: newName } : c
        ));
    };

    const handleSaveClick = () => {
        // Validation
        const validCategories = localCategories.filter(c => c.name.trim() !== '');
        setShowConfirm(true);
    };

    const processSave = async () => {
        setIsSaving(true);
        // UX delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Filter out deleted existing categories or process them as needed by backend
        // For now, let's assume we pass the modified list. 
        // If the backend expects only active categories, we should filter.
        // But usually "Save Changes" implies syncing the state.
        // Let's filter out 'isDeleted' ones for the final list if the backend just replaces the list.
        // Or if handling individual ops, we might need to send them.
        // Based on user request "xóa thì nó sẽ hiện giống vậy" implies visual feedback before saving.
        // Assuming onSave expects the FINAL list of active categories:
        const finalCategories = localCategories
            .filter(c => !c.isDeleted && c.name.trim() !== '')
            .map(({ isNew, isDeleted, ...rest }) => rest); // Clean up temp flags

        onSave(finalCategories);
        setIsSaving(false);
        setShowConfirm(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="cm-overlay">
            <div className="cm-modal">
                <div className="cm-header">
                    <h2 className="cm-title">CATEGORIES MANAGER</h2>
                    <button className="cm-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="cm-content">
                    <div className="cm-list">
                        {localCategories.map((cat, index) => (
                            <div key={cat.id} className={`cm-item ${cat.isDeleted ? 'deleted' : ''} ${cat.isNew ? 'new' : ''}`}>
                                <div className="cm-drag-handle">
                                    <GripVertical size={16} />
                                </div>
                                <input
                                    type="text"
                                    className="cm-input"
                                    value={cat.name}
                                    placeholder="Danh mục mới"
                                    onChange={(e) => handleNameChange(cat.id, e.target.value)}
                                    autoFocus={cat.isNew}
                                    disabled={cat.isDeleted}
                                />

                                {cat.isNew && !cat.isDeleted && <span className="cm-badge-new">MỚI</span>}
                                {cat.isDeleted && <span className="cm-badge-delete">XÓA</span>}

                                {cat.isDeleted ? (
                                    <button
                                        className="cm-restore-btn"
                                        onClick={() => handleRestoreCategory(cat.id)}
                                        title="Restore"
                                    >
                                        <div className="rotate-icon">↺</div>
                                    </button>
                                ) : (
                                    <button
                                        className="cm-delete-btn"
                                        onClick={() => handleRemoveCategory(cat.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button className="cm-add-btn" onClick={handleAddCategory}>
                        <Plus size={16} /> Thêm danh mục
                    </button>
                </div>

                <div className="cm-footer">
                    <button className="cm-save-btn" onClick={handleSaveClick}>
                        <Save size={18} /> LƯU THAY ĐỔI
                    </button>
                </div>

                <SlideConfirmModal
                    isOpen={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    onConfirm={processSave}
                    title="Cập nhật danh mục"
                    description="Bạn có chắc chắn muốn lưu thay đổi các danh mục này không?"
                    isLoading={isSaving}
                    type="info"
                />
            </div>
        </div>
    );
};

export default CategoryManagerModal;
