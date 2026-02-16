import { useState, useMemo, useEffect } from "react";
import { ShoppingBag, AlertCircle, CheckCircle, TrendingUp, Trophy, AlertTriangle, Loader2 } from "lucide-react";
// import { menuData } from "../data/mockRestaurantData"; // Removed
import restaurantAppApi from "../../../api/restaurant/restaurantAppApi";
import "./ReportsMenuView.css";

const formatVndCompact = (n) => {
    return Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
};

const ReportsMenuView = () => {
    const [viewMode, setViewMode] = useState("best"); // 'best' or 'improve'
    const [reportData, setReportData] = useState({
        totalDishes: 0,
        activeDishes: 0,
        outOfStockDishes: 0,
        topSellingDishes: [],
        lowPerformingDishes: [],
        categoryBreakdown: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true);
            try {
                const res = await restaurantAppApi.getMenuReport();
                console.log("Menu Report API Response:", res.data);
                const data = res.data?.data || res.data?.result || {};
                setReportData({
                    totalDishes: data.totalDishes || 0,
                    activeDishes: data.activeDishes || 0,
                    outOfStockDishes: data.outOfStockDishes || 0,
                    topSellingDishes: Array.isArray(data.topSellingDishes) ? data.topSellingDishes : [],
                    lowPerformingDishes: Array.isArray(data.lowPerformingDishes) ? data.lowPerformingDishes : [],
                    categoryBreakdown: Array.isArray(data.categoryBreakdown) ? data.categoryBreakdown : []
                });
            } catch (error) {
                console.error("Failed to fetch menu report", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    // Process Data
    const stats = useMemo(() => {
        const totalItems = reportData.totalDishes;
        const selling = reportData.activeDishes;
        const outOfStock = reportData.outOfStockDishes;

        // Calculate total revenue from category breakdown or sum of items if available
        const totalRevenue = reportData.categoryBreakdown.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);

        return { totalItems, selling, outOfStock, totalRevenue };
    }, [reportData]);

    const categoryData = useMemo(() => {
        return reportData.categoryBreakdown.map(c => ({
            name: c.categoryName,
            count: c.totalDishes,
            revenue: c.totalRevenue
        })).sort((a, b) => b.revenue - a.revenue);
    }, [reportData]);

    const rankedItems = useMemo(() => {
        if (viewMode === 'best') {
            return reportData.topSellingDishes.map(i => ({
                id: i.dishId,
                name: i.dishName,
                category: i.categoryName,
                salesCount: i.totalOrdered,
                revenue: i.totalRevenue,
                trend: i.trend === 'up' ? 1 : i.trend === 'down' ? -1 : 0, // normalize 'stable' etc
                trendVal: i.trendPercent
            }));
        } else {
            return reportData.lowPerformingDishes.map(i => ({
                id: i.dishId,
                name: i.dishName,
                category: i.categoryName,
                salesCount: i.totalOrdered,
                revenue: i.totalRevenue,
                trend: i.trend === 'up' ? 1 : i.trend === 'down' ? -1 : 0,
                trendVal: i.trendPercent
            }));
        }
    }, [reportData, viewMode]);

    if (loading) {
        return (
            <div className="rmv-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        <div className="rmv-container">
            {/* --- Stats Grid --- */}
            <div className="rmv-stats-grid">
                {/* Total Items - Gray */}
                <div className="rmv-stat-card gray">
                    <div>
                        <div className="rmv-label">TỔNG MÓN <ShoppingBag size={14} /></div>
                        <div className="rov-value">{stats.totalItems}</div>
                    </div>
                </div>

                {/* Selling - Green */}
                <div className="rmv-stat-card green">
                    <div>
                        <div className="rmv-label">ĐANG BÁN <CheckCircle size={14} /></div>
                        <div className="rov-value" style={{ color: '#166534' }}>{stats.selling}</div>
                    </div>
                </div>

                {/* Out of Stock - Red */}
                <div className="rmv-stat-card red">
                    <div>
                        <div className="rmv-label">HẾT HÀNG <AlertTriangle size={14} /></div>
                        <div className="rov-value" style={{ color: '#991B1B' }}>{stats.outOfStock}</div>
                    </div>
                </div>

                {/* Revenue - Black */}
                <div className="rmv-stat-card black">
                    <div>
                        <div className="rmv-label">TỔNG DOANH THU</div>
                        <div className="rov-value" style={{ color: '#84cc16' }}>{formatVndCompact(stats.totalRevenue)}</div>
                    </div>
                    <div className="rmv-subtext">Từ thực đơn</div>
                </div>
            </div>

            {/* --- Charts Row --- */}
            <div className="rmv-charts-row">
                {/* Category Dist */}
                <div className="rmv-chart-card">
                    <h3 className="rmv-card-title">Phân Bố Danh Mục</h3>
                    <div className="rmv-donut-wrapper">
                        <div className="rmv-donut-chart" style={{
                            background: `conic-gradient(
                                #84cc16 0% 60%, 
                                #111827 60% 90%, 
                                #3b82f6 90% 100%
                            )`
                        }}>
                            <div className="rmv-donut-hole"></div>
                        </div>
                    </div>
                    <div className="rmv-donut-legend">
                        {categoryData.slice(0, 3).map((c, i) => (
                            <div key={i} className="rmv-legend-item">
                                <div className="dot" style={{ background: i === 0 ? '#84cc16' : i === 1 ? '#111827' : '#3b82f6' }}></div>
                                {c.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Revenue by Cat */}
                <div className="rmv-chart-card">
                    <h3 className="rmv-card-title">Doanh Thu Theo Danh Mục</h3>
                    <div className="rmv-rev-list">
                        {categoryData.slice(0, 3).map((c, i) => (
                            <div key={i} className="rmv-rev-item">
                                <div className="rmv-rev-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div className="dot" style={{ background: i === 0 ? '#84cc16' : i === 1 ? '#111827' : '#3b82f6' }}></div>
                                        {c.name}
                                    </div>
                                    <div className="rmv-rev-meta">
                                        {c.count} món <span className="rmv-rev-val">{formatVndCompact(c.revenue)}</span>
                                    </div>
                                </div>
                                <div className="rmv-progress-bg">
                                    <div className="rmv-progress-fill" style={{
                                        width: `${(c.revenue / (stats.totalRevenue || 1)) * 100}%`,
                                        background: i === 0 ? '#84cc16' : i === 1 ? '#111827' : '#3b82f6'
                                    }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Item Performance --- */}
            <div className="rmv-perf-section">
                <div className="rmv-perf-header">
                    <div className="rmv-perf-title-group">
                        <div className="rmv-perf-icon-box">
                            {viewMode === 'best' ? <Trophy size={20} /> : <TrendingUp size={20} />}
                        </div>
                        <div>
                            <h3 className="rmv-perf-title">{viewMode === 'best' ? 'Món Bán Chạy' : 'Món Cần Cải Thiện'}</h3>
                            <p className="rmv-perf-subtitle">{viewMode === 'best' ? 'Top 5 món có doanh số cao nhất' : 'Các món cần xem xét'}</p>
                        </div>
                    </div>

                    <div className="rmv-toggle-group">
                        <button
                            className={`rmv-toggle-btn ${viewMode === 'best' ? 'active' : ''}`}
                            onClick={() => setViewMode('best')}
                        >
                            🔥 Bán chạy
                        </button>
                        <button
                            className={`rmv-toggle-btn ${viewMode === 'improve' ? 'active' : ''}`}
                            onClick={() => setViewMode('improve')}
                        >
                            ⚠️ Cần cải thiện
                        </button>
                    </div>
                </div>

                <div className="rmv-perf-grid">
                    {rankedItems.map((item, index) => (
                        <div key={item.id} className="rmv-item-card">
                            <div className="rmv-rank-badge">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                            </div>
                            <div className="rmv-trend">
                                {item.trend > 0 ? '-' : '↘'} {item.trendVal}%
                            </div>

                            <div className="rmv-item-content">
                                <div className="rmv-item-name" title={item.name}>{item.name}</div>
                                <div className="rmv-item-cat">{item.category?.toUpperCase() || 'MÓN CHÍNH'}</div>

                                <div className="rmv-item-stats">
                                    <div className="rmv-stat-box">
                                        <span className="rmv-stat-val-sm">ĐÃ BÁN</span>
                                        <span className="rmv-stat-val-lg-black">{item.salesCount}</span>
                                    </div>
                                    <div className="rmv-stat-box" style={{ alignItems: 'flex-end' }}>
                                        <span className="rmv-stat-val-sm">DOANH THU</span>
                                        <span className="rmv-stat-val-lg">{formatVndCompact(item.revenue)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsMenuView;
