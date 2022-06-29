import Sequelize from "sequelize"
import Entities from "./index.js"

export default class WalletUserEntity {
    constructor() {
        this.id = null
        this.walletTypeId = null
        this.companyId = null
        this.userId = null
        this.publicKey = null
        this.privateKey = null
        this.address = null
        this.balance = 0
        this.createdAt = null
        this.updatedAt = null
    }

    static get model() {
        return "wallets_users"
    }

    static get schema() {
        return {
            id: {
                field: 'id',
                type: Sequelize.STRING(36),
                allowNull: false,
                primaryKey: true
            },
            walletTypeId: {
                field: 'wallet_type_id',
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: Entities.WalletType.model,
                    key: 'id'
                }
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
            userId: {
                field: 'user_id',
                type: Sequelize.STRING(36),
                allowNull: false,
                references: {
                    model: Entities.User.model,
                    key: 'id'
                }
            },
            publicKey: {
                field: 'public_key',
                type: Sequelize.STRING(100),
                allowNull: false
            },
            privateKey: {
                field: 'private_key',
                type: Sequelize.STRING(100),
                allowNull: false
            },
            address: {
                field: 'address',
                type: Sequelize.STRING(100),
                allowNull: false
            },
            balance: {
                field: 'balance',
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