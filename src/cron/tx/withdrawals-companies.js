import Services from "../../services/services.js"
import AbstractCron from "../abstract-cron"

export default class WithdrawalsCompaniesCron extends AbstractCron {
    constructor(logger) {
        super(logger)
    }

    async execute() {
        const wallets = await Services.walletCompany.getAll()
        const walletsTypes = await Services.walletType.getAll()

        await Promise.all(await wallets.map(async (wallet) => {
            const walletType = await walletsTypes.find(({id}) => id === wallet.walletTypeId)
            const transactions = await Services.blockchain.getTransactionsOf(wallet.address, walletType.acronym)

            if (transactions) {
                for (const transaction of transactions) {
                    if (transaction.type === 'withdrawal') {
                        let withdrawal = await Services.withdrawalCompany.getByHash(transaction.hash)

                        if (withdrawal) {
                            if (withdrawal.confirmations !== transaction.confirmations && withdrawal.status !== 'COMPLETED') {
                                withdrawal.confirmations = transaction.confirmations
                                withdrawal.status = (withdrawal.confirmations > walletType.confirmations) ? 'COMPLETED' : 'PENDING'

                                try {
                                    await Services.withdrawalCompany.update(withdrawal)
                                } catch (error) {
                                    await this.logError(error, 'withdrawal', withdrawal)
                                }
                            }
                        }
                    }
                }
            }
        }))
    }
}