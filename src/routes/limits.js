import AbstractRouter from "./abstract-router.js"
import Services from "../services/services.js"
import Passport from "../passport/passport.js"

export default class LimitRouter extends AbstractRouter {
    init() {
        this.post('/', false, Passport.isTokenValid, this.createLimit)
        this.put('/', false, Passport.isTokenValid, this.updateLimit)
        this.get('/level/:level', false, Passport.isTokenValid, this.getLimitsByLevel)
    }

    async createLimit(req, res) {
        this.logger.debug("Create limit.")
        const {levelId, type, deposit, withdrawal} = req.body

        const level = await this.level(levelId)
        if (!type) throw new Error("Type not provided.")
        if (type !== 'MXN' && type !== 'BTC' && type !== 'ETH' && type !== 'XOY') throw new Error("Incorrect type value (Must be MXN, BTC, ETH or XOY).")
        if (!deposit) throw new Error("Deposit amount not provided.")
        if (!withdrawal) throw new Error("Withdrawal amount not provided.")

        let limit = await Services.limit.getByLevelType(level.id, type)
        if (limit) throw new Error("Limit already exists.")

        limit = await Services.limit.create({
            levelId,
            type,
            deposit,
            withdrawal
        })

        res.sendSuccess({
            id: limit.id,
            levelId: limit.levelId,
            type: limit.type,
            deposit: limit.deposit,
            withdrawal: limit.withdrawal
        })
    }

    async updateLimit(req, res) {
        this.logger.debug("Update limit.")
        const {id, type, deposit, withdrawal} = req.body

        await this.limit(id)
        if (!type) throw new Error("Type not provided.")
        if (type !== 'MXN' && type !== 'BTC' && type !== 'ETH' && type !== 'XOY') throw new Error("Incorrect type value (Must be MXN, BTC, ETH or XOY).")
        if (!deposit) throw new Error("Deposit amount not provided.")
        if (!withdrawal) throw new Error("Withdrawal amount not provided.")

        const limit = await Services.limit.update({id, type, deposit, withdrawal})

        res.sendSuccess({
            id: limit.id,
            levelId: limit.levelId,
            type: limit.type,
            deposit: limit.deposit,
            withdrawal: limit.withdrawal
        })
    }

    async getLimitsByLevel(req, res) {
        this.logger.debug("Get limits by level.")

        const level = await this.level(req.params.level)

        const limits = await Services.limit.getAllByLevel(level.id)
        if (!limits) throw new Error("Error: Cannot get limits.")

        const result = limits.map(limit => ({
            id: limit.id,
            levelId: limit.levelId,
            type: limit.type,
            deposit: limit.deposit,
            withdrawal: limit.withdrawal
        }))

        res.sendSuccess(result)
    }
}