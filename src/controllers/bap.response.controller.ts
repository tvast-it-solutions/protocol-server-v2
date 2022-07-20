import client from "amqplib"
import { getConfig } from "../utils/config.utils"
import logger from "../utils/logger.utils"

// TODO: code bapResponseHandler

export const bapResponseHandler = async (msg : client.ConsumeMessage | null) => {
    try {
        // TODO: code bapResponseHandler
    } catch (err) {
        logger.error(err)
    }
}