import Sequelize from 'sequelize'
import Entities from "./index.js"

export default class AccessTokenEntity {
    constructor() {
        this.id = null
        this.name = null
        this.token = null
        this.createdAt = null
        this.updatedAt = null
    }

    static get model() {
        return "access_tokens"
    }

    static get schema() {
        return {
            id: {
                field: 'id',
                type: Sequelize.STRING(36),
                allowNull: false,
                primaryKey: true
            },
            companyId: {
                field: 'company_id',
                type: Sequelize.STRING(36),
                allowNull: false,
                references: {
                    model: Entities.Company.model,
                    key: 'id'
                }
            },
            name: {
                field: 'name',
                type: Sequelize.STRING(100),
                allowNull: false
            },
            token: {
                field: 'token',
                type: Sequelize.STRING(150),
                allowNull: false
            },
            expiresAt: {
                field: 'expires_at',
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
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