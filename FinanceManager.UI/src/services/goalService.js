import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

export const addGoal = async (goalData) => {
    try {
        await apiPost('/Goals', goalData);
        return true;
    } catch (error) {
        console.error('Add Goal Error:', error);
        return false;
    }
};

export const modifyGoal = async (goalData) => {
    try {
        await apiPut('/Goals', goalData);
        return true;
    } catch (error) {
        console.error('Modify Goal Error:', error);
        return false;
    }
};

export const getAllGoals = async () => {
    try {
        return await apiGet('/Goals');
    } catch (error) {
        console.error('Get All Goals Error:', error);
        return [];
    }
};

export const removeGoal = async (id) => {
    try {
        await apiDelete(`/Goals/${id}`);
        return true;
    } catch (error) {
        console.error('Remove Goal Error:', error);
        return false;
    }
};

export const getTransactionHistory = async (id) => {
    try {
        return await apiGet(`/Goals/${id}/history`);
    } catch (error) {
        console.error('Get Transaction History Error:', error);
        return [];
    }
};