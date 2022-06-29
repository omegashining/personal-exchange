import AbstractRouter from "./abstract-router.js"
import Services from "../services/services.js"
import Passport from "../passport/passport.js"
import {v4 as Uuid} from "uuid";

export default class DepositUserRouter extends AbstractRouter {
    init() {
        this.post('/validate/xoy', false, Passport.isTokenValid, this.validateXoy)
        this.get('/hash/:hash', false, Passport.isTokenValid, this.getDepositByHash)
        this.get('/wallet/:walletId', false, Passport.isTokenValid, this.getDepositsByWallet)
    }

    async validateXoy(req, res) {
        this.logger.debug("Validate XOY deposit.")
        const {userId, hash, amount, signature} = req.body

        let deposit = await Services.depositUser.getByHash(hash)
        if (deposit) throw new Error("Deposit already exists.")

        const ethWalletType = await this.walletType('ETH')
        const xoycWalletType = await this.walletType('XOY')

        const address = await Services.blockchain.verifyMessage(amount, signature, xoycWalletType.acronym)
        if (!address) throw new Error("Could not verify message.")

        const user = await this.user(userId)

        const ethCompanyWallet = await Services.walletCompany.getByCompanyWalletType(user.companyId, ethWalletType.id)
        if (!ethCompanyWallet) throw new Error("ETH wallet not found.")

        const xoycUserWallet = await Services.walletUser.getByUserWalletType(user.userId, xoycWalletType.id)
        if (!xoycUserWallet) throw new Error("User wallet not found.")

        const event = await Services.blockchain.getEvent(ethCompanyWallet, xoycUserWallet.address, address, hash, xoycWalletType.acronym)
        if (!event) throw new Error("Deposit event was not found.")

        deposit = {
            id: Uuid(),
            walletId: xoycUserWallet.id,
            hash,
            sender: address,
            amount,
            fee: 0,
            confirmations: 0,
            status: 'PENDING',
            timestamp: new Date()
        }

        await Services.depositUser.create(deposit)

        res.sendSuccess({
            id: deposit.id,
            walletId: deposit.walletId,
            hash: deposit.hash,
            sender: deposit.sender,
            amount: deposit.amount,
            fee: deposit.fee,
            confirmations: deposit.confirmations,
            status: deposit.status,
            timestamp: deposit.timestamp
        })
    }

    async getDepositByHash(req, res) {
        this.logger.debug("Get deposit by hash.")
        const hash = req.params.hash

        if (!hash) throw new Error("Hash not provided.")

        const deposit = await Services.depositUser.getByHash(hash)
        if (!deposit) throw new Error("Deposit not found.")

        res.sendSuccess({
            id: deposit.id,
            walletId: deposit.walletId,
            hash: deposit.hash,
            sender: deposit.sender,
            amount: deposit.amount,
            fee: deposit.fee,
            confirmations: deposit.confirmations,
            status: deposit.status,
            timestamp: deposit.timestamp
        })
    }

    async getDepositsByWallet(req, res) {
        this.logger.debug("Get deposits by wallet.")
        const {walletId} = req.params

        const wallet = await this.walletUser(walletId)

        const deposits = await Services.depositUser.getAllByWallet(wallet.id)
        if (!deposits) throw new Error("Error: Cannot get deposits.")

        const result = deposits.map(deposit => ({
            id: deposit.id,
            walletId: deposit.walletId,
            hash: deposit.hash,
            sender: deposit.sender,
            amount: deposit.amount,
            fee: deposit.fee,
            confirmations: deposit.confirmations,
            status: deposit.status,
            timestamp: deposit.timestamp
        }))

        res.sendSuccess(result)
    }
}