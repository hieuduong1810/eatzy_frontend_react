// =============================================
// MOCK DATA - for all admin pages
// =============================================

// --- Dashboard ---
export const dashboardStats = {
    activeOrders: 42,
    totalRestaurants: 156,
    activeDrivers: 89,
    totalCustomers: 12480,
    totalOrders: 28650,
    todayOrders: 142,
    orderGrowth: 12.5,
    completedOrders: 27200,
    totalRevenue: 2850000000,
    revenueGrowth: 8.3,
    userGrowth: 15.2,
    averageOrderValue: 95000,
};

export const revenueChartData = [
    { label: "T1", value: 180000000 },
    { label: "T2", value: 220000000 },
    { label: "T3", value: 195000000 },
    { label: "T4", value: 310000000 },
    { label: "T5", value: 280000000 },
    { label: "T6", value: 350000000 },
    { label: "T7", value: 290000000 },
    { label: "T8", value: 320000000 },
    { label: "T9", value: 380000000 },
    { label: "T10", value: 410000000 },
    { label: "T11", value: 360000000 },
    { label: "T12", value: 450000000 },
];

export const orderTrendData = [
    { label: "T2", value: 120 },
    { label: "T3", value: 145 },
    { label: "T4", value: 98 },
    { label: "T5", value: 178 },
    { label: "T6", value: 165 },
    { label: "T7", value: 142 },
    { label: "CN", value: 110 },
];

export const topRestaurants = [
    { id: "1", name: "Phở Hà Nội", type: "Việt Nam", revenue: 45000000, image: "" },
    { id: "2", name: "Bún Bò Huế", type: "Việt Nam", revenue: 38000000, image: "" },
    { id: "3", name: "Pizza Express", type: "Ý", revenue: 35000000, image: "" },
    { id: "4", name: "Sushi Zen", type: "Nhật Bản", revenue: 32000000, image: "" },
    { id: "5", name: "BBQ Kings", type: "Hàn Quốc", revenue: 29000000, image: "" },
    { id: "6", name: "Bánh Mì SG", type: "Việt Nam", revenue: 27000000, image: "" },
];

