import axiosInstance from './axios';

export const updateItem = async (itemId, item) => {
    const response = await axiosInstance.put(`api/item/${itemId}`, item);
    return response.data;

};
export const createItem = async (item) => {
    const response = await axiosInstance.post('api/item', item);
    return response.data;
};

export const getItems = async (page = 1, item = 10, searchTerm = '') => {
    const response = await axiosInstance.get('api/item', {
        params: {
            page,
            item,
            searchTerm
        },
    });
    return response.data;

};

export const deleteItem = async (itemId) => {
    const response = await axiosInstance.delete(`api/item/${itemId}`);
    return response.data;

};