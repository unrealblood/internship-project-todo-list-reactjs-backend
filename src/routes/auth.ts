import express from "express";
import { getUserByEmail, getUserById, loginUser, registerUser, updateUserPassword } from "../lib/mongodb/auth.ts";
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

userRouter.post("/auth/forgot-password", async (req, res) => {
    const { email } = req.body;

    const user = await getUserByEmail(email);
    
    if(user !== null) {
        const token = jwt.sign({userId: user._id}, `${process.env.JWT_RESET_PASSWORD_SECRET}`, {expiresIn: "15m"});

        const resetLink = `http://localhost:5173/auth/reset-password?token=${token}`;

        return res.json({msg: "Reset link sent", resetLink});
    }
    
    if(user === null) {
        return res.json({error: "Invalid email"});
    }

    return res.json({error: "Failed to generate reset password link"});
});

userRouter.post("/auth/reset-password", async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;

    const decoded = jwt.verify(token as string, `${process.env.JWT_RESET_PASSWORD_SECRET}`) as jwt.JwtPayload;

    const user = await getUserById(decoded.userId);

    if(user !== null) {
        const result = await updateUserPassword(user._id?.toString()!, newPassword);
    
        if(result) {
            return res.json({msg: "Password reset successfully"});
        }
    }

    return res.json({error: "Failed to reset password"});
});

export {userRouter};