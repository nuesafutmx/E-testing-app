import pkg, { Types } from "mongoose";
import dotenv from "dotenv";
const { Schema, model } = pkg;
dotenv.config();

const OptionSchema = new Schema({
    id: String,
    text: String,
    isCorrect: Boolean
});

const QuestionSchema = new Schema({
    id: String,
    type: { type: String, enum: ['multiple-choice', 'true-false', 'short-answer'] },
    text: String,
    points: Number,
    options: [OptionSchema],
    hasImage: Boolean
});

const QuizSchema = new Schema({
    title: { type: String, required: true },
    subject: String,
    examId: String,
    description: String,
    duration: Number,
    passingScore: Number,
    isPublished: Boolean,
    questions: [QuestionSchema]
}, { timestamps: true });

export default model('Quiz', QuizSchema);
