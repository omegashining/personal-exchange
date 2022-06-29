import chai from 'chai'

import chaiAsPromised from "chai-as-promised"
import Services from "../../src/services/services.js"
import Data from "../data/wallets-users.json"

const expect = chai.expect
chai.use(chaiAsPromised)
chai.should()

describe('Wallets users', () => {
    const service = Services.walletUser

    it('Should create a wallet', async () => {
        const {id, walletTypeId, companyId, userId, privateKey, publicKey, address, balance} = Data[0]

        const res = await service.create({
            id,
            walletTypeId,
            companyId,
            userId,
            privateKey,
            publicKey,
            address,
            balance
        })

        expect(!!res).to.equals(true)
    })

    it('Should not create a wallet by missing id', async () => {
        const {walletTypeId, companyId, userId, privateKey, publicKey, address, balance} = Data[1]

        try {
            const res = await service.create({
                walletTypeId,
                companyId,
                userId,
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
        const {id, companyId, userId, privateKey, publicKey, address, balance} = Data[1]

        try {
            const res = await service.create({
                id,
                companyId,
                userId,
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
        const {id, walletTypeId, userId, privateKey, publicKey, address, balance} = Data[1]

        try {
            const res = await service.create({
                id,
                walletTypeId,
                userId,
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

    it('Should not create a wallet for missing user', async () => {
        const {id, walletTypeId, companyId, privateKey, publicKey, address, balance} = Data[1]

        try {
            const res = await service.create({
                id,
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

    it('Should not create a wallet for missing private key', async () => {
        const {id, walletTypeId, companyId, userId, publicKey, address, balance} = Data[1]

        try {
            const res = await service.create({
                id,
                walletTypeId,
                companyId,
                userId,
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
        const {id, walletTypeId, companyId, userId, privateKey, address, balance} = Data[1]

        try {
            const res = await service.create({
                id,
                walletTypeId,
                companyId,
                userId,
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
        const {id, walletTypeId, companyId, userId, privateKey, publicKey, balance} = Data[1]

        try {
            const res = await service.create({
                id,
                walletTypeId,
                companyId,
                userId,
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
        const {id, walletTypeId, companyId, userId, privateKey, publicKey, address} = Data[1]

        try {
            const res = await service.create({
                id,
                walletTypeId,
                companyId,
                userId,
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

    it('Should return a wallet by user and wallet type', async () => {
        const {walletTypeId, userId} = Data[0]

        const res = await service.getByUserWalletType(userId, walletTypeId)

        expect(res).to.not.equals(null)
    })

    it('Should not return a wallet by empty user and wallet type', async () => {
        const {walletTypeId} = Data[0]

        const res = await service.getByUserWalletType('', walletTypeId)

        expect(res).to.equals(null)
    })

    it('Should not return a wallet by user and empty wallet type', async () => {
        const {userId} = Data[0]

        const res = await service.getByUserWalletType(userId, '')

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

    it('Should return all wallets by user', async () => {
        const {userId} = Data[0]

        const res = await service.getAllByUser(userId)

        expect(res.length).to.not.equals(0)
    })

    it('Should not return wallets by empty user', async () => {
        const res = await service.getAllByUser('')

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

    it('Should return all wallets by wallet type', async () => {
        const {walletTypeId} = Data[0]

        const res = await service.getAllByWalletType(walletTypeId)

        expect(res.length).to.not.equals(0)
    })

    it('Should not return wallets by empty wallet type', async () => {
        const res = await service.getAllByWalletType('')

        expect(res.length).to.equals(0)
    })

    it('Should return all wallets by company and wallet type', async () => {
        const {companyId, walletTypeId} = Data[0]

        const res = await service.getAllByCompanyWalletType(companyId, walletTypeId)

        expect(res.length).to.not.equals(0)
    })

    it('Should not return wallets by empty company and wallet type', async () => {
        const {walletTypeId} = Data[0]

        const res = await service.getAllByCompanyWalletType('', walletTypeId)

        expect(res.length).to.equals(0)
    })

    it('Should not return wallets by company and empty wallet type', async () => {
        const {companyId} = Data[0]

        const res = await service.getAllByCompanyWalletType(companyId, '')

        expect(res.length).to.equals(0)
    })
})