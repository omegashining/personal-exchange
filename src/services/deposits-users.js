import DepositUser from "../model/deposit-user-entity.js"

export default class DepositUserService {
    constructor(dao, webhook) {
        this.dao = dao
        this.webhook = webhook
    }

    async create(object) {
        if (!object.timestamp) object.timestamp = null

        const result = await this.dao.insert(DepositUser.model, object)

        if (!!result) {
            await this.webhook.sendData(1, object)
        }

        return result
    }

    async getByHash(hash) {
        return await this.dao.selectOne(DepositUser.model, {hash})
    }

    async getAllByWallet(walletId) {
        return await this.dao.select(DepositUser.model, {walletId})
    }

    async update(object) {
        let deposit = await this.dao.selectById(DepositUser.model, object.id)

        if (deposit) {
            deposit.confirmations = object.confirmations
            deposit.status = object.status
            deposit.updatedAt = new Date()

            const result = await deposit.save()

            if (!!result) {
                await this.webhook.sendData(1, deposit)
            }

            return result
        } else {
            return false
        }
    }

    count() {
        return this.dao.count(DepositUser.model)
    }
}