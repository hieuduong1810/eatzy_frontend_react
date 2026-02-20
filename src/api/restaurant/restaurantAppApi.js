import axiosClient from "../axios";

const restaurantAppApi = {
    getMyWallet: () => {
        const url = "/api/v1/wallets/my-wallet";
        return axiosClient.get(url);
    },
    getMyTransactions: (params) => {
        const url = "/api/v1/wallet-transactions/my-transactions";
        return axiosClient.get(url, { params });
    },
    getMyOrders: (params) => {
        const url = "/api/v1/orders/my-restaurant";
        return axiosClient.get(url, { params });
    },
    getMenu: () => {
        const url = "/api/v1/restaurants/my-restaurant/menu";
        return axiosClient.get(url);
    },
    getReviews: (params) => {
        const url = "/api/v1/reviews/my-restaurant";
        return axiosClient.get(url, { params });
    },
    getMyRestaurant: () => {
        const url = "/api/v1/restaurants/my-restaurant";
        return axiosClient.get(url);
    },
    updateOrderStatus: (orderId, status) => {
        const url = `/api/v1/orders/${orderId}/status`;
        return axiosClient.put(url, null, { params: { status } });
    },
    getOverviewReport: (params) => {
        const url = "/api/v1/restaurants/reports/full";
        return axiosClient.get(url, { params });
    },
    getRevenueReport: (params) => {
        const url = "/api/v1/restaurants/reports/revenue";
        return axiosClient.get(url, { params });
    },
    getOrdersReport: (params) => {
        const url = "/api/v1/restaurants/reports/orders";
        return axiosClient.get(url, { params });
    },
    getMenuReport: () => {
        const url = "/api/v1/restaurants/reports/menu";
        return axiosClient.get(url);
    },
    getReviewsReport: () => {
        const url = "/api/v1/restaurants/reports/reviews";
        return axiosClient.get(url);
    },
    openRestaurant: () => {
        const url = "/api/v1/restaurants/open";
        return axiosClient.post(url);
    },
    closeRestaurant: () => {
        const url = "/api/v1/restaurants/close";
        return axiosClient.post(url);
    },
    acceptOrder: (orderId) => {
        const url = `/api/v1/orders/${orderId}/restaurant/accept`;
        return axiosClient.patch(url);
    },
    markOrderAsReady: (orderId) => {
        const url = `/api/v1/orders/${orderId}/restaurant/ready`;
        return axiosClient.patch(url);
    },
    getOrder: (orderId) => {
        const url = `/api/v1/orders/${orderId}`;
        return axiosClient.get(url);
    },
    updateCategories: (categories) => {
        const url = "/api/v1/restaurants/my-restaurant/categories";
        return axiosClient.put(url, categories);
    },
    deleteDish: (dishId) => {
        const url = `/api/v1/dishes/${dishId}`;
        return axiosClient.delete(url);
    }
};

export default restaurantAppApi;
