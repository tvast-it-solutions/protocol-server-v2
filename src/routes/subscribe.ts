import {subscribe, checkKey} from "../controllers/subscribe"
import { Router } from "express"

const subscribeRouter = Router()

subscribeRouter.post("/", subscribe)
subscribeRouter.post("/f", checkKey)

export default subscribeRouter