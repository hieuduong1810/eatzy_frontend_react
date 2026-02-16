import React, { useState, useEffect } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import OrderGoalCard from "../components/dashboard/OrderGoalCard";
import OrderTrendChart from "../components/dashboard/OrderTrendChart";
import OverviewChart from "../components/dashboard/OverviewChart";
import TopRestaurantsScroll from "../components/dashboard/TopRestaurantsScroll";
import ActivityList from "../components/dashboard/ActivityList";
// Removed mockData imports
import "./DashboardPage.css";
import dashboardApi from "../../../api/admin/dashboardApi";

const DashboardPage = () => {
    const [stats, setStats] = useState({
        activeOrders: 0,
        totalRestaurants: 0,
        activeDrivers: 0,
        totalCustomers: 0,
        completedOrders: 0,
        totalOrders: 0,
        averageOrderValue: 0,
    });

    const [revenueData, setRevenueData] = useState([]);
    const [orderTrendData, setOrderTrendData] = useState([]);
    const [topRestaurants, setTopRestaurants] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all data in parallel
                const [orders, users, restaurants, drivers] = await Promise.all([
                    dashboardApi.getAllOrders(),
                    dashboardApi.getUsers(),
                    dashboardApi.getRestaurants(),
                    dashboardApi.getDrivers()
                ]);

                // Calculate Stats
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const activeOrders = orders.filter(o =>
                    !['DELIVERED', 'CANCELLED', 'REJECTED'].includes(o.orderStatus)
                ).length;

                const completedOrders = orders.filter(o => o.orderStatus === 'DELIVERED');
                const totalOrders = orders.length;

                // Calculate Revenue
                const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

                // Derived counts (or use the separate API lists if available)
                const totalCustomers = users.filter(u => u.role && u.role.name === 'CUSTOMER').length

                const totalRestaurantsCount = restaurants.length

                // Backend uses 'AVAILABLE' or 'UNAVAILABLE' for online drivers
                const activeDrivers = drivers.filter(d =>
                    ['AVAILABLE', 'UNAVAILABLE', 'OFFLINE', 'APPROVED'].includes(d.status)
                ).length;

                setStats({
                    activeOrders,
                    totalRestaurants: totalRestaurantsCount,
                    activeDrivers,
                    totalCustomers,
                    completedOrders: completedOrders.length,
                    totalOrders,
                    averageOrderValue: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0,
                    totalRevenue,
                    revenueGrowth: 0
                });

                // Recent Activity (Top 5 latest orders)
                const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setRecentActivities(sortedOrders.slice(0, 5).map(o => ({
                    id: o.id,
                    type: "order",
                    description: `Đơn hàng #${o.id} trị giá ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", notation: "compact" }).format(o.totalAmount)} từ ${o.customer ? o.customer.firstName : "Khách"}`,
                    status: o.orderStatus,
                    timestamp: o.createdAt,
                })));

                // Top Restaurants (by revenue)
                const restaurantRevenue = {};
                completedOrders.forEach(o => {
                    const rId = o.restaurant?.id;
                    if (rId) {
                        if (!restaurantRevenue[rId]) {
                            // Find full restaurant info from the restaurants list to get avatarUrl
                            const fullRes = restaurants.find(r => r.id === rId);

                            restaurantRevenue[rId] = {
                                id: rId,
                                name: o.restaurant.name,
                                image: fullRes?.avatarUrl || o.restaurant.image, // Use avatarUrl from full list if available
                                type: "Nhà hàng",
                                revenue: 0
                            };
                        }
                        restaurantRevenue[rId].revenue += (o.totalAmount || 0);
                    }
                });

                const sortedRestaurants = Object.values(restaurantRevenue)
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 5);

                setTopRestaurants(sortedRestaurants);

                // Revenue Chart Data (Last 30 days to match reference)
                const last30Days = Array.from({ length: 30 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (29 - i));
                    d.setHours(0, 0, 0, 0);
                    return d;
                });

                const chartData = last30Days.map(date => {
                    const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }); // dd/MM
                    // Find orders delivered on this date
                    const dayRevenue = completedOrders
                        .filter(o => {
                            const oDate = new Date(o.createdAt);
                            return oDate.getDate() === date.getDate() &&
                                oDate.getMonth() === date.getMonth() &&
                                oDate.getFullYear() === date.getFullYear();
                        })
                        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

                    return { label: dateStr, value: dayRevenue };
                });

                setRevenueData(chartData);

                // Order Trend Data (Hourly distribution for today)
                const trendData = Array.from({ length: 7 }, (_, i) => { // 6 intervals of 4 hours
                    const hour = i * 4; // 0, 4, 8, 12, 16, 20, 24
                    const label = `${hour.toString().padStart(2, '0')}:00`;

                    // Count orders in this 4-hour block for *today*
                    const count = orders.filter(o => {
                        const oDate = new Date(o.createdAt);
                        const now = new Date();
                        const isToday = oDate.getDate() === now.getDate() &&
                            oDate.getMonth() === now.getMonth() &&
                            oDate.getFullYear() === now.getFullYear();
                        return isToday && oDate.getHours() >= hour && oDate.getHours() < hour + 4;
                    }).length;

                    return { label: label, value: count };
                });
                setOrderTrendData(trendData);

            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="dashboard-page">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard-page">
            <DashboardHeader
                title="Tổng quan hệ thống"
                subtitle="Chào mừng Admin, đây là tình hình hệ thống hôm nay."
                stats={{
                    activeOrders: stats.activeOrders,
                    totalRestaurants: stats.totalRestaurants,
                    activeDrivers: stats.activeDrivers,
                    totalCustomers: stats.totalCustomers,
                }}
            />

            <div className="dashboard-grid">
                {/* Left Column - Statistics */}
                <div className="dashboard-left">
                    <DashboardStats stats={stats} />

                    <OrderGoalCard
                        completedOrders={stats.completedOrders}
                        totalOrders={stats.totalOrders}
                        averageOrderValue={stats.averageOrderValue}
                    />

                    {/* Real daily data */}
                    <OrderTrendChart data={orderTrendData} />
                </div>

                {/* Right Column - Charts & Content */}
                <div className="dashboard-right">
                    <div style={{ height: 350 }}>
                        <OverviewChart data={revenueData} />
                    </div>

                    <TopRestaurantsScroll restaurants={topRestaurants} />

                    <ActivityList activities={recentActivities} />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
