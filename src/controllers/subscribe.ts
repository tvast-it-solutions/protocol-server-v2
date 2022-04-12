import { NextFunction, Request, RequestHandler, Response } from "express";
import { createAuthHeaderConfig } from "../utils/auth";
import { getPrivateKey, key_exchange_arguments } from "../utils/encryption";
import logger from "../utils/logger";
const axiosd = require('axios').default
import axios from "axios";
import { registryLookup } from "../utils/lookup";
import { createPublicKey, createDiffieHellman, getDiffieHellman, KeyObject, createDecipheriv, randomBytes } from "crypto";
import { readFileSync } from "fs";
import bytes from "bytes";
const ossl = require('openssl-wrapper')
const AesEncryption = require('aes-encryption')
var aesjs = require('aes-js')
import CryptoJS from "crypto-js";
// var CryptoJS = require("crypto-js");
import { generateSecret, getPublicKey } from "../utils/subAuth";

export const subscribe : RequestHandler = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const publicKey : string = getPublicKey()
        let reqBody = {
            "valid_from": new Date().toISOString(),
            "type": "BAP",
            "signing_public_key": "ZgEmkDZce9/rUqo2dlA7u4MVZhjF47JJtDfjXoA+iTw=",
            "valid_until": "2024-08-14T12:55:00.000Z",
            "subscriber_id": "sjsj.tvast.in",
            "unique_key_id": "15",
            "url": "https://8fee-2405-201-d007-c09b-9d3f-64ec-e4a1-b4cf.ngrok.io",
            "domain": "nic2004:52110",
            "encr_public_key": publicKey,
            "country": "IND",
            "city": "std:080",
            "nonce": 14,
        }
        console.log(reqBody)
        const axios_config = await createAuthHeaderConfig(reqBody)
        console.log(axios_config)
        console.log(reqBody)
        const response = await axiosd.post('https://registry.becknprotocol.io/subscribers/subscribe', reqBody, axios_config)
        logger.info(response.status)
        logger.info(response.data)
        res.status(200).json({
            status: "ok"
        })
    } catch (err) {
        console.log(err)
        if(axios.isAxiosError(err)) {
            logger.error(err.response!.data)
            res.status(err.response!.status).json(err.response!.data)
        }
    }
}

export const checkKey : RequestHandler = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const publicKey = await createPublicKey({
            key: "-----BEGIN PUBLIC KEY-----\
/re98S+QQonKxutHTNsnfX3qbSjZrsiqZ/drbeLbhis=\
-----END PUBLIC KEY-----",
        })
        console.log(publicKey)
        res.status(200).json({
            status: "ok"
        })
    } catch (err) {
        console.log(err)
        if(axios.isAxiosError(err)) {
            logger.error(err.response!.data)
            res.status(err.response!.status).json(err.response!.data)
        }
    }
}

export const onSubscribe : RequestHandler = async (req : Request, res : Response, next : NextFunction) => {
    try {
        console.log(req.body)
        const shared = await generateSecret("/re98S+QQonKxutHTNsnfX3qbSjZrsiqZ/drbeLbhis=")
        console.log(shared)
        res.status(200).json({
            status: "ok"
        })
    } catch (err) {
        if(axios.isAxiosError(err)) {
            logger.error(JSON.stringify(err.response!.data))
        } else {
            console.log(err)
        }
    }
}