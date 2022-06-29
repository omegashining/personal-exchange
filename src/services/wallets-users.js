import WalletUser from "../model/wallet-user-entity.js"

export default class WalletUserService {
    constructor(dao) {
        this.dao = dao
    }

    async create(object) {
        return await this.dao.insert(WalletUser.model, object)
    }

    async getById(id) {
        return await this.dao.selectById(WalletUser.model, id)
    }

    async getByUserWalletType(userId, walletTypeId) {
        return await this.dao.selectOne(WalletUser.model, {userId, walletTypeId})
    }

    async getByAddressWalletType(address, walletTypeId) {
        return await this.dao.selectOne(WalletUser.model, {address, walletTypeId})
    }

    async getAll() {
        return await this.dao.select(WalletUser.model)
    }

    async getAllByUser(userId) {
        return await this.dao.select(WalletUser.model, {userId})
    }

    async getAllByCompany(companyId) {
        return await this.dao.select(WalletUser.model, {companyId})
    }

    async getAllByWalletType(walletTypeId) {
        return await this.dao.select(WalletUser.model, {walletTypeId})
    }

    async getAllByCompanyWalletType(companyId, walletTypeId) {
        return await this.dao.select(WalletUser.model, {companyId, walletTypeId})
    }

    async updateBalance(userId, walletTypeId, newBalance) {
        let walletUser = await this.dao.selectOne(WalletUser.model, {userId, walletTypeId})

        if (walletUser) {
            walletUser.balance = newBalance
            walletUser.updatedAt = new Date()

            return await walletUser.save()
        } else {
            return false
        }
    }

    async updateContract(companyId, walletTypeId, xoyContract) {
        let update = await this.dao.updateWhere(WalletUser.model,
            {address: xoyContract, updatedAt: new Date()},
            {companyId, walletTypeId}
        )

        return !!update;
    }

    count() {
        return this.dao.count(WalletUser.model)
    }
}