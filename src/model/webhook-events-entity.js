import Sequelize from 'sequelize'
import Entities from "./index.js"

export default class WebhookEventsEntity {

    static get model(){
        return "webhook_events"
    }

    static get schema(){
        return {
            id: {
                field: 'id',
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            webhook: {
                field: 'webhook_id',
                type: Sequelize.STRING(36),
                allowNull: false,
                references: {
                    model: Entities.Webhook.model,
                    key: 'id'
                }
            },
            event: {
                field: 'event_id',
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: Entities.Event.model,
                    key: 'id'
                }
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