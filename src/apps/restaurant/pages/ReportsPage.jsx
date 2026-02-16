import { useState, useEffect } from "react";
import { ShoppingBag, DollarSign, TrendingUp, Users, BarChart3, Calendar, ChevronDown, Download, Pizza, Star, CheckCircle, XCircle, Search, ThumbsUp, ThumbsDown, MessageCircle, ArrowRight, Loader2 } from "lucide-react";
// import { mockOrderHistory } from "../data/mockRestaurantData"; // Removed mock data import
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
        totalOrders: 0,
        avgOrderValue: 0,
        completedOrders: 0,
        completionRate: 0,
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
                        totalOrders: data.totalOrders || 0,
                        avgOrderValue: data.averageOrderValue || 0,
                        completedOrders: data.completedOrders || 0,
                        // Calculate completion rate if not provided directly, or use cancelRate
                        completionRate: data.totalOrders > 0 ? ((data.completedOrders / data.totalOrders) * 100).toFixed(1) : 0,
                        dailyData: Array.isArray(data.revenueChart) ? data.revenueChart.map(d => ({
                            ...d,
                            revenue: d.foodRevenue // Mapping foodRevenue to revenue for chart compatibility
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

                    setRevenueData({
                        totalRevenue: totalRev,
                        totalCommission: totalComm,
                        totalDiscount: totalDisc,
                        dailyData: dailyList.map(d => ({
                            ...d,
                            revenue: d.foodRevenue // Mapping for chart
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
                <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                    <Loader2 className="animate-spin" size={32} />
                </div>
            )}

            {!loading && activeTab === "overview" && (
                <>
                    {/* Metrics Grid */}
                    <div className="rp-metrics-grid">
                        {metrics.map((m, i) => (
                            <div key={i} className="rp-card" style={{ borderColor: i === 3 ? 'transparent' : '', background: i === 3 ? '#F3F4F6' : '' }}>
                                <div className="rp-metric-label">{m.label.toUpperCase()} <m.icon size={16} /></div>
                                <div className="rp-metric-value" style={{ color: m.color }}>{m.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Best Seller Banner */}
                    <div style={{ background: '#ecfccb', padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
                        <div style={{ width: '64px', height: '64px', background: '#d9f99d', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                            👑
                        </div>
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: 800, color: '#4d7c0f', background: '#d9f99d', width: 'fit-content', padding: '2px 8px', borderRadius: '6px', marginBottom: '8px' }}>BEST SELLER</div>
                            <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#1a2e05', marginBottom: '4px' }}>Cơm Gà Nướng</h3>
                            <p style={{ color: '#365314', fontSize: '14px', maxWidth: '600px' }}>Món ăn bán chạy nhất trong tháng này, chiếm tỷ lệ cao nhất trong tổng doanh thu của nhà hàng.</p>
                        </div>
                    </div>

                    {/* Charts & Status Section */}
                    <div className="rp-grid-2-1">
                        {/* Revenue Trends Chart */}
                        <div className="rp-card">
                            <div className="rp-metric-label" style={{ marginBottom: '0' }}>Xu Hướng Doanh Thu</div>
                            <div className="rp-chart-container">
                                {(() => {
                                    // Simple SVG Line Chart Logic
                                    const dataPoints = overviewData.dailyData.map(d => d.revenue);
                                    const max = Math.max(...dataPoints, 100000); // min max to avoid flat line at 0
                                    const width = 600; // viewBox width
                                    const height = 250; // viewBox height
                                    const padding = 20;

                                    const getX = (i) => (i / (dataPoints.length - 1 || 1)) * (width - padding * 2) + padding;
                                    const getY = (val) => height - ((val / max) * (height - padding * 2)) - padding;

                                    const pathD = dataPoints.map((val, i) =>
                                        `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(val)}`
                                    ).join(' ');

                                    return (
                                        <svg viewBox={`0 0 ${width} ${height}`} className="rp-chart-svg" preserveAspectRatio="none">
                                            {/* Grid Lines */}
                                            {[0, 0.33, 0.66, 1].map(p => (
                                                <g key={p}>
                                                    <line
                                                        x1="30" y1={getY(max * p)}
                                                        x2={width} y2={getY(max * p)}
                                                        className="rp-chart-grid-line"
                                                    />
                                                    <text x="0" y={getY(max * p) + 4} className="rp-chart-axis-text">
                                                        {Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(max * p)}
                                                    </text>
                                                </g>
                                            ))}

                                            {/* The Line */}
                                            <path d={pathD} className="rp-chart-line" />

                                            {/* X Axis Labels */}
                                            {overviewData.dailyData.map((d, i) => {
                                                if (i % 2 !== 0 && i !== overviewData.dailyData.length - 1) return null; // Show every 2nd label
                                                const dateParts = d.date.split('-');
                                                const label = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}` : d.date;
                                                return (
                                                    <text key={i} x={getX(i)} y={height + 15} textAnchor="middle" className="rp-chart-axis-text">
                                                        {label}
                                                    </text>
                                                );
                                            })}
                                        </svg>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Order Status Stats */}
                        <div className="rp-card">
                            <div className="rp-metric-label" style={{ marginBottom: '24px' }}>Tình Trạng Đơn Hàng</div>

                            {(() => {
                                const total = overviewData.totalOrders || 1;
                                const completed = overviewData.completedOrders || 0;
                                const cancelled = total - completed; // Simplification as API might not allow cancelled breakdown yet

                                const pctCompleted = overviewData.completionRate;
                                const pctCancelled = (100 - pctCompleted).toFixed(1);

                                return (
                                    <div>
                                        {/* Completed Row */}
                                        <div className="rp-status-group">
                                            <div className="rp-status-row">
                                                <div className="rp-status-left">
                                                    <div className="rp-status-icon-box success"><CheckCircle size={20} strokeWidth={2.5} /></div>
                                                    <div className="rp-status-info">
                                                        <h4>Hoàn thành</h4>
                                                        <p>{completed} đơn</p>
                                                    </div>
                                                </div>
                                                <div className="rp-status-pct success">{pctCompleted}%</div>
                                            </div>
                                            <div className="rp-progress-bar-single">
                                                <div className="rp-progress-fill success" style={{ width: `${pctCompleted}%` }}></div>
                                            </div>
                                        </div>

                                        {/* Cancelled Row */}
                                        <div className="rp-status-group">
                                            <div className="rp-status-row">
                                                <div className="rp-status-left">
                                                    <div className="rp-status-icon-box error"><XCircle size={20} strokeWidth={2.5} /></div>
                                                    <div className="rp-status-info">
                                                        <h4>Đã hủy/Khác</h4>
                                                        <p>{cancelled} đơn</p>
                                                    </div>
                                                </div>
                                                <div className="rp-status-pct error">{pctCancelled}%</div>
                                            </div>
                                            <div className="rp-progress-bar-single">
                                                <div className="rp-progress-fill error" style={{ width: `${pctCancelled}%` }}></div>
                                            </div>
                                        </div>

                                        {/* Footer Stats */}
                                        <div className="rp-stat-footer">
                                            <div className="rp-stat-item">
                                                <div className="rp-stat-label">GIÁ TRỊ TB</div>
                                                <div className="rp-stat-val">{Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(overviewData.avgOrderValue)}</div>
                                            </div>
                                            <div className="rp-stat-item">
                                                <div className="rp-stat-label">ĐÁNH GIÁ</div>
                                                <div className="rp-stat-val">4.8</div>
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
                    <div className="rp-rev-metrics">
                        <div className="rp-card">
                            <div className="rp-metric-label">TỔNG DOANH THU <DollarSign size={16} /></div>
                            <div className="rp-metric-value">{formatVnd(revenueData.totalRevenue)}</div>
                        </div>
                        <div className="rp-card">
                            <div className="rp-metric-label">HOA HỒNG PLATFORM</div>
                            <div className="rp-metric-value">{formatVnd(revenueData.totalCommission)}</div>
                        </div>
                        <div className="rp-card">
                            <div className="rp-metric-label">GIẢM GIÁ</div>
                            <div className="rp-metric-value">{formatVnd(revenueData.totalDiscount)}</div>
                        </div>
                    </div>

                    {/* Full Width Chart */}
                    <div className="rp-card" style={{ marginBottom: '24px' }}>
                        <div className="rp-metric-label" style={{ marginBottom: '0' }}>Xu Hướng Doanh Thu</div>
                        <div className="rp-chart-container">
                            {(() => {
                                const dataPoints = revenueData.dailyData.map(d => d.revenue);
                                const max = Math.max(...dataPoints, 100000);
                                const width = 1000; // Wider for full width
                                const height = 250;
                                const padding = 20;

                                const getX = (i) => (i / (dataPoints.length - 1 || 1)) * (width - padding * 2) + padding;
                                const getY = (val) => height - ((val / max) * (height - padding * 2)) - padding;

                                const pathD = dataPoints.map((val, i) =>
                                    `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(val)}`
                                ).join(' ');

                                return (
                                    <svg viewBox={`0 0 ${width} ${height}`} className="rp-chart-svg" preserveAspectRatio="none">
                                        {[0, 0.33, 0.66, 1].map(p => (
                                            <g key={p}>
                                                <line
                                                    x1="30" y1={getY(max * p)}
                                                    x2={width} y2={getY(max * p)}
                                                    className="rp-chart-grid-line"
                                                />
                                                <text x="0" y={getY(max * p) + 4} className="rp-chart-axis-text">
                                                    {Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(max * p)}
                                                </text>
                                            </g>
                                        ))}
                                        <path d={pathD} className="rp-chart-line" />
                                        {revenueData.dailyData.map((d, i) => {
                                            if (i % 2 !== 0 && i !== revenueData.dailyData.length - 1) return null;
                                            const dateParts = d.date.split('-');
                                            const label = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}` : d.date;
                                            return (
                                                <text key={i} x={getX(i)} y={height + 15} textAnchor="middle" className="rp-chart-axis-text">
                                                    {label}
                                                </text>
                                            );
                                        })}
                                    </svg>
                                )
                            })()}
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
                                        <td className="text-right">{formatVnd(d.revenue)}</td>
                                        <td className="text-right">{formatVnd(0)}</td>
                                        <td className="text-right">{formatVnd(0)}</td>
                                        <td className="text-right text-green">{formatVnd(d.revenue)}</td>
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
