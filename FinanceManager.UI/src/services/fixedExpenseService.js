
const url = 'https://localhost:7021/api/FixedExpense';

export const addFixedExpense = async (expenceData) => {
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenceData)
        });
        if(!response.ok){
            throw new Error("Add new FixedExpence Failed");
        }

        return true;
    }
    catch(error){
        console.error(error);
        return false;
    }
}

export const getFixedExpenses = async () => {
    try{
        const response = await fetch(url);

        if(!response.ok){
            throw new Error("Get expenses failed");
        }
        return await response.json();
    }
    catch (error){
        console.error(error)
        return[];
    }
}

export const modifyFixedExpense = async (expenseData) => {
    try{
        const response = await fetch(url,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenseData)
        })
        if(!response.ok){
            throw new Error("Modify expense failed");
        }
        return true;
    }
    catch (error){
        console.error(error);
        return false;
    }
}