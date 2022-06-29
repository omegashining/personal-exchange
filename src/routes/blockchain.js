import AbstractRouter from "./abstract-router.js"
import Services from "../services/services.js"
import Passport from "../passport/passport.js"
import {v4 as Uuid} from "uuid";

export default class BlockchainRouter extends AbstractRouter {
    init() {
        this.post('/wallet', false, Passport.isTokenValid, this.createWallet)
        this.post('/send', false, Passport.isTokenValid, this.sendTransactionUser)
        this.post('/send/company', false, Passport.isTokenValid, this.sendTransactionCompany)
        this.get('/balance/address/:address/currency/:currency', false, Passport.isTokenValid, this.getBalance)
        this.get('/transaction/:txId/currency/:currency', false, Passport.isTokenValid, this.getTransaction)
        this.get('/transactions/txs/:txsId/currency/:currency', false, Passport.isTokenValid, this.getTransactions)
        // this.get('/rawTransaction/:txId/hash/:hash/currency/:currency', false, Passport.isTokenValid, this.getRawTransaction)
        this.get('/transactions/address/:address/currency/:currency', false, Passport.isTokenValid, this.getTransactionsByAddress)
        this.get('/block/height/:height/currency/:currency', false, Passport.isTokenValid, this.getBlockByHeight)
        // this.get('/listUnspent/address/:address/currency/:currency', false, Passport.isTokenValid, this.listUnspent)
        // this.get('/importAddress/address/:address/currency/:currency', false, Passport.isTokenValid, this.importAddress)
    }

    async createWallet(req, res) {
        this.logger.debug("Create wallet.")
        const {seed, indexId, currency} = req.body

        if (!seed) throw new Error("Seed not provided.")
        if (!indexId) throw new Error("Index not provided.")

        const walletType = await this.walletType(currency)

        const walletData = await Services.blockchain.createWallet(seed, indexId, walletType.acronym)
        if (!walletData) throw new Error("Error: Cannot generate wallet data.")

        return res.sendSuccess({
            publicKey: walletData.publicKey,
            privateKey: walletData.privateKey,
            address: walletData.address,
        })
    }

    async sendTransactionUser(req, res) {
        this.logger.debug("Send transaction.")
        const {to, amount, currency} = req.body

        if (!to) throw new Error("Receiver address not provided.")
        if (!amount) throw new Error("Amount not provided.")

        const walletType = await this.walletType(currency)

        let wallet
        let receipt
        if (walletType.acronym === 'XOY') {
            const user = await this.user(req.body.userId)
            const ethWalletType = await this.walletType('ETH')

            wallet = await Services.walletUser.getByUserWalletType(user.userId, walletType.id)
            if (!wallet) throw new Error("User wallet not found.")
            if (wallet.balance < amount) throw new Error("Insufficient funds.")

            const ethCompanyWallet = await Services.walletCompany.getByCompanyWalletType(user.companyId, ethWalletType.id)
            if (!ethCompanyWallet) throw new Error("ETH wallet not found.")

            receipt = await Services.blockchain.sendContractTransaction(ethCompanyWallet, wallet.address, to, amount, walletType.acronym, user.userId)
        } else {
            if (!req.body.from) throw new Error("Sender address not provided.")

            wallet = await Services.walletUser.getByAddressWalletType(req.body.from, walletType.id)
            if (!wallet) throw new Error("User wallet not found.")
            if (wallet.balance < amount) throw new Error("Insufficient funds.")

            receipt = await Services.blockchain.sendTransaction(wallet, to, amount, walletType.acronym)
        }

        const withdrawal = {
            id: Uuid(),
            walletId: wallet.id,
            hash: receipt.hash,
            receiver: to,
            amount: amount,
            fee: receipt.fee,
            confirmations: 0,
            status: 'PENDING',
            timestamp: new Date()
        }

        await Services.withdrawalUser.create(withdrawal)

        const newBalance = parseFloat(wallet.balance) - parseFloat(amount)
        await Services.walletUser.updateBalance(wallet.userId, wallet.walletTypeId, newBalance)

        if (receipt.ethHash) {
            const ethWalletType = await this.walletType('ETH')
            const ethWallet = await Services.walletUser.getByUserWalletType(wallet.userId, ethWalletType.id)

            const withdrawal = {
                id: Uuid(),
                walletId: ethWallet.id,
                hash: receipt.ethHash,
                receiver: receipt.ethTo,
                amount: receipt.ethAmount,
                fee: receipt.fee,
                confirmations: 0,
                status: 'PENDING',
                timestamp: new Date()
            }

            await Services.withdrawalUser.create(withdrawal)

            const newBalance = parseFloat(ethWallet.balance) - receipt.ethAmount - (receipt.fee * 2)
            await Services.walletUser.updateBalance(ethWallet.userId, ethWallet.walletTypeId, newBalance)
        }

        return res.sendSuccess({
            hash: receipt.hash,
            fee: receipt.fee
        })
    }

