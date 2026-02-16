import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    ChevronRight, Check, Percent, Clock, Store, Crosshair,
    Wallet, Banknote, Truck, ChevronLeft, CreditCard, MapPin, FileText,
    ShoppingBag, Tag, ArrowLeft, Search
} from "lucide-react";
import DeliveryMapView from "../components/DeliveryMapView";
import "../CustomerApp.css";
import "./CheckoutPage.css";
import { useLocationStore } from "../../../stores/locationStore";
import customerApi from "../../../api/customer/customerApi";
import { useCart } from "../context/CartContext";

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

const MOCK_RESTAURANT = {
    id: "r1",
    name: "Cơm Tấm B4",
    address: "72 Đường số 4, P. An Lạc, Bình Tân",
    latitude: 10.7731,
    longitude: 106.7030
};

const MOCK_ITEMS = [
    {
        id: "i1",
        name: "Cơm Tấm Sườn",
        description: "Cơm tấm thường, Có mỡ hành, Đồ chua",
        price: 35000,
        quantity: 2,
        imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a3a2720?auto=format&fit=crop&w=150&q=80"
    },
    {
        id: "i2",
        name: "Cơm Sườn Bì Chả",
        description: "Cơm thêm (+5k), Trứng ốp la",
        price: 55000,
        quantity: 1,
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80"
    }
];

const MOCK_PAYMENT_METHODS = [
    { id: "eatzy_wallet", label: "EatzyPay", sub: "E-WALLET", balance: 930000, icon: <Wallet size={20} />, active: true },
    { id: "vnpay", label: "VnPay", sub: "QR CODE", icon: <CreditCard size={20} />, active: false },
    { id: "cash", label: "By Cash", sub: "COD", icon: <Banknote size={20} />, active: false },
];

const MOCK_SHIPPING_VOUCHERS = [
    { id: "sv1", title: "Miễn phí vận chuyển KTX", dist: "Tiết kiệm đến 15.000 đ", min: "ĐƠN TỪ 40.000 Đ", exp: "1/1/2027", tag: "BEST" },
    { id: "sv2", title: "Miễn phí vận chuyển toàn KTX", dist: "Tiết kiệm đến 15.000 đ", min: "ĐƠN TỪ 50.000 Đ", exp: "1/1/2027", tag: "" },
];

const MOCK_DISCOUNT_VOUCHERS = [
    { id: "dv1", title: "Giảm nóng 50k đơn từ 100k", dist: "Giảm 50k", min: "ĐƠN TỪ 100.000 Đ", exp: "1/1/2027", tag: "BEST" },
];

const MOCK_PICKUP_POINTS = [
    { id: "p1", name: "Đường Tân Lập", address: "Đường Tân Lập, 75300, Dong Hoa, Thành phố Hồ Chí Minh, Việt Nam", selected: true },
    { id: "p2", name: "Song hành Xa lộ Hà Nội", address: "Xa lộ Hà Nội, TP. Thủ Đức", selected: false },
    { id: "p3", name: "Xa lộ Hà Nội", address: "Xa lộ Hà Nội, Quận 9", selected: false },
];

// ─── UTILS ───────────────────────────────────────────────────────────────────

const formatVnd = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────

