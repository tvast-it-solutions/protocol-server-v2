import { Collection, Db, MongoClient } from "mongodb";
import { Exception, ExceptionType } from "../models/exception.model";
import { getConfig } from "./config.utils";
import logger from "./logger.utils";

export class MongoUtils{
    public static getInstance(): MongoUtils {
        if (!MongoUtils.instance) {
            MongoUtils.instance = new MongoUtils();
        }
        return MongoUtils.instance;
    }

    private static instance: MongoUtils;

    private client: MongoClient | null;
    private enabled: boolean;
    private db: Db|null;
    public isConnected: boolean = false;

    private constructor() {
        this.enabled = getConfig().responseCache.enabled;
        this.client = null;
        this.db=null;
        
        if(!this.enabled){
            console.log("Response cache is disabled.");
            return;
        }

        if(!getConfig().responseCache.mongoURL){
            this.enabled=false;
            throw new Exception(ExceptionType.Mongo_URLNotFound, "Response cache configuration is invalid, mongoURL is required.", 500);
        }
        
        this.client = new MongoClient(getConfig().responseCache.mongoURL!, {
            minPoolSize: 10,
            maxPoolSize: 15,
        });
    }

    public async connect(): Promise<void> {
        if(!this.enabled){
            return;
        }

        if(!this.client){
            throw new Exception(ExceptionType.Mongo_ClientNotInitialized, "Mongo client is not initialized.", 500);
        }

        this.client = await this.client.connect();
        this.db=this.client.db();
        this.isConnected=true;
        
        logger.info("Mongo client connected.");
    }

    public getDB(): Db{
        if(!this.isConnected){
            throw new Exception(ExceptionType.Mongo_ClientNotInitialized, "Mongo client is not connected.", 500);
        }

        return this.db!;
    }

    public getCollection(collectionName: string): Collection<Document>{ 
        if(!this.isConnected){
            throw new Exception(ExceptionType.Mongo_ClientNotInitialized, "Mongo client is not connected.", 500);
        }

        return this.db!.collection(collectionName);
    }


    public async disconnect(): Promise<void> {
        if(!this.isConnected){
            return;
        }

        await this.client!.close();
        this.isConnected=false;
        logger.info("Mongo client disconnected.");

        this.client=null;   
        this.db=null;
        return;
    }
}