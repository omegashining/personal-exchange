import Sequelize from "sequelize"

export default class WalletTypeEntity {
    constructor() {
        this.id = null
        this.acronym = null
        this.description = null
        this.confirmations = 0
        this.createdAt = null
        this.updatedAt = null
    }

    static get model() {
        return "ctl_wallets_types"
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
            acronym: {
                field: 'acronym',
                type: Sequelize.STRING(20),
                allowNull: false
            },
            description: {
                field: 'description',
                type: Sequelize.STRING(20),
                allowNull: false
            },
            confirmations: {
                field: 'confirmations',
                type: Sequelize.INTEGER,
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