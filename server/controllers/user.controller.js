import { StatusCodes } from 'http-status-codes';
import Quiz from '../models/quizDB.js';
import Pin from '../models/pinDB.js';
import Result from '../models/resultDB.js';

class UserController {
    static async HttpAddQuiz(request, response) {
        try {
            const { title, subject,examId, description, duration, passingScore, isPublished, questions } = request.body;
            const parsedQuestions = JSON.parse(questions);

            const newQuiz = await Quiz.create({
                title,
                subject,
                examId,
                description,
                duration,
                passingScore,
                isPublished,
                questions: parsedQuestions
            });

            const data = {
                title: newQuiz.title,
                subject: newQuiz.subject,
                examId: newQuiz.examId,
                description: newQuiz.description,
                duration: newQuiz.duration,
                passingScore: newQuiz.passingScore,
                isPublished: newQuiz.isPublished,
                questions: newQuiz.questions
            };

            response.status(StatusCodes.CREATED).json(data);
        } catch (error) {
            response.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        }
    }

    static async HttpGetQuiz(request, response) {
        try {
            const quizzes = await Quiz.find();
            response.status(StatusCodes.OK).json(quizzes);
        } catch (error) {
            response.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        }
    }

    static async HttpAddPins(request, response) {
        try {
            const pins = request.body;

            const newPins = await Pin.insertMany(pins);

            response.status(StatusCodes.CREATED).json(newPins);
        } catch (error) {
            response.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        }
    }

    static async HttpGetPins(request, response) {
        try {
            const pins = await Pin.find();
            response.status(StatusCodes.OK).json(pins);
        } catch (error) {
            response.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        }
    }

    static async HttpGetQuizByExamId(request, response) { 
        try {
            const { examId } = request.params;
            const quizzes = await Quiz.find({ examId });

            if (quizzes.length === 0) {
                return response.status(StatusCodes.NOT_FOUND).json({ error: 'No quizzes found for the given id' });
            }

            response.status(StatusCodes.OK).json(quizzes);
        } catch (error) {
            response.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        }
    }
    static async HttpAddResult(request, response) {
        try {
            const { title, name, score, pin } = request.body;
            const newResult = await Result.create({
                name,
                pin,
                score,
                title
            });

            response.status(StatusCodes.CREATED).json(newResult);
        } catch (error) {
            response.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        }
    }
    static async HttpGetResult(request, response) {
        try {
            const results = await Result.find();
            response.status(StatusCodes.OK).json(results);
        } catch (error) {
            response.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        }
    }
}

export default UserController;