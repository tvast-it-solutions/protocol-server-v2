// Create client config schema with config type.
// Create a parser function which will decide the client config type.
// Follow the priority order.

import { z } from "zod";
import { Exception, ExceptionType } from "../../models/exception.model";

export enum ClientConfigType {
    synchronous = "synchronous",
    webhook = "webhook",
    pubSub = "pubSub",
}

export const syncrhonousClientConfigSchema = z.boolean();
export type SyncrhonousClientConfigDataType = z.infer<typeof syncrhonousClientConfigSchema>;

export const webhookClientSchema = z.object({
    url: z.string(),
});
export type WebhookClientConfigDataType = z.infer<typeof webhookClientSchema>;

const pubSubClientSchema = z.object({
    amqpUrl: z.string(),
    client_inbox_queue: z.string(),
    client_outbox_queue: z.string(),
});
export type PubSubClientConfigDataType = z.infer<typeof pubSubClientSchema>;

export const pubSubClientParser = (config: any): PubSubClientConfigDataType => {
    const pubSubClientConfig = pubSubClientSchema.parse({
        amqpUrl: config.amqpUrl,
        client_inbox_queue: config["client-inbox-queue"],
        client_outbox_queue: config["client-outbox-queue"],
    });
    return pubSubClientConfig;
}

export const clientConfigSchema = z.object({
    type: z.nativeEnum(ClientConfigType),
    // connnection: syncrhonousClientConfigSchema.or(webhookClientSchema).or(pubSubClientSchema)
    connection: z.union([
        syncrhonousClientConfigSchema,
        webhookClientSchema,
        pubSubClientSchema,
    ]),
});

export type ClientConfigDataType = z.infer<typeof clientConfigSchema>;

export const parseClientConfig = (config: any): any => {
    let clientConfigType: ClientConfigType|null=null;
    let connectionConfig: SyncrhonousClientConfigDataType|WebhookClientConfigDataType|PubSubClientConfigDataType|null=null;
    if(config.synchronous==true){
        clientConfigType=ClientConfigType.synchronous;
        connectionConfig=true;
    }
    else if(config.webhook){
        clientConfigType=ClientConfigType.webhook;
        connectionConfig=webhookClientSchema.parse(config.webhook);
    }
    else{
        clientConfigType=ClientConfigType.pubSub;
        connectionConfig=pubSubClientParser(config.pubSub);
    }

    if(!connectionConfig){
        throw new Exception(ExceptionType.Config_ClientConfigurationInvalid, "Client configuration is invalid", 400);
    }

    const clientConfig = clientConfigSchema.parse({
        type: clientConfigType,
        connection: connectionConfig
    });

    return clientConfig;
}