import { useState, useEffect } from "react";
import { ShoppingBag, DollarSign, TrendingUp, Users, BarChart3, Calendar, ChevronDown, Download, Pizza, Star, CheckCircle, XCircle, Search, ThumbsUp, ThumbsDown, MessageCircle, ArrowRight, Loader2, Percent, Tag } from "lucide-react";
// import { mockOrderHistory } from "../data/mockRestaurantData"; // Removed mock data import
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "../RestaurantApp.css";
import "./ReportsPage.css";

import HistoryPage from "./HistoryPage";
import ReportsOrdersView from "./ReportsOrdersView";
import ReportsMenuView from "./ReportsMenuView";
import ReportsReviewsView from "./ReportsReviewsView";
import MenuPage from "./MenuPage";
import ReviewsPage from "./ReviewsPage";
import restaurantAppApi from "../../../api/restaurant/restaurantAppApi";

const formatVnd = (n) => Intl.NumberFormat("vi-VN").format(n) + "đ";

const MonthPicker = ({ selectedDate, onChange, onClose }) => {
    const [year, setYear] = useState(selectedDate.getFullYear());
    const months = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    const handleMonthClick = (index) => {
        const newDate = new Date(year, index, 1);
        onChange(newDate);
        onClose();
    };

    return (
        <div className="rp-month-picker-popover">
            <div className="rp-mp-header">
                <button onClick={() => setYear(year - 1)}>&lt;</button>
                <span>{year}</span>
                <button onClick={() => setYear(year + 1)}>&gt;</button>
            </div>
            <div className="rp-mp-grid">
                {months.map((m, i) => (
                    <button
                        key={m}
                        className={`rp-mp-month ${selectedDate.getMonth() === i && selectedDate.getFullYear() === year ? "active" : ""}`}
                        onClick={() => handleMonthClick(i)}
                    >
                        {m}
                    </button>
                ))}
            </div>
        </div>
    );
};

