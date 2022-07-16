import { z } from "zod";
import { RequestActions } from "../configs/actions.app.config.schema";

const syncErrorSchema = z.object({
    type: z.string(),
    code: z.number(),
    path: z.string().optional(),
    message: z.string(),
    data: z.array(z.any()).optional()
});

export type SyncErrorDataType = z.infer<typeof syncErrorSchema>;

export const syncCacheSchema = z.object({
    message_id: z.string(),
    action: z.nativeEnum(RequestActions),
    responses: z.array(z.any()),
    error: syncErrorSchema.optional()
}); 

export type SyncCacheDataType = z.infer<typeof syncCacheSchema>;
