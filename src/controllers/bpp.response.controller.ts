import { Request, Response, NextFunction } from "express"
import { MQClient } from "../utils/rbtmq.utils";

// TODO: Code bppResponseHandler()

export const bppClientResponseHandler = (req : Request, res : Response, next : NextFunction) => {
    try {
        new MQClient().publishMessage("outbox", req.body)
        res.status(200).json({
            message: {
                ack: {
                    status: "ACK"
                }
            }
        })
    } catch (err) {
        next(err);
    }
}