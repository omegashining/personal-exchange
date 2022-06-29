import Sequelize from 'sequelize'

export default class EventEntity {
    static get model(){
        return "events"
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
            description: {
                field: 'description',
                type: Sequelize.STRING,
                allowNull: false
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