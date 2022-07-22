import { z } from "zod";

export const errorAcknowledgementSchema=z.object({

});

export type ErrorAcknowledgementDataType=z.infer<typeof errorAcknowledgementSchema>;