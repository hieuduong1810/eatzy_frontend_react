import { X, Play, MapPin, Star, User, Phone, Mail, Globe, Printer, Wallet, Calendar, ShieldCheck, ChevronRight } from "lucide-react";
import "./RestaurantDetail.css";

const RestaurantDetail = ({ restaurant, onClose }) => {
    if (!restaurant) return null;

    // Mock data for UI showcase
    const establishedYear = "2024";
    const walletBalance = "3.278.503 ₫";
    const platformFee = "10%";
    const operationalHours = "06:00 - 20:00";

    return (
        <div className="res-detail-overlay" onClick={onClose}>
            <div className="res-detail-container" onClick={(e) => e.stopPropagation()}>
                {/* Header with Cover */}
                <div className="res-detail-header">
                    <img
                        src={restaurant.coverImageUrl}
                        className="res-cover-img"
                        alt="cover"
                    />

                    {/* Header Content */}
                    <div className="res-header-content">
                        <div className="res-avatar-wrapper">
                            <img
                                src={restaurant.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.name)}&background=random`}
                                className="res-avatar"
                                alt={restaurant.name}
                            />
                            <div className="res-status-indicator">
                                <Play size={14} fill="white" strokeWidth={0} />
                            </div>
                        </div>
                        <div className="res-title-group">
                            <div className="res-badges">
                                <span className="res-badge">{restaurant.restaurantTypes?.name || "Món Việt"}</span>
                                <span className="res-badge" style={{ background: '#84cc16' }}>ID #{restaurant.id}</span>
                            </div>
                            <h1 className="res-detail-name">{restaurant.name}</h1>
                            <div className="res-detail-meta">ESTD ★ {establishedYear}</div>
                        </div>
                    </div>

                    {/* Quick Info Bar - Now inside transparent header area to show bg behind */}
                    <div className="res-info-bar-wrapper">
                        <div className="res-info-pill">
                            <MapPin size={16} className="text-gray-400" />
                            <span>{restaurant.address}</span>
                        </div>
                        <div className="res-info-pill res-rating-pill">
                            <Star size={16} fill="#facc15" strokeWidth={0} />
                            <span className="font-bold">{restaurant.averageRating || "0.0"}</span>
                            <span className="text-gray-400 text-xs ml-1">{restaurant.reviewCount || 0} REVIEWS</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="res-grid">
                    {/* Financial Overview */}
                    <div className="res-card">
                        <div className="detail-card-title">
                            <Wallet size={18} />
                            Financial Overview
                        </div>
                        <div className="stat-row">
                            <div>
                                <span className="contact-label">Wallet Balance</span>
                                <div className="stat-value">{walletBalance}</div>
                            </div>
                            <div>
                                <span className="contact-label">Platform Fee</span>
                                <div className="stat-value stat-val-highlight">{restaurant.commissionRate || 10}%</div>
                            </div>
                        </div>
                    </div>

                    {/* Performance */}
                    <div className="res-card" style={{ background: "#000000ff", color: "white" }}>
                        <div className="detail-card-title" style={{ color: "#9ca3af" }}>
                            Performance
                        </div>
                        <div className="rate-display">
                            <div className="big-rate">{restaurant.averageRating || "4.0"}</div>
                            <div className="rate-stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < Math.round(restaurant.averageRating || 0) ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <div className="total-reviews">{restaurant.reviewCount || 0} Total Reviews</div>
                        </div>
                    </div>

                    {/* Partner Contacts */}
                    <div className="res-card">
                        <div className="detail-card-title">
                            <User size={18} />
                            Partner Contacts
                        </div>
                        <div className="contact-grid">
                            <div className="contact-item">
                                <span className="contact-label">Contact Number</span>
                                <div className="contact-value">{restaurant.contactPhone}</div>
                            </div>
                            <div className="contact-item">
                                <span className="contact-label">Legal Entity / Owner</span>
                                <div className="contact-value">{restaurant.owner?.name || "Restaurant"}</div>
                            </div>
                            <div className="contact-item">
                                <span className="contact-label">Operational Region</span>
                                <div className="contact-value">{restaurant.address}</div>
                            </div>
                            <div className="contact-item">
                                <span className="contact-label">Email Address</span>
                                <div className="contact-value" title={restaurant.owner?.email}>{restaurant.owner?.email}</div>
                            </div>
                        </div>
                    </div>

                    {/* Business Schedule */}
                    <div className="res-card">
                        <div className="detail-card-title">
                            <Calendar size={18} />
                            Business Schedule
                        </div>
                        <div className="contact-item" style={{ background: "#ecfccb" }}>
                            <span className="contact-label" style={{ color: "#4d7c0f" }}>Operational Hours</span>
                            <div className="contact-value" style={{ color: "#365314" }}>{operationalHours}</div>
                        </div>
                        <div className="mt-4 text-xs text-gray-400">
                            Schedule is maintained by the partner. Admin can force close/lock account from the main dashboard.
                        </div>
                    </div>

                    {/* Description */}
                    <div className="res-card" style={{ gridColumn: "span 2" }}>
                        <div className="detail-card-title">
                            Description & Philosophy
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl italic text-gray-600 border-l-4 border-lime-500">
                            "{restaurant.description || "Cơm trưa sinh viên, cơm tấm sườn bì chả..."}"
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="dossier-footer">
                    <div className="policy-check">
                        <div className="policy-icon-wrapper">
                            <ShieldCheck size={24} color="#84cc16" />
                        </div>
                        <div>
                            <h4>Security & Policy Check</h4>
                            <p>This partner has agreed to Eatzy's quality of service policy. Review their metrics regularly to ensure system health.</p>
                        </div>
                    </div>
                    <button className="res-detail-close-btn" onClick={onClose}>
                        CLOSE DOSSIER <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetail;
