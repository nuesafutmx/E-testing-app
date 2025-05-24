export const getQuiz = async () => {
    try {
        console.log('fetching exams ..................');
        const URL = process.env.NEXT_PUBLIC_SERVER_URL;
        const response = await fetch(`${URL}/api/getquiz`, {
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
        console.log('Error fetching quiz:', error);
        throw error;
    }
}