import DepositsUsersCron from "./deposits-users.js"
import WithdrawalsUsersCron from "./withdrawals-users.js"
import config from "../../config.js"
import Logger from "../../util/logger.js"
import cron from 'node-cron'

const logger = new Logger()

cron.schedule('*/5 * * * *', async () => {
    console.log('Cron: deposit_user, withdrawal_user')
    try {
        const depositsUsersCron = new DepositsUsersCron(logger.instance(config.logger.elastic.indexes.crons.deposit_user))
        await depositsUsersCron.execute()

        const withdrawalsUsersCron = new WithdrawalsUsersCron(logger.instance(config.logger.elastic.indexes.crons.withdrawal_user))
        await withdrawalsUsersCron.execute()

        //process.exit(0)
    } catch(error) {
        console.log('Error in user crons: ', error)
        //process.exit(1)
    }
});
