import chai from 'chai'

import chaiAsPromised from "chai-as-promised"
import Services from "../../src/services/services.js"
import * as hdWallet from "../../src/util/hdwalllet.js"
import Data from "../data/companies.json"

const expect = chai.expect
chai.use(chaiAsPromised)
chai.should()

describe('Companies', () => {
    const service = Services.company

    it('Should create a company', async () => {
        const {id, accessId, name, mnemonic, seed, status} = Data[0]

        const res = await service.create({
            id,
            accessId,
            name,
            mnemonic,
            seed,
            status
        })

        expect(!!res).to.equals(true)
    })

    it('Should not create a company for missing id', async () => {
        const {accessId, name, status} = Data[1]

        const genesis = hdWallet.generateGenesis()

        try {
            const res = await service.create({
                accessId,
                name,
                mnemonic: genesis[0],
                seed: genesis[1].toString('hex'),
                status
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a company for missing accessId', async () => {
        const {id, name, status} = Data[1]

        const genesis = hdWallet.generateGenesis()

        try {
            const res = await service.create({
                id,
                name,
                mnemonic: genesis[0],
                seed: genesis[1].toString('hex'),
                status
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a company for missing name', async () => {
        const {id, accessId, status} = Data[1]

        const genesis = hdWallet.generateGenesis()

        try {
            const res = await service.create({
                id,
                accessId,
                mnemonic: genesis[0],
                seed: genesis[1].toString('hex'),
                status
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a company for missing status', async () => {
        const {id, accessId, name} = Data[1]

        const genesis = hdWallet.generateGenesis()

        try {
            const res = await service.create({
                id,
                accessId,
                name,
                mnemonic: genesis[0],
                seed: genesis[1].toString('hex')
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should return a company by id', async () => {
        const res = await service.getById(Data[0].id)

        expect(res).to.not.equals(null)
    })

    it('Should not return a company by empty id', async () => {
        const res = await service.getById('')

        expect(res).to.equals(null)
    })

    it('Should update a company', async () => {
        const {id} = Data[0]
        const {name} = Data[2]

        const res = await service.update({
            id,
            name
        })

        expect(!!res).to.equals(true)
    })

    it('Should not update a company for missing id', async () => {
        const {name} = Data[2]

        try {
            const res = await service.update({
                name
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeDatabaseError')
        }
    })

    it('Should not update a company for missing name', async () => {
        const {id} = Data[0]

        try {
            const res = await service.update({
                id
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should activate a company by id', async () => {
        const {id} = Data[0]

        const res = await service.activate(id)

        expect(res).to.equals(true)
    })

    it('Should not activate a company by empty id', async () => {
        const res = await service.activate('')

        expect(res).to.equals(false)
    })

    it('Should inactivate a company by id', async () => {
        const {id} = Data[0]

        const res = await service.inactivate(id)

        expect(res).to.equals(true)
    })

    it('Should not inactivate a company by empty id', async () => {
        const res = await service.inactivate('')

        expect(res).to.equals(false)
    })

    it('Should lock a company by id', async () => {
        const {id} = Data[0]

        const res = await service.lock(id)

        expect(res).to.equals(true)
    })

    it('Should not lock a company by empty id', async () => {
        const res = await service.lock('')

        expect(res).to.equals(false)
    })
})