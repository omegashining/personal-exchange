import Sequelize from 'sequelize'

export default class AccessEntity {
    constructor() {
        this.id = null
        this.name = null
        this.password = null
        this.lastPassword = null
        this.email = null
        this.emailToUpdate = null
        this.emailVerifiedAt = null
        this.status = 'INACTIVE'
        this.deletedAt = null
        this.createdAt = null
        this.updatedAt = null
    }

    static get model() {
        return "accesses"
    }

    static get schema() {
        return {
            id: {
                field: 'id',
                type: Sequelize.STRING(36),
                allowNull: false,
                primaryKey: true
            },
            name: {
                field: 'name',
                type: Sequelize.STRING(100),
                allowNull: false
            },
            password: {
                field: 'password',
                type: Sequelize.STRING(125),
                allowNull: false
            },
            lastPassword: {
                field: 'last_password',
                type: Sequelize.STRING(125)
            },
            email: {
                field: 'email',
                type: Sequelize.STRING(125),
                allowNull: false
            },
            emailToUpdate: {
                field: 'email_to_update',
                type: Sequelize.STRING(125)
            },
            emailVerifiedAt: {
                field: 'email_verified_at',
                type: Sequelize.DATE
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
                type: Sequelize.DATE,
                onUpdate : Sequelize.NOW
            }
        }
    }
}