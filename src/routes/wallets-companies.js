import AbstractRouter from "./abstract-router.js"
import Services from "../services/services.js"
import Passport from "../passport/passport.js"
import {v4 as Uuid} from "uuid"

export default class WalletCompanyRouter extends AbstractRouter {
    init() {
        this.post('/', false, Passport.isTokenValid, this.createWallet)
        this.get('/company/:companyId/currency/:currency', false, Passport.isTokenValid, this.getWalletByCompanyCurrency)
        this.get('/address/:address/currency/:currency', false, Passport.isTokenValid, this.getWalletByAddressCurrency)
        this.get('/company/:companyId', false, Passport.isTokenValid, this.getWalletsByCompany)
    }

    async createWallet(req, res) {
        this.logger.debug("Create wallet.")
        const {companyId, currency} = req.body

        const company = await this.company(companyId)
        const walletType = await this.walletType(currency)

        let wallet = await Services.walletCompany.getByCompanyWalletType(company.id, walletType.id)
        if (wallet) throw new Error("Wallet already exists.")

        let walletData
        if (walletType.acronym === 'XOY') {
            walletData = { publicKey: '', privateKey: '', address: company.xoyContract }
        } else {
            walletData = await Services.blockchain.createWallet(company.seed, 0, walletType.acronym)
            if (!walletData) throw new Error("Error: Cannot generate wallet data.")
        }

        wallet = await Services.walletCompany.create({
            id: Uuid(),
            walletTypeId: walletType.id,
            companyId: company.id,
            publicKey: walletData.publicKey,
            privateKey: walletData.privateKey,
            address: walletData.address,
            balance: 0
        })

        res.sendSuccess({
            id: wallet.id,
            walletTypeId: wallet.walletTypeId,
            companyId: wallet.companyId,
            address: wallet.address,
            balance: wallet.balance
        })
    }

    async getWalletByCompanyCurrency(req, res) {
        this.logger.debug("Get wallet by company and currency.")
        const {companyId, currency} = req.params

        const company = await this.company(companyId)
        let walletType = await this.walletType(currency)

        const wallet = await Services.walletCompany.getByCompanyWalletType(company.id, walletType.id)
        if (!wallet) throw new Error("Wallet not found.")

        return res.sendSuccess({
            id: wallet.id,
            walletTypeId: wallet.walletTypeId,
            companyId: wallet.companyId,
            address: wallet.address,
            balance: wallet.balance
        })
    }

    async getWalletByAddressCurrency(req, res) {
        this.logger.debug("Get wallet by address and currency.")
        const {address, currency} = req.params

        if (!address) throw new Error("Address not provided.")
        let walletType = await this.walletType(currency)

        const wallet = await Services.walletCompany.getByAddressWalletType(address, walletType.id)
        if (!wallet) throw new Error("Wallet not found.")

        return res.sendSuccess({
            id: wallet.id,
            walletTypeId: wallet.walletTypeId,
            companyId: wallet.companyId,
            address: wallet.address,
            balance: wallet.balance
        })
    }

    async getWalletsByCompany(req, res) {
        this.logger.debug("Get wallets by company.")
        const companyId = req.params.companyId

        if (!companyId) throw new Error("Company ID not provided.")

        const walletsTypes = await Services.walletType.getAll()
        const wallets = await Services.walletCompany.getAllByCompany(companyId)
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
                address: wallet.address,
                balance: wallet.balance
            }
        }))

        return res.sendSuccess(result)
    }
}