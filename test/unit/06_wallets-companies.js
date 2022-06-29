import chai from 'chai'

import chaiAsPromised from "chai-as-promised"
import Services from "../../src/services/services.js"
import Data from "../data/wallets-companies.json"

const expect = chai.expect
chai.use(chaiAsPromised)
chai.should()

describe('Wallets companies', () => {
    const service = Services.walletCompany

    it('Should create a wallet', async () => {
        const {id, walletTypeId, companyId, privateKey, publicKey, address, balance} = Data[0]

        const res = await service.create({
            id,
            walletTypeId,
            companyId,
            privateKey,
            publicKey,
            address,
            balance
        })

        expect(!!res).to.equals(true)
    })

    it('Should not create a wallet by missing id', async () => {
        const {walletTypeId, companyId, privateKey, publicKey, address, balance} = Data[1]

        try {
            const res = await service.create({
                walletTypeId,
                companyId,
                privateKey,
                publicKey,
                address,
                balance
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a wallet for missing wallet type', async () => {
        const {id, companyId, privateKey, publicKey, address, balance} = Data[1]

        try {
            const res = await service.create({
                id,
                companyId,
                privateKey,
                publicKey,
                address,
                balance
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a wallet for missing company', async () => {
        const {id, walletTypeId, privateKey, publicKey, address, balance} = Data[1]

        try {
            const res = await service.create({
                id,
                walletTypeId,
                privateKey,
                publicKey,
                address,
                balance
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a wallet for missing private key', async () => {
        const {id, walletTypeId, companyId, publicKey, address, balance} = Data[1]

        try {
            const res = await service.create({
                id,
                walletTypeId,
                companyId,
                publicKey,
                address,
                balance
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a wallet for missing public key', async () => {
        const {id, walletTypeId, companyId, privateKey, address, balance} = Data[1]

        try {
            const res = await service.create({
                id,
                walletTypeId,
                companyId,
                privateKey,
                address,
                balance
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a wallet for missing address', async () => {
        const {id, walletTypeId, companyId, privateKey, publicKey, balance} = Data[1]

        try {
            const res = await service.create({
                id,
                walletTypeId,
                companyId,
                privateKey,
                publicKey,
                balance
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a wallet for missing balance', async () => {
        const {id, walletTypeId, companyId, privateKey, publicKey, address} = Data[1]

        try {
            const res = await service.create({
                id,
                walletTypeId,
                companyId,
                privateKey,
                publicKey,
                address
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should return a wallet by id', async () => {
        const {id} = Data[0]

        const res = await service.getById(id)

        expect(res).to.not.equals(null)
    })

    it('Should not return a wallet by empty id', async () => {
        const res = await service.getById('')

        expect(res).to.equals(null)
    })

    it('Should return a wallet by company and wallet type', async () => {
        const {walletTypeId, companyId} = Data[0]

        const res = await service.getByCompanyWalletType(companyId, walletTypeId)

        expect(res).to.not.equals(null)
    })

    it('Should not return a wallet by empty company and wallet type', async () => {
        const {walletTypeId} = Data[0]

        const res = await service.getByCompanyWalletType('', walletTypeId)

        expect(res).to.equals(null)
    })

    it('Should not return a wallet by company and empty wallet type', async () => {
        const {companyId} = Data[0]

        const res = await service.getByCompanyWalletType(companyId, '')

        expect(res).to.equals(null)
    })

    it('Should return a wallet by address and wallet type', async () => {
        const {walletTypeId, address} = Data[0]

        const res = await service.getByAddressWalletType(address, walletTypeId)

        expect(res).to.not.equals(null)
    })

    it('Should not return a wallet by empty address and wallet type', async () => {
        const {walletTypeId} = Data[0]

        const res = await service.getByAddressWalletType('', walletTypeId)

        expect(res).to.equals(null)
    })

    it('Should not return a wallet by address and empty wallet type', async () => {
        const {address} = Data[0]

        const res = await service.getByAddressWalletType(address, '')

        expect(res).to.equals(null)
    })

    it('Should return all wallets', async () => {
        const res = await service.getAll()

        expect(res.length).to.not.equals(0)
    })

    it('Should return all wallets by wallet type', async () => {
        const {walletTypeId} = Data[0]

        const res = await service.getAllByWalletType(walletTypeId)

        expect(res.length).to.not.equals(0)
    })

    it('Should not return wallets by empty wallet type', async () => {
        const res = await service.getAllByWalletType('')

        expect(res.length).to.equals(0)
    })

    it('Should return all wallets by company', async () => {
        const {companyId} = Data[0]

        const res = await service.getAllByCompany(companyId)

        expect(res.length).to.not.equals(0)
    })

    it('Should not return wallets by empty company', async () => {
        const res = await service.getAllByCompany('')

        expect(res.length).to.equals(0)
    })
})