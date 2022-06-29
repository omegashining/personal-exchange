import WalletType from "../model/wallet-type-entity.js"

export default class WalletTypeService {
    constructor(dao) {
        this.dao = dao
    }

    async create(object) {
        return await this.dao.insert(WalletType.model, object)
    }

    async getById(id) {
        return await this.dao.selectById(WalletType.model, id)
    }

    async getByAcronym(acronym) {
        return await this.dao.selectOne(WalletType.model, {acronym})
    }

    async getAll() {
        return await this.dao.select(WalletType.model)
    }

    count() {
        return this.dao.count(WalletType.model)
    }
}