import AbstractRouter from "./abstract-router.js"
import Services from "../services/services.js"
import Passport from "../passport/passport.js"
import {v4 as Uuid} from "uuid"
import BigDecimal from "js-big-decimal"

export default class WalletUserRouter extends AbstractRouter {
    init() {
        this.post('/', false, Passport.isTokenValid, this.createWallet)
        this.get('/user/:userId', false, Passport.isTokenValid, this.getWalletsByUser)
        this.get('/company/:companyId', false, Passport.isTokenValid, this.getWalletsByCompany)
        this.get('/company/:companyId/currency/:currency', false, Passport.isTokenValid, this.getWalletsByCompanyCurrency)
        this.get('/user/:userId/currency/:currency', false, Passport.isTokenValid, this.getWalletByUserCurrency)
        this.get('/address/:address/currency/:currency', false, Passport.isTokenValid, this.getWalletByAddressCurrency)
        this.get('/balance/company/:companyId', false, Passport.isTokenValid, this.getBalances)
        this.get('/balance/company/:companyId/currency/:currency', false, Passport.isTokenValid, this.getBalance)
    }

    async createWallet(req, res) {
        this.logger.debug("Create wallet.")
        const {userId, currency} = req.body

        const user = await this.user(userId)
        const company = await this.company(user.companyId)
        const walletType = await this.walletType(currency)

        let wallet = await Services.walletUser.getByUserWalletType(user.userId, walletType.id)
        if (wallet) throw new Error("Wallet already exists.")

        let walletData
        if (walletType.acronym === 'XOY') {
            walletData = { publicKey: '', privateKey: '', address: company.xoyContract }
        } else {
            walletData = await Services.blockchain.createWallet(company.seed, user.id, walletType.acronym)
            if (!walletData) throw new Error("Error: Cannot generate wallet data.")
        }

        wallet = await Services.walletUser.create({
            id: Uuid(),
            walletTypeId: walletType.id,
            companyId: company.id,
            userId: user.userId,
            publicKey: walletData.publicKey,
            privateKey: walletData.privateKey,
            address: walletData.address,
            balance: 0
        })

        res.sendSuccess({
            id: wallet.id,
            walletTypeId: wallet.walletTypeId,
            companyId:wallet.companyId,
            userId: wallet.userId,
            address: wallet.address,
            balance: wallet.balance
        })
    }

    async getWalletByUserCurrency(req, res) {
        this.logger.debug("Get wallet by user and currency.")
        const {userId, currency} = req.params

        const user = await this.user(userId)
        const walletType = await this.walletType(currency)

        const wallet = await Services.walletUser.getByUserWalletType(user.userId, walletType.id)
        if (!wallet) throw new Error("Wallet not found.")

        return res.sendSuccess({
            id: wallet.id,
            walletTypeId: wallet.walletTypeId,
            companyId:wallet.companyId,
            userId: wallet.userId,
            address: wallet.address,
            balance: wallet.balance
        })
    }

    async getWalletByAddressCurrency(req, res) {
        this.logger.debug("Get wallet by address and currency.")
        const {address, currency} = req.params

        if (!address) throw new Error("Address not provided.")
        const walletType = await this.walletType(currency)

        const wallet = await Services.walletUser.getByAddressWalletType(address, walletType.id)
        if (!wallet) throw new Error("Wallet not found.")

        return res.sendSuccess({
            id: wallet.id,
            walletTypeId: wallet.walletTypeId,
            companyId:wallet.companyId,
            userId: wallet.userId,
            address: wallet.address,
            balance: wallet.balance
        })
    }

