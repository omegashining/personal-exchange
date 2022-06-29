import Router from "./router.js"
import Services from "../services/services.js"
import * as hdWallet from "../util/hdwalllet.js"

export default class AbstractRouter extends Router {
    async access(accessId) {
        if (!accessId) throw new Error("ID not provided.")

        const access = await Services.access.getById(accessId)
        if (!access) throw new Error("Access not found.")

        return access
    }

    async company(companyId) {
        if (!companyId) throw new Error("ID not provided.")

        let company = await Services.company.getById(companyId)
        if (!company) throw new Error("Company not found.")

        if (!company.seed) {
            const genesis = hdWallet.generateGenesis()
            company.mnemonic = genesis[0]
            company.seed = genesis[1].toString('hex')

            company = await Services.company.update(company)
        }

        if (company.xoyContract === null) {
            company.xoyContract = ''

            company = await Services.company.update(company)
        }

        if (!company.seed) throw new Error("Company data was not found.")

        return company
    }

    async level(levelId) {
        if (!levelId) throw new Error("ID not provided.")

        const level = await Services.level.getById(levelId)
        if (!level) throw new Error("Level not found.")

        return level
    }

    async limit(limitId) {
        if (!limitId) throw new Error("ID not provided.")

        const limit = await Services.level.getById(limitId)
        if (!limit) throw new Error("Limit not found.")

        return limit
    }

    async user(userId) {
        if (!userId) throw new Error("ID not provided.")

        const user = await Services.user.getById(userId)
        if (!user) throw new Error("User not found.")

        return user
    }

    async walletCompany(walletId) {
        if (!walletId) throw new Error("ID not provided.")

        let wallet = await Services.walletCompany.getById(walletId)
        if (!wallet) throw new Error("Wallet not found.")

        return wallet
    }

    async walletType(currency) {
        if (!currency) throw new Error("Currency not provided.")

        let walletType = await Services.walletType.getByAcronym(currency)
        if (!walletType) throw new Error("Currency not found.")

        return walletType
    }

    async walletUser(walletId) {
        if (!walletId) throw new Error("ID not provided.")

        let wallet = await Services.walletUser.getById(walletId)
        if (!wallet) throw new Error("Wallet not found.")

        return wallet
    }

    async webhook(webhookId) {
        if (!webhookId) throw new Error("ID not provided.")

        const webhook = await Services.webhook.getById(webhookId)
        if (!webhook) throw new Error("Webhook not found.")

        return webhook
    }
}