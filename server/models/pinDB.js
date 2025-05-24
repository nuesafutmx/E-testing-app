import pkg, { Types } from "mongoose";
import dotenv from "dotenv";
const { Schema, model } = pkg;
dotenv.config();

const pinSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    pin: {
        type: String,
        required: true
    },
    exam: {
        type: String,
        required: true
    },
    examId:{
        type: String,
        required:true
    },
    status: {
        type: String,
        required: true,
        enum: ['unused', 'used']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
export default model('Pin', pinSchema);
