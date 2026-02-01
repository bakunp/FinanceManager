
const url = 'https://localhost:7021/api/Fund';

export const addFundsAutomatically = async (amount, description) => {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: amount, description }) 
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

export const addFundsManually = async (id, amount, description) => {
    try {
        const response = await fetch(`${url}/manual`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ goalID: id, amount: amount, description: description}) 
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