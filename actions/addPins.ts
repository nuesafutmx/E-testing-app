export const addPins = async (pins: any) => {
    try {
        const URL = process.env.NEXT_PUBLIC_SERVER_URL;
        console.log('URL :>> ', URL);
        console.log('adding new pins :>> ', pins);
        const response = await fetch(`${URL}/api/addpins`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pins)
        });
        console.log('response :>> ', response);
        const result = await response.json();
        console.log('result :>> ', result);
        return result;
    } catch (error) {
        console.log('Error adding pins:', error);
        throw error;
    }
}