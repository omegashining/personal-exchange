import chai from 'chai'

import chaiAsPromised from "chai-as-promised"
import Services from "../../src/services/services.js"
import Data from "../data/levels.json"

const expect = chai.expect
chai.use(chaiAsPromised)
chai.should()

describe('Levels', () => {
    const service = Services.level

    it('Should create a level', async () => {
        const {id, companyId, order, description} = Data[0]

        const res = await service.create({
            id,
            companyId,
            order,
            description
        })

        expect(!!res).to.equals(true)
    })

    it('Should not create a level for missing company', async () => {
        const {order, description} = Data[1]

        try {
            const res = await service.create({
                order,
                description
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a level for missing order', async () => {
        const {companyId, description} = Data[1]

        try {
            const res = await service.create({
                companyId,
                description
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create a level for missing description', async () => {
        const {companyId, order} = Data[1]

        try {
            const res = await service.create({
                companyId,
                order
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should return a level by id', async () => {
        const {id} = Data[0]

        const res = await service.getById(id)

        expect(res).to.not.equals(null)
    })

    it('Should not return a level by empty id', async () => {
        const res = await service.getById('')

        expect(res).to.equals(null)
    })

    it('Should return a level by company id and order', async () => {
        const {companyId, order} = Data[0]

        const res = await service.getByCompanyOrder(companyId, order)

        expect(res).to.not.equals(null)
    })

    it('Should not return a level by empty company id and order', async () => {
        const {order} = Data[0]

        const res = await service.getByCompanyOrder('', order)

        expect(res).to.equals(null)
    })

    it('Should return all levels by company id', async () => {
        const {companyId} = Data[0]

        const res = await service.getAllByCompany(companyId)

        expect(res.length).to.be.above(0)
    })

    it('Should update a level', async () => {
        const {id} = Data[0]
        const {description} = Data[2]

        const res = await service.update({
            id,
            description
        })

        expect(!!res).to.equals(true)
    })

    it('Should not update a level for missing id', async () => {
        const {description} = Data[2]

        try {
            const res = await service.update({
                description
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeDatabaseError')
        }
    })
})