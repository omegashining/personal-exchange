import config from '../../config'
import randomstring from "randomstring"
import RedisService from "./redis"

export default class ActivateService extends RedisService {
    constructor() {
        super(config.redis, config.redis.prefix.activation)
    }

    async newActivationToken(user, expires = 60 * 60 * 24) {
        const token = this.prefix + randomstring.generate({
            length: 6,
            charset: 'numeric'
        })

        await this.set(token, expires, `${user._id}`)

        return token
    }

    async getUserIdFromToken(token) {
        return await this.get(token)
    }

    async removeRecoverToken(token) {
        await this.del(token)
        return true
    }
}