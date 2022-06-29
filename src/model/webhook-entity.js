import Sequelize from 'sequelize'
import Entities from "./index.js"

export default class WebhookEntity {

    static get model(){
        return "webhooks"
    }

    static get schema(){
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
            url: {
                field: 'url',
                type: Sequelize.STRING,
                allowNull: false
            },
            contentType: {
                field: 'content_type',
                type: Sequelize.ENUM('application/json', 'text/xml'),
                allowNull: false
            },
            secret: {
                field: 'secret',
                type: Sequelize.STRING(100)
            },
            status: {
                field: 'status',
                type: Sequelize.ENUM('INACTIVE', 'ACTIVE', 'DISABLED'),
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