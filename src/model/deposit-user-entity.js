import Sequelize from 'sequelize'
import Entities from "./index.js"

export default class DepositUserEntity {
    constructor() {
        this.id = null
        this.walletId = null
        this.hash = null
        this.sender = null
        this.amount = 0
        this.fee = 0
        this.confirmations = 0
        this.status = null
        this.timestamp = null
        this.createdAt = null
        this.updatedAt = null
    }

    static get model() {
        return "deposits_users"
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
            hash: {
                field: 'hash',
                type: Sequelize.STRING,
                allowNull: false
            },
            sender: {
                field: 'sender',
                type: Sequelize.STRING(150),
                allowNull: false
            },
            amount: {
                field: 'amount',
                type: Sequelize.DECIMAL(16, 8),
                allowNull: false
            },
            fee: {
                field: 'fee',
                type: Sequelize.DECIMAL(16, 8),
                allowNull: false,
            },
            confirmations: {
                field: 'confirmations',
                type: Sequelize.INTEGER,
                allowNull: false
            },
            status: {
                field: 'status',
                type: Sequelize.ENUM('PENDING', 'COMPLETED', 'REJECTED'),
                allowNull: false
            },
            timestamp: {
                field: 'timestamp',
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