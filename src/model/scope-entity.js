import Sequelize from 'sequelize'

export default class ScopeEntity {
    constructor() {
        this.id = null
        this.name = null
        this.endpoint = null
        this.createdAt = null
        this.updatedAt = null
    }

    static get model() {
        return "scopes"
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
            name: {
                field: 'name',
                type: Sequelize.STRING(100),
                allowNull: false
            },
            endpoint: {
                field: 'endpoint',
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