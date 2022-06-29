import Scope from "../model/scope-entity.js"

export default class ScopeService {
    constructor(dao) {
        this.dao = dao
    }

    async create(object) {
        return await this.dao.insert(Scope.model, object)
    }

    count() {
        return this.dao.count(Scope.model)
    }
}