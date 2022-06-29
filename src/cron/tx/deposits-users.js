import Services from "../../services/services.js"
import {v4 as Uuid} from "uuid"
import BigDecimal from "js-big-decimal"
import AbstractCron from "../abstract-cron"

export default class DepositsUsersCron extends AbstractCron {
    constructor(logger) {
        super(logger)
    }

    async execute() {
        const wallets = await Services.walletUser.getAll()
        const walletsTypes = await Services.walletType.getAll()
        let deposits = {}

        walletsTypes.forEach(walletType => {
            deposits[walletType.acronym] = []
        });

        await Promise.all(await wallets.map(async (wallet) => {
            const walletType = await walletsTypes.find(({id}) => id === wallet.walletTypeId)
            const transactions = await Services.blockchain.getTransactionsOf(wallet.address, walletType.acronym)

            // console.log(walletType.acronym, wallet.address, transactions)
            if (transactions) {
                for (const transaction of transactions) {
                    if (transaction.type === 'deposit') {
                        let deposit = await Services.depositUser.getByHash(transaction.hash)

                        if (deposit) {
                            if (deposit.confirmations !== transaction.confirmations && deposit.status !== 'COMPLETED') {
                                deposit.confirmations = transaction.confirmations
                                deposit.status = (deposit.confirmations > walletType.confirmations) ? 'COMPLETED' : 'PENDING'

                                try {
                                    const depositUpdated = await Services.depositUser.update(deposit)

                                    if (depositUpdated && deposit.confirmations > walletType.confirmations) {
                                        deposits[walletType.acronym][depositUpdated.walletId] = deposits[walletType.acronym][depositUpdated.walletId] || []
                                        deposits[walletType.acronym][depositUpdated.walletId].push(depositUpdated)
                                    }
                                } catch (error) {
                                    await this.logError(error, 'deposit', deposit)
                                }
                            }
                        } else if (!deposit && walletType.acronym !== 'XOY') {
                            deposit = {
                                id: Uuid(),
                                walletId: wallet.id,
                                hash: transaction.hash,
                                sender: Array.isArray(transaction.from) ? transaction.from.join(',') : transaction.from,
                                amount: transaction.value,
                                fee: transaction.fee,
                                confirmations: transaction.confirmations,
                                status: 'PENDING',
                                timestamp: transaction.timestamp
                            }

                            try {
                                await Services.depositUser.create(deposit)
                            } catch (error) {
                                await this.logError(error, 'deposit', deposit)
                            }
                        }
                    }
                }
            }
        }))

        for (const walletType of walletsTypes) {
            for (let [key, value] of Object.entries(deposits[walletType.acronym])) {
                const wallet = await Services.walletUser.getById(key)
                let newBalance = new BigDecimal(wallet.balance)

                for (const deposit of value) {
                    const amount = new BigDecimal(deposit.amount)
                    newBalance = newBalance.add(amount)
                }

                await Services.walletUser.updateBalance(wallet.userId, wallet.walletTypeId, newBalance.getValue())
            }
        }
    }
}