import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {userRouter} from './routes/users.js'

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);

mongoose.connect("mongodb+srv://smithemily:AbEbIhIvks6JxzZJ@cluster0.8do8xgh.mongodb.net/cashflowplus?retryWrites=true&w=majority")

app.listen(3001, () => {
    console.log("SERVER RUNNING")
})