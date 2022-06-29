import chai from 'chai'

import chaiAsPromised from "chai-as-promised"
import Services from "../../src/services/services.js"
import Data from "../data/access.json"

const expect = chai.expect
chai.use(chaiAsPromised)
chai.should()

describe('Access', () => {
    const service = Services.access

    it('Should return an access by id', async () => {
        const res = await service.getById(Data[0].id)

        expect(res).to.not.equals(null)
    })

    it('Should not return an access by empty id', async () => {
        const res = await service.getById('')

        expect(res).to.equals(null)
    })

    it('Should return an access by email', async () => {
        const res = await service.getByEmail(Data[0].email)

        expect(res).to.not.equals(null)
    })

    it('Should not return an access by empty email', async () => {
        const res = await service.getByEmail('')

        expect(res).to.equals(null)
    })

    it('Should update an access password by id', async () => {
        const res = await service.updatePassword(Data[0].id, Data[0].password)

        expect(!!res).to.equals(true)
    })

    it('Should not update an access password by empty id', async () => {
        const res = await service.updatePassword('', Data[0].password)

        expect(!!res).to.equals(false)
    })

    it('Should activate an access by id', async () => {
        const res = await service.activate(Data[0].id)

        expect(res).to.equals(true)
    })

    it('Should not activate an user by empty id', async () => {
        const res = await service.activate('')

        expect(res).to.equals(false)
    })

    it('Should inactivate an access by id', async () => {
        const res = await service.inactivate(Data[0].id)

        expect(res).to.equals(true)
    })

    it('Should not inactivate an user by empty id', async () => {
        const res = await service.inactivate('')

        expect(res).to.equals(false)
    })

    it('Should lock an access by id', async () => {
        const res = await service.lock(Data[0].id)

        expect(res).to.equals(true)
    })

    it('Should not lock an user by empty id', async () => {
        const res = await service.lock('')

        expect(res).to.equals(false)
    })
})