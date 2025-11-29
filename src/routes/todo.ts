import express from "express";
import { addTodo, deleteTodo, getUserAllTodos, markTodoCompleted, updateTodo } from "../lib/mongodb/todo.ts";

const todoRouter = express.Router();

todoRouter.get("/get-todos/:uID", async (req, res) => {
    const { uID: userId } = req.params;

    const todos = await getUserAllTodos(userId);

    return res.json({todos});
});

todoRouter.post("/add-todo", async (req, res) => {
    const { userId, content, completed } = req.body;

    const result = await addTodo(userId, content, completed);

    if(result) {
        return res.json({success: result.success, insertedId: result.insertedId, msg: "Successfully added the todo."});
    }
    else {
        return res.json({error: "Failed to add todo."});
    }
});

todoRouter.post("/mark-completed", async (req, res) => {
    const { _id, value } = req.body;

    const result = await markTodoCompleted(_id, value);

    if(result) {
        return res.json({msg: "Successfully marked todo as completed."});
    }
    else {
        return res.json({error: "Failed to mark todo as completed."});
    }
});

todoRouter.put("/update-todo", async (req, res) => {
    const { _id, content } = req.body;

    const result = await updateTodo(_id, content);

    if(result) {
        return res.json({msg: "Successfully updated the todo."});
    }
    else {
        return res.json({error: "Failed to update the todo."});
    }
});

todoRouter.delete("/delete-todo/:todoId", async (req, res) => {
    const { todoId } = req.params;

    const result = await deleteTodo(todoId);

    if(result) {
        return res.json({msg: "Successfully deleted the todo."});
    }
    else {
        return res.json({error: "Failed to delete the todo."});
    }
});

export { todoRouter };