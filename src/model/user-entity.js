import Sequelize from 'sequelize'
import Entities from "./index.js"

export default class UserEntity {
    constructor() {
        this.id = null
        this.userId = null
        this.companyId = null
        this.levelId = 0
        this.name = null
        this.email = null
        this.password = null
        this.status = 'INACTIVE'
        this.createdAt = null
        this.updatedAt = null
    }

    static get model() {
        return "users"
    }

    static get schema() {
        return {
            id: {
                field: 'index_id',
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            userId: {
                field: 'id',
                type: Sequelize.STRING(36),
                allowNull: false,
                unique: true
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
            levelId: {
                field: 'level_id',
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: Entities.Level.model,
                    key: 'id'
                }
            },
            name: {
                field: 'name',
                type: Sequelize.STRING(100),
                allowNull: false
            },
            email: {
                field: 'email',
                type: Sequelize.STRING(100),
                allowNull: false
            },
            password: {
                field: 'pass',
                type: Sequelize.STRING(100),
                allowNull: false
            },
            status: {
                field: 'status',
                type: Sequelize.ENUM('INACTIVE', 'ACTIVE', 'LOCKED', 'DISABLED', 'DELETED'),
                allowNull: false
            },
            deletedAt: {
                field: 'deleted_at',
                type: Sequelize.DATE
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