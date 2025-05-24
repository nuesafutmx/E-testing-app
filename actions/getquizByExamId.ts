export const getQuizByExamid = async (examId: string) => {
    try {
        console.log('fetching subject quiz ........');
        const URL = process.env.NEXT_PUBLIC_SERVER_URL;
        const response = await fetch(`${URL}/api/getquiz/${examId}`, {
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
        console.log('Error fetching quiz by exam ID:', error);
        throw error;
    }
}