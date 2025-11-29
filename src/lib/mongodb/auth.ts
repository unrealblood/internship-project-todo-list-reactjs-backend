import { ObjectId } from "mongodb";
import type { UserType } from "../typescript/user.ts";
import { UserSchema } from "../zod/schemas.ts";
import { getMongoDBClient } from "./client.ts";

export async function registerUser(_id: string, name: string, email: string, password: string): Promise<boolean> {
    const client = await getMongoDBClient();
    
    try {
        const db = client.db();

        const newUser: UserType = UserSchema.parse({
            name,
            email,
            password
        });

        const result = await db.collection<UserType>("users").insertOne(newUser);

        return result.acknowledged;
    }
    catch(ex) {
        if(ex instanceof Error) {
            throw new Error("Failed to register user. Error: " + ex.message);
        }

        throw new Error("Failed to register user. Unknow error.");
    }
}

export async function loginUser(email: string, password: string): Promise<{userId: string, sucess: boolean}> {
    const client = await getMongoDBClient();
    
    try {
        const db = client.db();

        const result = await db.collection<UserType>("users").findOne({email, password});

        return {userId: result?._id.toString()!, sucess: result !== null};
    }
    catch(ex) {
        if(ex instanceof Error) {
            throw new Error("Failed to login. Error: " + ex.message);
        }

        throw new Error("Failed to login the user. Unknow error.");
    }
}

export async function getUserByEmail(email: string): Promise<UserType> {
    const client = await getMongoDBClient();
    
    try {
        const db = client.db();

        const user = await db.collection<UserType>("users").findOne({email});

        return user!;
    }
    catch(ex) {
        if(ex instanceof Error) {
            throw new Error("Failed to get user by email. Error: " + ex.message);
        }

        throw new Error("Failed to get user by email. Unknow error.");
    }
}

export async function getUserById(userId: string): Promise<UserType> {
    const client = await getMongoDBClient();
    
    try {
        const db = client.db();

        const user = await db.collection<UserType>("users").findOne({_id: ObjectId.createFromHexString(userId)});

        return user!;
    }
    catch(ex) {
        if(ex instanceof Error) {
            throw new Error("Failed to get user by id. Error: " + ex.message);
        }

        throw new Error("Failed to get user by id. Unknow error.");
    }
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
    const client = await getMongoDBClient();
    
    try {
        const db = client.db();

        const result = await db.collection<UserType>("users").updateOne({_id: ObjectId.createFromHexString(userId)}, {$set: {password: newPassword}});

        return result.acknowledged;
    }
    catch(ex) {
        if(ex instanceof Error) {
            throw new Error("Failed to update user password. Error: " + ex.message);
        }

        throw new Error("Failed to update user password. Unknow error.");
    }
}