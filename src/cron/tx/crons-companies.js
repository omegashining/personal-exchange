import DepositsCompaniesCron from "./deposits-companies.js"
import WithdrawalsCompaniesCron from "./withdrawals-companies.js"
import config from "../../config.js"
import Logger from "../../util/logger.js"
import cron from 'node-cron'

const logger = new Logger()

cron.schedule('*/5 * * * *', async () => {
    console.log('Cron: deposit_company, withdrawal_company')
    try {
        const depositsCompaniesCron = new DepositsCompaniesCron(logger.instance(config.logger.elastic.indexes.crons.deposit_company))
        await depositsCompaniesCron.execute()

        const withdrawalsCompaniesCron = new WithdrawalsCompaniesCron(logger.instance(config.logger.elastic.indexes.crons.withdrawal_company))
        await withdrawalsCompaniesCron.execute()

        //process.exit(0)
    } catch(error) {
        console.error('Error in company crons: ', error)
        //process.exit(1)
    }
});
