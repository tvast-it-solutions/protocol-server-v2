import { generateKeyPair, KeyObject, generateKeyPairSync, KeyPairKeyObjectResult, getDiffieHellman, createDiffieHellman } from "crypto"
import { readFileSync, writeFileSync } from "fs"
import logger from "./logger"

interface IKeyExchangeArgs {
    prime_number: string | null
    primitive_root: string | null
    x_of_a: string | null
    y_of_a: string | null
}
let publicKey : string | Buffer | null = null
let privateKey : string | Buffer | null = null
export let key_exchange_arguments : IKeyExchangeArgs | null = null

export const generateEncrKeys : Function = async () : Promise<void> => {
    try {
        // const keyPair : KeyPairKeyObjectResult = generateKeyPairSync('x25519')
        // publicKey = keyPair.publicKey.export({
        //     type: 'spki',
        //     format: 'pem'
        // })
        // privateKey = keyPair.privateKey.export({
        //     type: 'pkcs8',
        //     format: 'pem'
        // })
        // let f1 = readFileSync('./publicKey.pem').toString('base64')
        // let f2 = readFileSync('./privateKey.pem').toString('base64')
        // publicKey = f1
        // privateKey = f2
        // console.log(publicKey)
        // console.log(privateKey)
        let x25519Data = JSON.parse(readFileSync('./x25519.json').toString())
        key_exchange_arguments = {
            prime_number: x25519Data.prime_number,
            primitive_root: x25519Data.primitive_root,
            x_of_a: x25519Data.x_of_a,
            y_of_a: x25519Data.y_of_a
        }
    } catch (err : any) {
        const ro = err.code
        if(ro === 'ENOENT') {
            // let a = getDiffieHellman('modp1')
            let a = createDiffieHellman(1024)
            a.generateKeys()
            publicKey = a.getPublicKey('base64')
            privateKey = a.getPrivateKey('base64')
            key_exchange_arguments = {
                prime_number: a.getPrime().toString('hex'),
                primitive_root: a.getGenerator().toString('hex'),
                x_of_a: a.getPrivateKey().toString('hex'),
                y_of_a: a.getPublicKey().toString('hex')
            }
            writeFileSync('./x25519.json', JSON.stringify(key_exchange_arguments))
        }
        // throw err
    }
}

export const getPublicKey : Function = () => {
    try {
        if(!publicKey){
            throw new Error("Public key is not initialized")
        }
        return publicKey
    } catch (err) {
        logger.error(err)
        // throw err
    }
}

export const getPrivateKey : Function = () => {
    try {
        if(!privateKey){
            throw new Error("Private key is not initialized")
        }
        return privateKey
    } catch (err) {
        logger.error(err)
        // throw err
    }
}
