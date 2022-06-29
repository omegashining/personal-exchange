import AccessTokenScopeAction from "../model/access-token-scope-action-entity.js"

export default class AccessTokenScopeActionService {
    constructor(dao) {
        this.dao = dao
    }

    async create(object) {
        return await this.dao.insert(AccessTokenScopeAction.model, object)
    }

    count() {
        return this.dao.count(AccessTokenScopeAction.model)
    }
}