import axiosClient from "../axios";

const systemConfigApi = {
    getAllConfigs: (params) => {
        const url = '/api/v1/system-configurations';
        return axiosClient.get(url, { params });
    },
    getConfigByKey: (key) => {
        const url = `/api/v1/system-configurations/key/${key}`;
        return axiosClient.get(url);
    },
    updateConfig: (data) => {
        const url = '/api/v1/system-configurations';
        return axiosClient.put(url, data);
    }
};

export default systemConfigApi;
