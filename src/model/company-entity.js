import Sequelize from 'sequelize'
import Entities from "./index.js"

export default class CompanyEntity {
    constructor() {
        this.id = null
        this.accessId = null
        this.name = null
        this.fiscalId = null
        this.contactEmail = null
        this.contactPhone = null
        this.website = null
        this.coverFile = null
        this.logoFile = null
        this.planType = 'BASIC'
        this.seed = null
        this.mnemonic = null
        this.xoyContract
        this.status = 'INACTIVE'
        this.deletedAt = null
        this.createdAt = null
        this.updatedAt = null
    }

    static get model() {
        return "companies"
    }

    static get schema() {
        return {
            id: {
                field: 'id',
                type: Sequelize.STRING(36),
                allowNull: false,
                primaryKey: true
            },
            accessId: {
                field: 'access_id',
                type: Sequelize.STRING(36),
                allowNull: false,
                references: {
                    model: Entities.Access.model,
                    key: 'id'
                }
            },
            name: {
                field: 'name',
                type: Sequelize.STRING(125),
                allowNull: false
            },
            fiscalId: {
                field: 'fiscal_id',
                type: Sequelize.STRING(125)
            },
            contactEmail: {
                field: 'contact_email',
                type: Sequelize.STRING(125)
            },
            contactPhone: {
                field: 'contact_phone',
                type: Sequelize.STRING(125)
            },
            website: {
                field: 'website',
                type: Sequelize.STRING(255)
            },
            coverFile: {
                field: 'cover_file',
                type: Sequelize.STRING(255)
            },
            logoFile: {
                field: 'logo_file',
                type: Sequelize.STRING(255)
            },
            planType: {
                field: 'plan_type',
                type: Sequelize.ENUM('BASIC', 'PREMIUM')
            },
            planPeriod: {
                field: 'plan_period',
                type: Sequelize.ENUM('MONTH', 'YEAR')
            },
            planStarts: {
                field: 'plan_starts',
                type: Sequelize.DATE
            },
            planEnds: {
                field: 'plan_ends',
                type: Sequelize.DATE
            },
            seed: {
                field: 'seed',
                type: Sequelize.STRING(150)
            },
            mnemonic: {
                field: 'mnemonic',
                type: Sequelize.STRING(255)
            },
            xoyContract: {
                field: 'xoy_contract',
                type: Sequelize.STRING(100)
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