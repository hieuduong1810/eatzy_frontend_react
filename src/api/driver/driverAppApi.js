import axiosClient from "../axios";

const driverAppApi = {
    getMyProfile: async (userId) => {
        const url = `/api/v1/driver-profiles/user/${userId}`;
        return axiosClient.get(url);
    },
    updateProfile: async (data) => {
        const url = '/api/v1/driver-profiles';
        return axiosClient.put(url, data);
    },
    goOnline: async () => {
        const url = '/api/v1/driver-profiles/go-online';
        return axiosClient.post(url);
    },
    goOffline: async () => {
        const url = '/api/v1/driver-profiles/go-offline';
        return axiosClient.post(url);
    },
    getMyStatus: async () => {
        const url = '/api/v1/driver-profiles/my-profile/status';
        return axiosClient.get(url);
    },
    getMyWallet: async () => {
        const url = '/api/v1/wallets/my-wallet';
        return axiosClient.get(url);
    },
    getMyTransactions: async (params) => {
        const url = '/api/v1/wallet-transactions/my-transactions';
        return axiosClient.get(url, { params });
    },
    getMyOrders: async () => {
        const url = "/api/v1/orders/my-driver?page=1&size=100&sort=createdAt,desc";
        return axiosClient.get(url);
    },
    getOrderDetail: async (orderId) => {
        const url = `/api/v1/orders/${orderId}`;
        return axiosClient.get(url);
    }
};

export default driverAppApi;
