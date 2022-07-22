import { z } from "zod";

export const errorCallbackSchema = z.object({
    context: z.object({}),
    message: z.object({}),
    error: z.object({})
});

export type ErrorCallbackDataType = z.infer<typeof errorCallbackSchema>;