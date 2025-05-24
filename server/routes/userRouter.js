import {Router} from 'express';
import UserController from '../controllers/user.controller.js';
import { get } from 'http';
const userRouter = Router();
userRouter
    .post('/addquiz', UserController.HttpAddQuiz)
    .post('/addpins', UserController.HttpAddPins)
    .post('/addresult', UserController.HttpAddResult)
    .get('/getresult', UserController.HttpGetResult)
    .get('/getquiz', UserController.HttpGetQuiz)
    .get('/getpins', UserController.HttpGetPins)
    .get('/getquiz/:examId', UserController.HttpGetQuizByExamId)


export default userRouter;