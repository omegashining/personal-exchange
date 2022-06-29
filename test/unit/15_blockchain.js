import chai from 'chai'

import chaiAsPromised from "chai-as-promised"
import BlockchainService from "../../src/services/blockchain.js"
import Data from "../data/blockchain.json"

const expect = chai.expect
chai.use(chaiAsPromised)
chai.should()

describe('Blockchain', () => {
    const service = new BlockchainService()

    it('Should create a Bitcoin wallet', async () => {
        const res = await service.createWallet(Data[0].seed, Data[0].indexId, 'BTC')

        expect(res.address).to.not.equals(null)
    })

    it('Should create an Ethereum wallet', async () => {
        const res = await service.createWallet(Data[0].seed, Data[0].indexId, 'ETH')

        expect(res.address).to.not.equals(null)
    })

    it('Should create a Tether wallet', async () => {
        const res = await service.createWallet(Data[0].seed, Data[0].indexId, 'USDT')

        expect(res.address).to.not.equals(null)
    })

    it('Should not create an unknown wallet', async () => {
        try {
            const res = await service.createWallet(Data[0].seed, Data[0].indexId, 'UNKNOWN')

            expect(res).to.equals(null)
        } catch (err) {
            expect(err.name).to.equals('Error')
        }
    })

    it('Should return balance of Bitcoin wallet', async () => {
        const res = await service.getBalance(Data[1].address, Data[1].walletType)

        expect(res).to.be.greaterThanOrEqual(0)
    })

    it('Should return balance of Ethereum wallet', async () => {
        const res = await service.getBalance(Data[2].address, Data[2].walletType)

        expect(res).to.be.greaterThanOrEqual(0)
    })

    it('Should return a transaction of Bitcoin wallet', async () => {
        const res = await service.getTransactionInfo(Data[1].transaction, Data[1].walletType)

        expect(res).to.not.equals(null)
    })

    it('Should return a transaction of Ethereum wallet', async () => {
        const res = await service.getTransactionInfo(Data[2].transaction, Data[2].walletType)

        expect(res).to.not.equals(null)
    })

    it('Should return transactions of Bitcoin wallet', async () => {
        const res = await service.getTransactionsOf(Data[1].address, Data[1].walletType)

        expect(res.length).to.be.greaterThanOrEqual(0)
    })

    it('Should return transactions of Ethereum wallet', async () => {
        const res = await service.getTransactionsOf(Data[2].address, Data[2].walletType)

        expect(res.length).to.be.greaterThanOrEqual(0)
    })

    it('Should not return balance of invalid Bitcoin wallet', async () => {
        try {
            const res = await service.getBalance('B4dB1tc01nAddr3ss', 'BTC')

            expect(res).to.equals(null)
        } catch (err) {
            expect(err.name).to.equals('AssertionError')
        }
    })

    it('Should not return balance of invalid Ethereum wallet', async () => {
        try {
            const res = await service.getBalance('B4dEth3r3umAddr3ss', 'ETH')

            expect(res).to.equals(null)
        } catch (err) {
            expect(err.name).to.equals('AssertionError')
        }
    })
})