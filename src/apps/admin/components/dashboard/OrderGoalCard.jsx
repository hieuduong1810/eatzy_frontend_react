import { MoreHorizontal } from "lucide-react";

const OrderGoalCard = ({ completedOrders, totalOrders, averageOrderValue }) => {
    const percentage = totalOrders > 0
        ? Math.min(Math.max((completedOrders / totalOrders) * 100, 0), 100)
        : 0;

    return (
        <div className="goal-card card">
            <div className="goal-card-header">
                <div>
                    <h3 className="goal-card-title">Tỉ lệ hoàn thành</h3>
                    <div className="goal-card-value">
                        {percentage.toFixed(1)}%{" "}
                        <span className="goal-card-total">/ 100%</span>
                    </div>
                </div>
                <button className="goal-card-more">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="goal-card-body">
                <div className="goal-card-labels">
                    <span>{completedOrders?.toLocaleString()} Thành công</span>
                    <span>{totalOrders?.toLocaleString()} Tổng đơn</span>
                </div>

                <div className="goal-card-progress-track">
                    <div className="goal-card-progress-stripes" />
                    <div
                        className="goal-card-progress-fill"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <div className="goal-card-footer">
                    <span>Mục tiêu: 95%</span>
                    <span className="goal-card-avg">
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            notation: "compact",
                        }).format(averageOrderValue)}{" "}
                        / đơn
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OrderGoalCard;
