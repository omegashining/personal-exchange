import WalletCompany from "../model/wallet-company-entity.js"

export default class WalletCompanyService {
    constructor(dao) {
        this.dao = dao
    }

    async create(object) {
        return await this.dao.insert(WalletCompany.model, object)
    }

    async getById(id) {
        return await this.dao.selectById(WalletCompany.model, id)
    }

    async getByCompanyWalletType(companyId, walletTypeId) {
        return await this.dao.selectOne(WalletCompany.model, {companyId, walletTypeId})
    }

    async getByAddressWalletType(address, walletTypeId) {
        return await this.dao.selectOne(WalletCompany.model, {address, walletTypeId})
    }

    async getAll() {
        return await this.dao.select(WalletCompany.model)
    }

    async getAllByWalletType(walletTypeId) {
        return await this.dao.select(WalletCompany.model, {walletTypeId})
    }

    async getAllByCompany(companyId) {
        return await this.dao.select(WalletCompany.model, {companyId})
    }

    async updateBalance(companyId, walletTypeId, newBalance) {
        let walletCompany = await this.dao.selectOne(WalletCompany.model, {companyId, walletTypeId})

        if (walletCompany) {
            walletCompany.balance = newBalance
            walletCompany.updatedAt = new Date()

            return await walletCompany.save()
        } else {
            return false
        }
    }

    async updateContract(companyId, walletTypeId, xoyContract) {
        let walletCompany = await this.dao.selectOne(WalletCompany.model, {companyId, walletTypeId})

        if (walletCompany) {
            walletCompany.address = xoyContract
            walletCompany.updatedAt = new Date()

            return await walletCompany.save()
        } else {
            return false
        }
    }

    count() {
        return this.dao.count(WalletCompany.model)
    }
}