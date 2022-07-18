import { connect } from "amqplib";
import logger from "./logger.utils";

import client, { Channel } from "amqplib"

interface callbackType { (msg : client.ConsumeMessage | null) : void }

export class MQClient {
    private channel : Channel | null
    public isConnected : boolean = false

    constructor() {
        this.channel = null
        this.isConnected = false
    }

    public async connect(url : string) : Promise<void> {
        connect(url, {
            heartbeat: 10
        })
        .then(connection => {
            connection.createChannel()
            .then(tempChannel => {
                this.channel = tempChannel
                this.isConnected = true
                logger.info(`MQ Client Connected For URL: ${url}`)
            })
            .error(err => {
                throw new Error(err)
            })
        })
        .error(err => {
            throw new Error(err)
        })
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
        await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)))
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