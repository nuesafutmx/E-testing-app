export const addResult = async (results: any) => {
    try {
        const URL = process.env.NEXT_PUBLIC_SERVER_URL;
        console.log('URL :>> ', URL);
        console.log('adding new quiz :>> ', results);
        const response = await fetch(`${URL}/api/addquiz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(results)
        });
        console.log('response :>> ', response);
        const result = await response.json();
        console.log('result :>> ', result);
        return result;
    } catch (error) {
        console.log('Error adding result:', error);
        throw error;
    }
}