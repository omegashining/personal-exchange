import Limit from "../model/limit-entity.js"

export default class LimitService {
    constructor(dao) {
        this.dao = dao
    }

    async create(object) {
        return await this.dao.insert(Limit.model, object)
    }

    async getById(id) {
        return await this.dao.selectById(Limit.model, id)
    }

    async getByLevelType(levelId, type) {
        return await this.dao.selectOne(Limit.model, {levelId, type})
    }

    async getAllByLevel(levelId) {
        return await this.dao.select(Limit.model, {levelId}, [['type', 'ASC']])
    }

    async update(object) {
        let limit = await this.dao.selectById(Limit.model, object.id)

        if (limit) {
            limit.type = object.type
            limit.deposit = object.deposit
            limit.withdrawal = object.withdrawal
            limit.updatedAt = new Date()

            return await limit.save()
        } else {
            return false
        }
    }

    count() {
        return this.dao.count(Limit.model)
    }
}