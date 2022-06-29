import crypto from "crypto"
import aesJs from "aes-js"
import config from "../config"

export const seed = (length = 16) => {
    return crypto.randomBytes(length).toString('hex')
}

export const encrypt = (text) => {
    let textBytes = aesJs.utils.utf8.toBytes(text)

    let aesCbc = new aesJs.ModeOfOperation.ctr(config.cipher.key)
    let encryptedBytes = aesCbc.encrypt(textBytes)

    return aesJs.utils.hex.fromBytes(encryptedBytes)
}

export const decrypt = (hex) => {
    let encryptedBytes = aesJs.utils.hex.toBytes(hex)

    let aesCbc = new aesJs.ModeOfOperation.ctr(config.cipher.key)
    let decryptedBytes = aesCbc.decrypt(encryptedBytes)

    return aesJs.utils.utf8.fromBytes(decryptedBytes)
}

export const encryptAes256 = (text) => {
    let key = Buffer.from('ciw7p02f70000ysjon7gztjn7c2x7GfJ', 'utf8')
    let iv = crypto.randomBytes(16)

    let cipher = crypto.createCipheriv('aes256', key, iv)
    let ciphered = cipher.update(text, 'utf8', 'hex')
    ciphered += cipher.final('hex')

    return iv.toString('hex') + ':' + ciphered
}

export const decryptAes256 = (ciphertext) => {
    let components = ciphertext.split(':')
    let ivFromCiphertext = Buffer.from(components.shift(), 'hex')
    let decipher = crypto.createDecipheriv('aes256', key, ivFromCiphertext)
    let deciphered = decipher.update(components.join(':'), 'hex', 'utf8')
    deciphered += decipher.final('utf8')

    return deciphered
}