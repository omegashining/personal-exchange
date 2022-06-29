import Router from "./router.js"
import Services from "../services/services.js"
import Passport from "../passport/passport.js"

export default class WalletTypeRouter extends Router {
    init() {
        this.get('/', '1 minute', Passport.isTokenValid, this.getWalletsTypes)
    }

    async getWalletsTypes(req, res) {
        this.logger.debug("Get wallets types.")

        const walletsTypes = await Services.walletType.getAll()
        if (!walletsTypes) throw new Error("Error: Cannot get currencies.")

        const result = walletsTypes.map(walletType => ({
            id: walletType.id,
            acronym: walletType.acronym,
            description: walletType.description,
            confirmations: walletType.confirmations
        }))

        res.sendSuccess(result)
    }
}