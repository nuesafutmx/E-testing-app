export const addQuiz = async (quiz: any) => {
    try {
        const URL = process.env.NEXT_PUBLIC_SERVER_URL;
        console.log('URL :>> ', URL);
        console.log('adding new quiz :>> ', quiz);
        const response = await fetch(`${URL}/api/addquiz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quiz)
        });
        console.log('response :>> ', response);
        const result = await response.json();
        console.log('result :>> ', result);
        return result;
    } catch (error) {
        console.log('Error adding quiz:', error);
        throw error;
    }
}