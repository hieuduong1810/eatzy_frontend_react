import { useState, useEffect, useCallback } from "react";
import { LocateFixed, Bike } from "lucide-react";
import DriverMapView from "../components/map/DriverMapView";
import ConnectToggle from "../components/online/ConnectToggle";
import OnlineStatusBadge from "../components/online/OnlineStatusBadge";
import OrderOfferModal from "../components/orders/OrderOfferModal";
import CurrentOrderPanel from "../components/orders/CurrentOrderPanel";
import { mockOffers, mockActiveOrder } from "../data/mockDriverData";
import driverAppApi from "../../../api/driver/driverAppApi";
import "../DriverApp.css";

const HomePage = () => {
    const [online, setOnline] = useState(false);
    const [locateVersion, setLocateVersion] = useState(0);

    // Mock offer state
    const [currentOffer, setCurrentOffer] = useState(null);
    const [countdown, setCountdown] = useState(30);
    const [offerIndex, setOfferIndex] = useState(0);
    const [activeOrder, setActiveOrder] = useState(null);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const res = await driverAppApi.getMyStatus();
            if (res && res.data) {
                // API returns { data: { status: "AVAILABLE" } } or similiar
                const data = res.data.data || res.data;
                const status = data.status || data;

                // Check if status is "ONLINE" or "AVAILABLE" or "UNAVAILABLE" or boolean
                setOnline(status === "ONLINE" || status === "AVAILABLE" || status === "UNAVAILABLE" || status === true);
            }
        } catch (error) {
            console.error("Failed to fetch driver status", error);
        }
    };

    const handleToggleOnline = async () => {
        try {
            if (online) {
                await driverAppApi.goOffline();
                setOnline(false);
            } else {
                await driverAppApi.goOnline();
                setOnline(true);
            }
        } catch (error) {
            console.error("Failed to toggle status", error);
            // Optionally revert state if it was optimistic
        }
    };

    // Show a mock offer 5s after going online
    useEffect(() => {
        if (!online || activeOrder) {
            setCurrentOffer(null);
            return;
        }
        const timer = setTimeout(() => {
            setCurrentOffer(mockOffers[offerIndex % mockOffers.length]);
            setCountdown(30);
        }, 5000);
        return () => clearTimeout(timer);
    }, [online, offerIndex, activeOrder]);

    const acceptOffer = useCallback(() => {
        setCurrentOffer(null);
        setActiveOrder({ ...mockActiveOrder });
    }, []);

    const rejectOffer = useCallback(() => {
        setCurrentOffer(null);
        setOfferIndex((i) => i + 1);
    }, []);

    const handleStageChange = useCallback((newStage) => {
        if (newStage === "DELIVERED") {
            setActiveOrder(null);
            return;
        }
        setActiveOrder((prev) => prev ? { ...prev, orderStatus: newStage } : null);
    }, []);

    // Countdown timer
    useEffect(() => {
        if (!currentOffer) return;
        if (countdown <= 0) {
            // Auto-accept when timer expires (moved countdown to Accept button)
            acceptOffer();
            return;
        }
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [currentOffer, countdown, acceptOffer]);

    return (
        <div className="driver-home">
            <DriverMapView locateVersion={locateVersion} activeOrder={activeOrder} />

            {/* Top branding */}
            <div className="driver-home-brand">
                <span className="driver-home-brand-text">Eatzy Driver</span>
            </div>

            {/* Bottom controls */}
            <div className="driver-home-controls">
                <div className="driver-home-controls-row">
                    <ConnectToggle online={online} onToggle={handleToggleOnline} />
                    <button
                        className="driver-locate-btn"
                        onClick={() => setLocateVersion((v) => v + 1)}
                    >
                        <LocateFixed size={22} />
                    </button>
                </div>

                {/* Searching indicator */}
                {online && !activeOrder && (
                    <div className="driver-searching-card">
                        <div className="driver-searching-inner">
                            <div className="driver-searching-icon">
                                <Bike size={16} />
                            </div>
                            <div className="driver-searching-text">Đang tìm đơn hàng phù hợp...</div>
                        </div>
                    </div>
                )}

                {/* Active order panel */}
                {activeOrder && (
                    <CurrentOrderPanel order={activeOrder} onStageChange={handleStageChange} />
                )}
            </div>

            {/* Online Status Badge */}
            <OnlineStatusBadge online={online} />

            {/* Order Offer Modal */}
            <OrderOfferModal
                offer={currentOffer}
                countdown={countdown}
                onAccept={acceptOffer}
                onReject={rejectOffer}
            />
        </div>
    );
};

export default HomePage;