const ReportsPage = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Date Filtering State
    const [dateRange, setDateRange] = useState(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of month
        return { startDate: start, endDate: end, displayDate: start };
    });

    const handleDateChange = (newDate) => {
        const start = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
        const end = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
        setDateRange({ startDate: start, endDate: end, displayDate: start });
    };

    const [overviewData, setOverviewData] = useState({
        totalRevenue: 0,
        netRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        completionRate: 0,
        averageRating: 0,
        totalReviews: 0,
        topPerformingDish: "",
        dailyData: []
    });
    const [revenueData, setRevenueData] = useState({
        totalRevenue: 0,
        totalCommission: 0,
        totalDiscount: 0,
        dailyData: []
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const params = {
                    startDate: dateRange.startDate.toISOString(),
                    endDate: dateRange.endDate.toISOString()
                };

                if (activeTab === "overview") {
                    const res = await restaurantAppApi.getOverviewReport(params);
                    const data = res.data?.data || {};
                    // Map API data to component state
                    setOverviewData({
                        totalRevenue: data.totalRevenue || 0,
                        netRevenue: data.netRevenue || 0,
                        totalOrders: data.totalOrders || 0,
                        avgOrderValue: data.averageOrderValue || 0,
                        completedOrders: data.completedOrders || 0,
                        cancelledOrders: data.cancelledOrders || 0,
                        averageRating: data.averageRating || 0,
                        totalReviews: data.totalReviews || 0,
                        topPerformingDish: data.topPerformingDish || "",
                        // Calculate completion rate if not provided directly, or use cancelRate
                        completionRate: data.totalOrders > 0 ? ((data.completedOrders / data.totalOrders) * 100).toFixed(1) : 0,
                        dailyData: Array.isArray(data.revenueChart) ? data.revenueChart.map(d => ({
                            ...d,
                            foodRevenue: d.foodRevenue, // Gross
                            netRevenue: d.netRevenue // Net (Real)
                        })) : []
                    });
                } else if (activeTab === "revenue") {
                    const res = await restaurantAppApi.getRevenueReport(params);
                    // API returns array directly in data
                    const dailyList = Array.isArray(res.data?.data) ? res.data.data : [];

                    // Calculate totals from the list
                    const totalRev = dailyList.reduce((sum, item) => sum + (item.foodRevenue || 0), 0);
                    const totalComm = dailyList.reduce((sum, item) => sum + (item.commissionAmount || 0), 0);
                    const totalDisc = dailyList.reduce((sum, item) => sum + (item.discountAmount || 0), 0);
                    const totalNet = dailyList.reduce((sum, item) => sum + (item.netRevenue || 0), 0);

                    setRevenueData({
                        totalRevenue: totalRev,
                        totalCommission: totalComm,
                        totalDiscount: totalDisc,
                        totalNetRevenue: totalNet,
                        dailyData: dailyList.map(d => ({
                            ...d,
                            foodRevenue: d.foodRevenue,
                            netRevenue: d.netRevenue || (d.foodRevenue - (d.commissionAmount || 0) - (d.discountAmount || 0)) // Fallback if needed, though API has it
                        }))
                    });
                }
            } catch (error) {
                console.error("Failed to fetch report data", error);
            } finally {
                setLoading(false);
            }
        };

        if (['overview', 'revenue'].includes(activeTab)) {
            fetchData();
        }
    }, [activeTab, dateRange]);

    const tabs = [
        { id: "overview", label: "Tổng Quan", icon: BarChart3 },
        { id: "revenue", label: "Doanh Thu", icon: DollarSign },
        { id: "orders", label: "Đơn Hàng", icon: ShoppingBag },
        { id: "menu", label: "Thực Đơn", icon: Pizza },
        { id: "reviews", label: "Đánh Giá", icon: Star },
    ];

    // Metrics for Overview (mapped from API data)
    const metrics = [
        { icon: ShoppingBag, label: "Tổng đơn hàng", value: overviewData.totalOrders, color: "#3B82F6" },
        { icon: DollarSign, label: "Tổng doanh thu", value: formatVnd(overviewData.totalRevenue), color: "#16A34A" },
        { icon: TrendingUp, label: "Giá trị TB/đơn", value: formatVnd(overviewData.avgOrderValue), color: "#F59E0B" },
        { icon: Users, label: "Hoàn thành", value: `${overviewData.completedOrders} (${overviewData.completionRate}%)`, color: "#8B5CF6" },
    ];

    const dailyDataForChart = (activeTab === 'overview' ? overviewData.dailyData : revenueData.dailyData) || [];
    const maxRevenue = Math.max(...dailyDataForChart.map((d) => d.revenue || 0), 1);

    return (
        <div className="resto-page">
            {/* Header */}
            <div className="rp-header">
                <div className="rp-title-group">
                    <span className="rp-badge">
                        <BarChart3 size={14} /> RESTAURANT ANALYTICS
                    </span>
                    <h1 className="rp-title">Reports Center</h1>
                </div>
                <div className="rp-controls">
                    <div style={{ position: 'relative' }}>
                        <button
                            className="rp-date-picker"
                            onClick={() => setShowDatePicker(!showDatePicker)}
                        >
                            <Calendar size={18} />
                            <span>tháng {dateRange.displayDate.getMonth() + 1} {dateRange.displayDate.getFullYear()}</span>
                            <ChevronDown size={16} />
                        </button>
                        {showDatePicker && (
                            <>
                                <div className="rp-mp-overlay" onClick={() => setShowDatePicker(false)}></div>
                                <MonthPicker
                                    selectedDate={dateRange.displayDate}
                                    onChange={handleDateChange}
                                    onClose={() => setShowDatePicker(false)}
                                />
                            </>
                        )}
                    </div>
                    <button className="rp-btn-black">
                        Xuất Báo Cáo <ChevronDown size={16} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="rp-tabs">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <div
                            key={tab.id}
                            className={`rp-tab ${activeTab === tab.id ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </div>
                    );
                })}
            </div>

            {loading && (
                <div className="rp-loading-container">
                    <div className="rp-custom-loader">
                        <div className="rp-loader-track"></div>
                        <div className="rp-loader-spinner"></div>
                        <div className="rp-loader-center"></div>
                    </div>
                    <p className="rp-loading-text">Đang phân tích dữ liệu...</p>
                </div>
            )}

            {!loading && activeTab === "overview" && (
                <>
                    {/* Metrics Grid - New Design */}
                    <div className="rp-metrics-grid-new">
                        {/* Card 1: Total Revenue (White) */}
                        <div className="rp-metric-card">
                            <div className="rp-card-header">
                                <span className="rp-card-title">TỔNG DOANH THU</span>
                                <div className="rp-icon-bg"><DollarSign size={40} color="#ecfccb" /></div>
                            </div>
                            <div className="rp-card-value">{formatVnd(overviewData.totalRevenue)}</div>
                            <div className="rp-card-subtext">
                                <span className="text-green-600">↗ +12%</span> Doanh thu gộp
                            </div>
                        </div>

                        {/* Card 2: Net Revenue (White) */}
                        <div className="rp-metric-card">
                            <div className="rp-card-header">
                                <span className="rp-card-title">DOANH THU THỰC</span>
                                <div className="rp-icon-bg"><TrendingUp size={40} color="#dbeafe" /></div>
                            </div>
                            <div className="rp-card-value">{formatVnd(overviewData.netRevenue)}</div>
                            <div className="rp-card-subtext">
                                <span className="text-green-600">↗ +8%</span> Sau hoa hồng
                            </div>
                        </div>

                        {/* Card 3: Total Orders (White) */}
                        <div className="rp-metric-card">
                            <div className="rp-card-header">
                                <span className="rp-card-title">TỔNG ĐƠN HÀNG</span>
                                <div className="rp-icon-bg"><ShoppingBag size={40} color="#f3e8ff" /></div>
                            </div>
                            <div className="rp-card-value">{overviewData.totalOrders}</div>
                            <div className="rp-card-subtext">
                                1 hoàn thành
                            </div>
                        </div>

                        {/* Card 4: Avg Rating (Black) */}
                        <div className="rp-metric-card dark">
                            <div className="rp-card-header">
                                <span className="rp-card-title">ĐÁNH GIÁ TB</span>
                                <div className="rp-icon-bg dark-icon"><Star size={40} color="#3f3f46" /></div>
                            </div>
                            <div className="rp-card-value text-green">{overviewData.averageRating}</div>
                            <div className="rp-card-subtext" style={{ color: '#a1a1aa' }}>
                                {overviewData.totalReviews} đánh giá
                            </div>
                        </div>
                    </div>

                    {/* Best Seller Banner */}
                    <div style={{ background: '#ecfccb', padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
                        <div style={{ width: '64px', height: '64px', background: '#d9f99d', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                            👑
                        </div>
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: 800, color: '#4d7c0f', background: '#d9f99d', width: 'fit-content', padding: '2px 8px', borderRadius: '6px', marginBottom: '8px' }}>BEST SELLER</div>
                            <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#1a2e05', marginBottom: '4px' }}>{overviewData.topPerformingDish}</h3>
                            <p style={{ color: '#365314', fontSize: '14px', maxWidth: '600px' }}>Món ăn bán chạy nhất trong tháng này, chiếm tỷ lệ cao nhất trong tổng doanh thu của nhà hàng.</p>
                        </div>
                    </div>

                    {/* Charts & Status Section */}
                    <div className="rp-grid-2-1">
                        <div className="rp-card" style={{ padding: '24px', height: '400px' }}>
                            <div className="rp-metric-label" style={{ marginBottom: '24px', fontSize: '18px', color: '#111827' }}>Xu Hướng Doanh Thu</div>
                            <div style={{ width: '100%', height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={overviewData.dailyData}
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#84cc16" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                                            tickFormatter={(date) => {
                                                const d = new Date(date);
                                                return `${d.getDate() < 10 ? '0' + d.getDate() : d.getDate()}-${d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1}`;
                                            }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                                            tickFormatter={(val) => {
                                                if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                                                if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                                                return val;
                                            }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                borderRadius: '12px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                                border: 'none',
                                                padding: '12px'
                                            }}
                                            formatter={(value, name) => [formatVnd(value), name === 'foodRevenue' ? 'Doanh thu món' : 'Doanh thu thực']}
                                            labelFormatter={(label) => {
                                                const d = new Date(label);
                                                return d.toLocaleDateString("vi-VN");
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="netRevenue" // Real Revenue (Solid Green)
                                            stackId="2"
                                            stroke="#84cc16"
                                            strokeWidth={3}
                                            fill="url(#colorRevenue)"
                                            activeDot={{ r: 6, fill: "#fff", stroke: "#84cc16", strokeWidth: 2 }}
                                        />
                                        <Area
                                            type="monotone"
                                            // Mocking same data for dashed line effect from screenshot if needed, or better, calculate a "Potential" vs "Real"
                                            // For now just one main line as per user request "like this" but user screenshot shows dashed line too.
                                            // The dashed line in screenshot seems to be a projection or a comparison. 
                                            // I'll add a second area if I can derive data, but for now let's stick to the main solid green line which matches the "Net" or "Real" revenue.
                                            // Wait, the screenshot shows a dashed BLACK line with a higher peak, and a solid GREEN line with a lower peak.
                                            // Dashed might be "Total Revenue" vs "Net Revenue".
                                            // Let's verify data keys.
                                            // I will map `revenue` (foodRevenue) to the Dashed line (Gross), and `revenue * 0.8` to Solid Green (Net).
                                            dataKey="foodRevenue" // Total Revenue (Dashed Black)
                                            stroke="#000"
                                            strokeDasharray="5 5"
                                            fill="none"
                                            dot={false}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Order Status Stats */}
                        <div className="rp-card">
                            <div className="rp-metric-label" style={{ marginBottom: '24px' }}>Tình Trạng Đơn Hàng</div>

                            {(() => {
                                const completed = overviewData.completedOrders || 0;
                                const cancelled = overviewData.cancelledOrders || 0;
                                const total = completed + cancelled;

                                const pctCompleted = total > 0 ? (completed / total) * 100 : 0;
                                const pctCancelled = total > 0 ? (cancelled / total) * 100 : 0;

                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div>
                                            {/* Completed Row */}
                                            <div className="rp-status-row" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div className="rp-status-left" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                    <div className="rp-status-icon-box success" style={{ background: '#dcfce7', color: '#16a34a', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <CheckCircle size={20} strokeWidth={2.5} />
                                                    </div>
                                                    <div className="rp-status-info">
                                                        <h4 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#111827' }}>Hoàn thành</h4>
                                                        <p style={{ fontSize: '13px', margin: 0, color: '#6b7280' }}>{completed} đơn</p>
                                                    </div>
                                                </div>
                                                <div className="rp-status-pct success" style={{ fontSize: '18px', fontFamily: 'Antonio, sans-serif', fontWeight: '800', color: '#16a34a' }}>{Math.round(pctCompleted)}%</div>
                                            </div>

                                            {/* Cancelled Row */}
                                            <div className="rp-status-row" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div className="rp-status-left" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                    <div className="rp-status-icon-box error" style={{ background: '#fee2e2', color: '#ef4444', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <XCircle size={20} strokeWidth={2.5} />
                                                    </div>
                                                    <div className="rp-status-info">
                                                        <h4 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#111827' }}>Đã hủy</h4>
                                                        <p style={{ fontSize: '13px', margin: 0, color: '#6b7280' }}>{cancelled} đơn</p>
                                                    </div>
                                                </div>
                                                <div className="rp-status-pct error" style={{ fontSize: '18px', fontFamily: 'Antonio, sans-serif', fontWeight: '800', color: '#ef4444' }}>{Math.round(pctCancelled)}%</div>
                                            </div>

                                            {/* Single Progress Bar */}
                                            <div className="rp-progress-bar-single" style={{ height: '12px', background: '#f3f4f6', borderRadius: '6px', overflow: 'hidden', display: 'flex', width: '100%' }}>
                                                <div style={{ width: `${pctCompleted}%`, height: '100%', background: '#16a34a', borderRadius: '6px 0 0 6px' }}></div>
                                                <div style={{ width: `${pctCancelled}%`, height: '100%', background: '#ef4444', borderRadius: '0 6px 6px 0' }}></div>
                                            </div>
                                        </div>

                                        {/* Footer Stats */}
                                        {/* Footer Stats */}
                                        <div className="rp-stat-footer" style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                            <div className="rp-stat-item" style={{ textAlign: 'center' }}>
                                                <div className="rp-stat-label" style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase' }}>GIÁ TRỊ TB</div>
                                                <div className="rp-stat-val" style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Antonio, sans-serif', color: '#111827' }}>
                                                    {Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(overviewData.avgOrderValue)}
                                                </div>
                                            </div>
                                            <div className="rp-stat-item" style={{ textAlign: 'center' }}>
                                                <div className="rp-stat-label" style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase' }}>ĐÁNH GIÁ</div>
                                                <div className="rp-stat-val" style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Antonio, sans-serif', color: '#111827' }}>4.8</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </>
            )}

            {!loading && activeTab === "revenue" && (
                <>
                    {/* Revenue Metrics */}
                    {/* Revenue Metrics */}
                    {/* Revenue Metrics - New Design */}
                    <div className="rp-metrics-grid-new">
                        {/* Card 1: Total Revenue (White) */}
                        <div className="rp-metric-card">
                            <div className="rp-card-header">
                                <span className="rp-card-title">TỔNG DOANH THU</span>
                                <div className="rp-icon-bg"><DollarSign size={40} color="#16a34a" /></div>
                            </div>
                            <div className="rp-card-value text-green">{formatVnd(revenueData.totalRevenue)}</div>
                            <div className="rp-card-subtext">
                                <span className="text-green-600">↗ +12%</span> Doanh thu gộp
                            </div>
                        </div>

                        {/* Card 2: Net Revenue (White) */}
                        <div className="rp-metric-card">
                            <div className="rp-card-header">
                                <span className="rp-card-title">DOANH THU THỰC</span>
                                <div className="rp-icon-bg"><TrendingUp size={40} color="#2563eb" /></div>
                            </div>
                            <div className="rp-card-value">{formatVnd(revenueData.totalNetRevenue)}</div>
                            <div className="rp-card-subtext">
                                <span className="text-green-600">↗ +8%</span> Sau hoa hồng
                            </div>
                        </div>

                        {/* Card 3: Commission (White) */}
                        <div className="rp-metric-card">
                            <div className="rp-card-header">
                                <span className="rp-card-title">HOA HỒNG PLATFORM</span>
                                <div className="rp-icon-bg"><Percent size={40} color="#d97706" /></div>
                            </div>
                            <div className="rp-card-value text-blue">{formatVnd(revenueData.totalCommission)}</div>
                            <div className="rp-card-subtext">
                                {((revenueData.totalCommission / (revenueData.totalRevenue || 1)) * 100).toFixed(1)}% tổng doanh thu
                            </div>
                        </div>

                        {/* Card 4: Discount (Dark) */}
                        <div className="rp-metric-card dark">
                            <div className="rp-card-header">
                                <span className="rp-card-title">GIẢM GIÁ</span>
                                <div className="rp-icon-bg dark-icon"><Tag size={40} color="#db2777" /></div>
                            </div>
                            <div className="rp-card-value text-red">{formatVnd(revenueData.totalDiscount)}</div>
                            <div className="rp-card-subtext" style={{ color: '#a1a1aa' }}>
                                Đã áp dụng cho khách hàng
                            </div>
                        </div>
                    </div>

                    {/* Revenue Chart */}
                    <div className="rp-card" style={{ marginBottom: '24px' }}>
                        <div className="rp-card-header" style={{ marginBottom: '24px' }}>
                            <div className="rp-card-title">XU HƯỚNG DOANH THU</div>
                        </div>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData.dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#84cc16" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        dy={10}
                                        tickFormatter={(str) => {
                                            const parts = str.split('-');
                                            if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
                                            return str;
                                        }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        tickFormatter={(val) => Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(val)}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value, name) => [formatVnd(value), name === 'foodRevenue' ? 'Doanh thu món' : 'Doanh thu thực']}
                                        labelFormatter={(label) => `Ngày ${label}`}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="netRevenue" // Real Revenue (Green)
                                        stackId="2"
                                        stroke="#84cc16"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="foodRevenue" // Dish Revenue (Dashed Black)
                                        stackId="1"
                                        stroke="#000"
                                        strokeDasharray="5 5"
                                        fill="none"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Daily Detail Table */}
                    <div className="rp-card">
                        <div className="rp-table-title">Chi Tiết Theo Ngày</div>
                        <table className="rp-table">
                            <thead>
                                <tr>
                                    <th>NGÀY</th>
                                    <th className="text-right">DOANH THU MÓN</th>
                                    <th className="text-right">HOA HỒNG</th>
                                    <th className="text-right">GIẢM GIÁ</th>
                                    <th className="text-right">THỰC NHẬN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {revenueData.dailyData.map((d, i) => (
                                    <tr key={i}>
                                        <td>{d.date}/2026</td>
                                        <td className="text-right">{formatVnd(d.foodRevenue)}</td>
                                        <td className="text-right">{formatVnd(d.commissionAmount)}</td>
                                        <td className="text-right">{formatVnd(d.discountAmount)}</td>
                                        <td className="text-right text-green">{formatVnd(d.netRevenue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Content for Orders Tab */}
            {activeTab === "orders" && <ReportsOrdersView startDate={dateRange.startDate} endDate={dateRange.endDate} />}

            {/* Content for Menu Tab */}
            {activeTab === "menu" && <ReportsMenuView />}

            {/* Content for Reviews Tab */}
            {activeTab === "reviews" && <ReportsReviewsView />}
        </div>
    );
};

export default ReportsPage;

const SkeletonReportsPage = () => {
    return (
        <div className="resto-page">
            <div className="rp-skeleton-header">
                <div className="rp-skeleton-title-group">
                    <div className="skeleton-block" style={{ width: 150, height: 24 }}></div>
                    <div className="skeleton-block" style={{ width: 300, height: 48 }}></div>
                </div>
                <div className="rp-skeleton-controls">
                    <div className="skeleton-block" style={{ width: 180, height: 40 }}></div>
                    <div className="skeleton-block" style={{ width: 140, height: 40 }}></div>
                </div>
            </div>

            <div className="rp-skeleton-tabs">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="skeleton-block rp-skeleton-tab"></div>
                ))}
            </div>

            <div className="rp-skeleton-grid">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="rp-skeleton-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className="skeleton-block" style={{ width: 100, height: 16 }}></div>
                            <div className="skeleton-block" style={{ width: 40, height: 40, borderRadius: 12 }}></div>
                        </div>
                        <div className="skeleton-block" style={{ width: 120, height: 32 }}></div>
                        <div className="skeleton-block" style={{ width: 80, height: 16 }}></div>
                    </div>
                ))}
            </div>

            <div className="rp-grid-2-1">
                <div className="rp-skeleton-chart">
                    <div className="skeleton-block" style={{ width: 200, height: 24, marginBottom: 24 }}></div>
                    <div className="skeleton-block" style={{ width: '100%', height: 300, borderRadius: 12 }}></div>
                </div>
                <div className="rp-skeleton-chart">
                    <div className="skeleton-block" style={{ width: 150, height: 24, marginBottom: 24 }}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <div className="skeleton-block" style={{ width: 40, height: 40, borderRadius: 99 }}></div>
                                    <div>
                                        <div className="skeleton-block" style={{ width: 100, height: 16, marginBottom: 4 }}></div>
                                        <div className="skeleton-block" style={{ width: 60, height: 12 }}></div>
                                    </div>
                                </div>
                                <div className="skeleton-block" style={{ width: 40, height: 24 }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
