import AbstractRouter from "./abstract-router.js"
import Services from "../services/services.js"
import Passport from "../passport/passport.js"

export default class WithdrawalCompanyRouter extends AbstractRouter {
    init() {
        this.get('/hash/:hash', false, Passport.isTokenValid, this.getWithdrawalByHash)
        this.get('/wallet/:walletId', false, Passport.isTokenValid, this.getWithdrawalsByWallet)
    }

    async getWithdrawalByHash(req, res) {
        this.logger.debug("Get withdrawal by hash.")
        const hash = req.params.hash

        if (!hash) throw new Error("Hash not provided.")

        const withdrawal = await Services.withdrawalCompany.getByHash(hash)
        if (!withdrawal) throw new Error("Withdrawal not found.")

        res.sendSuccess({
            id: withdrawal.id,
            walletId: withdrawal.walletId,
            userId: withdrawal.userId,
            hash: withdrawal.hash,
            receiver: withdrawal.receiver,
            amount: withdrawal.amount,
            fee: withdrawal.fee,
            confirmations: withdrawal.confirmations,
            status: withdrawal.status,
            timestamp: withdrawal.timestamp
        })
    }

    async getWithdrawalsByWallet(req, res) {
        this.logger.debug("Get withdrawals by user and wallet.")
        const {walletId} = req.params

        const wallet = await this.walletCompany(walletId)

        const withdrawals = await Services.withdrawalCompany.getAllByWallet(wallet.id)
        if (!withdrawals) throw new Error("Error: Cannot get withdrawals.")

        const result = withdrawals.map(withdrawal => ({
            id: withdrawal.id,
            walletId: withdrawal.walletId,
            userId: withdrawal.userId,
            hash: withdrawal.hash,
            receiver: withdrawal.receiver,
            amount: withdrawal.amount,
            fee: withdrawal.fee,
            confirmations: withdrawal.confirmations,
            status: withdrawal.status,
            timestamp: withdrawal.timestamp
        }))

        res.sendSuccess(result)
    }
}