    async getWalletsByUser(req, res) {
        this.logger.debug("Get wallets by user.")
        const userId = req.params.userId

        if (!userId) throw new Error("User ID not provided.")

        const walletsTypes = await Services.walletType.getAll()
        const wallets = await Services.walletUser.getAllByUser(userId)
        if (!wallets) throw new Error("Error: Cannot get wallets.")

        const result = await Promise.all(wallets.map(async wallet => {
            const walletType = await walletsTypes.find(({id}) => id === wallet.walletTypeId)

            return {
                id: wallet.id,
                walletType: {
                    id: walletType.id,
                    acronym: walletType.acronym
                },
                companyId: wallet.companyId,
                userId: wallet.userId,
                address: wallet.address,
                balance: wallet.balance
            }
        }))

        return res.sendSuccess(result)
    }

    async getWalletsByCompany(req, res) {
        this.logger.debug("Get wallets by company.")
        const companyId = req.params.companyId

        if (!companyId) throw new Error("Company ID not provided.")

        const walletsTypes = await Services.walletType.getAll()
        const wallets = await Services.walletUser.getAllByCompany(companyId)
        if (!wallets) throw new Error("Error: Cannot get wallets.")

        const result = await Promise.all(wallets.map(async wallet => {
            const walletType = await walletsTypes.find(({id}) => id === wallet.walletTypeId)

            return {
                id: wallet.id,
                walletType: {
                    id: walletType.id,
                    acronym: walletType.acronym
                },
                companyId: wallet.companyId,
                userId: wallet.userId,
                address: wallet.address,
                balance: wallet.balance
            }
        }))

        return res.sendSuccess(result)
    }

    async getWalletsByCompanyCurrency(req, res) {
        this.logger.debug("Get wallets by company and currency.")
        const {companyId, currency} = req.params

        if (!companyId) throw new Error("Company ID not provided.")
        const walletType = await this.walletType(currency)

        const walletsTypes = await Services.walletType.getAll()
        const wallets = await Services.walletUser.getAllByCompanyWalletType(companyId, walletType.id)
        if (!wallets) throw new Error("Error: Cannot get wallets.")

        const result = await Promise.all(wallets.map(async wallet => {
            const walletType = await walletsTypes.find(({id}) => id === wallet.walletTypeId)

            return {
                id: wallet.id,
                walletType: {
                    id: walletType.id,
                    acronym: walletType.acronym
                },
                companyId: wallet.companyId,
                userId: wallet.userId,
                address: wallet.address,
                balance: wallet.balance
            }
        }))

        return res.sendSuccess(result)
    }

    async getBalances(req, res) {
        this.logger.debug("Get balances by company.")
        const companyId = req.params.companyId

        if (!companyId) throw new Error("Company ID not provided.")

        const walletsTypes = await Services.walletType.getAll()
        if (!walletsTypes) throw new Error("Error: Cannot get currencies.")

        let balances = {}
        let walletType

        const wallets = await Services.walletUser.getAllByCompany(companyId)
        if (!wallets) throw new Error("Error: Cannot get wallets.")

        wallets.forEach((wallet) => {
            walletType = walletsTypes.find(({id}) => id === wallet.walletTypeId)

            if (balances[walletType.acronym]) {
                balances[walletType.acronym] = balances[walletType.acronym].add(new BigDecimal(wallet.balance))
            } else {
                balances[walletType.acronym] = new BigDecimal(wallet.balance)
            }
        })

        walletsTypes.forEach((walletType) => {
            if (balances[walletType.acronym]) {
                balances[walletType.acronym] = balances[walletType.acronym].getValue()
            }
        })

        return res.sendSuccess(balances)
    }

    async getBalance(req, res) {
        this.logger.debug("Get balance by company and currency.")
        const {companyId, currency} = req.params

        if (!companyId) throw new Error("Company ID not found.")

        const walletType = await this.walletType(currency)

        const wallets = await Services.walletUser.getAllByCompanyWalletType(companyId, walletType.id)
        if (!wallets) throw new Error("Error: Cannot get wallets.")

        let balance = new BigDecimal(0)
        wallets.forEach((wallet) => {
            balance = balance.add(new BigDecimal(wallet.balance))
        })

        return res.sendSuccess({balance: balance.getValue()})
    }
}