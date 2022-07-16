import { Db, MongoClient } from "mongodb";
import { Exception, ExceptionType } from "../models/exception.model";

export class DBClient{
    private db: Db;
    private client: MongoClient;
    public isConnected: boolean = false;

    constructor(dbURL: string){
        this.client = new MongoClient(dbURL, {
            minPoolSize: 10,
            maxPoolSize: 15,
        });

        this.db = this.client.db();
    }

    public async connect(): Promise<void> {
        this.client = await this.client.connect();
        this.db = this.client.db();
        this.isConnected = true;
    }

    public getDB(): Db{
        if(!this.isConnected){
            throw new Exception(ExceptionType.Mongo_ClientNotInitialized, "Mongo client is not connected.", 500);
        }

        return this.db;
    }

    public getClient(): MongoClient{
        if(!this.isConnected){
            throw new Exception(ExceptionType.Mongo_ClientNotInitialized, "Mongo client is not connected.", 500);
        }

        return this.client;
    }

}