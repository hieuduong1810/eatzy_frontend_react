// ============ STORE PROFILE ============
export const mockStore = {
    id: "r1",
    name: "Burger Prince",
    description: "Cơm trưa sinh viên, cơm tấm sườn bì chả.",
    address: "Canteen B4, KTX Khu B ĐHQG, Đông Hòa, Dĩ An",
    coords: { lat: 10.8837, lng: 106.7807 },
    commissionRate: 10.0,
    phone: "0901234567",
    email: "restaurant@gmail.com",
    rating: 4.5,
    reviewCount: 187,
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    categories: [
        { id: "c1", name: "Burger" },
        { id: "c2", name: "Fast Food" },
        { id: "c3", name: "American" },
    ],
    openingHours: [
        { day: "Thứ 2", isOpen: true, shifts: [{ open: "08:00", close: "22:00" }] },
        { day: "Thứ 3", isOpen: true, shifts: [{ open: "08:00", close: "14:00" }, { open: "16:00", close: "22:00" }] },
        { day: "Thứ 4", isOpen: true, shifts: [{ open: "08:00", close: "22:00" }] },
        { day: "Thứ 5", isOpen: true, shifts: [{ open: "08:00", close: "22:00" }] },
        { day: "Thứ 6", isOpen: true, shifts: [{ open: "08:00", close: "23:00" }] },
        { day: "Thứ 7", isOpen: true, shifts: [{ open: "09:00", close: "23:00" }] },
        { day: "Chủ Nhật", isOpen: false, shifts: [] },
    ],
    images: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400",
    ],
};

