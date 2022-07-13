import { z } from "zod";

export const cacheConfigSchema = z.object({
    host: z.string(),
    port: z.number(),
    ttl: z.string(),
    db: z.number().default(0),
});

export type CacheConfigDataType = z.infer<typeof cacheConfigSchema>;

export const parseCacheConfig = (config: any): any => {
    const cacheConfig= cacheConfigSchema.parse(config);
    return cacheConfig;
}