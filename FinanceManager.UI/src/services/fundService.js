import { apiPut } from './apiClient';

export const addFundsAutomatically = async (amount, description) => {
    try {
        await apiPut('/Fund', { amount, description });
        return true;
    } catch (error) {
        console.error('Fund Service Error (automatic):', error);
        return false;
    }
};

export const addFundsManually = async (id, amount, description) => {
    try {
        await apiPut('/Fund/manual', { goalID: id, amount, description });
        return true;
    } catch (error) {
        console.error('Fund Service Error (manual):', error);
        return false;
    }
};