import AbstractCron from "./abstract-cron"
import Services from "../services/services.js"
import {v4 as Uuid} from "uuid"
import config from "../config.js"

export default class XoyTransfersCron extends AbstractCron {
    constructor(logger) {
        super(logger)
    }

    async execute() {
        const xoyMinimum = config.blockchains.xoy.minimum / 1e8
        const companies = await Services.company.getAll()
        const xoyWalletType = await Services.walletType.getByAcronym('XOY')

        await Promise.all(await companies.map(async (company) => {
            const xoyCompanyWallet = await Services.walletCompany.getByCompanyWalletType(company.id, xoyWalletType.id)
            const xoyUsersWallets = await Services.walletUser.getAllByCompanyWalletType(company.id, xoyWalletType.id)

            if (xoyCompanyWallet && xoyUsersWallets) {
                for (const xoyUserWallet of xoyUsersWallets) {
                    if (parseFloat(xoyUserWallet.balance) > xoyMinimum) {
                        const withdrawal = {
                            id: Uuid(),
                            walletId: xoyUserWallet.id,
                            hash: 'internal',
                            receiver: xoyCompanyWallet.address,
                            amount: xoyUserWallet.balance,
                            fee: 0,
                            confirmations: 1,
                            status: 'COMPLETED',
                            timestamp: new Date()
                        }

                        await Services.withdrawalUser.create(withdrawal)

                        const newUserBalance = parseFloat(xoyUserWallet.balance) - parseFloat(withdrawal.amount)
                        await Services.walletUser.updateBalance(xoyUserWallet.userId, xoyUserWallet.walletTypeId, newUserBalance)

                        const deposit = {
                            id: Uuid(),
                            walletId: xoyCompanyWallet.id,
                            hash: 'internal',
                            sender: xoyUserWallet.address,
                            amount: xoyUserWallet.balance,
                            fee: 0,
                            confirmations: 1,
                            status: 'COMPLETED',
                            timestamp: new Date()
                        }

                        await Services.depositUser.create(deposit)

                        const newCompanyBalance = parseFloat(xoyCompanyWallet.balance) + parseFloat(xoyUserWallet.balance)
                        await Services.walletCompany.updateBalance(xoyCompanyWallet.userId, xoyCompanyWallet.walletTypeId, newCompanyBalance)
                    }
                }
            }
        }))
    }
}