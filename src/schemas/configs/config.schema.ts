import { z } from "zod";
import { Exception, ExceptionType } from "../../models/exception.model";
import { appConfigSchema, AppMode, parseAppConfig } from "./app.config.schema";
import { cacheConfigSchema, parseCacheConfig } from "./cache.config.schema";
import { clientConfigSchema, ClientConfigType, parseClientConfig } from "./client.config.schema";
import { parseResponseCacheConfig, responseCacheConfigSchema } from "./response.cache.config.schema";

// Create the schema for the config file using other config schemas.
// Create a parser function which will do the following.
// 1. Parse the config file and return the config object.
// 2. checks for the app mode, in case BPP then synchronous is not an option (throw error).
// 3. checks for the required fields, in case not present then throw error.
//      Required fields are :
//      port, cache, client, app

export const configSchema = z.object({
    port: z.number(),
    cache: cacheConfigSchema,
    responseCache: responseCacheConfigSchema,
    client: clientConfigSchema,
    app: appConfigSchema,
});

export type ConfigDataType = z.infer<typeof configSchema>;

export const parseConfig = (config: any): any => {
    const cacheConfig = parseCacheConfig(config.cache);
    const responseCacheConfig = parseResponseCacheConfig(config.responseCache);
    const clientConfig = parseClientConfig(config.client);
    const appConfig = parseAppConfig(config.app);

    const configObject = configSchema.parse({
        port: config.port,
        cache: cacheConfig,
        responseCache: responseCacheConfig,
        client: clientConfig,
        app: appConfig,
    });
    
    if(configObject.app.mode===AppMode.bap){
        // TODO: apply a check for actions to be in paired in case of synchronous only.
        // Like search and on_search both needs to be configured.
        // This check is specific to BAP.
    }
    else if(configObject.app.mode===AppMode.bpp){
        if(configObject.client.type===ClientConfigType.synchronous){
            throw new Exception(ExceptionType.Config_BPPConfigurationInvalid, "BPP configuration is invalid, synchronous is not an option for BPP Mode.", 400);
        }
    }
    return configObject;
}