export const recentActivities = [
    { id: "1", type: "order", description: "Đơn hàng #12345 được tạo mới", timestamp: new Date(Date.now() - 5 * 60000).toISOString(), status: "Đang xử lý" },
    { id: "2", type: "restaurant", description: "Nhà hàng Pizza Express đăng ký mới", timestamp: new Date(Date.now() - 15 * 60000).toISOString(), status: "Chờ duyệt" },
    { id: "3", type: "driver", description: "Tài xế Nguyễn Văn A đã online", timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
    { id: "4", type: "user", description: "Khách hàng Trần Thị B đăng ký tài khoản", timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
    { id: "5", type: "order", description: "Đơn hàng #12340 đã giao thành công", timestamp: new Date(Date.now() - 60 * 60000).toISOString(), status: "Hoàn thành" },
    { id: "6", type: "system", description: "Hệ thống backup dữ liệu thành công", timestamp: new Date(Date.now() - 120 * 60000).toISOString() },
];

// --- Restaurants ---
export const restaurants = [
    { id: "R001", name: "Phở Hà Nội", ownerName: "Trần Văn A", email: "phohano@email.com", phone: "0901234567", address: "123 Lê Lợi, Q.1, TP.HCM", category: "Việt Nam", status: "active", rating: 4.8, totalOrders: 1250, revenue: 45000000, createdAt: "2025-06-15" },
    { id: "R002", name: "Bún Bò Huế Mười", ownerName: "Nguyễn Thị B", email: "bunbomuoi@email.com", phone: "0912345678", address: "456 Nguyễn Huệ, Q.1, TP.HCM", category: "Việt Nam", status: "active", rating: 4.5, totalOrders: 980, revenue: 38000000, createdAt: "2025-07-20" },
    { id: "R003", name: "Pizza Express", ownerName: "John Smith", email: "pizza@email.com", phone: "0923456789", address: "789 Pasteur, Q.3, TP.HCM", category: "Ý", status: "active", rating: 4.6, totalOrders: 856, revenue: 35000000, createdAt: "2025-08-01" },
    { id: "R004", name: "Sushi Zen", ownerName: "Tanaka Yuki", email: "sushi@email.com", phone: "0934567890", address: "321 Hai Bà Trưng, Q.1, TP.HCM", category: "Nhật Bản", status: "pending", rating: 0, totalOrders: 0, revenue: 0, createdAt: "2026-01-10" },
    { id: "R005", name: "BBQ Kings", ownerName: "Kim Min Ho", email: "bbq@email.com", phone: "0945678901", address: "654 Võ Văn Tần, Q.3, TP.HCM", category: "Hàn Quốc", status: "active", rating: 4.3, totalOrders: 720, revenue: 29000000, createdAt: "2025-09-05" },
    { id: "R006", name: "Cơm Tấm Sài Gòn", ownerName: "Lê Minh C", email: "comtam@email.com", phone: "0956789012", address: "987 Cách Mạng T8, Q.10, TP.HCM", category: "Việt Nam", status: "inactive", rating: 4.1, totalOrders: 450, revenue: 15000000, createdAt: "2025-05-10" },
    { id: "R007", name: "Trà Sữa Hoa Hồng", ownerName: "Phan D", email: "trasua@email.com", phone: "0967890123", address: "159 Nguyễn Trãi, Q.5, TP.HCM", category: "Đồ uống", status: "active", rating: 4.7, totalOrders: 2100, revenue: 52000000, createdAt: "2025-04-15" },
    { id: "R008", name: "Gà Rán Vàng", ownerName: "Hoàng E", email: "garan@email.com", phone: "0978901234", address: "753 Lý Tự Trọng, Q.1, TP.HCM", category: "Gà rán", status: "active", rating: 4.4, totalOrders: 1600, revenue: 42000000, createdAt: "2025-03-20" },
    { id: "R009", name: "Lẩu Thái Spicy", ownerName: "Thanh F", email: "lauthai@email.com", phone: "0989012345", address: "246 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM", category: "Thái", status: "active", rating: 4.2, totalOrders: 890, revenue: 31000000, createdAt: "2025-07-01" },
    { id: "R010", name: "Bánh Mì SG 24h", ownerName: "Minh G", email: "banhmi@email.com", phone: "0990123456", address: "852 Trần Hưng Đạo, Q.5, TP.HCM", category: "Việt Nam", status: "active", rating: 4.9, totalOrders: 3200, revenue: 65000000, createdAt: "2025-01-10" },
    { id: "R011", name: "Mì Ý Mario", ownerName: "Mario Rossi", email: "miymario@email.com", phone: "0901112233", address: "111 Đồng Khởi, Q.1, TP.HCM", category: "Ý", status: "pending", rating: 0, totalOrders: 0, revenue: 0, createdAt: "2026-02-01" },
    { id: "R012", name: "Cháo Ếch Singapore", ownerName: "Hùng H", email: "chaoech@email.com", phone: "0912223344", address: "222 Nguyễn Đình Chiểu, Q.3, TP.HCM", category: "Châu Á", status: "active", rating: 4.0, totalOrders: 380, revenue: 12000000, createdAt: "2025-11-15" },
];

// --- Drivers ---
export const drivers = [
    { id: "D001", name: "Nguyễn Văn Hùng", email: "hung@email.com", phone: "0901111111", vehicleType: "Xe máy", licensePlate: "59A1-12345", status: "online", rating: 4.9, totalTrips: 3200, earnings: 48000000, joinDate: "2025-03-10" },
    { id: "D002", name: "Trần Minh Tuấn", email: "tuan@email.com", phone: "0902222222", vehicleType: "Xe máy", licensePlate: "59B2-23456", status: "busy", rating: 4.7, totalTrips: 2100, earnings: 32000000, joinDate: "2025-04-15" },
    { id: "D003", name: "Lê Đức Anh", email: "anh@email.com", phone: "0903333333", vehicleType: "Xe máy", licensePlate: "59C3-34567", status: "offline", rating: 4.5, totalTrips: 1800, earnings: 27000000, joinDate: "2025-05-20" },
    { id: "D004", name: "Phạm Quốc Bảo", email: "bao@email.com", phone: "0904444444", vehicleType: "Ô tô", licensePlate: "51D-45678", status: "online", rating: 4.8, totalTrips: 950, earnings: 22000000, joinDate: "2025-06-01" },
    { id: "D005", name: "Hoàng Thị Mai", email: "mai@email.com", phone: "0905555555", vehicleType: "Xe máy", licensePlate: "59E5-56789", status: "online", rating: 4.6, totalTrips: 1500, earnings: 23000000, joinDate: "2025-07-10" },
    { id: "D006", name: "Vũ Đình Long", email: "long@email.com", phone: "0906666666", vehicleType: "Xe máy", licensePlate: "59F6-67890", status: "offline", rating: 4.3, totalTrips: 800, earnings: 12000000, joinDate: "2025-08-15" },
    { id: "D007", name: "Đặng Văn Khoa", email: "khoa@email.com", phone: "0907777777", vehicleType: "Xe máy", licensePlate: "59G7-78901", status: "busy", rating: 4.4, totalTrips: 2500, earnings: 38000000, joinDate: "2025-02-20" },
    { id: "D008", name: "Bùi Thanh Sơn", email: "son@email.com", phone: "0908888888", vehicleType: "Ô tô", licensePlate: "51H-89012", status: "online", rating: 4.7, totalTrips: 1100, earnings: 25000000, joinDate: "2025-09-01" },
    { id: "D009", name: "Ngô Thị Hạnh", email: "hanh@email.com", phone: "0909999999", vehicleType: "Xe máy", licensePlate: "59I9-90123", status: "offline", rating: 4.2, totalTrips: 600, earnings: 9000000, joinDate: "2025-10-10" },
    { id: "D010", name: "Dương Văn Phú", email: "phu@email.com", phone: "0910000000", vehicleType: "Xe máy", licensePlate: "59K0-01234", status: "online", rating: 4.8, totalTrips: 4100, earnings: 62000000, joinDate: "2024-12-01" },
];

// --- Customers ---
export const customers = [
    { id: "C001", name: "Trần Thị Bích", email: "bich@email.com", phone: "0911111111", totalOrders: 45, totalSpent: 4275000, status: "active", joinDate: "2025-01-15", lastOrder: "2026-02-10" },
    { id: "C002", name: "Nguyễn Hoàng Nam", email: "nam@email.com", phone: "0922222222", totalOrders: 120, totalSpent: 11400000, status: "active", joinDate: "2024-11-20", lastOrder: "2026-02-12" },
    { id: "C003", name: "Lê Thị Hương", email: "huong@email.com", phone: "0933333333", totalOrders: 8, totalSpent: 760000, status: "active", joinDate: "2026-01-05", lastOrder: "2026-02-08" },
    { id: "C004", name: "Phạm Minh Đức", email: "duc@email.com", phone: "0944444444", totalOrders: 67, totalSpent: 6365000, status: "active", joinDate: "2025-06-10", lastOrder: "2026-02-11" },
    { id: "C005", name: "Hoàng Thị Lan", email: "lan@email.com", phone: "0955555555", totalOrders: 3, totalSpent: 285000, status: "inactive", joinDate: "2025-09-01", lastOrder: "2025-10-15" },
    { id: "C006", name: "Vũ Quốc Trung", email: "trung@email.com", phone: "0966666666", totalOrders: 89, totalSpent: 8455000, status: "active", joinDate: "2025-03-20", lastOrder: "2026-02-12" },
    { id: "C007", name: "Đặng Thị Thuỷ", email: "thuy@email.com", phone: "0977777777", totalOrders: 156, totalSpent: 14820000, status: "active", joinDate: "2024-08-15", lastOrder: "2026-02-11" },
    { id: "C008", name: "Bùi Văn Tâm", email: "tam@email.com", phone: "0988888888", totalOrders: 22, totalSpent: 2090000, status: "active", joinDate: "2025-12-01", lastOrder: "2026-02-09" },
    { id: "C009", name: "Ngô Minh Phát", email: "phat@email.com", phone: "0999999999", totalOrders: 0, totalSpent: 0, status: "pending", joinDate: "2026-02-10", lastOrder: "" },
    { id: "C010", name: "Dương Thị Ngọc", email: "ngoc@email.com", phone: "0910101010", totalOrders: 34, totalSpent: 3230000, status: "active", joinDate: "2025-07-25", lastOrder: "2026-02-07" },
    { id: "C011", name: "Cao Văn Sĩ", email: "si@email.com", phone: "0920202020", totalOrders: 201, totalSpent: 19095000, status: "active", joinDate: "2024-06-01", lastOrder: "2026-02-12" },
    { id: "C012", name: "Tôn Thị Kim", email: "kim@email.com", phone: "0930303030", totalOrders: 15, totalSpent: 1425000, status: "inactive", joinDate: "2025-10-10", lastOrder: "2025-12-20" },
];

// --- Finance ---
export const transactions = [
    { id: "TXN001", orderId: "#12345", type: "Thanh toán đơn hàng", amount: 185000, fee: 18500, net: 166500, paymentMethod: "VNPay", status: "completed", restaurant: "Phở Hà Nội", customer: "Trần Thị Bích", date: "2026-02-12 14:30" },
    { id: "TXN002", orderId: "#12344", type: "Thanh toán đơn hàng", amount: 250000, fee: 25000, net: 225000, paymentMethod: "Momo", status: "completed", restaurant: "Pizza Express", customer: "Nguyễn Hoàng Nam", date: "2026-02-12 13:15" },
    { id: "TXN003", orderId: "#12343", type: "Hoàn tiền", amount: -95000, fee: 0, net: -95000, paymentMethod: "VNPay", status: "completed", restaurant: "Bún Bò Huế Mười", customer: "Lê Thị Hương", date: "2026-02-12 11:45" },
    { id: "TXN004", orderId: "#12342", type: "Thanh toán đơn hàng", amount: 120000, fee: 12000, net: 108000, paymentMethod: "Tiền mặt", status: "completed", restaurant: "Cơm Tấm Sài Gòn", customer: "Phạm Minh Đức", date: "2026-02-12 10:20" },
    { id: "TXN005", orderId: "#12341", type: "Thanh toán đơn hàng", amount: 310000, fee: 31000, net: 279000, paymentMethod: "VNPay", status: "processing", restaurant: "BBQ Kings", customer: "Hoàng Thị Lan", date: "2026-02-12 09:50" },
    { id: "TXN006", orderId: "#12340", type: "Chi tài xế", amount: -45000, fee: 0, net: -45000, paymentMethod: "Ví Eatzy", status: "completed", restaurant: "Phở Hà Nội", customer: "Vũ Quốc Trung", date: "2026-02-11 18:30" },
    { id: "TXN007", orderId: "#12339", type: "Thanh toán đơn hàng", amount: 175000, fee: 17500, net: 157500, paymentMethod: "Momo", status: "completed", restaurant: "Trà Sữa Hoa Hồng", customer: "Đặng Thị Thuỷ", date: "2026-02-11 16:15" },
    { id: "TXN008", orderId: "#12338", type: "Thanh toán đơn hàng", amount: 88000, fee: 8800, net: 79200, paymentMethod: "Tiền mặt", status: "cancelled", restaurant: "Bánh Mì SG 24h", customer: "Bùi Văn Tâm", date: "2026-02-11 14:00" },
    { id: "TXN009", orderId: "", type: "Rút tiền nhà hàng", amount: -5000000, fee: 50000, net: -5050000, paymentMethod: "Ngân hàng", status: "completed", restaurant: "Phở Hà Nội", customer: "", date: "2026-02-11 10:00" },
    { id: "TXN010", orderId: "#12337", type: "Thanh toán đơn hàng", amount: 420000, fee: 42000, net: 378000, paymentMethod: "VNPay", status: "completed", restaurant: "Lẩu Thái Spicy", customer: "Cao Văn Sĩ", date: "2026-02-10 19:30" },
    { id: "TXN011", orderId: "#12336", type: "Thanh toán đơn hàng", amount: 155000, fee: 15500, net: 139500, paymentMethod: "Momo", status: "completed", restaurant: "Gà Rán Vàng", customer: "Dương Thị Ngọc", date: "2026-02-10 12:45" },
    { id: "TXN012", orderId: "", type: "Rút tiền tài xế", amount: -2000000, fee: 20000, net: -2020000, paymentMethod: "Ngân hàng", status: "processing", restaurant: "", customer: "", date: "2026-02-10 09:00" },
];

// --- Promotions ---
export const promotions = [
    { id: "P001", name: "Giảm 30% đơn đầu", code: "WELCOME30", type: "Phần trăm", discount: 30, maxDiscount: 50000, minOrder: 100000, usageLimit: 1000, usageCount: 756, startDate: "2026-01-01", endDate: "2026-03-31", status: "active" },
    { id: "P002", name: "Free ship toàn sàn", code: "FREESHIP", type: "Miễn phí ship", discount: 0, maxDiscount: 25000, minOrder: 50000, usageLimit: 5000, usageCount: 3210, startDate: "2026-02-01", endDate: "2026-02-28", status: "active" },
    { id: "P003", name: "Giảm 50K đơn từ 200K", code: "SAVE50K", type: "Cố định", discount: 50000, maxDiscount: 50000, minOrder: 200000, usageLimit: 500, usageCount: 500, startDate: "2026-01-15", endDate: "2026-02-15", status: "expired" },
    { id: "P004", name: "Combo trưa vui vẻ", code: "LUNCH20", type: "Phần trăm", discount: 20, maxDiscount: 40000, minOrder: 80000, usageLimit: 2000, usageCount: 890, startDate: "2026-02-10", endDate: "2026-04-10", status: "active" },
    { id: "P005", name: "Flash sale cuối tuần", code: "WEEKEND", type: "Phần trăm", discount: 40, maxDiscount: 60000, minOrder: 150000, usageLimit: 300, usageCount: 0, startDate: "2026-03-01", endDate: "2026-03-02", status: "scheduled" },
    { id: "P006", name: "Giảm 15% Trà sữa", code: "TRASUA15", type: "Phần trăm", discount: 15, maxDiscount: 30000, minOrder: 0, usageLimit: 800, usageCount: 650, startDate: "2025-12-01", endDate: "2026-01-31", status: "expired" },
    { id: "P007", name: "Mừng khai trương", code: "OPEN100", type: "Cố định", discount: 100000, maxDiscount: 100000, minOrder: 300000, usageLimit: 100, usageCount: 45, startDate: "2026-02-15", endDate: "2026-02-20", status: "scheduled" },
    { id: "P008", name: "Sinh nhật Eatzy", code: "BDAY2026", type: "Phần trăm", discount: 25, maxDiscount: 75000, minOrder: 100000, usageLimit: 10000, usageCount: 1200, startDate: "2026-02-01", endDate: "2026-02-28", status: "active" },
];

// --- System Config ---
export const systemConfig = [
    {
        group: "Phí dịch vụ",
        items: [
            { key: "platform_fee_percent", label: "Phí nền tảng (%)", value: "10", type: "number", description: "Phần trăm phí hệ thống thu trên mỗi đơn hàng" },
            { key: "delivery_fee_base", label: "Phí giao hàng cơ bản (VNĐ)", value: "15000", type: "number", description: "Phí giao hàng cơ bản cho khoảng cách < 3km" },
            { key: "delivery_fee_per_km", label: "Phí giao hàng / km (VNĐ)", value: "5000", type: "number", description: "Phí tính thêm cho mỗi km vượt quá 3km" },
        ],
    },
    {
        group: "Giới hạn đơn hàng",
        items: [
            { key: "min_order_value", label: "Giá trị đơn hàng tối thiểu (VNĐ)", value: "30000", type: "number", description: "Giá trị tối thiểu để đặt đơn" },
            { key: "max_order_distance_km", label: "Khoảng cách giao hàng tối đa (km)", value: "15", type: "number", description: "Khoảng cách tối đa cho phép giao hàng" },
        ],
    },
    {
        group: "Tài xế",
        items: [
            { key: "driver_commission_percent", label: "Hoa hồng tài xế (%)", value: "80", type: "number", description: "Phần trăm phí giao hàng tài xế nhận được" },
            { key: "driver_min_rating", label: "Đánh giá tối thiểu", value: "4.0", type: "number", description: "Đánh giá tối thiểu để tài xế tiếp tục hoạt động" },
            { key: "driver_max_active_orders", label: "Số đơn tối đa cùng lúc", value: "3", type: "number", description: "Số đơn hàng tối đa một tài xế có thể nhận cùng lúc" },
        ],
    },
    {
        group: "Hệ thống",
        items: [
            { key: "maintenance_mode", label: "Chế độ bảo trì", value: "false", type: "boolean", description: "Bật/tắt chế độ bảo trì hệ thống" },
            { key: "auto_cancel_minutes", label: "Tự động huỷ đơn (phút)", value: "30", type: "number", description: "Thời gian chờ trước khi tự động huỷ đơn chưa được nhận" },
        ],
    },
];

// --- Permissions ---
export const permissions = [
    { id: "ROLE001", name: "Super Admin", description: "Toàn quyền hệ thống", userCount: 2, permissions: ["all"], createdAt: "2024-01-01" },
    { id: "ROLE002", name: "Admin", description: "Quản trị viên hệ thống", userCount: 5, permissions: ["users.read", "users.write", "restaurants.read", "restaurants.write", "orders.read", "finance.read"], createdAt: "2024-01-01" },
    { id: "ROLE003", name: "Support", description: "Nhân viên hỗ trợ", userCount: 12, permissions: ["users.read", "restaurants.read", "orders.read", "orders.write"], createdAt: "2024-06-15" },
    { id: "ROLE004", name: "Finance", description: "Nhân viên tài chính", userCount: 3, permissions: ["finance.read", "finance.write", "orders.read"], createdAt: "2025-01-10" },
    { id: "ROLE005", name: "Marketing", description: "Nhân viên marketing", userCount: 4, permissions: ["promotions.read", "promotions.write", "users.read"], createdAt: "2025-03-20" },
];
