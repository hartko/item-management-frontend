import axiosInstance from './axios';

export const login = async (creds) => {
    const response = await axiosInstance.post(`api/auth/login`, creds);
    return response.data;
};

export const register = async (user) => {
    const response = await axiosInstance.post(`api/auth/register`, user);
    return response.data;
};