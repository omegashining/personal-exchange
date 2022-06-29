import Sequelize from "sequelize"
import Entities from "./index.js"

export default class AccessTokenScopeActionEntity {
    constructor() {
        this.accessTokenId = null
        this.scopeActionId = null
        this.createdAt = null
        this.updatedAt = null
    }

    static get model() {
        return "access_tokens_scopes_actions"
    }

    static get schema() {
        return {
            accessTokenId: {
                field: 'access_token_id',
                type: Sequelize.STRING(36),
                allowNull: false,
                references: {
                    model: Entities.AccessToken.model,
                    key: 'id'
                }
            },
            scopeActionId: {
                field: 'scope_action_id',
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: Entities.ScopeAction.model,
                    key: 'id'
                }
            },
            createdAt: {
                field: 'created_at',
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                field: 'updated_at',
                type: Sequelize.DATE
            }
        }
    }
}