import { useState } from "react";
import { Phone, Compass, DollarSign, MapPin, Utensils, ChevronDown } from "lucide-react";

const stageConfig = {
    DRIVER_ASSIGNED: { title: "Đang đến cửa hàng", buttonText: "Đã nhận hàng" },
    READY: { title: "Đơn hàng đã sẵn sàng", buttonText: "Đã nhận hàng" },
    PICKED_UP: { title: "Đang giao hàng", buttonText: "Đã đến điểm giao" },
    ARRIVED: { title: "Đã đến điểm giao", buttonText: "Giao hàng thành công" },
};

const STAGE_ORDER = ["DRIVER_ASSIGNED", "READY", "PICKED_UP", "ARRIVED"];

const CurrentOrderPanel = ({ order, onStageChange }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const currentStage = order.orderStatus || "DRIVER_ASSIGNED";
    const { title, buttonText } = stageConfig[currentStage] || stageConfig.DRIVER_ASSIGNED;

    const handleAdvanceStage = () => {
        const idx = STAGE_ORDER.indexOf(currentStage);
        if (idx < STAGE_ORDER.length - 1) {
            onStageChange?.(STAGE_ORDER[idx + 1]);
        } else {
            onStageChange?.("DELIVERED");
        }
    };

    const handleNavigation = () => {
        const dest = currentStage === "DRIVER_ASSIGNED" ? order.pickup : order.dropoff;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}&travelmode=driving`;
        window.open(url, "_blank");
    };

    return (
        <div className="order-panel-wrap">
            {/* Toggle */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="order-panel-toggle"
            >
                <ChevronDown
                    size={16}
                    style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
                />
            </button>

            <div className="order-panel">
                {/* Header */}
                <div className="order-panel-header">
                    <div className="order-panel-title">{title}</div>
                    <div className="order-panel-pay-badge">
                        {order.paymentMethod === "CASH" ? "Tiền mặt" : "Thẻ/Ví"}
                    </div>
                </div>

                {/* Collapsible Content */}
                {isExpanded && (
                    <div className="order-panel-body">
                        {/* Locations */}
                        <div className="order-panel-locations">
                            <div className="order-panel-loc">
                                <div className="order-panel-loc-dot order-panel-loc-dot--pickup">
                                    <div className="order-panel-loc-dot-inner" />
                                </div>
                                <div>
                                    <div className="order-panel-loc-name">{order.pickup.name}</div>
                                    <div className="order-panel-loc-addr">{order.pickup.address}</div>
                                </div>
                            </div>

                            <div className="order-panel-loc-line" />

                            <div className="order-panel-loc">
                                <div className="order-panel-loc-dot order-panel-loc-dot--dropoff">
                                    <MapPin size={12} color="white" />
                                </div>
                                <div>
                                    <div className="order-panel-loc-name">Điểm giao</div>
                                    <div className="order-panel-loc-addr">{order.dropoff.address}</div>
                                </div>
                            </div>
                        </div>

                        <div className="order-panel-divider" />

                        {/* Earnings */}
                        <div className="order-panel-earnings">
                            <div className="order-panel-earn-item">
                                <DollarSign size={16} className="order-panel-icon-primary" />
                                <span>Thu nhập:</span>
                                <strong className="order-panel-earn-value">
                                    {Intl.NumberFormat("vi-VN").format(order.earnings.driverNetEarning)}đ
                                </strong>
                            </div>
                            <div className="order-panel-earn-sep" />
                            <div className="order-panel-earn-item">
                                <span>Giá trị:</span>
                                <strong>{Intl.NumberFormat("vi-VN").format(order.earnings.orderSubtotal)}đ</strong>
                            </div>
                        </div>

                        <div className="order-panel-divider" />

                        {/* Actions */}
                        <div className="order-panel-actions">
                            <button className="order-panel-action-btn">
                                <Utensils size={16} />
                                <span>Chi tiết</span>
                            </button>
                            <button className="order-panel-action-btn">
                                <Phone size={16} />
                                <span>Gọi quán</span>
                            </button>
                            <button className="order-panel-action-btn" onClick={handleNavigation}>
                                <Compass size={16} />
                                <span>Chỉ đường</span>
                            </button>
                        </div>

                        {/* Stage button */}
                        <button className="order-panel-stage-btn" onClick={handleAdvanceStage}>
                            {buttonText}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrentOrderPanel;
