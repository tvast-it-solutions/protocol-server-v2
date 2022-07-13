import Express, { NextFunction, Request, Response } from "express"
import { WebhookClientConfigDataType, webhookClientSchema } from "./schemas/configs/client.config.schema"
import { ResponseCache } from "./utils/cache/response.cache.utils"

import { getConfig } from "./utils/config.utils"
import logger from "./utils/logger.utils"
import { MongoUtils } from "./utils/mongo.utils"

const app = Express()

app.use(Express.json())

const initializeExpress=async()=>{
    const app = Express()
    
    // Middleware for request body conversion to json and raw body creation.
    app.use(Express.json({
        verify: (req: Request, res: Response, buf: Buffer) => {
            res.locals={
                rawBody: buf.toString()
            }
        }    
    }))

    // Request Logger.
    app.use('/',async (req:Request, res: Response, next: NextFunction) => {
        logger.info(JSON.stringify(req.body));
        next();
    })

    // Requests Routing.
    const {requestsRouter} = require('./routes/requests.routes');
    app.use('/', requestsRouter);

    // TODO: Response Routing.

    // Error Handler.
    app.use((err : any, req : Request, res : Response, next : NextFunction) => {
        logger.error(err);
        res.status(err.status || 500).json({
            message: {
                ack:{
                    status: "NACK"
                }
            },
            error: {
                message: err.toString()
            }
        })
    })

    const PORT: number = getConfig().port;
    app.listen(PORT, () => {
        logger.info('Protocol Server started on PORT : '+PORT);
    })
}

const main = async () => {
    try {
        getConfig();
        await initializeExpress();
        await MongoUtils.getInstance().connect();

        if(MongoUtils.getInstance().isConnected){
            ResponseCache.getInstance();
        }
    } catch (err) {
        logger.error(err)
    }
}

main();