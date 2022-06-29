import Sequelize from "sequelize"
import Entities from "./index.js"

export default class LimitEntity {
    constructor() {
        this.id = 0
        this.levelId = 0
        this.type = null
        this.deposit = 0
        this.withdrawal = 0
        this.createdAt = null
        this.updatedAt = null
    }

    static get model() {
        return "ctl_limits"
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
            levelId: {
                field: 'level_id',
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: Entities.Level.model,
                    key: 'id'
                }
            },
            type: {
                field: 'type',
                type: Sequelize.ENUM('MXN', 'BTC', 'ETH', 'XOY'),
                allowNull: false
            },
            deposit: {
                field: 'deposit',
                type: Sequelize.DECIMAL(16, 8),
                allowNull: false
            },
            withdrawal: {
                field: 'withdrawal',
                type: Sequelize.DECIMAL(16, 8),
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