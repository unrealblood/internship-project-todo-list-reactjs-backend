import "dotenv/config";
import express from "express";
import cors from "cors";
import { todoRouter } from "./routes/todo.ts";
import { userRouter } from "./routes/auth.ts";

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN_PATH
}));

app.use("/users", userRouter);
app.use("/todos", todoRouter);

app.listen(5000, (error) => {
    if(error) {
        console.log("Error occured while running server: " + error);
    }
    else {
        console.log("Server is up and running on port number 5000");
    }
});