import axiosClient from "../axios";

const permissionApi = {
    getAllPermissions: async (params = {}) => {
        try {
            const response = await axiosClient.get("/api/v1/permissions", {
                params: {
                    page: 1,
                    size: 1000,
                    ...params
                },
            });
            return response.data?.data?.result || response.data?.result || [];
        } catch (error) {
            console.error("Error fetching permissions:", error);
            throw error;
        }
    }
};

export default permissionApi;
