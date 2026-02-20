import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Tag, Star, Clock, Image, PenLine, Check } from "lucide-react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import restaurantAppApi from "../../../api/restaurant/restaurantAppApi";
import "./StorePage.css";

// Using the token found in the codebase
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const StorePage = () => {
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStoreData();
    }, []);

    const fetchStoreData = async () => {
        try {
            const response = await restaurantAppApi.getMyRestaurant();
            if (response && response.data) {
                const data = response.data.data || response.data;
                // Normalize data structure
                const normalizedStore = {
                    ...data,
                    isOpen: data.status === "OPEN",
                    coverUrl: data.coverImageUrl,
                    imageUrl: data.avatarUrl,
                    phone: data.contactPhone,
                    email: data.owner?.email,
                    rating: data.averageRating,
                    openingHours: Array(7).fill(null).map((_, i) => ({
                        day: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"][i],
                        isOpen: true,
                        shifts: [{ open: data.schedule.split(" - ")[0], close: data.schedule.split(" - ")[1] }]
                    }))
                };
                setStore(normalizedStore);
            }
        } catch (error) {
            console.error("Failed to fetch store data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <SkeletonStorePage />;
    if (!store) return <div className="p-8">Store not found.</div>;

    // Default coordinates if missing (HCMC)
    const latitude = store.latitude || 10.870;
    const longitude = store.longitude || 106.803;

    return (
        <div className="resto-store-page">
            {/* Cover Section */}
            <div className="resto-store-cover-section">
                <img src={store.coverUrl || store.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80"}
                    alt="Cover"
                    className="resto-store-cover-img" />

                <div className="resto-store-header-content">
                    <div className="resto-header-badges">
                        <span className="badge-open">
                            <StoreIcon size={14} /> {store.isOpen ? "Đang mở cửa" : "Đã đóng cửa"}
                        </span>
                        <span className="badge-rating">
                            <Star size={12} fill="#FACC15" color="#FACC15" /> {store.rating || "New"} ({store.reviewCount || 0} đánh giá)
                        </span>
                    </div>
                    <h1 className="resto-header-name">{store.name}</h1>
                    <div className="resto-header-details">
                        <div className="header-detail-item">
                            <MapPin size={16} /> {store.address}
                        </div>
                        <div className="header-detail-item">
                            <Phone size={16} /> {store.phone}
                        </div>
                    </div>
                </div>

                <button className="btn-change-cover">
                    <Image size={16} /> Thay đổi ảnh bìa
                </button>
            </div>

            {/* Main Content Floating Card */}
            <div className="resto-store-main-container">
                {/* General Info Card */}
                <div className="store-general-card">
                    <div className="store-section-title">
                        <div className="section-icon-wrapper bg-blue-100 text-blue-600">
                            <InfoIcon size={20} />
                        </div>
                        GENERAL INFORMATION
                        <button className="btn-edit-section"><PenLine size={16} /></button>
                    </div>

                    <div className="store-top-row">
                        {/* Profile Card */}
                        <div className="store-profile-card">
                            <div className="store-avatar-wrapper">
                                <img src={store.imageUrl} alt={store.name} className="store-avatar" />
                                <div className="verified-badge"><Check size={14} strokeWidth={4} /></div>
                            </div>
                            <h3 className="store-profile-name">{store.name}</h3>
                            <div className="store-profile-role">Restaurant Partner</div>

                            <div className="store-stats-row">
                                <div className="store-stat-item">
                                    <span className="stat-value">{store.reviewCount || 0}</span>
                                    <span className="stat-label">REVIEWS</span>
                                </div>
                                <div className="store-stat-item">
                                    <span className="stat-value">
                                        {store.rating || 0} <Star size={12} fill="black" stroke="none" style={{ display: 'inline' }} />
                                    </span>
                                    <span className="stat-label">RATING</span>
                                </div>
                                <div className="store-stat-item">
                                    <span className="stat-value">
                                        {store.commissionRate || 10}% <span className="badge-fixed">FIXED</span>
                                    </span>
                                    <span className="stat-label">COMMISSION RATE</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Content */}
                        <div className="store-info-content">
                            <div className="info-block">
                                <h4>About {store.name}</h4>
                                <p className="info-text">
                                    {store.description || "Chưa có mô tả giới thiệu."}
                                </p>
                            </div>

                            <div className="info-block">
                                <h4>Contact Information</h4>
                                <div className="contact-grid">
                                    <div className="contact-item">
                                        <Phone size={20} className="contact-icon" />
                                        <div>
                                            <span className="contact-detail-label">Phone Support</span>
                                            <span className="contact-detail-value">{store.phone}</span>
                                        </div>
                                    </div>
                                    <div className="contact-item">
                                        <Mail size={20} className="contact-icon" />
                                        <div>
                                            <span className="contact-detail-label">Email</span>
                                            <span className="contact-detail-value">{store.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Protection Note (Moved inside Info Content) */}
                            <div className="protection-note">
                                <ShieldCheckIcon /> To protect your payment, always communicate through the Eatzy website.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Location & Hours */}
                <div className="store-bottom-grid">
                    {/* Location */}
                    <div className="content-card">
                        <div className="store-section-title">
                            <div className="section-icon-wrapper bg-green-100 text-green-600">
                                <MapPin size={20} />
                            </div>
                            LOCATION & ADDRESS
                            <button className="btn-edit-section"><PenLine size={16} /></button>
                        </div>
                        <div className="address-text">
                            <span className="text-gray-500 text-xs font-bold uppercase block mb-1">ADDRESS: </span>
                            {store.address}
                        </div>

                        <div className="map-placeholder">
                            <Map
                                initialViewState={{
                                    longitude: longitude,
                                    latitude: latitude,
                                    zoom: 15
                                }}
                                style={{ width: "100%", height: "100%", borderRadius: "12px" }}
                                mapStyle="mapbox://styles/mapbox/streets-v12"
                                mapboxAccessToken={MAPBOX_TOKEN}
                            >
                                <Marker longitude={longitude} latitude={latitude} color="red" />
                            </Map>
                        </div>
                    </div>

                    {/* Hours */}
                    <div className="content-card">
                        <div className="store-section-title">
                            <div className="section-icon-wrapper bg-orange-100 text-orange-600">
                                <Clock size={20} />
                            </div>
                            OPENING HOURS
                            <button className="btn-edit-section"><PenLine size={16} /></button>
                        </div>

                        <div className="hours-list">
                            {store.openingHours && store.openingHours.length > 0 ? (
                                store.openingHours.map((day, i) => (
                                    <div key={i} className={`hours-row ${!day.isOpen ? "hours-closed" : ""}`}>
                                        <span className="day-label">{day.day}</span>
                                        <div className="time-range">
                                            {day.isOpen ? (
                                                day.shifts?.map((s, j) => (
                                                    <span key={j}>{s.open} - {s.close}{j < day.shifts.length - 1 ? ", " : ""}</span>
                                                ))
                                            ) : (
                                                "CLOSED"
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 italic">Chưa cập nhật giờ hoạt động.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Icons helper
const StoreIcon = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>
);

const InfoIcon = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
);

const ShieldCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>
);

export default StorePage;

const SkeletonStorePage = () => {
    return (
        <div className="resto-store-page">
            {/* Cover Skeleton */}
            <div className="skeleton-cover">
                <div className="skeleton-header-content">
                    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                        <div className="skeleton-block" style={{ width: 100, height: 24, borderRadius: 99, background: 'rgba(255,255,255,0.2)' }}></div>
                        <div className="skeleton-block" style={{ width: 120, height: 24, borderRadius: 99, background: 'rgba(255,255,255,0.2)' }}></div>
                    </div>
                    <div className="skeleton-block" style={{ width: 400, height: 48, marginBottom: 16, background: 'rgba(255,255,255,0.2)' }}></div>
                    <div style={{ display: 'flex', gap: 24 }}>
                        <div className="skeleton-block" style={{ width: 200, height: 20, background: 'rgba(255,255,255,0.2)' }}></div>
                        <div className="skeleton-block" style={{ width: 150, height: 20, background: 'rgba(255,255,255,0.2)' }}></div>
                    </div>
                </div>
            </div>

            <div className="resto-store-main-container">
                <div className="skeleton-block" style={{ width: 250, height: 24, marginBottom: 24 }}></div>

                <div className="skeleton-top-row">
                    {/* Profile Card Skeleton */}
                    <div className="skeleton-profile-card">
                        <div className="skeleton-block skeleton-avatar"></div>
                        <div className="skeleton-block" style={{ width: 180, height: 24, marginBottom: 8 }}></div>
                        <div className="skeleton-block" style={{ width: 120, height: 16, marginBottom: 24 }}></div>

                        <div style={{ width: '100%', borderTop: '1px solid #f3f4f6', paddingTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                            <div className="skeleton-block" style={{ width: 60, height: 40 }}></div>
                            <div className="skeleton-block" style={{ width: 60, height: 40 }}></div>
                            <div className="skeleton-block" style={{ width: 60, height: 40 }}></div>
                        </div>
                    </div>

                    {/* Info Content Skeleton */}
                    <div className="skeleton-info-content">
                        <div className="skeleton-info-block">
                            <div className="skeleton-block" style={{ width: 150, height: 20 }}></div>
                            <div className="skeleton-block" style={{ width: '100%', height: 16 }}></div>
                            <div className="skeleton-block" style={{ width: '90%', height: 16 }}></div>
                            <div className="skeleton-block" style={{ width: '80%', height: 16 }}></div>
                        </div>
                        <div className="skeleton-info-block">
                            <div className="skeleton-block" style={{ width: 150, height: 20 }}></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <div className="skeleton-block" style={{ width: 20, height: 20, borderRadius: 99 }}></div>
                                    <div>
                                        <div className="skeleton-block" style={{ width: 80, height: 14, marginBottom: 4 }}></div>
                                        <div className="skeleton-block" style={{ width: 100, height: 14 }}></div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <div className="skeleton-block" style={{ width: 20, height: 20, borderRadius: 99 }}></div>
                                    <div>
                                        <div className="skeleton-block" style={{ width: 80, height: 14, marginBottom: 4 }}></div>
                                        <div className="skeleton-block" style={{ width: 120, height: 14 }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="skeleton-bottom-grid">
                    <div className="skeleton-content-card">
                        <div className="skeleton-block" style={{ width: 200, height: 24, marginBottom: 24 }}></div>
                        <div className="skeleton-block" style={{ width: '100%', height: 250, borderRadius: 12 }}></div>
                    </div>
                    <div className="skeleton-content-card">
                        <div className="skeleton-block" style={{ width: 180, height: 24, marginBottom: 24 }}></div>
                        {[1, 2, 3, 4, 5, 6, 7].map(i => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                <div className="skeleton-block" style={{ width: 60, height: 16 }}></div>
                                <div className="skeleton-block" style={{ width: 100, height: 16 }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
