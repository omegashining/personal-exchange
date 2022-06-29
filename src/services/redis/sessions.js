import config from '../../config.js'
import randomstring from "randomstring"
import RedisService from "./redis.js"

export default class SessionsService extends RedisService {
    constructor() {
        super(config.redis, config.redis.prefix.sessions)
    }

    async newSession(access, valid = false, expires = 60 * 60 * 24) {
        const token = this.prefix+randomstring.generate({length: 64})

        await this.set(token, expires, `${access.id}:${valid}`)

        return token
    }

    async validateSession(token, expires = 60 * 60 * 24) {
        const current = await this.get(token)

        await this.set(token, expires, current.replace("false", "true"))

        return token
    }

    async getSession(token) {
        let access = await this.get(token)
        if (!access) return {}

        access = access.split(':')

        return {
            id: access[0],
            status: access[1] === "true",
        }
    }

    async removeAllSessions(access) {
        const keys = (await this.lst("*")).filter(key => {
            return !key.startsWith('queues')
        })

        for (const token of keys) {
            const _access = await this.get(token)

            if (access.id === `${_access.split(':')[0]}`)
                await this.del(token)
        }

        return true
    }

    async removeSession(token) {
        await this.del(token)

        return true
    }
}