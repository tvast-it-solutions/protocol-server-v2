import { getConfig } from "./config.utils";
import logger from "./logger.utils";

var amqp = require("amqplib/callback_api")

let channel : any = null

export const initializeConnection = async () => {
    try {   
        amqp.connect(getConfig().client.messageQueue.amqpURL, (err : any, conn : any) => {
            if(err) {
                logger.error(err)
            } else {
                logger.info("Connected to RabbitMQ")
                conn.createChannel((err1 : any, ch : any) => {
                    if(err1) {
                        logger.error(err1)
                    }
                    channel = ch
                })
            }
        })
    } catch (err) {
        logger.error(err);
    }
}

// Used to Create a Queue. Does nothing if the queue already exists.
export const assertQueue = async (queueName : string) => {
    try {
        if(!channel) {
            throw new Error("Channel is not initialized")
        }
        channel.assertQueue(queueName, { durable: true })
    } catch (err) {
        throw err
    }
}

export const publishMessage = async (queueName : string, message : string) => {
    try {
        if(!channel) {
            throw new Error("Channel is not initialized")
        }
        channel.sendToQueue(queueName, Buffer.from(message))
    } catch (err) {
        throw err
    }
}

export const listenToQueue = async (queueName : string, callback : any) => {
    try {
        if(!channel) {
            throw new Error("Channel is not initialized")
        }
        channel.consume(queueName, callback, { noAck: true })
    } catch (err) {
        throw err
    }
}