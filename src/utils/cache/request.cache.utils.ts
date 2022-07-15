import { RequestCacheDataType, RequestCacheSchema } from "../../schemas/cache/request.cache.schema";
import { getConfig } from "../config.utils";
import { RedisClient } from "../redis.utils";
import Moment from 'moment'
import { RequestActions, ResponseActions } from "../../schemas/configs/actions.app.config.schema";

const RequestCacheDB=getConfig().cache.db*10+2;

export class RequestCache {
    public static getInstance(): RequestCache {
        if (!RequestCache.instance) {
            RequestCache.instance = new RequestCache();
        }
        return RequestCache.instance;
    }

    private static instance: RequestCache;

    private redisClient: RedisClient;

    private constructor() {
        this.redisClient = new RedisClient(RequestCacheDB);
    }

    public createKey(message_id: string, action: RequestActions|ResponseActions): string {
        const key = `${action}_${message_id}`;
        return key;
    }

    public async cache(request: RequestCacheDataType, ttl:number): Promise<boolean> {
        const key = this.createKey(request.message_id, request.action);
        console.log(key);
        const redisResponse = await this.redisClient.setWithExpiry(key, JSON.stringify(request), ttl);
        return redisResponse;
    }

    public async check(message_id: string, action: RequestActions|ResponseActions): Promise<RequestCacheDataType | null> {
        const key = this.createKey(message_id, action);
        console.log(key);
        const redisResponse = await this.redisClient.get(key);
        if (redisResponse) {
            const request = RequestCacheSchema.parse(JSON.parse(redisResponse));
            return request;
        }

        return null;
    }

    public async delete(message_id: string, action: RequestActions|ResponseActions): Promise<boolean> {
        const redisResponse = await this.redisClient.delete(message_id);
        return redisResponse;
    }


    public async clear(): Promise<boolean> {
        const redisResponse = await this.redisClient.flushDB();
        return redisResponse;
    }
}