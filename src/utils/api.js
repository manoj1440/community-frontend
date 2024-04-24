import { message } from 'antd';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

const api = {
    request: async (method, url, data = {}) => {
        try {
            message.loading({ content: 'Loading...', key: 'global-loader' });
            const response = await axiosInstance({
                method,
                url,
                data,
            });
            message.destroy('global-loader');
            return response.data;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.tokenFailed) {
                window.location.href = '/login';
                localStorage.clear();
            }
            message.destroy('global-loader');
            throw error;
        }
    },
};

export default api;
