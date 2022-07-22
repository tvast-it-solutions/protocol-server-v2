import { response, Response } from "express";
import { Exception, ExceptionType } from "../models/exception.model";
import { contextAcknowledgementSchema } from "../schemas/acknowledgement/context.acknowledgement.schema";
import { errorAcknowledgementSchema } from "../schemas/acknowledgement/error.acknowledgement.schema";

function acknowledge(res: Response, data: any){
    try {
        response.status(202).json(data);        
    } catch (error) {
        if(error instanceof Exception){
            throw error;
        }

        throw new Exception(ExceptionType.Acknowledgement_Failed, "Acknowledge to client connection failed", 500, error);
    }
}

export function acknowledgeACK(res: Response, context:any) {
    try {
        const contextData=contextAcknowledgementSchema.parse(context);
        acknowledge(res, {
            "context": contextData,
            "message": {
                "ack:": {
                    "status": "ACK" 
                }
            }
        })    
    } catch (error) {
        if(error instanceof Exception){
            throw error;
        }

        throw new Exception(ExceptionType.Acknowledgement_Failed, "Acknowledge to client connection failed", 500, error);
    }
}

export function acknowledgeNACK(res: Response, context:any, error: any){
    try {
        const errorData=errorAcknowledgementSchema.parse(error);
        const contextData=contextAcknowledgementSchema.parse(context);
        acknowledge(res, {
            "context": contextData,
            "message": {
                "ack:": {
                    "status": "NACK" 
                }
            },
            "error": errorData
        });
    } catch (error) {
        if(error instanceof Exception){
            throw error;
        }

        throw new Exception(ExceptionType.Acknowledgement_Failed, "Acknowledge to client connection failed", 500, error);
    }
}