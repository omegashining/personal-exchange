import redis from "redis"
import {promisify} from "util"

export default class RedisService {
    constructor(config, prefix) {
        this.prefix = prefix + '-'

        if (config.enabled) {
            const clientSessions = redis.createClient({
                host: config.host,
                port: config.port,
            })
            this.set = promisify(clientSessions.setex).bind(clientSessions)
            this.get = promisify(clientSessions.get).bind(clientSessions)
            this.del = promisify(clientSessions.del).bind(clientSessions)
            this.lst = promisify(clientSessions.keys).bind(clientSessions)
        }
    }
}