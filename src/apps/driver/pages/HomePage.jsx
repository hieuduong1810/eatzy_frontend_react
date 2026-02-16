import { useState, useEffect, useCallback } from "react";
import { LocateFixed, Bike } from "lucide-react";
import { toast } from "react-toastify";
import { useWebSocket } from "../../../contexts/WebSocketContext";
import DriverMapView from "../components/map/DriverMapView";
import ConnectToggle from "../components/online/ConnectToggle";
import OnlineStatusBadge from "../components/online/OnlineStatusBadge";
import OrderOfferModal from "../components/orders/OrderOfferModal";
import CurrentOrderPanel from "../components/orders/CurrentOrderPanel";
import { mockOffers, mockActiveOrder } from "../data/mockDriverData";
import driverAppApi from "../../../api/driver/driverAppApi";
import "../DriverApp.css";

import SlideConfirmModal from "../../../components/shared/SlideConfirmModal";

const HomePage = () => {
    const [online, setOnline] = useState(false);
    const [locateVersion, setLocateVersion] = useState(0);

    // Modal state
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);

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
                const isOnline = status === "ONLINE" || status === "AVAILABLE" || status === "UNAVAILABLE" || status === true;
                setOnline(isOnline);

                // If status is UNAVAILABLE (or just generally check), try to find active order
                if (status === "UNAVAILABLE" || status === "BUSY" || isOnline) {
                    fetchActiveOrder();
                }
            }
        } catch (error) {
            console.error("Failed to fetch driver status", error);
        }
    };

    const fetchActiveOrder = async () => {
        try {
            const res = await driverAppApi.getMyOrders();
            if (res && res.data) {
                const orders = res.data.data?.result || res.data.data || [];
                // Find order that is not DELIVERED, CANCELLED, REJECTED
                const active = orders.find(o =>
                    !["DELIVERED", "CANCELLED", "REJECTED", "COMPLETED"].includes(o.orderStatus)
                );
                if (active) {
                    console.log("Found active order:", active);
                    // Map API structure to what CurrentOrderPanel and Map expects
                    const mappedOrder = {
                        ...active,
                        driverLocation: location ? { lat: location.lat, lng: location.lng } : null,
                        pickup: {
                            name: active.restaurant?.name,
                            address: active.restaurant?.address,
                            lat: active.restaurant?.latitude,
                            lng: active.restaurant?.longitude,
                        },
                        dropoff: {
                            address: active.deliveryAddress,
                            lat: active.deliveryLatitude,
                            lng: active.deliveryLongitude,
                        },
                        earnings: {
                            driverNetEarning: active.driverNetEarning || 0,
                            orderSubtotal: active.totalAmount || 0,
                        }
                    };
                    setActiveOrder(mappedOrder);
                }
            }
        } catch (error) {
            console.error("Failed to fetch active order", error);
        }
    };

    const handleToggleOnline = () => {
        setIsConfirmOpen(true);
    };

    const confirmToggleOnline = async () => {
        setIsTogglingStatus(true);
        try {
            // Minimum 1s delay for UX
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (online) {
                await driverAppApi.goOffline();
                setOnline(false);
            } else {
                await driverAppApi.goOnline();
                setOnline(true);
            }
        } catch (error) {
            console.error("Failed to toggle status", error);
            toast.error("Không thể thay đổi trạng thái");
        } finally {
            setIsTogglingStatus(false);
            setIsConfirmOpen(false);
        }
    };

    // WebSocket integration
    const { client, isConnected } = useWebSocket();

    useEffect(() => {
        if (!client || !isConnected) return;

        console.log("Driver HomePage: Subscribing to /user/queue/orders");
        const subscription = client.subscribe('/user/queue/orders', (message) => {
            if (message.body) {
                const notification = JSON.parse(message.body);
                console.log('Driver received:', notification);

                if (notification.type === 'ORDER_ASSIGNED') {
                    const orderData = notification.data;
                    // Map ResOrderDTO to offer format
                    const offer = {
                        id: orderData.id,
                        netEarning: orderData.driverNetEarning || 0,
                        orderValue: orderData.totalAmount || 0,
                        distanceKm: orderData.distance || 0,
                        pickup: {
                            name: orderData.restaurant?.name,
                            address: orderData.restaurant?.address
                        },
                        dropoff: {
                            address: orderData.deliveryAddress
                        },
                        paymentMethod: orderData.paymentMethod
                    };
                    setCurrentOffer(offer);
                    setCountdown(30);

                    // Show notification
                    toast.info(`New Order Offer! ${orderData.distance}km away`, {
                        autoClose: 10000
                    });

                    // Play sound
                    const audio = new Audio('/sounds/notification.mp3');
                    audio.play().catch(e => console.log("Audio play failed"));
                } else if (notification.type === 'ORDER_STATUS_CHANGED') {
                    const updatedOrder = notification.data;
                    console.log("Received status update:", updatedOrder);

                    if (activeOrder && activeOrder.id === updatedOrder.id) {
                        // Update active order status
                        // If status is DELIVERED/CANCELLED/REJECTED, clear active order?
                        if (["DELIVERED", "CANCELLED", "REJECTED", "COMPLETED"].includes(updatedOrder.orderStatus)) {
                            setActiveOrder(null);
                        } else {
                            // Update structure to match local state
                            const mappedOrder = {
                                ...updatedOrder,
                                driverLocation: location ? { lat: location.lat, lng: location.lng } : null,
                                pickup: {
                                    name: updatedOrder.restaurant?.name,
                                    address: updatedOrder.restaurant?.address,
                                    lat: updatedOrder.restaurant?.latitude,
                                    lng: updatedOrder.restaurant?.longitude,
                                },
                                dropoff: {
                                    address: updatedOrder.deliveryAddress,
                                    lat: updatedOrder.deliveryLatitude,
                                    lng: updatedOrder.deliveryLongitude,
                                },
                                earnings: {
                                    driverNetEarning: updatedOrder.driverNetEarning || 0,
                                    orderSubtotal: updatedOrder.totalAmount || 0,
                                }
                            };
                            setActiveOrder(mappedOrder);
                        }
                    }
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [client, isConnected, activeOrder, location]);

    const acceptOffer = useCallback(async () => {
        if (!currentOffer) return;
        try {
            await driverAppApi.acceptOrder(currentOffer.id);
            toast.success("Accepted order successfully!");
            // Refresh valid active order
            const res = await driverAppApi.getOrderDetail(currentOffer.id);
            setActiveOrder(res.data);
        } catch (error) {
            console.error("Failed to accept order:", error);
            toast.error("Failed to accept order. It may have been taken.");
        } finally {
            setCurrentOffer(null);
        }
    }, [currentOffer]);

    const rejectOffer = useCallback(async () => {
        if (!currentOffer) return;
        try {
            await driverAppApi.rejectOrder(currentOffer.id);
            toast.info("Order rejected");
        } catch (error) {
            console.error("Failed to reject order:", error);
        } finally {
            setCurrentOffer(null);
        }
    }, [currentOffer]);

    const handleStageChange = useCallback(async (newStage) => {
        if (!activeOrder) return;
        try {
            if (newStage === "PICKED_UP") {
                await driverAppApi.markOrderAsPickedUp(activeOrder.id);
            } else if (newStage === "ARRIVED") {
                await driverAppApi.markOrderAsArrived(activeOrder.id);
            } else if (newStage === "DELIVERED") {
                await driverAppApi.markOrderAsDelivered(activeOrder.id);
                setActiveOrder(null);
                return;
            }
            // Update local state to reflect change immediately (optimistic)
            setActiveOrder((prev) => prev ? { ...prev, orderStatus: newStage } : null);
        } catch (error) {
            console.error("Failed to update order stage:", error);
            toast.error("Failed to update order status");
        }
    }, [activeOrder]);

    // Countdown timer for offer
    useEffect(() => {
        if (!currentOffer) return;
        if (countdown <= 0) {
            // Auto-accept when timer expires
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

            <SlideConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmToggleOnline}
                title={online ? "Tắt trạng thái hoạt động" : "Bắt đầu làm việc"}
                description={online
                    ? "Bạn sẽ không nhận được đơn hàng mới. Bạn có chắc chắn muốn nghỉ ngơi không?"
                    : "Bạn đã sẵn sàng nhận đơn và giao hàng chưa?"}
                isLoading={isTogglingStatus}
                type={online ? "warning" : "success"}
            />
        </div>
    );
};

export default HomePage;
