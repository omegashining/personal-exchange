import bcrypt from "bcrypt"
import crypto from "crypto"

export const hashText = (text, rounds = 10) => {
    return bcrypt.hashSync(text, bcrypt.genSaltSync(rounds))
}

export const hashWithSecret = (text, secret) => {
    return crypto.createHmac('sha256', secret).update(text).digest('hex')
}

export const isHashEquals = (original, hash) => {
    try {
        return bcrypt.compareSync(original, hash)
        //return original === hash
    } catch (e) {
        return false
    }
}