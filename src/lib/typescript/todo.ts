import type { ObjectId } from "mongodb";

export type TodoType = {
    content: string,
    completed: boolean,
    userId: ObjectId | string
};