    async sendTransactionCompany(req, res) {
        this.logger.debug("Send transaction company.")
        const {to, amount, currency} = req.body

        if (!to) throw new Error("Receiver address not provided.")
        if (!amount) throw new Error("Amount not provided.")

        const walletType = await this.walletType(currency)

        let wallet
        let receipt
        if (walletType.acronym === 'XOY') {
            if (!req.body.companyId) throw new Error("ID not provided.")
            const ethWalletType = await this.walletType('ETH')

            wallet = await Services.walletCompany.getByCompanyWalletType(req.body.companyId, walletType.id)
            if (!wallet) throw new Error("Company wallet not found.")
            if (wallet.balance < amount) throw new Error("Insufficient funds.")

            const ethCompanyWallet = await Services.walletCompany.getByCompanyWalletType(req.body.companyId, ethWalletType.id)
            if (!ethCompanyWallet) throw new Error("ETH wallet not found.")

            receipt = await Services.blockchain.sendContractTransaction(ethCompanyWallet, wallet.address, to, amount, walletType.acronym, req.body.companyId)
        } else {
            if (!req.body.from) throw new Error("Sender address not provided.")

            wallet = await Services.walletCompany.getByAddressWalletType(req.body.from, walletType.id)
            if (!wallet) throw new Error("Company wallet not found.")
            if (wallet.balance < amount) throw new Error("Insufficient funds.")

            receipt = await Services.blockchain.sendTransaction(wallet, to, amount, walletType.acronym)
        }

        const withdrawal = {
            id: Uuid(),
            walletId: wallet.id,
            hash: receipt.hash,
            receiver: to,
            amount: amount,
            fee: receipt.fee,
            confirmations: 0,
            status: 'PENDING',
            timestamp: new Date()
        }

        await Services.withdrawalCompany.create(withdrawal)

        const newBalance = parseFloat(wallet.balance) - parseFloat(amount)
        await Services.walletCompany.updateBalance(wallet.companyId, wallet.walletTypeId, newBalance)

        if (receipt.ethHash) {
            const ethWalletType = await this.walletType('ETH')
            const ethWallet = await Services.walletCompany.getByCompanyWalletType(wallet.companyId, ethWalletType.id)

            const withdrawal = {
                id: Uuid(),
                walletId: ethWallet.id,
                hash: receipt.ethHash,
                receiver: receipt.ethTo,
                amount: receipt.ethAmount,
                fee: receipt.fee,
                confirmations: 0,
                status: 'PENDING',
                timestamp: new Date()
            }

            await Services.withdrawalCompany.create(withdrawal)

            const newBalance = parseFloat(ethWallet.balance) - receipt.ethAmount - (receipt.fee * 2)
            await Services.walletCompany.updateBalance(ethWallet.companyId, ethWallet.walletTypeId, newBalance)
        }

        return res.sendSuccess({
            hash: receipt.hash,
            fee: receipt.fee
        })
    }

    async getBalance(req, res) {
        this.logger.debug("Get balance by address and currency.")
        const {address, currency} = req.params

        const walletType = await this.walletType(currency)
        const balance = await Services.blockchain.getBalance(address, walletType.acronym)

        return res.sendSuccess({balance})
    }

    async getTransaction(req, res) {
        this.logger.debug("Get transaction by txId and currency.")
        const {txId, currency} = req.params

        const walletType = await this.walletType(currency)
        const transactionInfo = await Services.blockchain.getTransactionInfo(txId, walletType.acronym)

        return res.sendSuccess(transactionInfo)
    }

    async getTransactions(req, res) {
        this.logger.debug("Get transactions by txsId and currency.")
        const {txsId, currency} = req.params

        const walletType = await this.walletType(currency)
        const transactionsInfo = await Services.blockchain.getTransactionsInfo(txsId, walletType.acronym)

        return res.sendSuccess(transactionsInfo)
    }

    async getRawTransaction(req, res) {
        this.logger.debug("Get raw transaction by txId, hash and currency.")
        const {txId, hash, currency} = req.params

        const walletType = await this.walletType(currency)
        const rawTransactionInfo = await Services.blockchain.getRawTransactionInfo(txId, hash, walletType.acronym)

        return res.sendSuccess(rawTransactionInfo)
    }

    async getTransactionsByAddress(req, res) {
        this.logger.debug("Get transactions by address and currency.")
        const {address, currency} = req.params

        const walletType = await this.walletType(currency)
        const transactions = await Services.blockchain.getTransactionsOf(address, walletType.acronym)

        return res.sendSuccess(transactions)
    }

    async getBlockByHeight(req, res) {
        this.logger.debug("Get block hash by height and currency.")
        const {height, currency} = req.params

        const walletType = await this.walletType(currency)
        const hash = await Services.blockchain.getBlockByHeight(height, walletType.acronym)

        return res.sendSuccess(hash)
    }

    async listUnspent(req, res) {
        this.logger.debug("Get unspent transactions by address and currency.")
        const {address, currency} = req.params

        const walletType = await this.walletType(currency)
        const listUnspent = await Services.blockchain.listUnspent(address, walletType.acronym)

        return res.sendSuccess(listUnspent)
    }

    async importAddress(req, res) {
        this.logger.debug("Import address by address and currency.")
        const {address, currency} = req.params

        const walletType = await this.walletType(currency)
        const importAddress = await Services.blockchain.importAddress(address, walletType.acronym)

        return res.sendSuccess(importAddress)
    }
}