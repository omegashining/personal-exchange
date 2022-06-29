import ScopeAction from "../model/scope-action-entity.js"

export default class ScopeActionService {
    constructor(dao) {
        this.dao = dao
    }

    async create(object) {
        return await this.dao.insert(ScopeAction.model, object)
    }

    count() {
        return this.dao.count(ScopeAction.model)
    }
}