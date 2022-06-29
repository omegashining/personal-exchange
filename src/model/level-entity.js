import Sequelize from "sequelize"
import Entities from "./index.js"

export default class LevelEntity {
    constructor() {
        this.id = 0
        this.companyId = null
        this.order = null
        this.description = null
        this.createdAt = null
        this.updatedAt = null
    }

    static get model() {
        return "ctl_levels"
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
            companyId: {
                field: 'company_id',
                type: Sequelize.STRING(36),
                allowNull: false,
                references: {
                    model: Entities.Company.model,
                    key: 'id'
                }
            },
            order: {
                field: 'order',
                type: Sequelize.INTEGER,
                allowNull: false
            },
            description: {
                field: 'description',
                type: Sequelize.STRING,
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