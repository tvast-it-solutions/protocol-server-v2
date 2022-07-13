// Create app config schema.
// Create a parser function.

import { z } from "zod";
import { actionsAppConfigSchema } from "./actions.app.config.schema";

export enum AppMode {
    bap = "bap",
    bpp = "bpp",
}

export const appConfigSchema = z.object({
    mode: z.nativeEnum(AppMode),
    actions: actionsAppConfigSchema,
    privateKey: z.string(),
    publicKey: z.string(),
    subscriberId:  z.string(),
    subscriberUri: z.string(),
    registryUrl: z.string(),
    auth: z.boolean(),
    uniqueKey: z.string(),
    city: z.string(),
    country: z.string(),
    ttl: z.string(),
    httpTimeout: z.number(),
    httpRetryCount:   z.number(),
});

export type AppConfigDataType = z.infer<typeof appConfigSchema>;

export const parseAppConfig = (config: any): any => {
    const appConfig = appConfigSchema.parse(config);
    return appConfig;
}
