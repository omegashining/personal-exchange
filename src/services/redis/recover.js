import config from '../../config'
import randomstring from "randomstring"
import RedisService from "./redis"

export default class RecoverService extends RedisService {
    constructor() {
        super(config.redis, config.redis.prefix.recover)
    }

    async newRecoverToken(user, expires = 60 * 60 * 24) {
        const token = this.prefix + randomstring.generate({length: 32})

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