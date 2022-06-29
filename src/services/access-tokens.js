import AccessToken from "../model/access-token-entity.js"
import AccessTokenScopeAction  from "../model/access-token-scope-action-entity.js"
import ScopeAction from "../model/scope-action-entity.js"
import Scope from "../model/scope-entity.js"

export default class AccessTokenService {
    constructor(dao) {
        this.dao = dao
    }

    async create(object) {
        return await this.dao.insert(AccessToken.model, object)
    }

    async getByToken(token) {
        const models = this.dao.models

        try {
            let accessToken = await models[AccessToken.model].findOne({where: {token}})

            if (accessToken) {
                let scopesActionsObjects = await models[AccessTokenScopeAction.model].findAll({
                    attributes: ['scopeActionId'],
                    where: {accessTokenId: accessToken.id}
                })
                let scopesActionsIds = scopesActionsObjects.map(sao => sao.scopeActionId)
                let scopesActions = await models[ScopeAction.model].findAll({
                    attributes: ['scopeId', 'method'],
                    where: {id: scopesActionsIds}
                })
                let scopes = await models[Scope.model].findAll()

                scopesActions.forEach(sa => {
                    sa.endpoint = scopes.find(({ id }) => id === sa.scopeId).endpoint
                })

                return {
                    id: accessToken.id,
                    companyId: accessToken.companyId,
                    scopesActions
                }
            }

            return null
        } catch(ex) {
            return null
        }
    }

    count() {
        return this.dao.count(AccessToken.model)
    }
}