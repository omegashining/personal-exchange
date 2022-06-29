import Level from "../model/level-entity.js"

export default class LevelService {
    constructor(dao) {
        this.dao = dao
    }

    async create(object) {
        return await this.dao.insert(Level.model, object)
    }

    async getById(id) {
        return await this.dao.selectById(Level.model, id)
    }

    async getByCompanyOrder(companyId, order) {
        return await this.dao.selectOne(Level.model, {companyId, order})
    }

    async getAllByCompany(companyId) {
        return await this.dao.select(Level.model, {companyId}, [['order', 'ASC']])
    }

    async update(object) {
        let level = await this.dao.selectById(Level.model, object.id)

        if (level) {
            level.description = object.description
            level.updatedAt = new Date()

            return await level.save()
        } else {
            return false
        }
    }

    count() {
        return this.dao.count(Level.model)
    }
}