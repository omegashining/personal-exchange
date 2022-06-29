import AbstractRouter from "./abstract-router.js"
import Services from "../services/services.js"
import Passport from "../passport/passport.js"
import {v4 as Uuid} from 'uuid'
import * as hdWallet from "../util/hdwalllet.js"

export default class CompanyRouter extends AbstractRouter {
    init() {
        this.post('/', false, Passport.isTokenValid, this.createCompany)
        this.post('/contract', false, Passport.isTokenValid, this.createContract)
        this.put('/', false, Passport.isTokenValid, this.updateCompany)
        this.get('/:id', false, Passport.isTokenValid, this.getCompanyById)
        this.put('/activate', false, Passport.isTokenValid, this.activateCompany)
        this.put('/inactivate', false, Passport.isTokenValid, this.inactivateCompany)
        this.put('/lock', false, Passport.isTokenValid, this.lockCompany)
    }

    async createCompany(req, res) {
        this.logger.debug("Create company.")
        const {name, planType} = req.body

        if (!name) throw new Error("Name not provided.")

        const genesis = hdWallet.generateGenesis()

        const company = await Services.company.create({
            id: Uuid(),
            accessId: req.user.id,
            name,
            mnemonic: genesis[0],
            seed: genesis[1].toString('hex'),
            xoyContract: '',
            status: 'INACTIVE'
        })

        await Services.level.create({
            companyId: company.id,
            order: 1,
            description: 'LEVEL_1'
        })

        let walletData
        const walletsTypes = await Services.walletType.getAll()

        for (const walletType of walletsTypes) {
            if (walletType.acronym === 'XOY') {
                walletData = { publicKey: '', privateKey: '', address: '' }
            } else {
                walletData = await Services.blockchain.createWallet(company.seed, 0, walletType.acronym)
            }

            await Services.walletCompany.create({
                id: Uuid(),
                walletTypeId: walletType.id,
                companyId: company.id,
                publicKey: walletData.publicKey,
                privateKey: walletData.privateKey,
                address: walletData.address,
                balance: 0
            })
        }

        res.sendSuccess({
            id: company.id,
            name: company.name,
            status: company.status
        })
    }

    async createContract(req, res) {
        this.logger.debug("Create contract.")
        const {id} = req.body

        let company = await this.company(id)
        if (company.xoyContract) throw new Error("Contract already exists.")
        const ethWalletType = await this.walletType('ETH')
        const xoycWalletType = await this.walletType('XOY')

        let wallet = await Services.walletCompany.getByCompanyWalletType(id, ethWalletType.id)
        if (wallet.balance <= 0) throw new Error("Insufficient funds (ETH).")

        const receipt = await Services.blockchain.createContract(wallet, xoycWalletType.acronym)
        if (!receipt) throw new Error("Error: Cannot generate contract.")

        company = await Services.company.updateContract(id, receipt.address)
        await Services.walletCompany.updateContract(company.id, xoycWalletType.id, receipt.address)
        await Services.walletUser.updateContract(company.id, xoycWalletType.id, receipt.address)

        if (receipt.hash) {
            const withdrawal = {
                id: Uuid(),
                walletId: wallet.id,
                hash: receipt.hash,
                receiver: receipt.address,
                amount: 0,
                fee: receipt.fee,
                confirmations: 0,
                status: 'PENDING',
                timestamp: new Date()
            }

            await Services.withdrawalCompany.create(withdrawal)

            const newBalance = parseFloat(wallet.balance) - receipt.fee
            await Services.walletCompany.updateBalance(wallet.companyId, wallet.walletTypeId, newBalance)
        }

        res.sendSuccess({
            result: !!company.id
        })
    }

    async updateCompany(req, res) {
        this.logger.debug("Update company.")
        const {id, name, planType} = req.body

        await this.company(id)
        if (!name) throw new Error("Name not provided.")

        const company = await Services.company.update({id, name})

        res.sendSuccess({
            id: company.id,
            name: company.name,
            status: company.status
        })
    }

    async getCompanyById(req, res) {
        this.logger.debug("Get company by id.")

        const company = await this.company(req.params.id)

        res.sendSuccess({
            id: company.id,
            name: company.name,
            status: company.status
        })
    }

    async activateCompany(req, res) {
        this.logger.debug("Activate company.")

        const company = await this.company(req.body.id)
        const result = await Services.company.activate(company.id)

        res.sendSuccess({
            result
        })
    }

    async inactivateCompany(req, res) {
        this.logger.debug("Inactivate company.")

        const company = await this.company(req.body.id)
        const result = await Services.company.inactivate(company.id)

        res.sendSuccess({
            result
        })
    }

    async lockCompany(req, res) {
        this.logger.debug("Lock company.")

        const company = await this.company(req.body.id)
        const result = await Services.company.lock(company.id)

        res.sendSuccess({
            result
        })
    }
}