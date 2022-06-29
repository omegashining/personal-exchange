import Sequelize from 'sequelize'
import Entities from "./index.js"

export default class TradeUserEntity {
    constructor() {
        this.id = null
        this.walletId = null
        this.amount = 0
        this.walletTypeId = null
        this.amountReceived = 0
        this.status = null
        this.createdAt = null
        this.updatedAt = null
    }

    static get model() {
        return "trades_users"
    }

    static get schema() {
        return {
            id: {
                field: 'id',
                type: Sequelize.STRING(36),
                allowNull: false,
                primaryKey: true
            },
            walletId: {
                field: 'wallet_id',
                type: Sequelize.STRING(36),
                allowNull: false,
                references: {
                    model: Entities.WalletUser.model,
                    key: 'id'
                }
            },
            amount: {
                field: 'amount',
                type: Sequelize.DECIMAL(16, 8),
                allowNull: false
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
            amountReceived: {
                field: 'amount_received',
                type: Sequelize.DECIMAL(16, 8),
                allowNull: false
            },
            status: {
                field: 'status',
                type: Sequelize.ENUM('PENDING', 'COMPLETED', 'REJECTED'),
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