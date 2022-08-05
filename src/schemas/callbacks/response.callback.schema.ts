import { z } from "zod";
import { becknContextSchema } from "../becknContext.schema";
import { becknErrorSchema } from "../becknError.schema";

export const responseCallbackSchema = z.object({
    context: becknContextSchema,
    message: z.object({}),
    error: becknErrorSchema,
});

export type ResponseCallbackDataType = z.infer<typeof responseCallbackSchema>;