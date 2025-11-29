import express from "express";
import { addTodo, getUserAllTodos } from "../lib/mongodb/todo.ts";

const todoRouter = express.Router();

todoRouter.get("/get-todos/:uID", async (req, res) => {
    const { uID: userId } = req.params;

    const todos = await getUserAllTodos(userId);

    return res.json({todos});
});

todoRouter.post("/add-todo", async (req, res) => {
    const { _id, userId, content, completed } = req.body;

    const result = await addTodo(_id, userId, content, completed);

    if(result) {
        return res.json({msg: "Successfully added the todo."});
    }
    else {
        return res.json({error: "Failed to add todo."});
    }
});

export { todoRouter };