import WithdrawalCompany from "../model/withdrawal-company-entity.js"

export default class WithdrawalCompanyService {
    constructor(dao, webhook) {
        this.dao = dao
        this.webhook = webhook
    }

    async create(object) {
        if (!object.timestamp) object.timestamp = null

        const result = await this.dao.insert(WithdrawalCompany.model, object)

        if (!!result) {
            await this.webhook.sendData(1, object)
        }

        return result
    }

    async getByHash(hash) {
        return await this.dao.selectOne(WithdrawalCompany.model, {hash})
    }

    async getAllByWallet(walletId) {
        return await this.dao.select(WithdrawalCompany.model, {walletId})
    }

    async update(object) {
        let withdrawal = await this.dao.selectById(WithdrawalCompany.model, object.id)

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
        return this.dao.count(WithdrawalCompany.model)
    }
}