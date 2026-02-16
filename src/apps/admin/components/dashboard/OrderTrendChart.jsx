import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const OrderTrendChart = ({ data }) => {
    return (
        <div className="chart-card card chart-card-sm">
            <div className="chart-card-header">
                <div>
                    <h3 className="chart-card-title">Đơn hàng</h3>
                    <p className="chart-card-desc">7 ngày vừa qua</p>
                </div>
                <select className="chart-select">
                    <option>Tuần này</option>
                    <option>Tuần trước</option>
                    <option>Tháng này</option>
                </select>
            </div>

            <div className="chart-body chart-body-sm">
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis
                            dataKey="label"
                            stroke="#9ca3af"
                            style={{ fontSize: "11px" }}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            style={{ fontSize: "11px" }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                background: "rgba(255,255,255,0.95)",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                padding: "8px 12px",
                                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                            }}
                            cursor={{ stroke: "#F59E0B", strokeWidth: 1, strokeDasharray: "3 3" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#F59E0B"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorOrders)"
                            name="Đơn hàng"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-footer">
                <div className="chart-footer-legend">
                    <div className="chart-legend-dot" style={{ background: "#F59E0B" }} />
                    <span>Tổng đơn hàng</span>
                </div>
            </div>
        </div>
    );
};

export default OrderTrendChart;
