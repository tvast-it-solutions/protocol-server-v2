import { Request } from "express";
import { SubscriberDetail } from "../schemas/subscriberDetails.schema";

export interface AuthenticatedRequest extends Request {
    sender?: SubscriberDetail;
    file?: Express.Multer.File
}
