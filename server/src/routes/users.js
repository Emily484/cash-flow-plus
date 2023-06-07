import express from 'express';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user) {
        return res.json({message: "This email already has an account registered"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)

    if(hashedPassword){
        const newUser = new UserModel({ email, password: hashedPassword });
        await newUser.save();

        res.json({message: "User Registered Successfully!"});
    }else{
        res.json({message: "something went wrong"});
    }

    
});

router.post("/login");

export { router as userRouter };