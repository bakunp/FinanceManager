import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

export const addFixedExpense = async (expenseData) => {
    try {
        await apiPost('/FixedExpense', expenseData);
        return true;
    } catch (error) {
        console.error('Add FixedExpense Error:', error);
        return false;
    }
};

export const getFixedExpenses = async () => {
    try {
        return await apiGet('/FixedExpense');
    } catch (error) {
        console.error('Get FixedExpenses Error:', error);
        return [];
    }
};

export const modifyFixedExpense = async (expenseData) => {
    try {
        await apiPut('/FixedExpense', expenseData);
        return true;
    } catch (error) {
        console.error('Modify FixedExpense Error:', error);
        return false;
    }
};

export const removeFixedExpense = async (id) => {
    try {
        await apiDelete(`/FixedExpense/${id}`);
        return true;
    } catch (error) {
        console.error('Remove FixedExpense Error:', error);
        return false;
    }
};