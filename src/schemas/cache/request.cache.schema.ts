import { z } from "zod";
import { RequestActions, ResponseActions, RequestType } from "../configs/actions.app.config.schema";

export const RequestCacheSchema = z.object({
    transaction_id: z.string(),
    message_id: z.string(),
    action: z.union([
        z.nativeEnum(RequestActions),
        z.nativeEnum(ResponseActions)
    ]),
    requestType: z.nativeEnum(RequestType)
});

export type RequestCacheDataType = z.infer<typeof RequestCacheSchema>;

export const parseRequestCache = (transaction_id: string, message_id: string, gatewayHeader?:string): RequestCacheDataType => {
    return RequestCacheSchema.parse({
        transaction_id: transaction_id,
        message_id: message_id,
        action: RequestActions.search,
        requestType: ((gatewayHeader)&&(gatewayHeader!="")) ? RequestType.broadcast : RequestType.direct
    });
}
