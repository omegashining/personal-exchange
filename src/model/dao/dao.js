import config from '../../config.js'
import Sequelize from 'sequelize'
import Entities from "../index.js"
import fs from "fs"

export default class Dao {
    constructor() {
        this.conn = new Sequelize(config.mysql.name, config.mysql.user, config.mysql.pass, {
            host: config.mysql.ip,
            port: config.mysql.port,
            dialect: `mysql`,
            timezone: config.mysql.timezone,
            logging: false,
            define: {
                timestamps: false,
                charset: 'utf8',
                dialectOptions: {
                    collate: 'utf8_general_ci'
                }
            },
            pool: {
                max: 30,
                idle: 30000,
                acquire: 60000
            }
        })

        // Validación de conexión a la Base de Datos
        this.conn.authenticate().catch( err => {
            console.error( err )
            process.exit()
        } )

        this.models = {
            [Entities.Access.model]: this.conn.define(Entities.Access.model, Entities.Access.schema, {tableName: Entities.Access.model, timestamps: false}),
            [Entities.WalletType.model]: this.conn.define(Entities.WalletType.model, Entities.WalletType.schema, {timestamps: false}),
            [Entities.Company.model]: this.conn.define(Entities.Company.model, Entities.Company.schema, {timestamps: false}),
            [Entities.Level.model]: this.conn.define(Entities.Level.model, Entities.Level.schema, {timestamps: false}),
            [Entities.Limit.model]: this.conn.define(Entities.Limit.model, Entities.Limit.schema, {timestamps: false}),
            [Entities.WalletCompany.model]: this.conn.define(Entities.WalletCompany.model, Entities.WalletCompany.schema, {timestamps: false}),
            [Entities.DepositCompany.model]: this.conn.define(Entities.DepositCompany.model, Entities.DepositCompany.schema, {timestamps: false}),
            [Entities.WithdrawalCompany.model]: this.conn.define(Entities.WithdrawalCompany.model, Entities.WithdrawalCompany.schema, {timestamps: false}),
            [Entities.User.model]: this.conn.define(Entities.User.model, Entities.User.schema, {timestamps: false}),
            [Entities.WalletUser.model]: this.conn.define(Entities.WalletUser.model, Entities.WalletUser.schema, {timestamps: false}),
            [Entities.DepositUser.model]: this.conn.define(Entities.DepositUser.model, Entities.DepositUser.schema, {timestamps: false}),
            [Entities.WithdrawalUser.model]: this.conn.define(Entities.WithdrawalUser.model, Entities.WithdrawalUser.schema, {timestamps: false}),
            [Entities.Webhook.model]: this.conn.define(Entities.Webhook.model, Entities.Webhook.schema, {timestamps: false}),
            [Entities.Event.model]: this.conn.define(Entities.Event.model, Entities.Event.schema, {timestamps: false}),
            [Entities.WebhookEvents.model]: this.conn.define(Entities.WebhookEvents.model, Entities.WebhookEvents.schema, {timestamps: false}),
            [Entities.AccessToken.model]: this.conn.define(Entities.AccessToken.model, Entities.AccessToken.schema, {timestamps: false}),
            [Entities.Scope.model]: this.conn.define(Entities.Scope.model, Entities.Scope.schema, {timestamps: false}),
            [Entities.ScopeAction.model]: this.conn.define(Entities.ScopeAction.model, Entities.ScopeAction.schema, {timestamps: false}),
            [Entities.AccessTokenScopeAction.model]: this.conn.define(Entities.AccessTokenScopeAction.model, Entities.AccessTokenScopeAction.schema, {timestamps: false})
        }
    }

    async insert(entity, object) {
        if (!this.models[entity]) {
            throw new Error('Entidad ' + entity + ' no esta definida.')
        }
        try {
            return this.models[entity].create(object)
        }
        catch(ex) {
            return null
        }
    }

    async update(entity, data) {
        try {
            this.models[entity].update(data)
        }
        catch(ex) {
            return null
        }
    }

    async updateWhere(entity, setData, whereData) {
        try {
            this.models[entity].update(setData, { where: whereData })
        }
        catch(ex) {
            return null
        }
    }

    async selectById(entity, id) {
        if (!this.models[entity]) {
            throw new Error('Entidad ' + entity + ' no esta definida.')
        }
        try {
            return await this.models[entity].findByPk(id)
        }
        catch(ex) {
            return null
        }
    }

    async selectOne(entity, params) {
        if (!this.models[entity]) {
            throw new Error('Entidad ' + entity + ' no esta definida.')
        }
        try {
            return await this.models[entity].findOne({where: params})
        }
        catch(ex) {
            return null
        }
    }

    async select(entity, params, orderParams = null) {
        if (!this.models[entity]) {
            throw new Error('Entidad ' + entity + ' no esta definida.')
        }
        try {
            return await this.models[entity].findAll({where: params, order: orderParams})
        }
        catch(ex) {
            return null
        }
    }

    async count(entity) {
        if (!this.models[entity]) {
            throw new Error('Entidad ' + entity + ' no esta definida.')
        }
        try {
            return await this.models[entity].count()
        }
        catch(ex) {
            return null
        }
    }
}
