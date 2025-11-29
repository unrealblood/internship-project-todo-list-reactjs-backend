import type { TodoType } from "../typescript/todo.ts";
import { getMongoDBClient } from "./client.ts";
import { TodoSchema } from "../zod/schemas.ts";

export async function getUserAllTodos(userId: string): Promise<TodoType[]> {
    const client = await getMongoDBClient();

    try {
        const db = client.db();
        
        const todos = db.collection<TodoType>("todos").find({userId: TodoSchema.parse({userId})}).toArray();

        return todos;
    }
    catch(ex) {
        if(ex instanceof Error) {
            throw new Error("Failed to get all user todos. Error: " + ex.message);
        }

        throw new Error("Failed to get all user todos. Unknow error.");
    }
}

export async function addTodo(_id: string, userId: string, content: string, completed: boolean): Promise<boolean> {
    const client = await getMongoDBClient();

    try {
        const db = client.db();

        const newTodo: TodoType = TodoSchema.parse({
            _id,
            userId,
            content,
            completed
        });
        console.log("USERID");
        console.log(newTodo.userId);

        const result = await db.collection<TodoType>("todos").insertOne(newTodo);

        return result.acknowledged;
    }
    catch(ex) {
        if(ex instanceof Error) {
            throw new Error("Failed to add todo. Error: " + ex.message);
        }

        throw new Error("Failed to add todo. Unknow error.");
    }
}