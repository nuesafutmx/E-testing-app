import { getQuiz } from "@/actions/getQuiz"

const fetchQuiz = async () => {
    const quiz = await getQuiz();
    console.log(quiz);
    return quiz;
};

export default fetchQuiz;