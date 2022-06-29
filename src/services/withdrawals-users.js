import WithdrawalUser from "../model/withdrawal-user-entity.js"

export default class WithdrawalUserService {
    constructor(dao, webhook) {
        this.dao = dao
        this.webhook = webhook
    }

    async create(object) {
        if (!object.timestamp) object.timestamp = null

        const result = await this.dao.insert(WithdrawalUser.model, object)

        if (!!result) {
            await this.webhook.sendData(1, object)
        }

        return result
    }

    async getByHash(hash) {
        return await this.dao.selectOne(WithdrawalUser.model, {hash})
    }

    async getAllByWallet(walletId) {
        return await this.dao.select(WithdrawalUser.model, {walletId})
    }

    async update(object) {
        let withdrawal = await this.dao.selectById(WithdrawalUser.model, object.id)

        if (withdrawal) {
            withdrawal.confirmations = object.confirmations
            withdrawal.status = object.status
            withdrawal.updatedAt = new Date()

            const result = await withdrawal.save()

            if (!!result) {
                await this.webhook.sendData(2, withdrawal)
            }

            return result
        } else {
            return false
        }
    }

    count() {
        return this.dao.count(WithdrawalUser.model)
    }
}