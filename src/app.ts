import Express, { NextFunction, Request, Response } from "express"
import { Exception } from "./models/exception.model"
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

    // Test Routes
    const testRouter = require('./routes/test.routes').default;
    app.use('/test', testRouter);

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

    const PORT: number = getConfig().server.port;
    app.listen(PORT, () => {
        logger.info('Protocol Server started on PORT : '+PORT);
    })
}

const main = async () => {
    try {
        console.log(getConfig());
        await initializeExpress();
        await MongoUtils.getInstance().connect();

        if(MongoUtils.getInstance().isConnected){
            ResponseCache.getInstance();
        }
    } catch (err) {
        if(err instanceof Exception){
            logger.error(err.toString());
        }
        else{
            logger.error(err);
        }
    }
}

main();