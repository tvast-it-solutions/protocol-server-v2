import loadConfig from './utils/config'
loadConfig();

import Express, { NextFunction, Request, Response } from "express";

import logger from './utils/logger';
import { connectToDb } from "./utils/db";
import router from "./routes/protocol";
import subscribeRouter from './routes/subscribe';
import { createKeyPair } from "./utils/auth"
import { generateEncrKeys } from './utils/encryption';
import { onSubscribe } from './controllers/subscribe';
import * as cd from './utils/subAuth'

const initializeExpress=async()=>{
    const app = Express()
    app.use(Express.json({
        verify: (req: Request, res: Response, buf: Buffer) => {
            res.locals={
                rawBody: buf.toString()
            }
        }    
    }))

    app.use('/', router)
    app.post('/on_subscribe', onSubscribe)
    app.use('/subscriber', subscribeRouter)

    app.use((err : any, req : Request, res : Response, next : NextFunction) => {
        res.status(err.status || 500).json({
            message: err.message,
            error: err
        })
    })

    app.listen(process.env.PORT, () => {
        logger.info('Server started on port '+process.env.PORT);
    })
}

const main = async () => {
    try {
        // connectToDb()
        // createKeyPair(); // Ed25519
        // generateEncrKeys() // X25519 
        cd.generateX25519KeyPair()
        initializeExpress();
    } catch (err) {
        logger.error(err)
    }
}

main();