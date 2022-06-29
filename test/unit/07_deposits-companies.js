import chai from 'chai'
import chaiAsPromised from "chai-as-promised"
import Services from "../../src/services/services.js"
import Data from "../data/deposits-companies.json"

const expect = chai.expect
chai.use(chaiAsPromised)
chai.should()

describe('Deposits companies', () => {
    const service = Services.depositCompany

    it('Should create a deposit', async () => {
        const {id, walletId, hash, sender, amount, fee, confirmations, status, timestamp} = Data[0]

        const res = await service.create({
            id,
            walletId,
            hash,
            sender,
            amount,
            fee,
            confirmations,
            status,
            timestamp
        })

        expect(!!res).to.equals(true)
    })

    it('Should create a deposit for missing timestamp', async () => {
        const {id, walletId, hash, sender, amount, fee, confirmations, status} = Data[1]

        const res = await service.create({
            id,
            walletId,
            hash,
            sender,
            amount,
            fee,
            confirmations,
            status
        })

        expect(!!res).to.equals(true)
    })

    it('Should not create a deposit for missing id', async () => {
        const {walletId, hash, sender, amount, fee, confirmations, status, timestamp} = Data[2]

        try {
            const res = await service.create({
                walletId,
                hash,
                sender,
                amount,
                fee,
                confirmations,
                status,
                timestamp
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a deposit for missing walletId', async () => {
        const {id, hash, sender, amount, fee, confirmations, status, timestamp} = Data[2]

        try {
            const res = await service.create({
                id,
                hash,
                sender,
                amount,
                fee,
                confirmations,
                status,
                timestamp
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a deposit for missing hash', async () => {
        const {id, walletId, sender, amount, fee, confirmations, status, timestamp} = Data[2]

        try {
            const res = await service.create({
                id,
                walletId,
                sender,
                amount,
                fee,
                confirmations,
                status,
                timestamp
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a deposit for missing sender', async () => {
        const {id, walletId, hash, amount, fee, confirmations, status, timestamp} = Data[2]

        try {
            const res = await service.create({
                id,
                walletId,
                hash,
                amount,
                fee,
                confirmations,
                status,
                timestamp
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a deposit for missing amount', async () => {
        const {id, walletId, hash, sender, fee, confirmations, status, timestamp} = Data[2]

        try {
            const res = await service.create({
                id,
                walletId,
                hash,
                sender,
                fee,
                confirmations,
                status,
                timestamp
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a deposit for missing fee', async () => {
        const {id, walletId, hash, sender, amount, confirmations, status, timestamp} = Data[2]

        try {
            const res = await service.create({
                id,
                walletId,
                hash,
                sender,
                amount,
                confirmations,
                status,
                timestamp
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a deposit for missing confirmations', async () => {
        const {id, walletId, hash, sender, amount, fee, status, timestamp} = Data[2]

        try {
            const res = await service.create({
                id,
                walletId,
                hash,
                sender,
                amount,
                fee,
                status,
                timestamp
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a deposit for missing status', async () => {
        const {id, walletId, hash, sender, amount, fee, confirmations, timestamp} = Data[2]

        try {
            const res = await service.create({
                id,
                walletId,
                hash,
                sender,
                amount,
                fee,
                confirmations,
                timestamp
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should return a deposit by hash', async () => {
        const {hash} = Data[0]

        const res = await service.getByHash(hash)

        expect(res).to.not.equals(null)
    })

    it('Should not return a deposit by empty hash', async () => {
        const res = await service.getByHash('')

        expect(res).to.equals(null)
    })

    it('Should return deposits by wallet', async () => {
        const {walletId} = Data[0]

        const res = await service.getAllByWallet(walletId)

        expect(res.length).to.be.above(0)
    })

    it('Should not return deposits by empty wallet id', async () => {
        const res = await service.getAllByWallet('')

        expect(res.length).to.equals(0)
    })

    it('Should update a deposit', async () => {
        const {id, confirmations, status} = Data[0]

        const res = await service.update({
            id,
            confirmations: (confirmations + 1),
            status
        })

        expect(!!res).to.equals(true)
    })

    it('Should not update a deposit for missing id', async () => {
        const {confirmations, status} = Data[0]

        try {
            const res = await service.update({
                confirmations: (confirmations + 1),
                status
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeDatabaseError')
        }
    })

    it('Should not update a deposit for missing confirmations', async () => {
        const {id, status} = Data[0]

        try {
            const res = await service.update({
                id,
                status
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not update a deposit for missing status', async () => {
        const {id, confirmations} = Data[0]

        try {
            const res = await service.update({
                id,
                confirmations: (confirmations + 1)
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })
})