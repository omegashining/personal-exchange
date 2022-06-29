import AbstractCron from "./abstract-cron"
import Services from "../services/services.js"
import {v4 as Uuid} from "uuid"
import config from "../config.js"
import {getEthGas} from "../util/ethereum.js"

export default class EthTransfersCron extends AbstractCron {
    constructor(logger) {
        super(logger)
    }

    async execute() {
        const ethMinimum = config.blockchains.eth.minimum / 1e18
        const xoyMinimum = config.blockchains.xoy.minimum / 1e8
        const companies = await Services.company.getAll()
        const ethWalletType = await Services.walletType.getByAcronym('ETH')
        const xoyWalletType = await Services.walletType.getByAcronym('XOY')

        await Promise.all(await companies.map(async (company) => {
            const xoyUsersWallets = await Services.walletUser.getAllByCompanyWalletType(company.id, xoyWalletType.id)

            if (xoyUsersWallets) {
                const gasPrice = await getEthGas()
                const fee = (parseFloat(gasPrice.wei) * parseInt(config.blockchains.eth.gasLimit)) / 1e18
                const totalFee = fee * 3
                const amount = ethMinimum + totalFee
                let ethCompanyWallet = await Services.walletCompany.getByCompanyWalletType(company.id, ethWalletType.id)

                for (const xoyUserWallet of xoyUsersWallets) {
                    if (parseFloat(xoyUserWallet.balance) > xoyMinimum && ethCompanyWallet && parseFloat(ethCompanyWallet.balance) >= amount) {
                        const ethUserWallet = await Services.walletUser.getByUserWalletType(xoyUserWallet.userId, ethWalletType.id)

                        if (ethUserWallet && parseFloat(ethUserWallet.balance) < totalFee) {
                            // Transaction from company to user
                            const receipt = await Services.blockchain.sendTransaction(ethCompanyWallet, ethUserWallet.address, amount, ethWalletType.acronym)

                            const withdrawal = {
                                id: Uuid(),
                                walletId: ethCompanyWallet.id,
                                hash: receipt.hash,
                                receiver: ethUserWallet.address,
                                amount,
                                fee: receipt.fee,
                                confirmations: 0,
                                status: 'PENDING',
                                timestamp: new Date()
                            }

                            await Services.withdrawalCompany.create(withdrawal)

                            const newBalance = parseFloat(ethCompanyWallet.balance) - amount
                            ethCompanyWallet = await Services.walletCompany.updateBalance(ethCompanyWallet.companyId, ethCompanyWallet.walletTypeId, newBalance)
                        }
                    }
                }
            }
        }))
    }
}