import XoyTransferCron from "./xoy-transfers.js"
import config from "../config.js"
import Logger from "../util/logger.js"
import cron from 'node-cron'

const logger = new Logger()

cron.schedule('*/5 * * * *', async () => {
    console.log('Cron: xoy_transfer')
    try {
        const xoyTransferCron = new XoyTransferCron(logger.instance(config.logger.elastic.indexes.crons.xoy_transfer))
        await xoyTransferCron.execute()

        //process.exit(0)
    } catch(error) {
        console.log('Error in xoy transfer cron: ', error)
        //process.exit(1)
    }
});
