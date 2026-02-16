import MetricCard from "../../../../components/shared/MetricCard";
import { BadgeDollarSign } from "lucide-react";

const DashboardStats = ({ stats }) => {
    return (
        <MetricCard
            label="Tổng doanh thu"
            value={new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                notation: "compact",
            }).format(stats.totalRevenue)}
            subValue="Toàn bộ thời gian"
            trend={stats.revenueGrowth}
            color="blue"
            icon={<BadgeDollarSign size={24} color="white" />}
        />
    );
};

export default DashboardStats;
