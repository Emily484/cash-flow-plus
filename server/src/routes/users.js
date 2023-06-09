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
    const newUser = new UserModel({ email, password: hashedPassword });
    await newUser.save();

    res.json({message: "User Registered Successfully!"});    
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if(!user){
        return res.json({ message: "Account doesn't exist for this email" });
    }

    const isPasswordVaild = await bcrypt.compare(password, user.password);

    if(!isPasswordVaild){
        res.json({ message: "Email or Password is incorrect"});
    }

    const token = jwt.sign({ id: user._id }, "secret");
    res.json({ token, userId: user._id })
});

export { router as userRouter };