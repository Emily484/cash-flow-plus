import express from 'express';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import rateLimit from 'express-rate-limit';
import { UserModel } from "../models/Users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user) {
        return res.json({message: "This email already has an account registered"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new UserModel({ email, password: hashedPassword });
    await newUser.save();

    res.json({message: "User Registered Successfully!"});    
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Allow 5 requests per windowMS
    message: 'Too many login attempts, please try again later.'
})

router.post("/login", limiter, async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if(!user){
        return res.json({ message: "Account doesn't exist for this email" });
    }

    if(user.lockUntil && unser.lockUntil > new Date()){
        return res.status(423).json({ error: true, message: "Account locked. Please try again later."});
    }

    const isPasswordVaild = await bcrypt.compare(password, user.password);

    if(!isPasswordVaild){
        res.json({ message: "Email or Password is incorrect"});
    }

    const token = jwt.sign({ id: user._id }, "secret");
    res.json({ token, userId: user._id })
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.save();
});

export { router as userRouter };