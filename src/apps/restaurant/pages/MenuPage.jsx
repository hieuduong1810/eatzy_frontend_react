import { useState, useEffect, useRef } from "react";
import { Plus, Search, Settings, MoreHorizontal, Check, Trash2, Edit3 } from "lucide-react";
import restaurantAppApi from "../../../api/restaurant/restaurantAppApi";
import Modal from "../../../components/shared/Modal";
import SlideConfirmModal from "../../../components/shared/SlideConfirmModal";
import AddDishModal from "../components/AddDishModal";
import CategoryManagerModal from "../components/CategoryManagerModal";
import "./MenuPage.css";

const formatVnd = (n) => Intl.NumberFormat("vi-VN", { style: 'currency', currency: 'VND' }).format(n);

const MenuPage = () => {
    const [menuData, setMenuData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [showAddDishModal, setShowAddDishModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingDish, setEditingDish] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [dishToDelete, setDishToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const isManualScroll = useRef(false);

    const handleAddNewDish = () => {
        setEditingDish(null);
        setShowAddDishModal(true);
    };

    const handleEditDish = (dish) => {
        setEditingDish(dish);
        setShowAddDishModal(true);
    };

    const handleSaveCategories = async (updatedCategories) => {
        try {
            // Sanitize: For new categories, remove the temp ID (or set to null)
            const payload = updatedCategories.map(cat => ({
                ...cat,
                id: cat.isNew ? null : cat.id
            }));
            await restaurantAppApi.updateCategories(payload);
            fetchMenu();
        } catch (error) {
            console.error("Failed to update categories:", error);
            alert("Failed to update categories. Please try again.");
        }
    };

    const handleDeleteClick = (dish) => {
        setDishToDelete(dish);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!dishToDelete) return;
        setIsDeleting(true);
        try {
            await restaurantAppApi.deleteDish(dishToDelete.id);
            fetchMenu();
            setShowDeleteConfirm(false);
            setDishToDelete(null);
        } catch (error) {
            console.error("Failed to delete dish:", error);
            alert("Failed to delete dish. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    // Scroll Spy
    useEffect(() => {
        const handleScroll = () => {
            if (isManualScroll.current) return;
            const container = document.querySelector('.resto-main');
            if (!container) return;

            // Header height approx 180px + padding
            const offset = 260;

            let currentId = null;
            // Iterate to find the last category that has passed the threshold
            categories.forEach(cat => {
                const el = document.getElementById(`category-${cat.id}`);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    // If the top of the element is above or near the offset point
                    if (rect.top < offset) {
                        currentId = cat.id;
                    }
                }
            });

            if (currentId) {
                setActiveCategory(currentId);
            }
        };

        const container = document.querySelector('.resto-main');
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        return () => container?.removeEventListener('scroll', handleScroll);
    }, [categories]);

    const fetchMenu = async () => {
        try {
            const response = await restaurantAppApi.getMenu();
            if (response && response.data) {
                // API structure: response.data is the payload, response.data.data is the restaurant object
                const categoriesData = response.data.data?.dishes || [];
                setMenuData(response.data);
                setCategories(categoriesData);
                if (categoriesData.length > 0) {
                    setActiveCategory(categoriesData[0].id);
                }
            }
        } catch (error) {
            console.error("Failed to fetch menu:", error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToCategory = (catId) => {
        isManualScroll.current = true;
        setActiveCategory(catId);
        const element = document.getElementById(`category-${catId}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            // Re-enable scroll spy after animation finishes
            setTimeout(() => {
                isManualScroll.current = false;
            }, 1000);
        }
    };

    const filteredCategories = categories.map(cat => ({
        ...cat,
        dishes: cat.dishes?.filter(d => d.name.toLowerCase().includes(search.toLowerCase())) || []
    })).filter(cat => cat.dishes.length > 0);

    if (loading) return <SkeletonMenuPage />;

    return (
        <div className="resto-menu-page">
            {/* Header */}
            {/* Header with Title and Actions */}
            {/* Sticky Header Wrapper */}
            <div className="resto-menu-sticky-header">
                {/* Header with Title and Actions */}
                <div className="resto-menu-header-row">
                    <div className="resto-menu-title">
                        <div className="menu-badge">
                            <Settings size={14} /> MENU EDITOR
                        </div>
                        <h1>MENU MANAGEMENT</h1>
                        <p className="resto-menu-subtitle">Quản lý món ăn, phân loại và tùy chọn</p>
                    </div>

                    <div className="resto-menu-actions-wrapper">
                        <div className="resto-menu-search-wrapper">
                            <Search size={18} className="resto-menu-search-icon" />
                            <input
                                type="text"
                                className="resto-menu-search-input"
                                placeholder="Tìm món ăn..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="resto-menu-btn-group">
                            <button className="btn-white" onClick={() => setShowCategoryModal(true)}>
                                <Settings size={18} /> Categories
                            </button>
                            <button className="btn-green" onClick={() => setShowAddDishModal(true)}>
                                <Plus size={18} /> THÊM MÓN MỚI
                            </button>
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
                {/* ... existing code ... */}

                <div className="resto-menu-categories-tabs">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`resto-cat-tab ${activeCategory === cat.id ? "active" : ""}`}
                            onClick={() => scrollToCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Sections */}
            <div className="resto-menu-content">
                {filteredCategories.map((category) => (
                    <div key={category.id} id={`category-${category.id}`} className="resto-menu-section">
                        <div className="resto-section-header">
                            <h2 className="resto-section-title">{category.name}</h2>
                            <span className="count-badge">{category.dishes.length} items</span>
                        </div>

                        <div className="resto-dish-grid">
                            {category.dishes.map((dish) => (
                                <div key={dish.id} className="resto-dish-card">
                                    <div className="dish-img-wrapper">
                                        <img src={dish.imageUrl} alt={dish.name} className="dish-img" />
                                        <div className="qty-badge">Qty: {dish.availabilityQuantity}</div>

                                        <div className="dish-edit-overlay">
                                            <button className="btn-edit-dish" onClick={() => handleEditDish(dish)}>
                                                <Edit3 size={14} />
                                                <span>Chỉnh sửa</span>
                                            </button>
                                            <button className="btn-delete-dish" onClick={() => handleDeleteClick(dish)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="dish-body">
                                        <h3 className="dish-name">{dish.name}</h3>
                                        <p className="dish-desc">{dish.description}</p>

                                        <div className="dish-footer">
                                            <span className="dish-price">{formatVnd(dish.price)}</span>
                                            {dish.menuOptionGroupCount > 0 && (
                                                <span className="options-badge">{dish.menuOptionGroupCount} options</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* End of List Indicator */}
            <div className="resto-eol-wrapper">
                <div className="resto-eol-icon">
                    <Check size={16} strokeWidth={1.5} />
                </div>
                <div className="resto-eol-text-row">
                    <div className="resto-eol-line"></div>
                    <span className="resto-eol-text">END OF LIST</span>
                    <div className="resto-eol-line"></div>
                </div>
            </div>

            {/* Add Dish Modal */}
            <AddDishModal
                isOpen={showAddDishModal}
                onClose={() => setShowAddDishModal(false)}
                categories={categories}
                onSave={fetchMenu}
                dish={editingDish}
            />

            {/* Category Manager Modal */}
            <CategoryManagerModal
                isOpen={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                categories={categories}
                onSave={handleSaveCategories}
            />

            <SlideConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleConfirmDelete}
                title="Xóa món ăn"
                description={`Bạn có chắc chắn muốn xóa món "${dishToDelete?.name}" không? Hành động này không thể hoàn tác.`}
                isLoading={isDeleting}
                type="danger"
            />
        </div>
    );
};

const SkeletonMenuPage = () => {
    return (
        <div className="resto-menu-page">
            <div className="resto-menu-sticky-header">
                <div className="resto-menu-header-row">
                    <div className="skeleton-block skeleton-title" style={{ width: 250, height: 40 }}></div>
                    <div className="resto-menu-actions-wrapper">
                        <div className="skeleton-block" style={{ width: 280, height: 40, borderRadius: 99 }}></div>
                        <div className="skeleton-block" style={{ width: 120, height: 40, borderRadius: 8 }}></div>
                        <div className="skeleton-block" style={{ width: 160, height: 40, borderRadius: 8 }}></div>
                    </div>
                </div>
                <div className="skeleton-tabs-row">
                    <div className="skeleton-block skeleton-tab"></div>
                    <div className="skeleton-block skeleton-tab"></div>
                    <div className="skeleton-block skeleton-tab"></div>
                    <div className="skeleton-block skeleton-tab"></div>
                    <div className="skeleton-block skeleton-tab"></div>
                </div>
            </div>

            <div className="resto-menu-content">
                {[1, 2].map((section) => (
                    <div key={section} className="skeleton-section">
                        <div className="skeleton-section-header">
                            <div className="skeleton-block skeleton-title"></div>
                            <div className="skeleton-block skeleton-badge"></div>
                        </div>
                        <div className="resto-dish-grid">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="skeleton-card">
                                    <div className="skeleton-img"></div>
                                    <div className="skeleton-body">
                                        <div className="skeleton-block skeleton-line-lg"></div>
                                        <div className="skeleton-block skeleton-line-sm"></div>
                                        <div className="skeleton-block skeleton-line-md"></div>
                                        <div className="skeleton-footer">
                                            <div className="skeleton-block skeleton-price"></div>
                                            <div className="skeleton-block skeleton-opt"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuPage;
