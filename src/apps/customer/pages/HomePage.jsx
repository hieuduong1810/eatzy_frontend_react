import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, MapPin, TrendingUp, Clock, ArrowRight, Sparkles, Utensils, Loader } from "lucide-react";
import { mockRestaurants, formatVnd } from "../data/mockCustomerData";
import { useLocationStore } from "../../../stores/locationStore";
import "../CustomerApp.css";

import customerApi from "../../../api/customer/customerApi";

const promotions = [
    { id: 1, title: "Giảm 30% 🎉", subtitle: "Đơn hàng đầu tiên", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { id: 2, title: "Free Ship 🚀", subtitle: "Đơn từ 150K", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    { id: 3, title: "Combo Deal 🔥", subtitle: "Tiết kiệm 50K", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
];

export default function HomePage() {
    const navigate = useNavigate();
    const { location } = useLocationStore();
    const [categories, setCategories] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState("all");
    const sliderRef = useRef(null);
    const promoRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await customerApi.getRestaurantTypes();
                // The API returns { data: { meta: ..., result: [...] } }
                // So we need to access response.data.data.result
                if (response.data && response.data.data && response.data.data.result) {
                    setCategories(response.data.data.result);
                }
            } catch (error) {
                console.error("Failed to fetch restaurant types:", error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch restaurants when location or category changes
    useEffect(() => {
        const fetchRestaurants = async () => {
            if (!location) return;

            setIsLoading(true);
            try {
                let filter = "";
                if (selectedCategory !== "all") {
                    filter = `restaurantTypes.id:${selectedCategory}`;
                }
                const response = await customerApi.getNearbyRestaurants(location.latitude, location.longitude, filter);

                if (response.data && response.data.data && response.data.data.result) {
                    setRestaurants(response.data.data.result);
                } else {
                    setRestaurants([]);
                }
            } catch (error) {
                console.error("Failed to fetch nearby restaurants:", error);
                // Fallback to mock with filtering
                if (selectedCategory === "all") {
                    setRestaurants(mockRestaurants);
                } else {
                    setRestaurants(mockRestaurants.filter(r => r.categories.some(c => c.id === selectedCategory)));
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchRestaurants();
    }, [location, selectedCategory]);

    const featured = restaurants.filter((r) => r.rating >= 4.8);
    const nearYou = restaurants;

    return (
        <div className="cust-page">
            <div className="cust-container">

                {/* ── Hero Section ── */}
                <section className="cust-hero">
                    <div className="cust-hero-content">
                        <div className="cust-hero-tag">
                            <Sparkles size={14} />
                            <span>Khám phá ngay</span>
                        </div>
                        <h1 className="cust-hero-title">
                            Đặt món yêu thích,<br />giao nhanh tận cửa
                        </h1>
                        <p className="cust-hero-desc">
                            Hàng nghìn nhà hàng & quán ăn đang chờ bạn
                        </p>
                    </div>
                    <div className="cust-hero-visual">
                        <div className="cust-hero-circle"></div>
                        <span className="cust-hero-emoji">🍕</span>
                    </div>
                </section>

                {/* ── Promotions ── */}
                <section className="cust-section">
                    <div className="cust-section-header">
                        <h2 className="cust-section-title">
                            <TrendingUp size={20} />
                            ƯU ĐÃI HÔM NAY
                        </h2>
                    </div>
                    <div className="cust-promo-scroll" ref={promoRef}>
                        {promotions.map((p) => (
                            <div key={p.id} className="cust-promo-card" style={{ background: p.gradient }}>
                                <span className="cust-promo-title">{p.title}</span>
                                <span className="cust-promo-sub">{p.subtitle}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Category Scroller ── */}
                <section className="cust-section">
                    <div className="cust-category-scroll">
                        <button
                            className={`cust-category-card cust-category-card--no-img ${selectedCategory === "all" ? "cust-category-card--active" : ""}`}
                            onClick={() => setSelectedCategory("all")}
                        >
                            <span className="cust-category-icon">🍽️</span>
                            <span className="cust-category-name">All</span>
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                className={`cust-category-card ${selectedCategory === cat.id ? "cust-category-card--active" : ""} ${!cat.image ? "cust-category-card--no-img" : ""}`}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                {cat.image ? (
                                    <>
                                        <img src={cat.image} alt={cat.name} className="cust-category-bg" />
                                        <div className="cust-category-overlay">
                                            <span className="cust-category-name">{cat.name}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span className="cust-category-icon">🥘</span>
                                        <span className="cust-category-name">{cat.name}</span>
                                    </>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* ── Featured Restaurants ── */}
                <section className="cust-section">
                    <div className="cust-section-header">
                        <h2 className="cust-section-title">
                            <Star size={20} />
                            NHÀ HÀNG NỔI BẬT
                        </h2>
                        <button className="cust-section-more">
                            Xem tất cả <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="cust-featured-scroll" ref={sliderRef}>
                        {featured.map((r) => (
                            <div
                                key={r.id}
                                className="cust-featured-card"
                                onClick={() => navigate(`../restaurant/${r.slug}`)}
                            >
                                <div className="cust-featured-img">
                                    <img src={r.url || r.imageUrl} alt={r.name} />
                                    <div className="cust-featured-badge">
                                        <Star size={12} fill="currentColor" />
                                        {r.rating}
                                    </div>
                                </div>
                                <div className="cust-featured-info">
                                    <h3 className="cust-featured-name">{r.name}</h3>
                                    <p className="cust-featured-cat">{r.categories.map((c) => c.name).join(", ")}</p>
                                    <div className="cust-featured-meta">
                                        <MapPin size={12} />
                                        <span>{r.address.split(",")[0]}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Near You List ── */}
                <section className="cust-section">
                    <div className="cust-section-header">
                        <h2 className="cust-section-title">
                            <Utensils size={20} />
                            GẦN BẠN {location ? `(${location.name})` : ""}
                        </h2>
                        <span className="cust-section-count">{nearYou.length} quán</span>
                    </div>
                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                            <Loader className="animate-spin" size={32} color="#78C841" />
                        </div>
                    ) : (
                        <div className="cust-restaurant-list">
                            {nearYou.map((r, idx) => (
                                <div
                                    key={r.id}
                                    className="cust-restaurant-list-item"
                                    onClick={() => navigate(`../restaurant/${r.slug}`, { state: { id: r.id, restaurant: r } })}
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <img
                                        src={r.avatarUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5"}
                                        alt={r.name}
                                        className="cust-res-list-img"
                                    />

                                    <div className="cust-res-list-info">
                                        <div className="cust-res-list-header">
                                            <h3 className="cust-res-list-name">{r.name}</h3>
                                        </div>

                                        <div className="cust-res-list-rating-row">
                                            <div className="cust-res-list-rating">
                                                <Star size={13} fill="currentColor" color="#F59E0B" />
                                                <span>{r.averageRating ? r.averageRating.toFixed(1) : 4.5}</span>
                                            </div>
                                            <span style={{ color: '#ddd' }}>•</span>
                                            <div className="cust-res-list-meta">
                                                <Clock size={13} />
                                                <span>{20 + Math.floor(Math.random() * 20)} min</span>
                                            </div>
                                            <span style={{ color: '#ddd' }}>•</span>
                                            <div className="cust-res-list-meta">
                                                <MapPin size={13} />
                                                <span>{r.distance ? `${r.distance.toFixed(1)} km` : "Gần bạn"}</span>
                                            </div>
                                        </div>

                                        <div className="cust-res-list-meta">
                                            <span>{r.address ? r.address.split(",")[0] : "Địa chỉ chưa cập nhật"}</span>
                                        </div>

                                        {/* Categories pill */}
                                        {r.categories && r.categories.length > 0 && (
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <span className="cust-res-list-cat">
                                                    {r.categories[0].name}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button (Go) */}
                                    <div className="cust-res-list-action">
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
