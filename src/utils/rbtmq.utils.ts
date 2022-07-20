import * as AmqbLib from "amqplib";
import logger from "./logger.utils";

import client, { Channel } from "amqplib"
import { Exception, ExceptionType } from "../models/exception.model";

interface callbackType { (msg : client.ConsumeMessage | null) : void }

export class MQClient {
    private amqpUrl : string
    private channel : Channel | null
    public isConnected : boolean = false

    constructor(amqpUrl : string) {
        this.channel = null
        this.isConnected = false
        this.amqpUrl = amqpUrl
    }

    public async connect() : Promise<void> {
        try {
            const connection=await AmqbLib.connect(this.amqpUrl, {
                heartbeat: 10
            });
    
            const tempChannel=await connection.createChannel()
            this.channel=tempChannel
            this.isConnected=true
    
            logger.info(`MQ Client Connected For URL: ${this.amqpUrl}`)
        } catch (error) {
            throw new Exception(ExceptionType.MQ_ConnectionFailed, `MQ Client Connection Failed For URL: ${this.amqpUrl}`, 500, error);
        }
    }

    public async assertQueue(queue : string) : Promise<void> {
        if(!this.channel) {
            throw new Error("MQ Client is not connected")
        }
        await this.channel.assertQueue(
            queue,
            {
                durable: true
            }
        )
    }

    public async publishMessage(queue : string, data : any) {
        if(!this.channel) {
            throw new Error("MQ Client is not connected")
        }
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)))
    }

    public async consumeMessage(queue : string, callback : callbackType) {
        if(!this.channel) {
            throw new Error("MQ Client is not connected")
        }
        this.channel.consume(queue, callback, {
            noAck: true
        })
    }
}