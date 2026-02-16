import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, Star, CheckCircle, CreditCard, User, Utensils } from 'lucide-react';
import customerApi from '../../../api/customer/customerApi';
import './OrderDetailModal.css';

const OrderDetailModal = ({ isOpen, onClose, order }) => {
    // State
    const [activeTab, setActiveTab] = useState('details');
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({
        restaurant: { rating: 0, comment: '' },
        driver: { rating: 0, comment: '' }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset state when modal opens or order changes
    useEffect(() => {
        if (isOpen) {
            setActiveTab('details');
            setReviews([]);
            setReviewForm({
                restaurant: { rating: 0, comment: '' },
                driver: { rating: 0, comment: '' }
            });
        }
    }, [isOpen, order]);

    // Fetch reviews when tab changes to 'reviews'
    useEffect(() => {
        if (isOpen && order && activeTab === 'reviews') {
            fetchReviews();
        }
    }, [activeTab, isOpen, order]);

    const fetchReviews = async () => {
        try {
            const response = await customerApi.getReviewsByOrderId(order.id);
            setReviews(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        }
    };

    if (!isOpen || !order) return null;

    const {
        id,
        restaurant,
        orderItems,
        subtotal,
        deliveryFee,
        discountAmount,
        totalAmount,
        orderStatus,
        createdAt,
        paymentMethod,
        paymentStatus,
        deliveryAddress,
        driver
    } = order;

    const formatVnd = (price) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return `${d.toLocaleTimeString("vi-VN")} ${d.toLocaleDateString("vi-VN")}`;
    };

    // Review Logic
    const handleRatingChange = (target, value) => {
        setReviewForm(prev => ({
            ...prev,
            [target]: { ...prev[target], rating: value }
        }));
    };

    const handleCommentChange = (target, value) => {
        setReviewForm(prev => ({
            ...prev,
            [target]: { ...prev[target], comment: value }
        }));
    };

    const submitReview = async (targetType) => { // targetType: 'RESTAURANT' or 'DRIVER'
        const formKey = targetType === 'RESTAURANT' ? 'restaurant' : 'driver';
        const targetId = targetType === 'RESTAURANT' ? restaurant.id : driver?.id;

        if (!targetId) return;

        const data = {
            orderId: id,
            targetType: targetType,
            targetId: targetId,
            rating: reviewForm[formKey].rating,
            comment: reviewForm[formKey].comment
        };

        try {
            setIsSubmitting(true);
            await customerApi.createReview(data);
            await fetchReviews();
        } catch (error) {
            console.error("Submit review failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const existingRestaurantReview = reviews.find(r => r.reviewTarget?.toLowerCase() === 'restaurant');
    const existingDriverReview = reviews.find(r => r.reviewTarget?.toLowerCase() === 'driver');

    const renderStars = (currentRating, onRate, readOnly = false) => {
        return (
            <div className="cust-star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={24}
                        fill={star <= currentRating ? "#fbbf24" : "none"}
                        color={star <= currentRating ? "#fbbf24" : "#d1d5db"}
                        className={!readOnly ? "cust-star-interactive" : ""}
                        onClick={() => !readOnly && onRate && onRate(star)}
                        style={{ cursor: readOnly ? 'default' : 'pointer' }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="cust-modal-overlay" onClick={onClose}>
            <div className="cust-modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="cust-modal-header">
                    <div className="cust-modal-title">
                        <h2>Order Detail</h2>
                        <p className="cust-modal-subtitle">Order ID: #{id}</p>
                    </div>

                    {/* Toggle Switch */}
                    <div className="cust-header-center">
                        <div className="cust-toggle-switch">
                            <div
                                className={`cust-toggle-option ${activeTab === 'details' ? 'active' : ''}`}
                                onClick={() => setActiveTab('details')}
                            >
                                Chi tiết
                            </div>
                            <div
                                className={`cust-toggle-option ${activeTab === 'reviews' ? 'active' : ''}`}
                                onClick={() => setActiveTab('reviews')}
                            >
                                Đánh giá
                            </div>
                        </div>
                    </div>

                    <div className="cust-modal-actions">
                        <button className="cust-btn-close" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                {activeTab === 'details' ? (
                    <div className="cust-modal-body">
                        {/* ── COL 1: Restaurant Profile ── */}
                        <div className="cust-col-1">
                            <div className="cust-detail-card cust-profile-card">
                                <div className="cust-profile-avatar-wrapper">
                                    <img
                                        src={restaurant.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                                        alt={restaurant.name}
                                        className="cust-profile-avatar"
                                    />
                                    <div className="cust-profile-status-dot" />
                                </div>

                                <h3 className="cust-profile-name">{restaurant.name}</h3>
                                <div className="cust-profile-meta">
                                    <MapPin size={12} />
                                    <span>Nhà hàng - Quán ăn</span>
                                </div>

                                <div className="cust-profile-stats">
                                    <div className="cust-profile-stat-item">
                                        <div className="cust-profile-stat-val">1.2k</div>
                                        <div className="cust-profile-stat-label">ĐÁNH GIÁ</div>
                                    </div>
                                    <div className="cust-profile-stat-item">
                                        <div className="cust-profile-stat-val">4.8 <Star size={12} fill="orange" color="orange" /></div>
                                        <div className="cust-profile-stat-label">XẾP HẠNG</div>
                                    </div>
                                </div>
                            </div>

                            <div className="cust-safety-badge">
                                <CheckCircle size={20} className="cust-safety-icon" />
                                <div className="cust-safety-text">
                                    Luôn đặt món qua Eatzy để được bảo vệ quyền lợi và đảm bảo an toàn giao dịch.
                                </div>
                            </div>
                        </div>

                        {/* ── COL 2: Items & Summary ── */}
                        <div className="cust-col-2">
                            <div className="cust-detail-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div className="cust-items-header">
                                    <div className="cust-items-title">
                                        <Utensils size={18} color="#65a30d" />
                                        <span>Món ăn</span>
                                    </div>
                                    <div className="cust-items-count">{orderItems?.length || 0} món</div>
                                </div>

                                <div className="cust-items-list" style={{ flex: 1 }}>
                                    {orderItems?.map((item) => (
                                        <div key={item.id} className="cust-detail-item">
                                            <div className="cust-item-left">
                                                <div className="cust-item-qty">{item.quantity}x</div>
                                                <div>
                                                    <div className="cust-item-name">{item.dish.name}</div>
                                                    <div className="cust-item-opts">
                                                        {item.orderItemOptions?.map(opt => (
                                                            <div key={opt.id}>• {opt.menuOption.name}</div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="cust-item-price">{formatVnd(item.priceAtPurchase)}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="cust-summary-section">
                                    <div className="cust-summary-row">
                                        <span>Tạm tính</span>
                                        <span>{formatVnd(subtotal)}</span>
                                    </div>
                                    <div className="cust-summary-row">
                                        <span>Phí vận chuyển</span>
                                        <span>{formatVnd(deliveryFee)}</span>
                                    </div>
                                    <div className="cust-summary-row" style={{ color: '#166534' }}>
                                        <span>Giảm giá</span>
                                        <span>- {formatVnd(discountAmount)}</span>
                                    </div>
                                    <div className="cust-summary-total">
                                        <span>Tổng cộng</span>
                                        <span>{formatVnd(totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── COL 3: Driver, Location, Meta ── */}
                        <div className="cust-col-3">
                            {/* Driver */}
                            <div className="cust-detail-card cust-driver-card-new">
                                <div className="cust-driver-section-left">
                                    <div className="cust-driver-avatar-circle-large">
                                        <Utensils size={32} strokeWidth={1.5} />
                                    </div>
                                    <div className="cust-driver-name-large">{driver ? driver.name : "Đang tìm tài xế..."}</div>
                                    <div className="cust-driver-plate">
                                        <MapPin size={12} /> {driver ? driver.vehicleLicensePlate : "---"}
                                    </div>
                                </div>
                                <div className="cust-driver-divider" />
                                <div className="cust-driver-section-right">
                                    <div className="cust-driver-stat-group">
                                        <div className="cust-driver-stat-val-large">
                                            {driver ? driver.averageRating : "--"} <Star size={14} fill="black" />
                                        </div>
                                        <div className="cust-driver-stat-label-small">Đánh giá</div>
                                    </div>
                                    <div className="cust-driver-stat-group">
                                        <div className="cust-driver-stat-val-large">{driver ? driver.vehicleType : "---"}</div>
                                        <div className="cust-driver-stat-label-small">Phương tiện</div>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="cust-detail-card">
                                <div className="cust-timeline">
                                    <div className="cust-timeline-item">
                                        <div className="cust-timeline-dot pickup" />
                                        <div className="cust-timeline-label">ĐIỂM LẤY HÀNG</div>
                                        <div className="cust-timeline-name">{restaurant.name}</div>
                                        <div className="cust-timeline-address">{restaurant.address}</div>
                                    </div>
                                    <div className="cust-timeline-item" style={{ marginTop: '32px' }}>
                                        <div className="cust-timeline-dot dropoff" />
                                        <div className="cust-timeline-label dropoff-label">ĐIỂM GIAO HÀNG</div>
                                        <div className="cust-timeline-name">Địa điểm nhận</div>
                                        <div className="cust-timeline-address">{deliveryAddress}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="cust-detail-card">
                                <h4 className="cust-detail-section-title">
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Clock size={16} color="#4b5563" /> Thông tin đơn hàng
                                    </span>
                                </h4>
                                <div className="cust-meta-list">
                                    <div className="cust-meta-row">
                                        <span className="cust-meta-label">Thời gian đặt</span>
                                        <span className="cust-meta-val" style={{ fontWeight: '700', fontSize: '14px', textAlign: 'right' }}>
                                            {formatDate(createdAt)}
                                        </span>
                                    </div>
                                    <div className="cust-meta-row">
                                        <span className="cust-meta-label">Phương thức thanh toán</span>
                                        <span className="cust-meta-val"><CreditCard size={14} /> {paymentMethod}</span>
                                    </div>
                                    <div className="cust-meta-row">
                                        <span className="cust-meta-label">Trạng thái thanh toán</span>
                                        <span className={`cust-meta-val ${paymentStatus === 'PAID' ? 'success' : ''}`}>
                                            {paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── Review Layout ── */
                    <div className="cust-modal-body cust-modal-body-reviews">
                        {/* Restaurant Review */}
                        <div className="cust-review-col">
                            <div className="cust-detail-card cust-review-card">
                                <h3 className="cust-review-title">Đánh giá nhà hàng</h3>
                                <div className="cust-review-target">
                                    <img
                                        src={restaurant.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                                        alt={restaurant.name}
                                        className="cust-review-avatar"
                                    />
                                    <h4 className="cust-review-name">{restaurant.name}</h4>
                                    <p className="cust-review-helper">Bạn thấy món ăn thế nào?</p>
                                </div>

                                {existingRestaurantReview ? (
                                    <div className="cust-existing-review">
                                        {renderStars(existingRestaurantReview.rating, null, true)}
                                        <div className="cust-review-comment-display">
                                            "{existingRestaurantReview.comment}"
                                        </div>
                                        <div className="cust-review-done-badge">
                                            <CheckCircle size={14} /> Đã đánh giá
                                        </div>
                                    </div>
                                ) : (
                                    <div className="cust-review-form">
                                        <div className="cust-stars-wrapper">
                                            {renderStars(reviewForm.restaurant.rating, (val) => handleRatingChange('restaurant', val))}
                                        </div>
                                        <textarea
                                            className="cust-review-textarea"
                                            placeholder="Chia sẻ cảm nhận của bạn về món ăn..."
                                            value={reviewForm.restaurant.comment}
                                            onChange={(e) => handleCommentChange('restaurant', e.target.value)}
                                        />
                                        <button
                                            className="cust-btn-primary cust-btn-submit-review"
                                            disabled={isSubmitting || reviewForm.restaurant.rating === 0}
                                            onClick={() => submitReview('RESTAURANT')}
                                        >
                                            <span style={{ marginRight: '8px' }}>➤</span> COMPLETE REVIEW
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Driver Review */}
                        <div className="cust-review-col">
                            <div className="cust-detail-card cust-review-card">
                                <h3 className="cust-review-title">Đánh giá tài xế</h3>
                                <div className="cust-review-target">
                                    <div className="cust-driver-avatar-circle-large" style={{ width: '64px', height: '64px', fontSize: '24px', margin: '0 auto 12px' }}>
                                        <Utensils size={28} strokeWidth={1.5} />
                                    </div>
                                    <h4 className="cust-review-name">{driver ? driver.name : "Driver"}</h4>
                                    <p className="cust-review-helper">{driver ? driver.vehicleLicensePlate : "---"}</p>
                                </div>

                                {existingDriverReview ? (
                                    <div className="cust-existing-review">
                                        {renderStars(existingDriverReview.rating, null, true)}
                                        <div className="cust-review-comment-display">
                                            "{existingDriverReview.comment}"
                                        </div>
                                        <div className="cust-review-done-badge">
                                            <CheckCircle size={14} /> Đã đánh giá
                                        </div>
                                    </div>
                                ) : (
                                    <div className="cust-review-form">
                                        <div className="cust-stars-wrapper">
                                            {renderStars(reviewForm.driver.rating, (val) => handleRatingChange('driver', val))}
                                        </div>
                                        <textarea
                                            className="cust-review-textarea"
                                            placeholder="Tài xế có thân thiện không?"
                                            value={reviewForm.driver.comment}
                                            onChange={(e) => handleCommentChange('driver', e.target.value)}
                                        />
                                        <button
                                            className="cust-btn-primary cust-btn-submit-review"
                                            disabled={isSubmitting || reviewForm.driver.rating === 0 || !driver}
                                            onClick={() => submitReview('DRIVER')}
                                        >
                                            <span style={{ marginRight: '8px' }}>➤</span> COMPLETE REVIEW
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetailModal;
