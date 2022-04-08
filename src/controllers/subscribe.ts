import { NextFunction, Request, RequestHandler, Response } from "express";
import { createAuthHeaderConfig } from "../utils/auth";
import { getPrivateKey, getPublicKey, key_exchange_arguments } from "../utils/encryption";
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

export const subscribe : RequestHandler = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const publicKey : string = await getPublicKey()
        let reqBody = {
            "valid_from": new Date().toISOString(),
            "type": "BAP",
            "signing_public_key": "ZgEmkDZce9/rUqo2dlA7u4MVZhjF47JJtDfjXoA+iTw=",
            "valid_until": "2024-08-14T12:55:00.000Z",
            "subscriber_id": "sjsj.tvast.in",
            "unique_key_id": "15",
            "url": "https://8fee-2405-201-d007-c09b-9d3f-64ec-e4a1-b4cf.ngrok.io",
            "domain": "nic2004:52110",
            "encr_public_key": "KAIVEScmKA4MbXQDoX0J8y3x1QctCoOmMwBwBnPrsjU=",
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
        console.log("*************************")
        console.log(req.body)
        console.log("*************************")
        // // const regstryKey = "/re98S+QQonKxutHTNsnfX3qbSjZrsiqZ/drbeLbhis="
        // // let a = createDiffieHellman(512)
        // // a.setPrivateKey(Buffer.from("SKROdhs7yeD4gdJi2fOWvHLA9rqYaBzty5v8k6bH/3Q=", 'base64'))
        // // let secret = a.computeSecret(Buffer.from(regstryKey, 'base64'))
        // // console.log(`*****************\n${secret.toString('base64')}\n*****************`)
        // let challenge = req.body["challenge"]
        // let secret = "z4bj/q+yGXY/BgUUcDkfwN1cHWKd+7C1AyKWcYPrHS8="
        // console.log(Buffer.from(secret, 'base64').toString('hex').length)
        // // const aes = new AesEncryption()
        // // aes.setSecretKey(Buffer.from(secret, 'base64').toString('hex'))
        // // const decryted = aes.decrypt(challenge)
        // // console.log(decryted)
        // const iv = Buffer.from("0");
        // // const iv = randomBytes(14).toString("hex").slice(0, 14);
        // const decipher = createDecipheriv('aes-256-gcm', Buffer.from(secret, 'base64').toString('hex'), iv)
        // const decryted = Buffer.concat([decipher.update(Buffer.from(challenge.content, 'hex')), decipher.final()]);
        // console.log(decryted)
        let challenge = req.body["challenge"]
        let secret = "z4bj/q+yGXY/BgUUcDkfwN1cHWKd+7C1AyKWcYPrHS8="
        let regScrt = Buffer.from(secret, 'base64').toString('hex')
        let a = createDiffieHellman(1024)
        a.setPrivateKey(Buffer.from(key_exchange_arguments?.x_of_a!))
        let kke = a.computeSecret(Buffer.from(regScrt))
        // console.log(Buffer.from(kke).toString('base64'))
        let cfg = {
            mode: CryptoJS.mode.CBC,
            keySize: 128,
            iv: CryptoJS.enc.Hex.parse('00000000000000000000000000000000')
        }
        const ff = CryptoJS.AES.decrypt(Buffer.from(challenge, 'base64').toString(), secret)
        // console.log(ff)
        // var redd = ""
        // console.log(ff.words)
        // for(let i = 0; i < ff.words.length; i++) {
        //     redd += String.fromCharCode(ff.words[i])
        // }
        let fdf = ff.toString(CryptoJS.enc.Base64)
        console.log(`Decrypted String: ${fdf}`)
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