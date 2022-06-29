import Access from "../model/access-entity.js"
import {hashText} from "../util/hash.js"

export default class AccessService {
    constructor(dao) {
        this.dao = dao
    }

    async create(object) {
        return await this.dao.insert(Access.model, object)
    }

    async getById(id) {
        return await this.dao.selectById(Access.model, id)
    }

    async getByEmail(email) {
        return await this.dao.selectOne(Access.model, {email})
    }

    async updatePassword(id, password) {
        let access = await this.dao.selectOne(Access.model, {id})

        if (access) {
            access.password = hashText(password)
            access.updatedAt = new Date()

            return await access.save()
        } else {
            return false
        }
    }

    async activate(id) {
        let access = await this.dao.selectOne(Access.model, {id})

        if (access) {
            access.status = 'ACTIVE'
            access.updatedAt = new Date()

            const result = await access.save()

            return !!result
        } else {
            return false
        }
    }

    async inactivate(id) {
        let access = await this.dao.selectOne(Access.model, {id})

        if (access) {
            access.status = 'INACTIVE'
            access.updatedAt = new Date()

            const result = await access.save()

            return !!result
        } else {
            return false
        }
    }

    async lock(id) {
        let access = await this.dao.selectOne(Access.model, {id})

        if (access) {
            access.status = 'LOCKED'
            access.updatedAt = new Date()

            const result = await access.save()

            return !!result
        } else {
            return false
        }
    }

    count() {
        return this.dao.count(Access.model)
    }
}