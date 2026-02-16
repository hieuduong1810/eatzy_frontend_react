/* =============================================
   CUSTOMER APP – Mock Data (matches eatzy_frontend)
   ============================================= */

// ── Restaurants (matching mockSearchData.ts structure) ──
export const mockRestaurants = [
    { id: "rest-1", name: "Phở Hà Nội", slug: "pho-ha-noi", categories: [{ id: "cat-vn", name: "Vietnamese" }], status: "OPEN", rating: 4.8, averageRating: 4.8, address: "123 Nguyễn Huệ, Q1, TP.HCM", imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800", description: "Authentic Northern Vietnamese cuisine with traditional pho and street food favorites", reviewCount: 128 },
    { id: "rest-2", name: "Sushi Sakura", slug: "sushi-sakura", categories: [{ id: "cat-jp", name: "Japanese" }], status: "OPEN", rating: 4.9, averageRating: 4.9, address: "456 Lê Lợi, Q1, TP.HCM", imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800", description: "Premium Japanese sushi and sashimi with fresh ingredients imported daily", reviewCount: 95 },
    { id: "rest-3", name: "Pizza Bella Italia", slug: "pizza-bella-italia", categories: [{ id: "cat-it", name: "Italian" }], status: "OPEN", rating: 4.7, averageRating: 4.7, address: "789 Pasteur, Q3, TP.HCM", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800", description: "Authentic Italian pizzas and pastas made with imported ingredients", reviewCount: 76 },
    { id: "rest-4", name: "Bún Bò Huế Authentic", slug: "bun-bo-hue", categories: [{ id: "cat-vn", name: "Vietnamese" }], status: "OPEN", rating: 4.6, averageRating: 4.6, address: "321 Võ Văn Tần, Q3, TP.HCM", imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800", description: "Traditional Central Vietnamese cuisine specializing in spicy beef noodle soup", reviewCount: 112 },
    { id: "rest-5", name: "Café De Paris", slug: "cafe-de-paris", categories: [{ id: "cat-cafe", name: "Café" }], status: "OPEN", rating: 4.5, averageRating: 4.5, address: "654 Đồng Khởi, Q1, TP.HCM", imageUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800", description: "French-inspired café serving artisanal coffee and delicate pastries", reviewCount: 88 },
    { id: "rest-6", name: "Korean BBQ House", slug: "korean-bbq", categories: [{ id: "cat-kr", name: "Korean" }], status: "OPEN", rating: 4.8, averageRating: 4.8, address: "987 Nguyễn Thị Minh Khai, Q3, TP.HCM", imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800", description: "Premium Korean BBQ with all-you-can-eat options and authentic side dishes", reviewCount: 156 },
    { id: "rest-7", name: "Thai Spice Kitchen", slug: "thai-spice", categories: [{ id: "cat-th", name: "Thai" }], status: "OPEN", rating: 4.7, averageRating: 4.7, address: "147 Hai Bà Trưng, Q1, TP.HCM", imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800", description: "Authentic Thai flavors with the perfect balance of sweet, sour, salty, and spicy", reviewCount: 67 },
    { id: "rest-8", name: "Burger Brothers", slug: "burger-brothers", categories: [{ id: "cat-burger", name: "Burger" }], status: "OPEN", rating: 4.6, averageRating: 4.6, address: "258 Cách Mạng Tháng 8, Q10, TP.HCM", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800", description: "Gourmet burgers made with premium beef and creative toppings", reviewCount: 134 },
    { id: "rest-9", name: "Dim Sum Palace", slug: "dim-sum-palace", categories: [{ id: "cat-cn", name: "Chinese" }], status: "OPEN", rating: 4.9, averageRating: 4.9, address: "369 Nguyễn Đình Chiểu, Q3, TP.HCM", imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800", description: "Traditional Cantonese dim sum served in bamboo steamers with tea", reviewCount: 201 },
    { id: "rest-10", name: "Mediterranean Delight", slug: "mediterranean-delight", categories: [{ id: "cat-med", name: "Mediterranean" }], status: "OPEN", rating: 4.7, averageRating: 4.7, address: "741 Trần Hưng Đạo, Q5, TP.HCM", imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800", description: "Fresh Mediterranean cuisine with healthy options and vibrant flavors", reviewCount: 89 },
];

// ── Menu Categories ──
export const mockMenuCategories = [
    { id: "mc-1-1", name: "Phở & Noodles", restaurantId: "rest-1", displayOrder: 1 },
    { id: "mc-1-2", name: "Appetizers", restaurantId: "rest-1", displayOrder: 2 },
    { id: "mc-2-1", name: "Sushi & Sashimi", restaurantId: "rest-2", displayOrder: 1 },
    { id: "mc-2-2", name: "Special Rolls", restaurantId: "rest-2", displayOrder: 2 },
    { id: "mc-3-1", name: "Classic Pizzas", restaurantId: "rest-3", displayOrder: 1 },
    { id: "mc-3-2", name: "Pasta Dishes", restaurantId: "rest-3", displayOrder: 2 },
    { id: "mc-4-1", name: "Noodle Soups", restaurantId: "rest-4", displayOrder: 1 },
    { id: "mc-4-2", name: "Rice Dishes", restaurantId: "rest-4", displayOrder: 2 },
    { id: "mc-5-1", name: "Coffee & Drinks", restaurantId: "rest-5", displayOrder: 1 },
    { id: "mc-5-2", name: "Pastries & Desserts", restaurantId: "rest-5", displayOrder: 2 },
    { id: "mc-6-1", name: "BBQ Meats", restaurantId: "rest-6", displayOrder: 1 },
    { id: "mc-6-2", name: "Hot Pots & Stews", restaurantId: "rest-6", displayOrder: 2 },
    { id: "mc-7-1", name: "Curry & Stir-fry", restaurantId: "rest-7", displayOrder: 1 },
    { id: "mc-7-2", name: "Salads & Appetizers", restaurantId: "rest-7", displayOrder: 2 },
    { id: "mc-8-1", name: "Signature Burgers", restaurantId: "rest-8", displayOrder: 1 },
    { id: "mc-8-2", name: "Sides & Drinks", restaurantId: "rest-8", displayOrder: 2 },
    { id: "mc-9-1", name: "Steamed Dim Sum", restaurantId: "rest-9", displayOrder: 1 },
    { id: "mc-9-2", name: "Fried & Baked", restaurantId: "rest-9", displayOrder: 2 },
    { id: "mc-10-1", name: "Mezze & Salads", restaurantId: "rest-10", displayOrder: 1 },
    { id: "mc-10-2", name: "Main Courses", restaurantId: "rest-10", displayOrder: 2 },
];

// ── Dishes ──
export const mockDishes = [
    // Phở Hà Nội
    { id: "d-1-1", name: "Phở Bò Tái", description: "Rare beef pho with fresh herbs and lime", price: 65000, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400", restaurantId: "rest-1", menuCategoryId: "mc-1-1", isAvailable: true, rating: 4.8 },
    { id: "d-1-2", name: "Phở Gà", description: "Chicken pho with tender meat and clear broth", price: 60000, imageUrl: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400", restaurantId: "rest-1", menuCategoryId: "mc-1-1", isAvailable: true, rating: 4.7 },
    { id: "d-1-3", name: "Bún Chả", description: "Grilled pork with vermicelli and herbs", price: 70000, imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400", restaurantId: "rest-1", menuCategoryId: "mc-1-1", isAvailable: true, rating: 4.9 },
    { id: "d-1-4", name: "Gỏi Cuốn", description: "Fresh spring rolls with shrimp and pork", price: 45000, imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", restaurantId: "rest-1", menuCategoryId: "mc-1-2", isAvailable: true, rating: 4.6 },
    { id: "d-1-5", name: "Chả Giò", description: "Crispy fried spring rolls", price: 50000, imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400", restaurantId: "rest-1", menuCategoryId: "mc-1-2", isAvailable: true, rating: 4.7 },
    // Sushi Sakura
    { id: "d-2-1", name: "Salmon Sashimi", description: "Fresh Norwegian salmon sliced thin", price: 180000, imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400", restaurantId: "rest-2", menuCategoryId: "mc-2-1", isAvailable: true, rating: 4.9 },
    { id: "d-2-2", name: "Tuna Sashimi", description: "Premium bluefin tuna sashimi", price: 220000, imageUrl: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400", restaurantId: "rest-2", menuCategoryId: "mc-2-1", isAvailable: true, rating: 5.0 },
    { id: "d-2-3", name: "Dragon Roll", description: "Eel and cucumber topped with avocado", price: 280000, imageUrl: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400", restaurantId: "rest-2", menuCategoryId: "mc-2-2", isAvailable: true, rating: 4.8 },
    { id: "d-2-4", name: "Rainbow Roll", description: "California roll topped with assorted fish", price: 300000, imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400", restaurantId: "rest-2", menuCategoryId: "mc-2-2", isAvailable: true, rating: 4.9 },
    // Pizza Bella Italia
    { id: "d-3-1", name: "Margherita", description: "Classic pizza with tomato, mozzarella, basil", price: 140000, imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", restaurantId: "rest-3", menuCategoryId: "mc-3-1", isAvailable: true, rating: 4.7 },
    { id: "d-3-2", name: "Quattro Formaggi", description: "Four cheese pizza with gorgonzola", price: 180000, imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400", restaurantId: "rest-3", menuCategoryId: "mc-3-1", isAvailable: true, rating: 4.8 },
    { id: "d-3-3", name: "Carbonara", description: "Creamy pasta with bacon and parmesan", price: 150000, imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400", restaurantId: "rest-3", menuCategoryId: "mc-3-2", isAvailable: true, rating: 4.8 },
    { id: "d-3-4", name: "Bolognese", description: "Traditional meat sauce with spaghetti", price: 140000, imageUrl: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400", restaurantId: "rest-3", menuCategoryId: "mc-3-2", isAvailable: true, rating: 4.7 },
    // Korean BBQ
    { id: "d-6-1", name: "Galbi", description: "Marinated beef short ribs", price: 280000, imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400", restaurantId: "rest-6", menuCategoryId: "mc-6-1", isAvailable: true, rating: 4.9 },
    { id: "d-6-2", name: "Bulgogi", description: "Marinated sliced beef", price: 250000, imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400", restaurantId: "rest-6", menuCategoryId: "mc-6-1", isAvailable: true, rating: 4.8 },
    { id: "d-6-3", name: "Kimchi Jjigae", description: "Kimchi stew with pork", price: 120000, imageUrl: "https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400", restaurantId: "rest-6", menuCategoryId: "mc-6-2", isAvailable: true, rating: 4.8 },
    // Dim Sum Palace
    { id: "d-9-1", name: "Har Gow", description: "Steamed shrimp dumplings", price: 85000, imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400", restaurantId: "rest-9", menuCategoryId: "mc-9-1", isAvailable: true, rating: 4.9 },
    { id: "d-9-2", name: "Xiao Long Bao", description: "Soup dumplings", price: 95000, imageUrl: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400", restaurantId: "rest-9", menuCategoryId: "mc-9-1", isAvailable: true, rating: 5.0 },
    { id: "d-9-3", name: "Egg Tarts", description: "Portuguese-style egg custard tarts", price: 55000, imageUrl: "https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=400", restaurantId: "rest-9", menuCategoryId: "mc-9-2", isAvailable: true, rating: 4.8 },
];

// ── Vouchers ──
export const mockVouchers = [
    { id: 1, restaurantId: "rest-1", code: "PHO20", description: "Giảm 20% hóa đơn từ 200K", discountType: "PERCENTAGE", discountValue: 20, minOrderValue: 200000 },
    { id: 2, restaurantId: "rest-2", code: "SUSHI10", description: "Giảm 10% cho đơn từ 300K", discountType: "PERCENTAGE", discountValue: 10, minOrderValue: 300000 },
    { id: 3, restaurantId: "rest-3", code: "PIZZA15", description: "Giảm 15% đơn hàng", discountType: "PERCENTAGE", discountValue: 15 },
    { id: 4, restaurantId: "rest-6", code: "BBQ8", description: "Giảm 8% thịt nướng", discountType: "PERCENTAGE", discountValue: 8 },
    { id: 5, restaurantId: "rest-9", code: "DIM10", description: "Giảm 10% dimsum", discountType: "PERCENTAGE", discountValue: 10 },
    { id: 6, code: "FREESHIP", description: "Miễn phí giao hàng đơn từ 150K", discountType: "SHIPPING", discountValue: 30000, minOrderValue: 150000 },
];

// ── Customer Profile ──
export const mockCustomerProfile = {
    id: "user_123",
    name: "Trần Minh Hiếu",
    phone: "0912 345 678",
    email: "hieu.tran@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
    membershipTier: "Gold",
    totalOrders: 42,
    reviewsCount: 15,
    rewardPoints: 850,
};

// ── Favorite Restaurant IDs ──
export const mockFavoriteIds = ["rest-1", "rest-2", "rest-6", "rest-9", "rest-10"];

// ── Order History ──
export const mockOrders = [
    {
        id: 1001, code: "EZ-1001", restaurant: { id: "rest-1", name: "Phở Hà Nội", imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=200", address: "123 Nguyễn Huệ, Q1, TP.HCM" },
        status: "PREPARING", deliveryAddress: "123 Lê Thánh Tôn, Q.1, TP.HCM",
        items: [{ name: "Phở Bò Tái", quantity: 2, price: 65000 }, { name: "Gỏi Cuốn", quantity: 1, price: 45000 }],
        subtotal: 175000, deliveryFee: 15000, discount: 20000, total: 170000,
        createdAt: new Date().toISOString(), estimatedTime: "25-35 phút", driverName: null,
        trackingStep: 2,
        pickup: { lat: 10.7731, lng: 106.7030 },
        dropoff: { lat: 10.7769, lng: 106.7009 },
    },
    {
        id: 1002, code: "EZ-1002", restaurant: { id: "rest-2", name: "Sushi Sakura", imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200", address: "456 Lê Lợi, Q1, TP.HCM" },
        status: "DELIVERING", deliveryAddress: "456 Nguyễn Huệ, Q.1, TP.HCM",
        items: [{ name: "Salmon Sashimi", quantity: 1, price: 180000 }, { name: "Dragon Roll", quantity: 1, price: 280000 }],
        subtotal: 460000, deliveryFee: 20000, discount: 30000, total: 450000,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), estimatedTime: "10-15 phút", driverName: "Lê Thị B",
        trackingStep: 3,
        pickup: { lat: 10.7758, lng: 106.7002 },
        dropoff: { lat: 10.7820, lng: 106.6940 },
        driverLocation: { lat: 10.7790, lng: 106.6970 },
    },
    {
        id: 1003, code: "EZ-1003", restaurant: { id: "rest-3", name: "Pizza Bella Italia", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200", address: "789 Pasteur, Q3, TP.HCM" },
        status: "DELIVERED", deliveryAddress: "123 Lê Thánh Tôn, Q.1, TP.HCM",
        items: [{ name: "Margherita", quantity: 1, price: 140000 }, { name: "Carbonara", quantity: 1, price: 150000 }],
        subtotal: 290000, deliveryFee: 18000, discount: 0, total: 308000,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
        id: 1004, code: "EZ-1004", restaurant: { id: "rest-6", name: "Korean BBQ House", imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200", address: "987 Nguyễn Thị Minh Khai, Q3, TP.HCM" },
        status: "DELIVERED", deliveryAddress: "456 Nguyễn Huệ, Q.1, TP.HCM",
        items: [{ name: "Galbi", quantity: 1, price: 280000 }, { name: "Bulgogi", quantity: 1, price: 250000 }],
        subtotal: 530000, deliveryFee: 15000, discount: 42400, total: 502600,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
        id: 1005, code: "EZ-1005", restaurant: { id: "rest-9", name: "Dim Sum Palace", imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200", address: "369 Nguyễn Đình Chiểu, Q3, TP.HCM" },
        status: "DELIVERED", deliveryAddress: "123 Lê Thánh Tôn, Q.1, TP.HCM",
        items: [{ name: "Har Gow", quantity: 2, price: 85000 }, { name: "Xiao Long Bao", quantity: 2, price: 95000 }],
        subtotal: 360000, deliveryFee: 12000, discount: 36000, total: 336000,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    },
    {
        id: 1006, code: "EZ-1006", restaurant: { id: "rest-5", name: "Café De Paris", imageUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=200", address: "654 Đồng Khởi, Q1, TP.HCM" },
        status: "CANCELLED", deliveryAddress: "123 Lê Thánh Tôn, Q.1, TP.HCM",
        items: [{ name: "Cappuccino", quantity: 2, price: 55000 }],
        subtotal: 110000, deliveryFee: 0, discount: 0, total: 110000,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    },
];

// ── Helper functions ──
export const getDishesForRestaurant = (restaurantId) =>
    mockDishes.filter((d) => d.restaurantId === restaurantId);

export const getMenuCategoriesForRestaurant = (restaurantId) =>
    mockMenuCategories
        .filter((c) => c.restaurantId === restaurantId)
        .sort((a, b) => a.displayOrder - b.displayOrder);

export const getDishesByMenuCategory = (menuCategoryId) =>
    mockDishes.filter((d) => d.menuCategoryId === menuCategoryId);

export const getRestaurantBySlug = (slug) =>
    mockRestaurants.find((r) => r.slug === slug || r.id === slug);

export const getVouchersForRestaurant = (restaurantId) =>
    mockVouchers.filter((v) => v.restaurantId === restaurantId);

export const formatVnd = (n) => new Intl.NumberFormat("vi-VN").format(n) + "đ";


