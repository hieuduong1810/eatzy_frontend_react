import axiosClient from "../axios";

const roleApi = {
    getAllRoles: async (params = {}) => {
        try {
            const response = await axiosClient.get("/api/v1/roles", {
                params: {
                    page: 1,
                    size: 100,
                    ...params
                },
            });
            return response.data?.data?.result || response.data?.result || [];
        } catch (error) {
            console.error("Error fetching roles:", error);
            throw error;
        }
    },

    getRoleById: async (id) => {
        try {
            const response = await axiosClient.get(`/api/v1/roles/${id}`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Error fetching role details:", error);
            throw error;
        }
    },

    createRole: async (data) => {
        try {
            const response = await axiosClient.post("/api/v1/roles", data);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Error creating role:", error);
            throw error;
        }
    },

    updateRole: async (data) => {
        try {
            const response = await axiosClient.put("/api/v1/roles", data);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Error updating role:", error);
            throw error;
        }
    },

    deleteRole: async (id) => {
        try {
            await axiosClient.delete(`/api/v1/roles/${id}`);
        } catch (error) {
            console.error("Error deleting role:", error);
            throw error;
        }
    }
};

export default roleApi;
