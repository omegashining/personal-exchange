import AbstractRouter from "./abstract-router.js"
import Services from "../services/services.js"
import Passport from "../passport/passport.js"
import {v4 as Uuid} from "uuid";

export default class DepositCompanyRouter extends AbstractRouter {
    init() {
        this.post('/validate/xoy', false, Passport.isTokenValid, this.validateXoy)
        this.get('/hash/:hash', false, Passport.isTokenValid, this.getDepositByHash)
        this.get('/wallet/:walletId', false, Passport.isTokenValid, this.getDepositsByWallet)
    }

    async validateXoy(req, res) {
        this.logger.debug("Validate XOY deposit.")
        const {companyId, hash, amount, signature} = req.body

        let deposit = await Services.depositCompany.getByHash(hash)
        if (deposit) throw new Error("Deposit already exists.")

        const ethWalletType = await this.walletType('ETH')
        const xoycWalletType = await this.walletType('XOY')

        const address = await Services.blockchain.verifyMessage(amount, signature, xoycWalletType.acronym)
        if (!address) throw new Error("Could not verify message.")

        const ethWallet = await Services.walletCompany.getByCompanyWalletType(companyId, ethWalletType.id)
        if (!ethWallet) throw new Error("ETH wallet not found.")

        const xoycWallet = await Services.walletCompany.getByCompanyWalletType(companyId, xoycWalletType.id)
        if (!xoycWallet) throw new Error("XOY wallet not found.")

        const event = await Services.blockchain.getEvent(ethWallet, xoycWallet.address, address, hash, xoycWalletType.acronym)
        if (!event) throw new Error("Deposit event was not found.")

        deposit = {
            id: Uuid(),
            walletId: xoycWallet.id,
            hash,
            sender: address,
            amount,
            fee: 0,
            confirmations: 0,
            status: 'PENDING',
            timestamp: new Date()
        }

        await Services.depositCompany.create(deposit)

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

        const deposit = await Services.depositCompany.getByHash(hash)
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

        const wallet = await this.walletCompany(walletId)

        const deposits = await Services.depositCompany.getAllByWallet(wallet.id)
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