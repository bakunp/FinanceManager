
const url = 'https://localhost:7021/api/Fund';

export const addFundsAutomatically = async (amount) => {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: amount }) 
        });

        if (!response.ok) {
            const errorText = await response.text(); 
            throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        return true;
    } catch (error) {
        console.error("Fund Service Error:", error);
        return false;
    }
};