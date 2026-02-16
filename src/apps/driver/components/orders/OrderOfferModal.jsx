import { CreditCard, Banknote, MapPin, DollarSign } from "lucide-react";

const OrderOfferModal = ({ offer, countdown, onAccept, onReject }) => {
    if (!offer) return null;

    const payIcon = offer.paymentMethod === "CASH"
        ? <Banknote size={18} />
        : <CreditCard size={18} />;

    const payLabel = offer.paymentMethod === "CASH" ? "Tiền mặt" : "Thẻ/Ví";

    return (
        <div className="offer-overlay">
            <div className="offer-modal">
                {/* Header */}
                <div className="offer-header">
                    <div className="offer-header-title">ĐƠN HÀNG MỚI</div>
                </div>

                {/* Content */}
                <div className="offer-body">
                    {/* Earnings */}
                    <div className="offer-earnings-section">
                        <div className="offer-earnings-row">
                            <div>
                                <div className="offer-earnings-label">Thu nhập ròng</div>
                                <div className="offer-earnings-value">
                                    {Intl.NumberFormat("vi-VN").format(offer.netEarning)}
                                    <span className="offer-earnings-unit">đ</span>
                                </div>
                            </div>
                            <div className="offer-pay-badge">
                                {payIcon}
                                <span>{payLabel}</span>
                            </div>
                        </div>

                        <div className="offer-info-row">
                            <div className="offer-info-item">
                                <DollarSign size={16} className="offer-icon-primary" />
                                <span>Giá trị:</span>
                                <strong>{Intl.NumberFormat("vi-VN").format(offer.orderValue)}đ</strong>
                            </div>
                            <div className="offer-info-divider" />
                            <div className="offer-info-item">
                                <MapPin size={16} className="offer-icon-primary" />
                                <span>Cách bạn:</span>
                                <strong>{offer.distanceKm.toFixed(2)} km</strong>
                            </div>
                        </div>
                    </div>

                    {/* Locations */}
                    <div className="offer-locations">
                        <div className="offer-location-item">
                            <div className="offer-loc-dot offer-loc-dot--pickup">
                                <div className="offer-loc-dot-inner" />
                            </div>
                            <div className="offer-loc-info">
                                <div className="offer-loc-tag offer-loc-tag--pickup">Điểm lấy hàng</div>
                                <div className="offer-loc-name">{offer.pickup.name}</div>
                                <div className="offer-loc-address">{offer.pickup.address}</div>
                            </div>
                        </div>

                        <div className="offer-loc-line" />

                        <div className="offer-location-item">
                            <div className="offer-loc-dot offer-loc-dot--dropoff">
                                <MapPin size={14} color="white" />
                            </div>
                            <div className="offer-loc-info">
                                <div className="offer-loc-tag offer-loc-tag--dropoff">Điểm giao hàng</div>
                                <div className="offer-loc-name">Điểm giao</div>
                                <div className="offer-loc-address">{offer.dropoff.address}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="offer-footer">
                    <button className="offer-btn offer-btn--reject" onClick={onReject}>
                        <span>Từ chối</span>
                    </button>
                    <button
                        className={`offer-btn offer-btn--accept ${countdown <= 5 ? "offer-btn--pulse" : ""}`}
                        onClick={onAccept}
                    >
                        <span>NHẬN ĐƠN</span>
                        <span className={`offer-countdown ${countdown <= 5 ? "offer-countdown--urgent" : ""}`}>
                            {countdown}s
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderOfferModal;
