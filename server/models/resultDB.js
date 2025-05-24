import pkg, { Types } from "mongoose";
import dotenv from "dotenv";
import { title } from "process";
const { Schema, model } = pkg;
dotenv.config();

const resultSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    pin: {
        type: String,
        required: true
    },
    score:{
        type: Number,
        required:true
    },
    title: {
        type: String,
        required: true
    },
   
});
export default model('Result', resultSchema);
