import chai from 'chai'

import chaiAsPromised from "chai-as-promised"
import Services from "../../src/services/services.js"
import Data from "../data/wallets-types.json"

const expect = chai.expect
chai.use(chaiAsPromised)
chai.should()

describe('Wallets types', () => {
    const service = Services.walletType

    it('Should return a wallet type by id', async () => {
        const {id} = Data[0]

        const res = await service.getById(id)

        expect(res).to.not.equals(null)
    })

    it('Should not return a wallet type by wrong id', async () => {
        const res = await service.getById(0)

        expect(res).to.equals(null)
    })

    it('Should return a wallet type by acronym', async () => {
        const {acronym} = Data[0]

        const res = await service.getByAcronym(acronym)

        expect(res).to.not.equals(null)
    })

    it('Should not return a wallet type by empty acronym', async () => {
        const res = await service.getByAcronym('')

        expect(res).to.equals(null)
    })

    it('Should return all wallet types', async () => {
        const res = await service.getAll()

        expect(res.length).to.not.equals(0)
    })
})
