import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const OverviewChart = ({ data }) => {
    const totalRevenue = data.reduce((sum, item) => sum + (item.value || 0), 0);
    const targetRevenue = totalRevenue * 1.2;

    const formatCurrency = (val) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", notation: "compact" }).format(val);

    return (
        <div className="chart-card card">
            <div className="chart-card-header">
                <div>
                    <h3 className="chart-card-title">Doanh thu hệ thống</h3>
                    <div className="chart-card-legend">
                        <div className="chart-legend-item">
                            <div className="chart-legend-dot" style={{ background: "#3B82F6" }} />
                            <span className="chart-legend-label">Doanh thu</span>
                            <span className="chart-legend-value">{formatCurrency(totalRevenue)}</span>
                        </div>
                        <div className="chart-legend-item">
                            <div className="chart-legend-dot" style={{ background: "#FB923C" }} />
                            <span className="chart-legend-label">Mục tiêu</span>
                            <span className="chart-legend-value">{formatCurrency(targetRevenue)}</span>
                        </div>
                    </div>
                </div>
                <select className="chart-select">
                    <option>30 ngày qua</option>
                    <option>7 ngày qua</option>
                    <option>Năm nay</option>
                </select>
            </div>

            <div className="chart-body">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenueOverview" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 500 }}
                            dy={15}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 500 }}
                            tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                        />
                        <Tooltip
                            cursor={{ stroke: "#3B82F6", strokeWidth: 1, strokeDasharray: "3 3" }}
                            contentStyle={{
                                borderRadius: "16px", border: "none",
                                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", padding: "12px",
                            }}
                            formatter={(val) => [formatCurrency(val), "Doanh thu"]}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenueOverview)"
                        />
                        <Area
                            type="monotone"
                            dataKey={(d) => d.value * 1.2}
                            stroke="#FB923C"
                            strokeWidth={3}
                            fill="none"
                            strokeDasharray="5 5"
                            fillOpacity={0}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default OverviewChart;
