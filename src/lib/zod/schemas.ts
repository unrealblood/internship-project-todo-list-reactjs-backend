import z from "zod";

export const TodoSchema = z.object({
    _id: z.string(),
    content: z.string(),
    completed: z.boolean(),
    userId: z.string()
});

export const UserSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string()
});