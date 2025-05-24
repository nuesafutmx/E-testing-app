export const getPins = async () => {
    try {
        console.log('fetching pins ..................');
        const URL = process.env.NEXT_PUBLIC_SERVER_URL;
        const response = await fetch(`${URL}/api/getpins`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('response :>> ', response);
        const result = await response.json();
        console.log('result :>> ', result);
        return result;
    } catch (error) {
        console.log('Error fetching pins:', error);
        throw error;
    }
}