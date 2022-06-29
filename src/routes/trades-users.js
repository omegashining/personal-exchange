import AbstractRouter from "./abstract-router.js"
import Passport from "../passport/passport.js"
import Services from "../services/services.js";

export default class TradeUserRouter extends AbstractRouter {
    init() {
        this.get('/', false, Passport.isTokenValid, this.trade)
        this.get('/user/:userId', false, Passport.isTokenValid, this.getTradesByUser)
    }

    async trade(req, res) {
        this.logger.debug("Trade.")
        const {walletId, currencyFrom, currencyTo, amount} = req.body

        if (!currencyFrom) throw new Error("Currency from not provided.")
        if (!currencyTo) throw new Error("Currency to not provided.")
        if (!amount) throw new Error("Amount not provided.")
        const userWallet = await this.walletUser(walletId)

        res.sendSuccess({
        })
    }

    async getTradesByUser(req, res) {
        this.logger.debug("Get trades by user.")
        const userId = req.params.userId

        if (!userId) throw new Error("User ID not provided.")

        const trades = await Services.tradeUser.getAllByUser(userId)
        if (!trades) throw new Error("Error: Cannot get trades.")

        const result = trades.map(wallet => ({
            id: wallet.id,
            walletId: wallet.walletId,
            amount: wallet.amount,
            walletTypeId: wallet.walletTypeId,
            amountReceived: wallet.amountReceived,
            status: wallet.status
        }))

        return res.sendSuccess(result)
    }
}