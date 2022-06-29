import User from "../model/user-entity.js"
import {hashText} from "../util/hash.js"

export default class UserService {
    constructor(dao) {
        this.dao = dao
    }

    async create(object) {
        return await this.dao.insert(User.model, object)
    }

    async getById(userId) {
        return await this.dao.selectOne(User.model, {userId})
    }

    async getByEmail(email) {
        return await this.dao.selectOne(User.model, {email})
    }

    async update(object) {
        let user = await this.dao.selectOne(User.model, {userId: object.userId})

        if (user) {
            user.levelId = object.levelId
            user.name = object.name
            user.email = object.email
            user.updatedAt = new Date()

            return await user.save()
        } else {
            return false
        }
    }

    async updatePassword(userId, password) {
        let user = await this.dao.selectOne(User.model, {userId})

        if (user) {
            user.password = hashText(password)
            user.updatedAt = new Date()

            return await user.save()
        } else {
            return false
        }
    }

    async activate(userId) {
        let user = await this.dao.selectOne(User.model, {userId})

        if (user) {
            user.status = 'ACTIVE'
            user.updatedAt = new Date()

            const result = await user.save()

            return !!result
        } else {
            return false
        }
    }

    async inactivate(userId) {
        let user = await this.dao.selectOne(User.model, {userId})

        if (user) {
            user.status = 'INACTIVE'
            user.updatedAt = new Date()

            const result = await user.save()

            return !!result
        } else {
            return false
        }
    }

    async lock(userId) {
        let user = await this.dao.selectOne(User.model, {userId})

        if (user) {
            user.status = 'LOCKED'
            user.updatedAt = new Date()

            const result = await user.save()

            return !!result
        } else {
            return false
        }
    }

    count() {
        return this.dao.count(User.model)
    }
}