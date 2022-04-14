import * as crypto from 'crypto'

export let x25519KeyPair : any = null
export let publicKey64 : any = null

export const generateX25519KeyPair = () => {
    try {
        const x25519Keys = crypto.generateKeyPairSync('x25519', { publicKeyEncoding: {
                type: 'spki',
                format: 'der'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: 'top secret'
            }
        });
        console.log(x25519Keys.privateKey);
        console.log(x25519Keys.publicKey.toString('base64'));
        x25519KeyPair = x25519Keys
        publicKey64 = x25519Keys.publicKey.toString('base64')
    } catch (error) {
        throw error
    }
}

export const getPublicKey = () => {
    if(publicKey64) {
        return publicKey64
    } else {
        throw new Error('Public key not generated')
    }
}

export const generateSecret = (publicKey : any) => {
    try {
        const ourPrivateKeyObject = crypto.createPrivateKey({ key: x25519KeyPair.privateKey , passphrase: 'top secret'});
        const peerPublicKeyBuffer = crypto.createPublicKey({ key: getDER(publicKey), format: 'der', type: 'spki' });
        const secret = crypto.diffieHellman({
            privateKey: ourPrivateKeyObject,
            publicKey: peerPublicKeyBuffer,
        })
        return secret.toString('base64')
    } catch (error) {
        throw error
    }
}

function getRaw(derEncodedBufferKey : any) {
  return derEncodedBufferKey.slice(derEncodedBufferKey.length-32,derEncodedBufferKey.length).toString('base64');
}

function getDER(base64EncodedKey : any) {
  const key = Buffer.from(base64EncodedKey, 'base64')
 
  // X25519's OID 
  const oid = Buffer.from([0x06, 0x03, 0x2B, 0x65, 0x6E])

  // Create a byte sequence containing the OID and key
  return Buffer.concat([
    Buffer.concat([
      Buffer.from([0x30, 0x2A, 0x30]), // Sequence tag
      Buffer.from([oid.length]),
      oid,
    ]),
    Buffer.concat([
      Buffer.from([0x03]), // Bit tag
      Buffer.from([key.length + 1]),
      Buffer.from([0x00]), // Zero bit
      key,
    ]),
  ])

}