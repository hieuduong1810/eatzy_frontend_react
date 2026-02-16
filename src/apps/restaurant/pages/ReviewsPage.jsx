import { useState, useEffect } from "react";
import { Star, Trophy, MessageSquare, ChevronDown } from "lucide-react";
import restaurantAppApi from "../../../api/restaurant/restaurantAppApi";
import "./ReviewsPage.css";

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortOption, setSortOption] = useState("newest");

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await restaurantAppApi.getReviews();
            if (response && response.data) {
                // Adjust this based on actual API response structure
                const fetchedReviews = response.data.data || [];
                const normalizedReviews = fetchedReviews.map(r => ({
                    ...r,
                    customerName: r.customer?.name || r.customerName || "Unknown",
                    orderId: r.order?.id || r.orderId || "?",
                    // Ensure other fields are accessible if needed
                }));
                setReviews(normalizedReviews);
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Stats
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
        : "0.0";

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
        if (ratingCounts[r.rating] !== undefined) ratingCounts[r.rating]++;
    });

    const ratingDist = [5, 4, 3, 2, 1].map(stars => ({
        stars,
        count: ratingCounts[stars],
        pct: totalReviews > 0 ? (ratingCounts[stars] / totalReviews) * 100 : 0
    }));

    // Filter & Sort
    const filteredReviews = reviews.filter(r =>
        (r.comment && r.comment.toLowerCase().includes(search.toLowerCase())) ||
        (r.customerName && r.customerName.toLowerCase().includes(search.toLowerCase()))
    );

    // Mock sort for now
    // In real app, might fetch sorted data or sort locally by date
    // filteredReviews.sort(...)

    if (loading) return <div className="p-8">Loading reviews...</div>;

    return (
        <div className="resto-reviews-page">
            {/* Header */}
            <div className="resto-reviews-header">
                <div className="resto-reviews-title-row">
                    <span className="badge-feedback">
                        <MessageSquare size={14} /> CUSTOMER FEEDBACK
                    </span>
                    {/* <span className="badge-pending">2 CHƯA PHẢN HỒI</span> */}
                </div>
                <h1 className="resto-reviews-title">REVIEWS & FEEDBACK</h1>
                <p className="resto-reviews-subtitle">Monitor customer satisfaction and ratings.</p>
            </div>

            <div className="resto-reviews-content">
                {/* Left Column: Stats */}
                <div className="reviews-stats-card">
                    {/* Overall Score */}
                    <div className="overall-rating-section">
                        <div className="big-rating-number">
                            <Trophy className="trophy-icon" color="#D97706" fill="#FBBF24" />
                            {avgRating.replace('.', ',')}
                            <Trophy className="trophy-icon" color="#D97706" fill="#FBBF24" />
                        </div>
                        <div className="rating-label">ĐƯỢC KHÁCH YÊU THÍCH</div>
                        <div className="rating-subtext">Dựa trên {totalReviews} đánh giá từ khách hàng.</div>
                    </div>

                    {/* Breakdown */}
                    <div className="rating-breakdown">
                        <div className="rating-breakdown-title">RATING BREAKDOWN</div>
                        {ratingDist.map(({ stars, count, pct }) => (
                            <div key={stars} className="rating-bar-row">
                                <div className="rating-star-label">
                                    {stars} <Star size={10} style={{ marginLeft: 2, marginTop: 2 }} />
                                </div>
                                <div className="rating-bar-bg">
                                    <div className="rating-bar-fill" style={{ width: `${pct}%` }}></div>
                                </div>
                                <div className="rating-count-label">{count}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: List */}
                <div className="reviews-list-section">
                    <div className="reviews-list-header">
                        <div className="reviews-count-heading">
                            <span className="reviews-count-number">{filteredReviews.length}</span>
                            CUSTOMER REVIEWS
                        </div>
                        <select
                            className="reviews-filter-dropdown"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="newest">Phù hợp nhất</option>
                            <option value="oldest">Mới nhất</option>
                            <option value="rating_high">Đánh giá cao</option>
                            <option value="rating_low">Đánh giá thấp</option>
                        </select>
                    </div>

                    <div className="search-wrapper relative mb-6">
                        <input
                            type="text"
                            className="reviews-search-input"
                            placeholder="Search reviews by content or customer name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="absolute left-3 top-3 text-gray-400">
                            <SearchIconSmall />
                        </div>
                    </div>

                    <div className="reviews-list">
                        {filteredReviews.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No reviews found.</div>
                        ) : (
                            filteredReviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReviewCard = ({ review }) => {
    // Assuming review.createdAt is ISO string
    const date = new Date(review.createdAt);
    const dateStr = date.toLocaleDateString("vi-VN"); // or relative time logic "3 ngày trước"

    return (
        <div className="review-card">
            <div className="review-card-header">
                <div className="review-user-info">
                    <div className="review-avatar-placeholder">
                        <MessageSquare size={20} />
                    </div>
                    <div className="review-user-details">
                        <h4>{review.customerName}</h4>
                        <div className="review-order-id">ĐƠN #{review.orderId}</div>
                    </div>
                </div>
                <div className="review-meta">
                    <div className="review-stars">
                        {[1, 2, 3, 4, 5].map(s => (
                            <Star
                                key={s}
                                size={14}
                                fill={s <= review.rating ? "#FACC15" : "#E5E7EB"}
                                color={s <= review.rating ? "#FACC15" : "#E5E7EB"}
                            />
                        ))}
                    </div>
                    <div className="review-date">{dateStr}</div>
                </div>
            </div>

            {review.comment && (
                <div className="review-content-box">
                    "{review.comment}"
                </div>
            )}

            <button className="review-reply-action">
                <MessageSquare size={14} /> Phản hồi đánh giá
            </button>
        </div>
    );
};

const SearchIconSmall = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

export default ReviewsPage;