// ============ MENU ============
export const menuData = [
    { id: "m1", name: "Gỏi cuốn tôm", description: "Tươi ngon, sốt đặc biệt", price: 60000, image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400", category: "Khai vị", tags: ["bestseller", "nhẹ"], available: true },
    { id: "m2", name: "Phở bò tái", description: "Phở truyền thống, nước dùng thanh", price: 85000, image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400", category: "Món chính", tags: ["popular", "bestseller"], available: true },
    { id: "m3", name: "Bánh flan", description: "Món tráng miệng mềm mịn", price: 35000, image: "https://images.unsplash.com/photo-1599785209799-7b3f6f067f41?w=400", category: "Tráng miệng", tags: ["new"], available: true },
    { id: "m4", name: "Trà đào", description: "Tươi mát, không đường", price: 30000, image: "https://images.unsplash.com/photo-1551024709-8f23befc6d7d?w=400", category: "Đồ uống", tags: [], available: true },
    { id: "m5", name: "Mì xào bò", description: "Mì giòn, bò mềm", price: 90000, image: "https://images.unsplash.com/photo-1604908177522-0dc2f5b4b0a7?w=400", category: "Món chính", tags: ["chef"], available: true },
    { id: "m6", name: "Bún chay xào", description: "Món chay thanh đạm", price: 70000, image: "https://images.unsplash.com/photo-1606312612987-9bbc3b5555e8?w=400", category: "Món chính", tags: ["chay", "popular"], available: false },
    { id: "m7", name: "Gỏi xoài cay", description: "Gỏi tôm mix với xoài chua cay", price: 65000, image: "https://images.unsplash.com/photo-1528723375684-2f48a2f4f27d?w=400", category: "Khai vị", tags: ["spicy"], available: true },
    { id: "m8", name: "Súp nấm", description: "Súp nhẹ, ít đường", price: 40000, image: "https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?w=400", category: "Khai vị", tags: ["low-sugar", "chay"], available: true },
    { id: "m9", name: "Chè sầu riêng", description: "Ngon đậm đà, phù hợp tráng miệng", price: 45000, image: "https://images.unsplash.com/photo-1609991775271-5b25c0aee5cb?w=400", category: "Tráng miệng", tags: ["new", "bestseller"], available: true },
    { id: "m10", name: "Cà phê sữa đá", description: "Đậm vị, đá mát lạnh", price: 25000, image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400", category: "Đồ uống", tags: [], available: true },
];

export const menuCategories = ["Tất cả", "Khai vị", "Món chính", "Tráng miệng", "Đồ uống"];

// ============ ACTIVE ORDERS ============
const CUSTOMER_NAMES = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Minh D", "Hoàng Yến E"];
const FOOD_NAMES = ["Phở Bò", "Cơm Tấm", "Bún Chả", "Gà Rán", "Trà Sữa", "Bánh Mì", "Gỏi Cuốn"];

const makeItems = () => {
    const count = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: count }, () => ({
        name: FOOD_NAMES[Math.floor(Math.random() * FOOD_NAMES.length)],
        quantity: Math.floor(Math.random() * 3) + 1,
        price: Math.floor(Math.random() * 10000) * 5 + 15000,
    }));
};

export const mockActiveOrders = [
    {
        id: "ORD-NEW-1",
        status: "NEW",
        customerName: "Nguyễn Văn A",
        customerAvatar: "https://i.pravatar.cc/150?u=1",
        items: [{ name: "Phở Bò", quantity: 2, price: 85000 }, { name: "Trà Sữa", quantity: 1, price: 30000 }],
        total: 200000,
        paymentMethod: "vnpay",
        createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        deliveryAddress: "123 Nguyễn Huệ, Q.1",
    },
    {
        id: "ORD-NEW-2",
        status: "NEW",
        customerName: "Trần Thị B",
        customerAvatar: "https://i.pravatar.cc/150?u=2",
        items: [{ name: "Cơm Tấm", quantity: 1, price: 45000 }],
        total: 60000,
        paymentMethod: "cash",
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        deliveryAddress: "456 Lê Lợi, Q.3",
    },
    {
        id: "ORD-PREP-1",
        status: "PREPARING",
        customerName: "Lê Văn C",
        customerAvatar: "https://i.pravatar.cc/150?u=3",
        items: [{ name: "Gà Rán", quantity: 3, price: 55000 }, { name: "Bánh Mì", quantity: 1, price: 25000 }],
        total: 190000,
        paymentMethod: "vnpay",
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        deliveryAddress: "789 Trần Hưng Đạo, Q.5",
    },
    {
        id: "ORD-DELIVERY-1",
        status: "DELIVERING",
        customerName: "Phạm Minh D",
        customerAvatar: "https://i.pravatar.cc/150?u=4",
        items: [{ name: "Bún Chả", quantity: 2, price: 75000 }],
        total: 165000,
        paymentMethod: "cash",
        createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        deliveryAddress: "Sân Bay Tân Sơn Nhất",
        driverName: "Trần Văn B",
        driverPhone: "0912345678",
    },
    {
        id: "ORD-DONE-1",
        status: "COMPLETED",
        customerName: "Hoàng Yến E",
        customerAvatar: "https://i.pravatar.cc/150?u=5",
        items: [{ name: "Gỏi Cuốn", quantity: 4, price: 60000 }],
        total: 255000,
        paymentMethod: "vnpay",
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        deliveryAddress: "Chợ Bến Thành, Q.1",
    },
];

// ============ ORDER HISTORY ============
const DRIVER_NAMES = ["Nguyễn Văn A", "Trần Văn B", "Lê Thị C", "Phạm Văn D"];
const VEHICLES = ["Honda Wave", "Yamaha Exciter", "Honda Vision", "Air Blade"];

export const mockOrderHistory = Array.from({ length: 20 }, (_, i) => {
    const statusProb = Math.random();
    const status = statusProb > 0.2 ? "completed" : statusProb > 0.1 ? "cancelled" : "refunded";
    const items = makeItems();
    const subtotal = items.reduce((s, it) => s + it.quantity * it.price, 0);
    const deliveryFee = 15000;
    const discount = Math.random() > 0.7 ? 10000 : 0;
    const platformFee = Math.round(subtotal * 0.15);
    const netIncome = subtotal - platformFee;
    const totalAmount = subtotal + deliveryFee - discount;

    return {
        id: `ORD-${2024000 + i}`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        customerName: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
        customerAvatar: `https://i.pravatar.cc/150?u=${i + 50}`,
        customerPhone: "0987654321",
        deliveryFee,
        discount,
        platformFee,
        netIncome,
        totalAmount,
        paymentMethod: Math.random() > 0.5 ? "vnpay" : "cash",
        status,
        itemsCount: items.length,
        items,
        driverName: DRIVER_NAMES[Math.floor(Math.random() * DRIVER_NAMES.length)],
        driver: {
            name: DRIVER_NAMES[Math.floor(Math.random() * DRIVER_NAMES.length)],
            phone: "0901234567",
            vehicleType: VEHICLES[Math.floor(Math.random() * VEHICLES.length)],
            licensePlate: `59-${Math.floor(Math.random() * 9)}23.45`,
            rating: +(4.5 + Math.random() * 0.5).toFixed(1),
            totalTrips: Math.floor(Math.random() * 5000) + 100,
        },
        reviewRating: status === "completed" ? (Math.random() > 0.7 ? 5 : 4) : undefined,
        deliveryAddress: `${Math.floor(Math.random() * 100)} Nguyễn Huệ, Q.${Math.floor(Math.random() * 10) + 1}`,
    };
}).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

// ============ WALLET ============
const currentBalance = 12500000;

const orderTrxs = mockOrderHistory.slice(0, 10).map((order) => ({
    id: `TRX-${Math.floor(Math.random() * 10000) + 1000}`,
    date: order.createdAt,
    type: "revenue",
    description: `Đơn hàng #${order.id}`,
    amount: order.netIncome,
    status: order.status === "completed" ? "success" : "failed",
    category: "Food Order",
}));

const withdrawals = [
    {
        id: "TRX-8890",
        date: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        type: "withdrawal",
        description: "Rút tiền về VCB *9988",
        amount: -5000000,
        status: "success",
        category: "Withdrawal",
    },
    {
        id: "TRX-8885",
        date: new Date(Date.now() - 86400000 * 3.5).toISOString(),
        type: "withdrawal",
        description: "Rút tiền về VCB *9988",
        amount: -2500000,
        status: "success",
        category: "Withdrawal",
    },
];

const allTrxs = [...orderTrxs, ...withdrawals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

let runningBal = currentBalance;
export const mockRestaurantWallet = {
    balance: { available: currentBalance, pending: 3450000, todayEarnings: 1250000 },
    bankAccount: { bankName: "Vietcombank", accountNumber: "**** **** **** 9988", holderName: "BURGER PRINCE STORE" },
    transactions: allTrxs.map((trx) => {
        const snap = runningBal;
        if (trx.status === "success") runningBal -= trx.amount;
        return { ...trx, balanceAfter: snap };
    }),
};

// ============ REVIEWS ============
export const mockReviews = [
    { id: "rv1", customerName: "Nguyen Van A", customerAvatar: "https://i.pravatar.cc/150?u=20", rating: 5, comment: "Đồ ăn rất ngon, giao hàng nhanh!", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), orderId: "ORD-2024001" },
    { id: "rv2", customerName: "Tran Thi B", customerAvatar: "https://i.pravatar.cc/150?u=21", rating: 4, comment: "Phở ngon, nhưng giao hơi chậm.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), orderId: "ORD-2024003" },
    { id: "rv3", customerName: "Le Van C", customerAvatar: "https://i.pravatar.cc/150?u=22", rating: 5, comment: "Xuất sắc! Sẽ quay lại lần nữa.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), orderId: "ORD-2024005" },
    { id: "rv4", customerName: "Pham Thi D", customerAvatar: "https://i.pravatar.cc/150?u=23", rating: 3, comment: "Tạm ổn, bún hơi nguội.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), orderId: "ORD-2024007" },
    { id: "rv5", customerName: "Hoang Van E", customerAvatar: "https://i.pravatar.cc/150?u=24", rating: 5, comment: "Rất hài lòng, đóng gói cẩn thận.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), orderId: "ORD-2024010" },
    { id: "rv6", customerName: "Do Minh F", customerAvatar: "https://i.pravatar.cc/150?u=25", rating: 4, comment: "Ngon lắm, giá hơi cao.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(), orderId: "ORD-2024012" },
];
