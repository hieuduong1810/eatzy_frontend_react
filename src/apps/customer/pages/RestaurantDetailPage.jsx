import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Plus, Minus, Info, CheckCircle } from "lucide-react";
import customerApi from "../../../api/customer/customerApi";
import { useCart } from "../context/CartContext";
import DishSelectionModal from "../components/DishSelectionModal"; // Import Modal
import CartFloatingButton from "../components/CartFloatingButton";
import CartModal from "../components/CartModal";
import "../CustomerAppRedesign.css"; // Correct CSS import

export default function RestaurantDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // State
    const [restaurant, setRestaurant] = useState(null);
    const [menuData, setMenuData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(null);
    const [selectedDish, setSelectedDish] = useState(null); // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal State
    const [isCartOpen, setIsCartOpen] = useState(false); // Cart Modal State
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null); // Store the ID of the favorite record

    // Refs for scrolling
    const categoryRefs = useRef({});
    const rightColRef = useRef(null); // Ref for scrollable container

    // Shared cart
    const { addItem, removeItem, getItemCount } = useCart();

    // 1. Fetch Restaurant & Menu Data
    useEffect(() => {
        const fetchRemoteData = async () => {
            setIsLoading(true);
            try {
                // A. Fetch Restaurant Details by Slug
                let resId = location.state?.id;
                let resData = null;

                if (slug) {
                    try {
                        const resResponse = await customerApi.getRestaurantBySlug(slug);
                        if (resResponse.data && resResponse.data.data) {
                            resData = resResponse.data.data;
                            setRestaurant({
                                id: resData.id,
                                name: resData.name,
                                description: resData.description,
                                address: resData.address,
                                rating: resData.averageRating || 4.5,
                                reviewCount: resData.reviewCount || 0,
                                imageUrl: resData.coverImageUrl, // Cover Image
                                avatarUrl: resData.avatarUrl,     // Avatar Image
                                schedule: resData.schedule
                            });
                            resId = resData.id;
                        }
                    } catch (err) {
                        console.error("Failed to fetch info by slug", err);
                    }
                }

                // B. Fetch Menu (using ID)
                if (resId) {
                    const menuResponse = await customerApi.getRestaurantMenu(resId);
                    if (menuResponse.data && menuResponse.data.data) {
                        const menuApiData = menuResponse.data.data;

                        if (!resData && menuApiData.name) {
                            setRestaurant({
                                id: menuApiData.id,
                                name: menuApiData.name,
                                address: "Địa chỉ nhà hàng",
                                rating: 4.5,
                                imageUrl: menuApiData.image
                            });
                        }

                        // Extract Categories
                        let categories = [];
                        if (Array.isArray(menuApiData.dishes)) {
                            categories = menuApiData.dishes;
                        }
                        setMenuData(categories);
                        if (categories.length > 0 && !activeCategory) {
                            setActiveCategory(categories[0].id);
                        }
                    }

                    // C. Check Favorite Status
                    try {
                        const favResponse = await customerApi.getMyFavorites();
                        if (favResponse.data && Array.isArray(favResponse.data.data)) {
                            const favorites = favResponse.data.data;
                            const foundFav = favorites.find(f => f.restaurant.id === resId);
                            if (foundFav) {
                                setIsFavorite(true);
                                setFavoriteId(foundFav.id);
                            } else {
                                setIsFavorite(false);
                                setFavoriteId(null);
                            }
                        }
                    } catch (favErr) {
                        console.error("Failed to check favorite status", favErr);
                    }
                }

            } catch (error) {
                console.error("Error loading restaurant page:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRemoteData();
    }, [slug, location.state]);

    // 2. Sticky Scroll Handler (Targeting Right Column)
    useEffect(() => {
        const handleScroll = () => {
            if (!rightColRef.current) return;

            const container = rightColRef.current;
            const scrollY = container.scrollTop + 200; // Offset
            let current = null;

            for (const catId of Object.keys(categoryRefs.current)) {
                const el = categoryRefs.current[catId];
                if (el) {
                    // Calculate offset relative to container
                    const offsetTop = el.offsetTop;
                    if (offsetTop <= scrollY) {
                        current = parseInt(catId);
                    }
                }
            }
            if (current) setActiveCategory(current);
        };

        const container = rightColRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [menuData]);

    const scrollToCategory = (catId) => {
        setActiveCategory(catId);
        const element = categoryRefs.current[catId];
        const container = rightColRef.current;

        if (element && container) {
            // Scroll container to element
            const y = element.offsetTop - 80; // Adjusted offset for sticky header/tabs
            container.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const handleDishClick = (dish) => {
        setSelectedDish(dish);
        setIsModalOpen(true);
    };

    const handleToggleFavorite = async () => {
        const resId = restaurant?.id;
        if (!resId) return;

        try {
            if (isFavorite) {
                // Call DELETE API
                if (favoriteId) {
                    await customerApi.removeFavorite(favoriteId);
                    setIsFavorite(false);
                    setFavoriteId(null);
                }
            } else {
                // Call POST API
                const res = await customerApi.addFavorite(resId);
                // Assuming response structure: res.data.data includes the new favorite object
                if (res.data && res.data.data) {
                    setIsFavorite(true);
                    setFavoriteId(res.data.data.id);
                }
            }
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
            // Optionally show toast/alert
        }
    };

    if (isLoading) return <div className="p-10 text-center">Loading...</div>;

    const currentResId = restaurant?.id || 0;

    return (
        <div className="cust-detail-page-redesign">

            <div className="cust-detail-container">

                {/* ── Left Column: Info + Avatar (Sticky) ── */}
                <div className="cust-col-left">
                    <div className="cust-sticky-wrapper">
                        <h1 className="cust-header-title">{restaurant?.name}</h1>
                        <p className="cust-header-subtitle">{restaurant?.description}</p>

                        <div className="cust-header-meta-row">
                            <MapPin size={16} className="cust-icon-grey" />
                            <span>{restaurant?.address}</span>
                        </div>

                        <div className="cust-header-rating-badge">
                            <div className="cust-rating-icon">
                                <Star size={14} fill="white" color="white" />
                            </div>
                            <span className="cust-rating-val">{restaurant?.rating}</span>
                            <div className="cust-rating-text-col">
                                <span className="cust-rating-label">RATING</span>
                                <span className="cust-rating-count">{restaurant?.reviewCount} Đánh giá</span>
                            </div>
                            <div className="cust-rating-arrow">›</div>
                        </div>

                        {/* Avatar Image (As Requested) */}
                        {restaurant?.avatarUrl && (
                            <div className="cust-header-avatar-img">
                                <img src={restaurant.avatarUrl} alt="Restaurant Avatar" />
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right Column: Cover + Tabs + Menu ── */}
                <div className="cust-col-right" ref={rightColRef}>

                    {/* Cover Image */}
                    <div className="cust-header-banner-img">
                        <img
                            src={restaurant?.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                            alt="Cover"
                        />
                        <button
                            className="cust-save-btn"
                            onClick={handleToggleFavorite}
                            style={isFavorite ? {
                                backgroundColor: '#582b2b', // Dark brown/red from screenshot
                                color: 'white',
                                borderColor: '#582b2b'
                            } : {}}
                        >
                            <Star size={14} fill={isFavorite ? "#ff4757" : "none"} color={isFavorite ? "#ff4757" : "currentColor"} />
                            {isFavorite ? "SAVED" : "SAVE VENUE"}
                        </button>
                    </div>

                    {/* Sticky Tabs */}
                    <div className="cust-detail-tabs-sticky">
                        <div className="cust-detail-tabs-list">
                            {menuData.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`cust-tab-link ${activeCategory === cat.id ? 'cust-tab-link--active' : ''}`}
                                    onClick={() => scrollToCategory(cat.id)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                        <hr className="cust-tabs-divider" />
                    </div>

                    {/* Menu Categories & Grid */}
                    {menuData.map(cat => (
                        <div
                            key={cat.id}
                            className="cust-menu-section"
                            ref={el => categoryRefs.current[cat.id] = el}
                        >
                            <div className="cust-cat-header-row">
                                <h3 className="cust-menu-cat-title">{cat.name}</h3>
                                <span className="cust-cat-count-pill">{cat.dishes?.length || 0} SELECTIONS</span>
                            </div>

                            <div className="cust-menu-grid-v2">
                                {cat.dishes && cat.dishes.map(dish => {
                                    const count = getItemCount(currentResId, dish.id);
                                    return (
                                        <div key={dish.id} className="cust-dish-card-v2" onClick={() => handleDishClick(dish)}>
                                            <div className="cust-dish-card-overlay">
                                                <img
                                                    src={dish.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                                                    alt={dish.name}
                                                />
                                                <div className="cust-dish-overlay-grad"></div>

                                                <div className="cust-dish-info-icon">
                                                    <Info size={16} />
                                                </div>

                                                <div className="cust-dish-overlay-content">
                                                    <h4 className="cust-dish-overlay-title">{dish.name}</h4>
                                                    <p className="cust-dish-overlay-desc">{dish.description}</p>

                                                    <div className="cust-dish-overlay-bottom">
                                                        <span className="cust-dish-price-pill">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dish.price)}
                                                        </span>

                                                        {count > 0 ? (
                                                            <div className="cust-qty-ctrl-green">
                                                                <button onClick={(e) => { e.stopPropagation(); removeItem(currentResId, dish.id); }}>-</button>
                                                                <span>{count}</span>
                                                                <button onClick={(e) => { e.stopPropagation(); addItem(currentResId, dish); }}>+</button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className="cust-dish-add-btn-green"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDishClick(dish);
                                                                }}
                                                            >
                                                                <Plus size={20} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* End of List Indicator */}
                    <div className="cust-end-of-list">
                        <CheckCircle className="cust-eol-icon" strokeWidth={1.5} />
                        <span className="cust-eol-text">END OF LIST</span>
                    </div>

                </div>
            </div>

            {/* Dish Selection Modal */}
            <DishSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                dish={selectedDish}
                restaurantId={currentResId}
            />

            {/* Cart Components */}
            <CartFloatingButton
                restaurantId={currentResId}
                onClick={() => setIsCartOpen(true)}
            />
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                restaurantId={currentResId}
            />
        </div>
    );
}
