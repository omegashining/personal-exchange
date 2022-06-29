import Event from "../model/event-entity.js"

export default class EventService {
    constructor(dao) {
        this.dao = dao
    }

    async create(object) {
        return await this.dao.insert(Event.model, object)
    }

    async getById(id) {
        return await this.dao.selectById(Event.model, id)
    }

    async getAll() {
        return await this.dao.select(Event.model)
    }

    count() {
        return this.dao.count(Event.model)
    }
}