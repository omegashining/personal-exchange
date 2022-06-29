import EthTransferCron from "./eth-transfers.js"
import config from "../config.js"
import Logger from "../util/logger.js"
import cron from 'node-cron'

const logger = new Logger()

cron.schedule('*/5 * * * *', async () => {
    console.log('Cron: eth_transfer')
    try {
        const ethTransferCron = new EthTransferCron(logger.instance(config.logger.elastic.indexes.crons.eth_transfer))
        await ethTransferCron.execute()

        //process.exit(0)
    } catch(error) {
        console.log('Error in eth transfer cron: ', error)
        //process.exit(1)
    }
});
