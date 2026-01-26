
const url = 'https://localhost:7021/api/Goals';

export const addGoal = async (goalData) => {
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(goalData)
        });
        if(!response.ok){
            throw new Error("Add Goal Error.");
        }

        return true;
    } catch (error){
        console.error(error);
        return false;
    }
};

export const getAllGoals = async () => {
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error("Get All Goals Error.");
        }
        return await response.json();
    } catch (error){
        console.error(error);
        return[];
    }
}

export const removeGoal = async (id) => {
    try{
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE'
        });
        return true;
    } catch (error){
        console.error(error);
        return false;
    }
}