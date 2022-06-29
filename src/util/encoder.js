import base32 from "thirty-two"
import crypto from "crypto"

export const generate = (length = 16) => {
    return base32.encode(crypto.randomBytes(length))
}

export const encode = (code) => {
    return base32.encode(code)
}

export const decode = (code) => {
    return base32.decode(code)
}