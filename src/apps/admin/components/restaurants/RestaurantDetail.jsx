import { X, Play, Pause, MapPin, Star, User, Phone, Mail, Globe, Printer, Wallet, Calendar, ShieldCheck, ChevronRight, Clock } from "lucide-react";
import "./RestaurantDetail.css";

const RestaurantDetail = ({ restaurant, onClose }) => {
    if (!restaurant) return null;

    // Mock data for UI showcase
    const establishedYear = "2024";
    const walletBalance = "3.278.503 ₫";

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
                            <div className={`res-status-indicator ${restaurant.status !== 'OPEN' ? 'closed' : ''}`}>
                                {restaurant.status === 'OPEN' ? (
                                    <Play size={14} fill="white" strokeWidth={0} />
                                ) : (
                                    <Pause size={14} fill="white" strokeWidth={0} />
                                )}
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
                            <div className="rating-wrapper-tight">
                                <Star size={20} fill="#facc15" strokeWidth={0} />
                                <span className="rating-num-large">{parseFloat(restaurant.averageRating || 0).toFixed(1)}</span>
                            </div>
                            <span className="rating-count-small">{restaurant.reviewCount || 0} REVIEWS</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="res-grid">
                    {/* Left Column Group */}
                    <div className="res-left-col">
                        {/* Financial Overview */}
                        <div className="res-card flat-card">
                            <div className="card-header-row">
                                <div className="icon-box-soft green">
                                    <Wallet size={20} />
                                </div>
                                <span className="card-title-text">FINANCIAL OVERVIEW</span>
                                <div className="wm-icon">
                                    <Wallet size={64} strokeWidth={1} />
                                </div>
                            </div>
                            <div className="fin-stats-row">
                                <div className="fin-stat-group">
                                    <span className="fin-label">WALLET BALANCE</span>
                                    <div className="fin-value">{walletBalance}</div>
                                </div>
                                <div className="fin-stat-group">
                                    <span className="fin-label">PLATFORM FEE</span>
                                    <div className="fin-fee-wrapper">
                                        <div className="fin-badge-purple">
                                            <span className="percent-icon">%</span>
                                        </div>
                                        <div className="fin-value fin-value-purple">{restaurant.commissionRate || 10}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Partner Contacts */}
                        <div className="res-card flat-card">
                            <div className="card-header-row mb-4">
                                <div className="icon-box-soft lime">
                                    <User size={20} />
                                </div>
                                <span className="card-title-text">PARTNER CONTACTS</span>
                            </div>
                            <div className="contact-grid-modern">
                                <div className="contact-pill">
                                    <div className="cp-icon"><Phone size={18} /></div>
                                    <div>
                                        <div className="cp-label">CONTACT NUMBER</div>
                                        <div className="cp-value">{restaurant.contactPhone}</div>
                                    </div>
                                </div>
                                <div className="contact-pill">
                                    <div className="cp-icon"><Printer size={18} /></div>
                                    <div>
                                        <div className="cp-label">LEGAL ENTITY / OWNER</div>
                                        <div className="cp-value">{restaurant.owner?.name || "Restaurant"}</div>
                                    </div>
                                </div>
                                <div className="contact-pill">
                                    <div className="cp-icon"><MapPin size={18} /></div>
                                    <div>
                                        <div className="cp-label">OPERATIONAL REGION</div>
                                        <div className="cp-value">{restaurant.address}</div>
                                    </div>
                                </div>
                                <div className="contact-pill">
                                    <div className="cp-icon"><Globe size={18} /></div>
                                    <div>
                                        <div className="cp-label">PUBLIC LANDING</div>
                                        <div className="cp-value truncate-w">.../restaurant/{restaurant.id} <ChevronRight size={12} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="res-card flat-card">
                            <div className="card-header-row mb-4">
                                <div className="icon-box-soft lime">
                                    <div style={{ fontWeight: 'bold', fontSize: '14px', fontStyle: 'italic' }}>i</div>
                                </div>
                                <span className="card-title-text">DESCRIPTION & PHILOSOPHY</span>
                            </div>
                            <div className="desc-quote-box">
                                <div className="quote-line"></div>
                                "{restaurant.description || "Chưa có mô tả..."}"
                            </div>
                        </div>
                    </div>

                    {/* Right Column Group */}
                    <div className="res-right-col">
                        {/* Performance Dark Card */}
                        <div className="res-card dark-card">
                            <div className="card-header-row mb-6">
                                <div>
                                    <span className="sub-header-text">PERFORMANCE</span>
                                    <div className="card-title-white">RATING ANALYTICS</div>
                                </div>
                                <div className="icon-sq-green">
                                    <Star size={18} fill="white" strokeWidth={0} />
                                </div>
                            </div>

                            <div className="rating-flex-row">
                                <div className="rating-big-num">{restaurant.averageRating || "5.0"}</div>
                                <div>
                                    <div className="stars-row">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill="#84cc16" strokeWidth={0} />
                                        ))}
                                    </div>
                                    <div className="rating-total-text">{restaurant.reviewCount || 0} TOTAL REVIEWS</div>
                                </div>
                            </div>

                            <div className="rating-bars">
                                {[5, 4, 3, 2, 1].map((num) => (
                                    <div className="bar-row" key={num}>
                                        <span className="bar-num">{num}</span>
                                        <div className="progress-track">
                                            <div className="progress-fill" style={{ width: num === 5 ? '100%' : '0%' }}></div>
                                        </div>
                                        <span className="bar-count">{num === 5 ? 1 : 0}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Business Schedule */}
                        <div className="res-card flat-card">
                            <div className="card-header-row mb-6">
                                <div className="icon-box-soft gray">
                                    <Clock size={20} />
                                </div>
                                <span className="card-title-text">BUSINESS SCHEDULE</span>
                            </div>

                            <div className="schedule-box">
                                <div className="schedule-header">
                                    <Calendar size={16} /> OPERATIONAL HOURS
                                </div>
                                <div className="schedule-time">{restaurant.schedule || "08:00 - 22:00"}</div>
                            </div>

                            <div className="schedule-note">
                                <div className="dot-gray"></div>
                                <span>Schedule is maintained by the partner. Admin can force close/lock account.</span>
                            </div>
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
