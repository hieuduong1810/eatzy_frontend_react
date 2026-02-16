import axiosClient from "../axios";

const userApi = {
    // Get users with filter support (e.g. by role)
    getUsers: async (params = {}) => {
        try {
            const response = await axiosClient.get("/api/v1/users", {
                params: {
                    page: 1,
                    size: 10,
                    ...params
                },
            });
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },

    getUserById: async (id) => {
        try {
            const response = await axiosClient.get(`/api/v1/users/${id}`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Error fetching user details:", error);
            throw error;
        }
    },

    createUser: async (data) => {
        try {
            const response = await axiosClient.post("/api/v1/users", data);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    updateUser: async (data) => {
        try {
            const response = await axiosClient.put("/api/v1/users", data);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            await axiosClient.delete(`/api/v1/users/${id}`);
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    },

    updateUserActiveStatus: async (id, isActive) => {
        try {
            const response = await axiosClient.put(`/api/v1/users/${id}/active`, { isActive });
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Error updating user status:", error);
            throw error;
        }
    },

    // Assign role to user (using update user endpoint)
    assignRoleToUser: async (user, roleId) => {
        try {
            // Need to fetch full user first or assume 'user' object has all required fields for update
            // Ideally backend should have a specific endpoint for this, but standard update is:
            // PUT /users with role object inside.
            const updatedUser = {
                ...user,
                role: { id: roleId }
            };
            const response = await axiosClient.put("/api/v1/users", updatedUser);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Error assigning role to user:", error);
            throw error;
        }
    }
};

export default userApi;
