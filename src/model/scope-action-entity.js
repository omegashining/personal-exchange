import Sequelize from "sequelize"
import Entities from "./index.js"

export default class ScopeActionEntity {
    constructor() {
        this.id = 0
        this.scopeId = null
        this.name = null
        this.method = null
        this.createdAt = null
        this.updatedAt = null
    }

    static get model() {
        return "scopes_actions"
    }

    static get schema() {
        return {
            id: {
                field: 'id',
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            scopeId: {
                field: 'scope_id',
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: Entities.Scope.model,
                    key: 'id'
                }
            },
            name: {
                field: 'name',
                type: Sequelize.STRING(150),
                allowNull: false
            },
            method: {
                field: 'method',
                type: Sequelize.STRING(150),
                allowNull: false
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