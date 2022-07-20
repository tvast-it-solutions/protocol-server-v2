import { getConfig } from "./config.utils";
import { MQClient } from "./rbtmq.utils";

export class GatewayUtils{
    public static getInstance(){
        if(!GatewayUtils.instance){
            GatewayUtils.instance = new GatewayUtils();
        }
        return GatewayUtils.instance;
    }

    private static instance: GatewayUtils;

    private mqClient: MQClient;

    private constructor(){
        this.mqClient = new MQClient(getConfig().app.gateway.amqpURL);
    }

    public async initialize(){
        await this.mqClient.connect();
        // TODO: add something to add routes.
    }
}