import { useState, useMemo, useEffect } from "react";
import { ArrowUpRight, Search, FileText, ShoppingBag, Clock, Loader2 } from "lucide-react";
// import { mockOrderHistory } from "../data/mockRestaurantData"; // Removed
import restaurantAppApi from "../../../api/restaurant/restaurantAppApi";
import "./ReportsOrdersView.css";

const formatVnd = (n) => Intl.NumberFormat("vi-VN").format(n) + "đ";

const ReportsOrdersView = ({ startDate, endDate }) => {
    const [search, setSearch] = useState("");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const params = {};
                if (startDate) params.startDate = startDate.toISOString();
                if (endDate) params.endDate = endDate.toISOString();

                const res = await restaurantAppApi.getOrdersReport(params);
                console.log("Orders Report API Response:", res.data); // Debug log
                // API returns { data: [...] }
                const data = res.data?.data || res.data?.result || [];
                setOrders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch orders report", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [startDate, endDate]);

    // --- Data Processing ---
    const stats = useMemo(() => {
        const total = orders.length;
        const completed = orders.filter(o => ['completed', 'delivered'].includes(o.status?.toLowerCase())).length;
        const cancelled = orders.filter(o => ['cancelled', 'rejected'].includes(o.status?.toLowerCase())).length;
        const revenue = orders
            .filter(o => ['completed', 'delivered'].includes(o.status?.toLowerCase()))
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        return { total, completed, cancelled, revenue };
    }, [orders]);

    // Hourly Distribution (Mock logic extracting hour from orderTime)
    const hourlyData = useMemo(() => {
        const hours = Array(24).fill(0);
        orders.forEach(o => {
            if (o.orderTime) {
                const d = new Date(o.orderTime);
                const h = d.getHours();
                hours[h]++;
            }
        });
        // Filter to show range 6:00 -> 22:00 for cleaner chart like screenshot
        return hours.slice(6, 23).map((count, i) => ({
            hour: i + 6,
            count
        }));
    }, [orders]);

    const maxHourly = Math.max(...hourlyData.map(h => h.count), 1);

    const filteredOrders = orders.filter(o =>
        (o.orderCode && o.orderCode.toLowerCase().includes(search.toLowerCase())) ||
        (o.customerName && o.customerName.toLowerCase().includes(search.toLowerCase())) ||
        (o.id && o.id.toString().includes(search))
    ).slice(0, 50); // Show top 50 recent

    if (loading) {
        return (
            <div className="rp-loading-container">
                <div className="rp-custom-loader">
                    <div className="rp-loader-track"></div>
                    <div className="rp-loader-spinner"></div>
                    <div className="rp-loader-center"></div>
                </div>
                <p className="rp-loading-text">Đang phân tích dữ liệu...</p>
            </div>
        );
    }
    return (
        <div className="rov-container">
            {/* --- Stats Grid --- */}
            <div className="rov-stats-grid">
                {/* Total Card - Black */}
                <div className="rov-stat-card black">
                    <div>
                        <div className="rov-label">TỔNG ĐƠN HÀNG</div>
                        <div className="rov-value">{stats.total}</div>
                    </div>
                    <div className="rov-subtext">
                        <ArrowUpRight size={14} /> +5 tuần này
                    </div>
                </div>

                {/* Completed Card */}
                <div className="rov-stat-card">
                    <div>
                        <div className="rov-label">HOÀN THÀNH</div>
                        <div className="rov-value rov-val-blue">{stats.completed}</div>
                    </div>
                    <div className="rov-subtext">Đơn đã giao</div>
                </div>

                {/* Cancelled Card */}
                <div className="rov-stat-card">
                    <div>
                        <div className="rov-label">ĐÃ HỦY</div>
                        <div className="rov-value rov-val-red">{stats.cancelled}</div>
                    </div>
                    <div className="rov-subtext">0.0% tỷ lệ</div>
                </div>

                {/* Revenue Card - Lime */}
                <div className="rov-stat-card lime">
                    <div>
                        <div className="rov-label">DOANH THU</div>
                        <div className="rov-value">{formatVnd(stats.revenue)}</div>
                    </div>
                    <div className="rov-subtext">Tổng thu</div>
                </div>
            </div>

            {/* --- Charts Row --- */}
            <div className="rov-charts-row">
                {/* Source Chart */}
                <div className="rov-chart-card">
                    <h3 className="rov-card-title">Nguồn Đơn Hàng</h3>
                    <div className="rov-source-chart">
                        {/* Simple Pie/Donut Chart Simulation using CSS conic-gradient */}
                        <div style={{
                            width: '140px',
                            height: '140px',
                            borderRadius: '50%',
                            background: 'conic-gradient(#84cc16 0% 100%, #111827 0% 0%)', // 100% App for now
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                inset: '20px',
                                background: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column'
                            }}>
                                <span style={{ fontSize: '24px', fontWeight: '800', color: '#111827' }}>100%</span>
                                <span style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase' }}>App</span>
                            </div>
                        </div>
                    </div>
                    <div className="rov-source-legend">
                        <div className="rov-legend-item">
                            <div className="dot green"></div> App (100%)
                        </div>
                        <div className="rov-legend-item">
                            <div className="dot black"></div> Walk-in (0%)
                        </div>
                    </div>
                </div>

                {/* Hourly Chart */}
                <div className="rov-chart-card">
                    <h3 className="rov-card-title">Phân Bố Theo Giờ</h3>
                    <div className="rov-bar-chart">
                        {hourlyData.map((d) => (
                            <div key={d.hour} className="rov-bar-col">
                                <span style={{ opacity: d.count > 0 ? 1 : 0, fontSize: '10px', fontWeight: 700 }}>{d.count}</span>
                                <div
                                    className="rov-bar-fill"
                                    style={{ height: `${(d.count / maxHourly) * 100}px`, opacity: d.count > 0 ? 1 : 0.1 }}
                                ></div>
                                <span className="rov-bar-label">{d.hour}:00</span>
                            </div>
                        ))}
                    </div>
                    <div className="rov-chart-footer">
                        Giờ cao điểm: 11:00 - 13:00
                    </div>
                </div>
            </div>

            {/* --- Orders List --- */}
            <div className="rov-list-section">
                <div className="rov-list-header">
                    <div className="rov-list-title-group">
                        <h3>Tất Cả Đơn Hàng</h3>
                        <span className="rov-list-subtitle">Lịch sử đơn hàng chi tiết trong khoảng thời gian đã chọn.</span>
                    </div>
                    <div className="rov-search-box">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Tìm đơn hàng..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rov-table">
                    {/* Header */}
                    <div className="rov-table-header">
                        <div>CHI TIẾT KHÁCH</div>
                        <div>MÃ ĐƠN</div>
                        <div>SỐ MÓN</div>
                        <div style={{ textAlign: 'right' }}>TRẠNG THÁI & TIỀN</div>
                    </div>

                    {/* Body */}
                    <div>
                        {filteredOrders.map(order => (
                            <div key={order.id} className="rov-list-item">
                                <div className="rov-col-customer">
                                    <div className="rov-avatar-frame">
                                        <Clock size={16} />
                                    </div>
                                    <div className="rov-c-info">
                                        <span className="rov-c-name">{order.customerName}</span>
                                        <span className="rov-c-date">{order.orderTime ? new Date(order.orderTime).toLocaleDateString('vi-VN') : ''}</span>
                                    </div>
                                </div>

                                <div className="rov-col-code">
                                    <div className="rov-order-code">
                                        <span className="rov-code-badge">MÃ ĐƠN</span>
                                        <span className="rov-code-val">#{order.orderCode}</span>
                                    </div>
                                </div>

                                <div className="rov-col-items">
                                    <div className="rov-items-summary">
                                        <div className="rov-item-icon">
                                            <ShoppingBag size={14} />
                                        </div>
                                        <div className="rov-item-text">
                                            <span className="rov-item-count">MÓN</span>
                                            <span className="rov-item-desc">
                                                {order.itemsCount} món
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rov-status-col">
                                    <span className="rov-price-val">{formatVnd(order.totalAmount)}</span>
                                    <span className="rov-status-text">{order.status === 'DELIVERED' ? 'HOÀN THÀNH' : order.status === 'CANCELLED' ? 'ĐÃ HỦY' : order.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsOrdersView;
