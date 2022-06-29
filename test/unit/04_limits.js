import chai from 'chai'

import chaiAsPromised from "chai-as-promised"
import Services from "../../src/services/services.js"
import Data from "../data/limits.json"

const expect = chai.expect
chai.use(chaiAsPromised)
chai.should()

describe('Limits', () => {
    const service = Services.limit

    it('Should create a limit', async () => {
        const {id, levelId, type, deposit, withdrawal} = Data[0]

        const res = await service.create({
            id,
            levelId,
            type,
            deposit,
            withdrawal
        })

        expect(!!res).to.equals(true)
    })

    it('Should not create a limit for missing level', async () => {
        const {type, deposit, withdrawal} = Data[0]

        try {
            const res = await service.create({
                type,
                deposit,
                withdrawal
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a limit for missing type', async () => {
        const {levelId, deposit, withdrawal} = Data[0]

        try {
            const res = await service.create({
                levelId,
                deposit,
                withdrawal
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a limit for missing deposit', async () => {
        const {levelId, type, withdrawal} = Data[0]

        try {
            const res = await service.create({
                levelId,
                type,
                withdrawal
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a limit for missing withdrawal', async () => {
        const {levelId, type, deposit} = Data[0]

        try {
            const res = await service.create({
                levelId,
                type,
                deposit
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should return a limit by id', async () => {
        const {id} = Data[0]

        const res = await service.getById(id)

        expect(res).to.not.equals(null)
    })

    it('Should not return a limit by empty id', async () => {
        const res = await service.getById('')

        expect(res).to.equals(null)
    })

    it('Should return a limit by level and type', async () => {
        const {levelId, type} = Data[0]

        const res = await service.getByLevelType(levelId, type)

        expect(res).to.not.equals(null)
    })

    it('Should not return a limit by level and empty type', async () => {
        const {levelId} = Data[0]

        const res = await service.getByLevelType(levelId, '')

        expect(res).to.equals(null)
    })

    it('Should return all limits by level', async () => {
        const {levelId} = Data[0]

        const res = await service.getAllByLevel(levelId)

        expect(res.length).to.be.above(0)
    })

    it('Should update a limit', async () => {
        const {id} = Data[0]
        const {type, deposit, withdrawal} = Data[2]

        const res = await service.update({
            id,
            type,
            deposit,
            withdrawal
        })

        expect(!!res).to.equals(true)
    })

    it('Should not update a limit for missing id', async () => {
        const {type, deposit, withdrawal} = Data[2]

        try {
            const res = await service.update({
                type,
                deposit,
                withdrawal
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeDatabaseError')
        }
    })

    it('Should not update a limit for missing type', async () => {
        const {id} = Data[0]
        const {deposit, withdrawal} = Data[2]

        try {
            const res = await service.update({
                id,
                deposit,
                withdrawal
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not update a limit for missing deposit', async () => {
        const {id} = Data[0]
        const {type, withdrawal} = Data[2]

        try {
            const res = await service.update({
                id,
                type,
                withdrawal
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not update a limit for missing withdrawal', async () => {
        const {id} = Data[0]
        const {type, deposit} = Data[2]

        try {
            const res = await service.update({
                id,
                type,
                deposit
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })
})