const CheckoutPage = () => {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const isManualScroll = useRef(false);

    const { state: navigationState } = useLocation();
    const [restaurant, setRestaurant] = useState(navigationState?.restaurant || MOCK_RESTAURANT);
    const items = navigationState?.items || MOCK_ITEMS;
    const { deleteRestaurantCart } = useCart();

    // Fetch restaurant details (especially coordinates)
    useEffect(() => {
        // Only fetch if ID is present and NOT the mock "r1"
        if (restaurant?.id && restaurant.id !== "r1") {
            console.log("Fetching restaurant details for ID:", restaurant.id);
            customerApi.getRestaurantById(restaurant.id)
                .then(res => {
                    // Verify response structure, usually res.data.result contains the object
                    // Based on user feedback, the data is in res.data.data
                    const data = res.data?.data || res.data?.result || res.data;
                    console.log("Fetched restaurant details:", data);
                    if (data) {
                        setRestaurant(prev => ({ ...prev, ...data }));
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch restaurant details:", err);
                });
        }
    }, [restaurant?.id]);

    const { location } = useLocationStore();

    // State
    const [activeTab, setActiveTab] = useState("ADDRESS");
    const [pickupPoints, setPickupPoints] = useState([]);

    // Initialize pickup points with current location and fetch suggestions
    useEffect(() => {
        if (location) {
            const currentLoc = {
                id: "current_loc",
                name: location.name || "Vị trí hiện tại",
                address: location.address,
                selected: true,
                lat: location.latitude,
                lng: location.longitude
            };

            // Initial state with just current location while loading
            setPickupPoints([currentLoc]);

            // Fetch nearby suggestions
            // Fetch nearby suggestions
            customerApi.getNearbyPlaces(location.latitude, location.longitude)
                .then(res => {
                    const features = res.data?.features || [];
                    const nearbyPoints = features
                        .filter(f => f.center) // Ensure has coordinates
                        .map(f => ({
                            id: f.id,
                            name: f.text, // e.g. "Starbucks" or "Street Name"
                            address: f.place_name,
                            selected: false,
                            lat: f.center[1],
                            lng: f.center[0]
                        }))
                        // Filter out points that roughly match current location to avoid duplicates
                        .filter(p => {
                            // Simple check: if address or name is very similar
                            const isDuplicateAddr = currentLoc.address && p.address && currentLoc.address.includes(p.address);
                            const isDuplicateName = currentLoc.name && p.name && currentLoc.name.includes(p.name);
                            return !isDuplicateAddr && !isDuplicateName;
                        });

                    // Update list: Current Location + Nearby Suggestions
                    setPickupPoints([currentLoc, ...nearbyPoints]);
                })
                .catch(err => console.error("Failed to fetch nearby points:", err));
        }
    }, [location]);

    const [paymentMethod, setPaymentMethod] = useState("eatzy_wallet");
    const [note, setNote] = useState("");
    const [walletBalance, setWalletBalance] = useState(0);

    // Vouchers State
    const [shippingVouchers, setShippingVouchers] = useState([]);
    const [discountVouchers, setDiscountVouchers] = useState([]);
    const [selectedShippingVoucher, setSelectedShippingVoucher] = useState(null);
    const [selectedDiscountVoucher, setSelectedDiscountVoucher] = useState(null);

    // Logic: Calculate Totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const [deliveryFeeBase, setDeliveryFeeBase] = useState(25000); // Default fallback

    // Calculate Delivery Fee
    // Calculate Delivery Fee
    useEffect(() => {
        const selectedP = pickupPoints.find(p => p.selected);
        if (restaurant?.id && restaurant.id !== "r1" && selectedP) {
            const payload = {
                restaurantId: restaurant.id,
                deliveryLatitude: selectedP.lat,
                deliveryLongitude: selectedP.lng
            };

            console.log("Calculating delivery fee...", payload);
            customerApi.calculateDeliveryFee(payload)
                .then(res => {
                    // Response structure from OrderController: ResDeliveryFeeDTO
                    // usually accessible directly via res.data if the interceptor doesn't unwrap it, 
                    // or res.data.data if using a standard response wrapper.
                    // Based on previous patterns: res.data might be the DTO directly or wrapped.
                    const feeData = res.data?.data || res.data;
                    console.log("Delivery Fee Response:", feeData);

                    if (feeData && typeof feeData.deliveryFee === 'number') {
                        setDeliveryFeeBase(feeData.deliveryFee);
                    } else if (typeof feeData === 'number') {
                        setDeliveryFeeBase(feeData);
                    }
                })
                .catch(err => {
                    console.error("Failed to calculate delivery fee:", err);
                    // Fallback to default if API fails
                    setDeliveryFeeBase(25000);
                });
        }
    }, [restaurant?.id, pickupPoints]);

    const calculateDiscount = (voucher, baseAmount) => {
        if (!voucher) return 0;
        let discount = 0;
        if (voucher.discountType === "PERCENTAGE") {
            discount = baseAmount * (voucher.discountValue / 100);
            if (voucher.maxDiscountAmount) {
                discount = Math.min(discount, voucher.maxDiscountAmount);
            }
        } else {
            // FIXED or FREESHIP
            discount = voucher.discountValue || 0;
        }
        return discount;
    };

    const shippingDiscount = calculateDiscount(selectedShippingVoucher, deliveryFeeBase);
    const orderDiscount = calculateDiscount(selectedDiscountVoucher, subtotal);

    const deliveryFee = Math.max(0, deliveryFeeBase - shippingDiscount);
    const totalAmount = Math.max(0, subtotal + deliveryFee - orderDiscount);

    const handleSelectVoucher = (voucher) => {
        // Check eligibility again just in case
        if (voucher.minOrderValue && subtotal < voucher.minOrderValue) return;

        if (voucher.discountType === "FREESHIP") {
            setSelectedShippingVoucher(prev => prev?.id === voucher.id ? null : voucher);
        } else {
            setSelectedDiscountVoucher(prev => prev?.id === voucher.id ? null : voucher);
        }
    };

    // Fetch Wallet Balance
    useEffect(() => {
        customerApi.getMyWallet()
            .then(res => {
                const balance = res.data?.data?.balance || res.data?.balance || 0;
                setWalletBalance(balance);
            })
            .catch(err => console.error("Failed to fetch wallet:", err));
    }, []);

    // Fetch Vouchers
    useEffect(() => {
        if (restaurant?.id && restaurant.id !== "r1") {
            customerApi.getRestaurantVouchers(restaurant.id)
                .then(res => {
                    const vouchers = res.data?.data || res.data || [];

                    const shipping = vouchers.filter(v => v.discountType === "FREESHIP");
                    const discount = vouchers.filter(v => v.discountType !== "FREESHIP");

                    if (shipping.length > 0) setShippingVouchers(shipping);
                    else setShippingVouchers([]); // No mock fallback when strictly using API

                    if (discount.length > 0) setDiscountVouchers(discount);
                    else setDiscountVouchers([]); // No mock fallback when strictly using API
                })
                .catch(err => {
                    console.error("Failed to fetch vouchers:", err);
                    setShippingVouchers(MOCK_SHIPPING_VOUCHERS);
                    setDiscountVouchers(MOCK_DISCOUNT_VOUCHERS);
                });
        } else {
            // Fallback for mock restaurant
            setShippingVouchers(MOCK_SHIPPING_VOUCHERS);
            setDiscountVouchers(MOCK_DISCOUNT_VOUCHERS);
        }
    }, [restaurant?.id]);


    // Scroll Spy Effect
    useEffect(() => {
        const handleScroll = () => {
            if (isManualScroll.current) return;

            const container = scrollContainerRef.current;
            if (!container) return;

            const sections = ["address", "notes", "summary", "method", "promo", "checkout"];
            // Adjust offset based on container scroll position
            // The tabs are sticky inside the container, but now the container starts BELOW the tabs.
            // So we just need to account for padding/margins.
            const scrollPosition = container.scrollTop + 30;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    // offsetTop is relative to the nearest positioned ancestor (ck-scroll-content)
                    const offsetTop = element.offsetTop;
                    const offsetBottom = offsetTop + element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                        setActiveTab(section.toUpperCase());
                    }
                }
            }
        };

        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            // Trigger once on mount to set initial active tab
            handleScroll();
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id.toLowerCase());
        const container = scrollContainerRef.current;

        if (element && container) {
            isManualScroll.current = true;

            // Calculate position to scroll to
            // subtract some offset for padding
            const headerOffset = 24;
            const offsetPosition = element.offsetTop - headerOffset;

            container.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });

            // Manually set active tab for immediate feedback
            setActiveTab(id);

            // Re-enable scroll spy after animation (approx)
            setTimeout(() => {
                isManualScroll.current = false;
            }, 600);
        }
    };

    // Get selected pickup point for display
    const selectedPickup = pickupPoints.find(p => p.selected) || pickupPoints[0] || {};

    // Handle Complete Order
    const handleCompleteOrder = async () => {
        if (!restaurant?.id || restaurant.id === "r1") {
            alert("This is a mock restaurant. Cannot place real orders.");
            return;
        }
        if (!pickupPoints.find(p => p.selected)) {
            alert("Please select a delivery address.");
            return;
        }

        const user = JSON.parse(localStorage.getItem("auth_user"));
        if (!user || !user.id) {
            alert("Please login to place an order.");
            return;
        }

        if (!items || items.length === 0) {
            alert("Your cart is empty. Please add items to order.");
            return;
        }

        const selectedP = pickupPoints.find(p => p.selected);

        // Prepare Order DTO
        // See ReqOrderDTO.java for fields
        const orderDTO = {
            customer: { id: user.id },
            restaurant: { id: restaurant.id },
            deliveryAddress: selectedP.address, // Correct field name
            deliveryLatitude: selectedP.lat,
            deliveryLongitude: selectedP.lng,
            specialInstructions: note,
            subtotal: subtotal,
            deliveryFee: deliveryFeeBase, // Use the base fee or the discounted fee depending on backend logic. Usually base.
            totalAmount: totalAmount,
            paymentMethod: paymentMethod.toUpperCase(), // E.g., CASH, VNPAY, EATZY_WALLET
            orderItems: items.map(item => ({
                dish: { id: item.id },
                quantity: item.quantity,
                orderItemOptions: item.selectedOptions?.map(opt => ({
                    menuOption: { id: opt.id }
                })) || []
            })),
            vouchers: [] // Add voucher logic here if needed
        };

        if (selectedShippingVoucher) {
            orderDTO.vouchers.push({ id: selectedShippingVoucher.id });
        }
        if (selectedDiscountVoucher) {
            orderDTO.vouchers.push({ id: selectedDiscountVoucher.id });
        }

        try {
            console.log("Creating order with DTO:", orderDTO);
            const res = await customerApi.createOrder(orderDTO);
            console.log("Order created successfully:", res.data);

            // Navigate to success page or order history
            // Usually returns ResOrderDTO which has the ID
            const orderId = res.data?.data?.id || res.data?.id;

            // Clear cart for this restaurant
            if (restaurant?.id) {
                await deleteRestaurantCart(restaurant.id);
            }

            // Dispatch event to update cart in CustomerApp (CartButton)
            window.dispatchEvent(new Event('cart-updated'));

            // Use sessionStorage to pass success state (more robust than location.state)
            sessionStorage.setItem('orderSuccess', JSON.stringify({ success: true, orderId: orderId }));

            navigate("/customer/home");

        } catch (error) {
            console.error("Failed to create order:", error);
            const errMsg = error.response?.data?.message || error.message || "Failed to create order.";
            alert(`Order creation failed: ${errMsg}`);
        }
    };

    return (
        <div className="ck-design-container">
            {/* ── Header (Custom with Back Button) ── */}
            <header className="ck-header">
                <div className="ck-header-inner">
                    <button className="ck-menu-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <div className="ck-header-logo" onClick={() => navigate("/customer/home")}>
                        <img
                            src="https://res.cloudinary.com/durzk8qz6/image/upload/v1771055848/itc1bfm5hvwdhsmrngt0.png"
                            alt="Eatzy Logo"
                            className="ck-logo-img"
                        />
                    </div>
                </div>
            </header>

            <div className="ck-main-content">
                {/* ── Left Column: Form Content ── */}
                <div className="ck-left-col">
                    {/* Navigation Tabs (Fixed at top of column) */}
                    <div className="ck-tabs-box"> {/* Renamed container to avoid old styles interference if needed */}
                        <div className="ck-tabs-scroll">
                            {["ADDRESS", "NOTES", "SUMMARY", "METHOD", "PROMO", "CHECKOUT"].map((tab) => (
                                <button
                                    key={tab}
                                    className={`ck-tab-btn ${activeTab === tab ? "active" : ""}`}
                                    onClick={() => scrollToSection(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="ck-scroll-content" ref={scrollContainerRef}>

                        {/* Section: Address */}
                        <div id="address" className="ck-card ck-faded">
                            <div className="ck-card-header">
                                <MapPin size={18} className="ck-icon-gray" />
                                <span className="ck-card-title">Địa chỉ giao hàng</span>
                                <div className="ck-ml-auto">
                                    <span className="ck-badge-gray"><MapPin size={12} /> CỐ ĐỊNH TRÊN MAP</span>
                                </div>
                            </div>
                            <div className="ck-form-section">
                                <div className="ck-form-icon-wrapper ck-orange-bg">
                                    <MapPin size={20} />
                                </div>
                                <div className="ck-form-input-wrapper">
                                    <div className="ck-form-text-value">
                                        {selectedPickup.address || "Đang tải..."}
                                    </div>
                                    <p className="ck-text-hint-green">* Vui lòng thay đổi vị trí trên bản đồ ở cột bên phải</p>
                                </div>
                            </div>
                        </div>

                        {/* Section: Notes */}
                        <div id="notes" className="ck-card">
                            <div className="ck-card-header">
                                <FileText size={18} className="ck-icon-gray" />
                                <span className="ck-card-title">Driver Notes</span>
                            </div>
                            <div className="ck-form-section">
                                <div className="ck-form-icon-wrapper ck-orange-bg">
                                    <FileText size={20} />
                                </div>
                                <div className="ck-form-input-wrapper">
                                    <textarea
                                        className="ck-form-input"
                                        placeholder="Ví dụ: Gọi trước khi đến, không bấm chuông"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                    />
                                    <p className="ck-text-hint">THÔNG TIN SẼ HIỂN THỊ CHO TÀI XẾ</p>
                                </div>
                            </div>
                        </div>

                        {/* Section: Order Items (Summary) */}
                        <div id="summary" className="ck-card">
                            <div className="ck-card-header">
                                <ShoppingBag size={18} className="ck-icon-gray" />
                                <span className="ck-card-title">Order Items</span>
                                <div className="ck-ml-auto">
                                    <span className="ck-item-count-badge">{MOCK_ITEMS.length} items</span>
                                </div>
                            </div>
                            <div className="ck-items-list">
                                {items.map((item) => (
                                    <div key={item.id} className="ck-item-row">
                                        <div className="ck-item-info">
                                            <div className="ck-item-qty">
                                                {item.quantity}x
                                            </div>
                                            <img src={item.imageUrl} alt={item.name} className="ck-item-img" />
                                            <div>
                                                <p className="ck-item-name">{item.name}</p>
                                                <p className="ck-item-desc">{item.description}</p>
                                                {item.selectedOptions && item.selectedOptions.length > 0 && (
                                                    <p className="ck-item-options">
                                                        {item.selectedOptions.map(opt => opt.name).join(", ")}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="ck-item-price">
                                            {formatVnd(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section: Payment Method */}
                        <div id="method" className="ck-card">
                            <div className="ck-card-header">
                                <CreditCard size={18} className="ck-icon-gray" />
                                <span className="ck-card-title">Payment Method</span>
                            </div>
                            <div className="ck-methods-grid">
                                {MOCK_PAYMENT_METHODS.map((method) => (
                                    <div
                                        key={method.id}
                                        className={`ck-method-card ${paymentMethod === method.id ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod(method.id)}
                                    >
                                        <div className="ck-method-header">
                                            <div className="ck-icon-gray-dark">{method.icon}</div>
                                            {paymentMethod === method.id && <div className="ck-check-circle"><Check size={12} color="white" /></div>}
                                        </div>
                                        <div className="ck-method-content">
                                            <div className="ck-method-label-row">
                                                <p className="ck-method-label">{method.label}</p>
                                                {method.id === "eatzy_wallet" && (
                                                    <p className="ck-method-balance">{formatVnd(walletBalance)}</p>
                                                )}
                                            </div>
                                            <p className="ck-method-sub">{method.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section: Promo */}
                        <div id="promo" className="ck-promo-grid">
                            {/* Left: Vouchers */}
                            <div className="ck-card ck-h-full">
                                <div className="ck-card-header">
                                    <Tag size={18} className="ck-icon-gray" />
                                    <span className="ck-card-title">Promo & Vouchers</span>
                                </div>

                                <div className="ck-voucher-section">
                                    <div className="ck-section-subtitle ck-text-blue">
                                        <Truck size={16} className="ck-mr-2" />
                                        <span>Shipping Vouchers</span>
                                    </div>
                                    <div className="ck-voucher-list">
                                        {shippingVouchers.map(v => {
                                            const isEligible = !v.minOrderValue || subtotal >= v.minOrderValue;
                                            const isSelected = selectedShippingVoucher?.id === v.id;
                                            const distText = v.discountType === 'PERCENTAGE'
                                                ? `Giảm ${v.discountValue}% tối đa ${formatVnd(v.maxDiscountAmount || 0)}`
                                                : `Tiết kiệm ${formatVnd(v.discountValue)}`;

                                            return (
                                                <div
                                                    key={v.id}
                                                    className={`ck-voucher-row ck-voucher-shipping ${!isEligible ? 'ck-voucher-disabled' : ''} ${isSelected ? 'active' : ''}`}
                                                    onClick={() => isEligible && handleSelectVoucher(v)}
                                                >
                                                    <div className="ck-voucher-icon"><Truck size={16} /></div>
                                                    <div className="ck-voucher-content">
                                                        <div className="ck-voucher-header">
                                                            <span className="ck-voucher-title">{v.description || v.code}</span>
                                                        </div>
                                                        <p className="ck-voucher-desc ck-text-blue">{distText}</p>
                                                        <p className="ck-voucher-desc-sub">
                                                            {v.minOrderValue ? `ĐƠN TỪ ${formatVnd(v.minOrderValue)}` : "Đơn tối thiểu 0đ"}
                                                            {v.endDate && <span className="ck-voucher-exp"> • HSD: {new Date(v.endDate).toLocaleDateString('vi-VN')}</span>}
                                                        </p>
                                                        {!isEligible && (
                                                            <div className="ck-voucher-warning">
                                                                Đơn hàng chưa đủ điều kiện
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={`ck-radio-circle ${isSelected ? 'active' : ''}`}>
                                                        {isSelected && <Check size={12} color="white" style={{ display: 'block', margin: '1px auto' }} />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {shippingVouchers.length === 0 && <p className="ck-empty-text">Không có mã vận chuyển</p>}
                                    </div>
                                </div>

                                <div className="ck-voucher-section">
                                    <div className="ck-section-subtitle ck-text-green">
                                        <Tag size={16} className="ck-mr-2" />
                                        <span>Discount Vouchers</span>
                                    </div>
                                    <div className="ck-voucher-list">
                                        {discountVouchers.map(v => {
                                            const isEligible = !v.minOrderValue || subtotal >= v.minOrderValue;
                                            const isSelected = selectedDiscountVoucher?.id === v.id;
                                            const distText = v.discountType === 'PERCENTAGE'
                                                ? `Giảm ${v.discountValue}% tối đa ${formatVnd(v.maxDiscountAmount || 0)}`
                                                : `Giảm ${formatVnd(v.discountValue)}`;

                                            return (
                                                <div
                                                    key={v.id}
                                                    className={`ck-voucher-row ${!isEligible ? 'ck-voucher-disabled' : ''} ${isSelected ? 'active' : ''}`}
                                                    onClick={() => isEligible && handleSelectVoucher(v)}
                                                >
                                                    <div className="ck-voucher-icon green"><Tag size={16} /></div>
                                                    <div className="ck-voucher-content">
                                                        <div className="ck-voucher-header">
                                                            <span className="ck-voucher-title">{v.description || v.code}</span>
                                                        </div>
                                                        <p className="ck-voucher-desc ck-text-green">{distText}</p>
                                                        <p className="ck-voucher-desc-sub">
                                                            {v.minOrderValue ? `ĐƠN TỪ ${formatVnd(v.minOrderValue)}` : "Đơn tối thiểu 0đ"}
                                                            {v.endDate && <span className="ck-voucher-exp"> • HSD: {new Date(v.endDate).toLocaleDateString('vi-VN')}</span>}
                                                        </p>
                                                        {!isEligible && (
                                                            <div className="ck-voucher-warning">
                                                                Đơn hàng chưa đủ điều kiện
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={`ck-radio-circle ${isSelected ? 'active' : ''}`}>
                                                        {isSelected && <Check size={12} color="white" style={{ display: 'block', margin: '1px auto' }} />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {discountVouchers.length === 0 && <p className="ck-empty-text">Không có mã giảm giá</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Payment Details */}
                            <div id="checkout" className="ck-card ck-h-full">
                                <div className="ck-card-header">
                                    <Banknote size={18} className="ck-icon-gray" />
                                    <span className="ck-card-title">Payment Details</span>
                                </div>
                                <div className="ck-payment-summary">
                                    <div className="ck-summary-row">
                                        <span>Subtotal</span>
                                        <span>{formatVnd(subtotal)}</span>
                                    </div>
                                    <div className="ck-summary-row">
                                        <span>Delivery Fee</span>
                                        <span style={{ color: shippingDiscount > 0 ? '#9CA3AF' : 'inherit' }}>
                                            {formatVnd(deliveryFeeBase)}
                                        </span>
                                    </div>
                                    {shippingDiscount > 0 && (
                                        <div className="ck-summary-row">
                                            <span className="ck-text-blue">Shipping Discount</span>
                                            <span className="ck-text-blue">-{formatVnd(shippingDiscount)}</span>
                                        </div>
                                    )}
                                    {orderDiscount > 0 && (
                                        <div className="ck-summary-row">
                                            <span className="ck-text-green">Voucher Discount</span>
                                            <span className="ck-text-green">-{formatVnd(orderDiscount)}</span>
                                        </div>
                                    )}
                                    <div className="ck-total-row">
                                        <span className="ck-total-label">Total Amount</span>
                                        <div className="ck-total-right">
                                            <p className="ck-total-amount">{formatVnd(totalAmount)}</p>
                                            <p className="ck-vat-text">VAT Included</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> {/* End of ck-promo-grid */}
                    </div > {/* End of ck-scroll-content */}

                </div > {/* End of ck-left-col */}
                {/* ── Right Column: Map & Actions ── */}
                <div className="ck-right-col">
                    <div className="ck-right-header">
                        <span className="ck-status-badge">CHECKOUT PROCESS</span>
                        <h2 className="ck-right-title">FINAL STEP <span className="ck-res-name">{restaurant?.name || "Nhà hàng"}</span></h2>
                    </div>

                    <div className="ck-map-wrapper">
                        {(() => {
                            const mapPickup = { lat: restaurant?.latitude || 10.7731, lng: restaurant?.longitude || 106.7030 };
                            return (
                                <DeliveryMapView
                                    pickup={mapPickup}
                                    dropoff={{ lat: selectedPickup.lat || location?.latitude || 10.7769, lng: selectedPickup.lng || location?.longitude || 106.7009 }}
                                    showRoute={true}
                                    interactive={true}
                                />
                            );
                        })()}
                        <button className="ck-map-relocate"><Crosshair size={18} /></button>
                    </div>

                    <div className="ck-right-scroll-box">
                        <div className="ck-pickup-section">
                            <div className="ck-card-header">
                                <MapPin size={18} className="ck-icon-dark" />
                                <span className="ck-card-title">Select Pickup Point</span>
                            </div>

                            <div className="ck-pickup-list">
                                {pickupPoints.map(point => (
                                    <div
                                        key={point.id}
                                        className={`ck-pickup-option ${point.selected ? 'active' : ''}`}
                                        onClick={() => setPickupPoints(prev => prev.map(p => ({ ...p, selected: p.id === point.id })))}
                                    >
                                        <div className="ck-pickup-dot-wrapper">
                                            {point.selected ? <div className="ck-pickup-dot-active"><MapPin size={12} color="green" /></div> : <div className="ck-pickup-dot"><MapPin size={14} /></div>}
                                        </div>
                                        <div className="ck-pickup-info">
                                            <p className={`ck-pickup-name ${point.selected ? 'active' : ''}`}>{point.name}</p>
                                            <p className="ck-pickup-address">{point.address}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="ck-right-footer-sticky">
                        <button className="ck-complete-btn" onClick={handleCompleteOrder}>
                            COMPLETE ORDER <span className="ck-btn-price">{formatVnd(totalAmount)}</span>
                        </button>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default CheckoutPage;
