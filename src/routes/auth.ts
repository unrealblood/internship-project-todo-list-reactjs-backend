import express from "express";
import { loginUser, registerUser } from "../lib/mongodb/auth.ts";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

userRouter.post("/auth/signup", async (req, res) => {
    const { _id, name, email, password } = req.body;

    const result = await registerUser(_id, name, email, password);
    
    if(result) {
        return res.json({msg: "Successfully registered the user"});
    }
    return res.json({error: "Failed to register the user"});
});

userRouter.post("/auth/signin", async (req, res) => {
    const { email, password } = req.body;

    const result = await loginUser(email, password);
    
    if(result.sucess) {
        const accessToken = jwt.sign({_id: result.userId}, `${process.env.JWT_SECRET}`);

        return res.json({accessToken, userId: result.userId, msg: "Login successfull"});
    }
    return res.json({error: "Invalid credentials"});
});

export {userRouter};