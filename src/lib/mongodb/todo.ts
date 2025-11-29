import type { TodoType } from "../typescript/todo.ts";
import { getMongoDBClient } from "./client.ts";
import { TodoSchema } from "../zod/schemas.ts";
import { ObjectId } from "mongodb";

export async function getUserAllTodos(userId: string): Promise<TodoType[]> {
    const client = await getMongoDBClient();

    try {
        const db = client.db();
        
        const todos = db.collection<TodoType>("todos").find({userId: ObjectId.createFromHexString(userId)}).toArray();

        return todos;
    }
    catch(ex) {
        if(ex instanceof Error) {
            throw new Error("Failed to get all user todos. Error: " + ex.message);
        }

        throw new Error("Failed to get all user todos. Unknow error.");
    }
}

export async function addTodo(userId: string, content: string, completed: boolean): Promise<{success: boolean, insertedId: string}> {
    const client = await getMongoDBClient();

    try {
        const db = client.db();

        const newTodo: TodoType = TodoSchema.parse({
            userId,
            content,
            completed
        });

        const result = await db.collection<TodoType>("todos").insertOne({...newTodo, userId: ObjectId.createFromHexString(userId)});

        return {success: result.acknowledged, insertedId: result.insertedId.toString()};
    }
    catch(ex) {
        if(ex instanceof Error) {
            throw new Error("Failed to add todo. Error: " + ex.message);
        }

        throw new Error("Failed to add todo. Unknow error.");
    }
}

export async function markTodoCompleted(_id: string, value: boolean): Promise<boolean> {
    const client = await getMongoDBClient();

    try {
        const db = client.db();

        const result = await db.collection<TodoType>("todos").updateOne({_id: ObjectId.createFromHexString(_id)}, {$set: {completed: value}});

        return result.acknowledged;
    }
    catch(ex) {
        if(ex instanceof Error) {
            throw new Error("Failed to mark todo as completed. Error: " + ex.message);
        }

        throw new Error("Failed to mark todo as completed. Unknow error.");
    }
}

export async function updateTodo(_id: string, content: string): Promise<boolean> {
    const client = await getMongoDBClient();

    try {
        const db = client.db();

        const result = await db.collection<TodoType>("todos").updateOne({_id: ObjectId.createFromHexString(_id)}, {$set: {content}});

        return result.acknowledged;
    }
    catch(ex) {
        if(ex instanceof Error) {
            throw new Error("Failed to mark todo as completed. Error: " + ex.message);
        }

        throw new Error("Failed to mark todo as completed. Unknow error.");
    }
}