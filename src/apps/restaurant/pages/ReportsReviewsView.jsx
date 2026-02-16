import { useState, useMemo, useEffect } from "react";
import { Star, Check, ThumbsUp, ThumbsDown, Clock, Reply, Loader2 } from "lucide-react";
// import { mockReviews } from "../data/mockRestaurantData"; // Removed
import restaurantAppApi from "../../../api/restaurant/restaurantAppApi";
import "./ReportsReviewsView.css";

const ReportsReviewsView = () => {
    const [filterStar, setFilterStar] = useState("all"); // 'all', 5, 4, 3, 2, 1
    const [reportData, setReportData] = useState({
        averageRating: 0,
        totalReviews: 0,
        responseRate: 0,
        averageResponseTime: 0,
        ratingDistribution: { oneStar: 0, twoStar: 0, threeStar: 0, fourStar: 0, fiveStar: 0 },
        recentReviews: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const res = await restaurantAppApi.getReviewsReport();
                console.log("Reviews Report API Response:", res.data);
                const data = res.data?.data || res.data?.result || {};
                setReportData({
                    averageRating: data.averageRating || 0,
                    totalReviews: data.totalReviews || 0,
                    responseRate: data.responseRate || 0,
                    averageResponseTime: data.averageResponseTime || 0,
                    ratingDistribution: data.ratingDistribution || { oneStar: 0, twoStar: 0, threeStar: 0, fourStar: 0, fiveStar: 0 },
                    recentReviews: Array.isArray(data.recentReviews) ? data.recentReviews : []
                });
            } catch (error) {
                console.error("Failed to fetch reviews report", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    // Data Processing
    const stats = useMemo(() => {
        const total = reportData.totalReviews;
        const avg = reportData.averageRating;
        const responseRate = reportData.responseRate;
        const responseTime = reportData.averageResponseTime;

        // Calculate positive/negative from distribution
        const dist = reportData.ratingDistribution;
        const positive = (dist.fourStar || 0) + (dist.fiveStar || 0);
        const negative = (dist.oneStar || 0) + (dist.twoStar || 0);

        return { total, avg, responseRate, responseTime, positive, negative };
    }, [reportData]);

    const distribution = useMemo(() => {
        const d = reportData.ratingDistribution;
        return {
            5: d.fiveStar || 0,
            4: d.fourStar || 0,
            3: d.threeStar || 0,
            2: d.twoStar || 0,
            1: d.oneStar || 0
        };
    }, [reportData]);

    const filteredReviews = reportData.recentReviews.filter(r => filterStar === 'all' || r.rating === parseInt(filterStar));
    const limitedReviews = filteredReviews.slice(0, 5); // Show top 5 for demo

    // Mock dish tags generator
    const getTags = (id) => {
        if (!id) return [];
        const strId = id.toString();
        const tags = [
            ["Cơm Tấm Sườn"],
            ["Cơm Tấm Sườn", "Chả Trứng", "Canh Khổ Qua"],
            ["Bún Bò Huế"],
            ["Trà Đá"]
        ];
        return tags[strId.charCodeAt(strId.length - 1) % tags.length];
    };

    if (loading) {
        return (
            <div className="rrv-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        <div className="rrv-container">
            {/* --- Stats Row --- */}
            <div className="rrv-stats-row">
                {/* Avg Rating - Black */}
                <div className="rrv-stat-card black">
                    <div className="rrv-stars">
                        {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={16} fill={s <= Math.round(stats.avg) ? "#fbbf24" : "none"} stroke={s <= Math.round(stats.avg) ? "none" : "#4b5563"} />
                        ))}
                    </div>
                    <div className="rrv-rating-val">{stats.avg}</div>
                    <div className="rrv-rating-desc">Điểm đánh giá trung bình<br />{stats.total} đánh giá</div>
                </div>

                {/* Response Rate */}
                <div className="rrv-stat-card">
                    <div className="rrv-label">
                        TỶ LỆ PHẢN HỒI
                        <div className="rrv-icon-badge green"><Check size={14} /></div>
                    </div>
                    <div className="rrv-value">{stats.responseRate}%</div>
                    <div className="rrv-progress-bg" style={{ marginTop: 'auto', height: '6px' }}>
                        <div className="rrv-progress-fill" style={{ width: `${stats.responseRate}%` }}></div>
                    </div>
                </div>

                {/* Response Time */}
                <div className="rrv-stat-card">
                    <div className="rrv-label">
                        THỜI GIAN PHẢN HỒI
                        <div className="rrv-icon-badge blue"><Clock size={14} /></div>
                    </div>
                    <div className="rrv-value blue">{stats.responseTime} <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 600 }}>phút</span></div>
                    <div className="rrv-subtext">Trung bình</div>
                </div>

                {/* Sentiment */}
                <div className="rrv-stat-card">
                    <div className="rrv-label">TÍCH CỰC / TIÊU CỰC</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#16a34a', fontWeight: 700 }}>
                            <ThumbsUp size={18} /> {stats.positive}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#ef4444', fontWeight: 700 }}>
                            {stats.negative} <ThumbsDown size={18} />
                        </div>
                    </div>
                    <div className="rrv-progress-bg" style={{ marginTop: '12px', height: '8px', background: '#fee2e2' }}>
                        <div className="rrv-progress-fill" style={{ width: `${(stats.positive / (stats.positive + stats.negative || 1)) * 100}%` }}></div>
                    </div>
                    <div className="rrv-subtext" style={{ textAlign: 'center', marginTop: '8px' }}>
                        {Math.round((stats.positive / (stats.positive + stats.negative || 1)) * 100)}% đánh giá tích cực (4-5 sao)
                    </div>
                </div>
            </div>

            {/* --- Rating Distribution --- */}
            <div className="rrv-dist-section">
                <h3 className="rrv-section-title">Phân Bố Đánh Giá</h3>
                {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="rrv-dist-row">
                        <div className="rrv-star-label">
                            {star} <Star className="rrv-star-icon" fill="#fbbf24" stroke="none" />
                        </div>
                        <div className="rrv-progress-bg">
                            <div
                                className="rrv-progress-fill"
                                style={{ width: `${(distribution[star] / (stats.total || 1)) * 100}%`, opacity: distribution[star] > 0 ? 1 : 0 }}
                            ></div>
                        </div>
                        <div className="rrv-count-label">{distribution[star]}</div>
                        <div className="rrv-percent-label">{Math.round((distribution[star] / (stats.total || 1)) * 100)}%</div>
                    </div>
                ))}
            </div>

            {/* --- Reviews List --- */}
            <div className="rrv-reviews-section">
                <div className="rrv-reviews-header">
                    <h3 className="rrv-section-title" style={{ margin: 0 }}>Đánh Giá Gần Đây <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 400 }}>{filteredReviews.length} đánh giá</span></h3>
                    <div className="rrv-filter-group">
                        <button className={`rrv-filter-btn ${filterStar === 'all' ? 'active' : ''}`} onClick={() => setFilterStar('all')}>Tất cả</button>
                        {[5, 4, 3, 2, 1].map(s => (
                            <button key={s} className={`rrv-filter-btn ${filterStar === s.toString() ? 'active' : ''}`} onClick={() => setFilterStar(s.toString())}>{s} <span style={{ fontSize: '10px' }}>⭐</span></button>
                        ))}
                    </div>
                </div>

                <div className="rrv-list">
                    {limitedReviews.map(review => (
                        <div key={review.id} className="rrv-review-card">
                            <div className="rrv-avatar">
                                {review.customerName ? review.customerName.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div className="rrv-review-content">
                                <div className="rrv-review-top">
                                    <div>
                                        <span className="rrv-user-name">{review.customerName || 'Customer'}</span>
                                        <span className="rrv-review-date">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div className="rrv-review-stars">
                                            {Array(5).fill(0).map((_, i) => (
                                                <Star key={i} size={12} fill={i < review.rating ? "#fbbf24" : "none"} stroke={i < review.rating ? "none" : "#d1d5db"} />
                                            ))}
                                        </div>
                                        <div className="rrv-review-id">#{review.orderId}</div>
                                    </div>
                                </div>

                                <div className="rrv-comment">"{review.comment}"</div>

                                <div className="rrv-tags">
                                    {getTags(review.id).map((tag, i) => (
                                        <span key={i} className="rrv-tag">{tag}</span>
                                    ))}
                                </div>

                                <button className="rrv-reply-link">
                                    <Reply size={14} /> Phản hồi đánh giá
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsReviewsView;
