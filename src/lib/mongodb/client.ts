import { MongoClient } from "mongodb";

export async function getMongoDBClient(): Promise<MongoClient> {
    const connectionURL = `mongodb+srv://${process.env.MONGODB_DATABASE_USERNAME}:${process.env.MONGODB_DATABASE_USER_PASSWORD}@${process.env.MONGODB_CLUSTER_NAME}.j4dxfij.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?appName=dev-cluster`;
    
    let client: MongoClient | null = null;

    try {
        if(client === null) {
            client = await MongoClient.connect(connectionURL);
        }
        return client;
    }
    catch(ex) {
        if(ex instanceof Error) {
            throw new Error("Failed to connect to the mongobDB. Error: " + ex.message);
        }

        throw new Error("Failed to connect to the mongobDB. Unknown error.");
    }
}