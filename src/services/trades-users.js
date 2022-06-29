import TradeUser from "../model/trade-user-entity.js"

export default class TradeUserService {
    constructor(dao) {
        this.dao = dao
    }

    async create(object) {
        return await this.dao.insert(TradeUser.model, object)
    }

    async getById(id) {
        return await this.dao.selectById(TradeUser.model, id)
    }

    async getAllByUser(userId) {
        return await this.dao.select(TradeUser.model, {userId})
    }

    async update(object) {
        let trade = await this.dao.selectById(TradeUser.model, object.id)

        if (deposit) {
            trade.status = object.status
            trade.updatedAt = new Date()

            return await trade.save()
        } else {
            return false
        }
    }

    count() {
        return this.dao.count(TradeUser.model)
    }
}