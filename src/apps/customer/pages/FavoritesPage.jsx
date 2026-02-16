import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Search, X, Star, MapPin, Store } from "lucide-react";
import customerApi from "../../../api/customer/customerApi";
import "./FavoritesPage.css";
import "../CustomerApp.css";

export default function FavoritesPage() {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            setIsLoading(true);
            const response = await customerApi.getMyFavorites();
            console.log("Favorites API response:", response.data);
            setFavorites(response.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch favorites:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredFavorites = useMemo(() => {
        if (!searchQuery) return favorites;
        const q = searchQuery.toLowerCase();
        return favorites.filter((item) => {
            const r = item.restaurant;
            return (
                r.name.toLowerCase().includes(q) ||
                (r.description && r.description.toLowerCase().includes(q))
            );
        });
    }, [favorites, searchQuery]);

    const handleSearch = (e) => {
        if (e.key === "Enter") setSearchQuery(searchValue);
    };

    // Note: Since no "unfavorite" API was provided in the prompt, 
    // we'll just optimistically remove it from the list for now.
    // In a real app, we would call an API like `customerApi.removeFavorite(id)`.
    const handleRemove = async (e, favId) => {
        e.stopPropagation();
        try {
            await customerApi.removeFavorite(favId);
            setFavorites((prev) => prev.filter((item) => item.id !== favId));
        } catch (error) {
            console.error("Failed to remove favorite:", error);
            alert("Failed to remove favorite");
        }
    };

    return (
        <div className="cust-page cust-page--fullheight">
            <div className="cust-page-scroll">
                <div className="cust-container">
                    {/* ── Header ── */}
                    <div className="cust-page-header">
                        <button className="cust-back-btn" onClick={() => navigate(-1)}>
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="cust-page-title">FAVORITES RESTAURANT</h1>
                            <p className="cust-page-subtitle">Your saved restaurants</p>
                        </div>
                    </div>

                    {/* ── Toolbar ── */}
                    <div className="cust-sticky-toolbar">
                        <div className="cust-toolbar-search">
                            <Search size={18} className="cust-toolbar-search-icon" />
                            <div className="cust-toolbar-search-divider" />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                            {searchValue && (
                                <button
                                    className="cust-toolbar-clear"
                                    onClick={() => {
                                        setSearchValue("");
                                        setSearchQuery("");
                                    }}
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <span className="cust-toolbar-count">{filteredFavorites.length} saved venues</span>
                    </div>

                    {/* ── Content ── */}
                    <div className="cust-grid-content">
                        {isLoading ? (
                            <div className="cust-loading-grid">
                                {[1, 2, 3, 4].map((n) => (
                                    <div key={n} className="cust-loading-card" />
                                ))}
                            </div>
                        ) : filteredFavorites.length > 0 ? (
                            <div className="cust-fav-grid">
                                {filteredFavorites.map((fav) => {
                                    const r = fav.restaurant;
                                    const category = r.restaurantTypes?.[0]?.name || "Restaurant";
                                    // Default image fallback if needed
                                    const bgImage = r.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60";

                                    return (
                                        <div
                                            key={fav.id}
                                            className="cust-fav-card"
                                            onClick={() => navigate(`../restaurant/${r.slug}`)}
                                        >
                                            <div
                                                className="cust-fav-bg"
                                                style={{ backgroundImage: `url(${bgImage})` }}
                                            />
                                            <div className="cust-fav-overlay">
                                                <div className="cust-fav-top">
                                                    <div className="cust-fav-rating">
                                                        <Star size={14} fill="#eab308" color="#eab308" />
                                                        <span>{r.averageRating?.toFixed(1) || "New"}</span>
                                                    </div>
                                                    <button
                                                        className="cust-fav-btn"
                                                        onClick={(e) => handleRemove(e, fav.id)}
                                                    >
                                                        <Heart size={20} fill="#f43f5e" color="#f43f5e" />
                                                    </button>
                                                </div>

                                                <div className="cust-fav-info">
                                                    <h3 className="cust-fav-name">{r.name}</h3>
                                                    <div className="cust-fav-address">
                                                        <MapPin size={14} />
                                                        <span>{r.address}</span>
                                                    </div>

                                                    <div className="cust-fav-stats-row">
                                                        <div className="cust-fav-stat-item">
                                                            <span className="cust-stat-val">{category}</span>
                                                            <span className="cust-stat-label">CATEGORY</span>
                                                        </div>
                                                        <div className="cust-fav-stat-item">
                                                            <span className="cust-stat-val">OPEN</span>
                                                            <span className="cust-stat-label">STATUS</span>
                                                        </div>
                                                    </div>

                                                    <div className="cust-fav-footer-btn">
                                                        <div className="cust-fav-visit-icon">
                                                            <Store size={16} />
                                                        </div>
                                                        <span>Visit Restaurant</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="cust-empty-state">
                                <div className="cust-empty-icon cust-empty-icon--red">
                                    <Heart size={40} />
                                </div>
                                <h3>No favorites yet</h3>
                                <p>Start saving restaurants you love!</p>
                                <button className="cust-empty-btn" onClick={() => navigate("/customer/home")}>
                                    Find Restaurants
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
