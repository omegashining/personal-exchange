import chai from 'chai'

import chaiAsPromised from "chai-as-promised"
import Services from "../../src/services/services.js"
import Data from "../data/users.json"

const expect = chai.expect
chai.use(chaiAsPromised)
chai.should()

describe('Users', () => {
    const service = Services.user

    it('Should create an user', async () => {
        const {userId, companyId, levelId, name, email, password, status} = Data[0]

        const res = await service.create({
            userId,
            companyId,
            levelId,
            name,
            email,
            password,
            status
        })

        expect(!!res).to.equals(true)
    })

    it('Should not create an user for missing id', async () => {
        const {companyId, levelId, name, email, password, status} = Data[1]

        try {
            const res = await service.create({
                companyId,
                levelId,
                name,
                email,
                password,
                status
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create an user for missing company', async () => {
        const {userId, levelId, name, email, password, status} = Data[1]

        try {
            const res = await service.create({
                userId,
                levelId,
                name,
                email,
                password,
                status
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create an user for missing level', async () => {
        const {userId, companyId, name, email, password, status} = Data[1]

        try {
            const res = await service.create({
                userId,
                companyId,
                name,
                email,
                password,
                status
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create an user for missing name', async () => {
        const {userId, companyId, levelId, email, password, status} = Data[1]

        try {
            const res = await service.create({
                userId,
                companyId,
                levelId,
                email,
                password,
                status
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create an user for missing email', async () => {
        const {userId, companyId, levelId, name, password, status} = Data[1]

        try {
            const res = await service.create({
                userId,
                companyId,
                levelId,
                name,
                password,
                status
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create an user for missing password', async () => {
        const {userId, companyId, levelId, name, email, status} = Data[1]

        try {
            const res = await service.create({
                userId,
                companyId,
                levelId,
                name,
                email,
                status
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not create an user for missing status', async () => {
        const {userId, companyId, levelId, name, email, password} = Data[1]

        try {
            const res = await service.create({
                userId,
                companyId,
                levelId,
                name,
                email,
                password
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should return an user by id', async () => {
        const res = await service.getById(Data[0].userId)

        expect(res).to.not.equals(null)
    })

    it('Should not return an user by empty id', async () => {
        const res = await service.getById('')

        expect(res).to.equals(null)
    })

    it('Should return an user by email', async () => {
        const res = await service.getByEmail(Data[0].email)

        expect(res).to.not.equals(null)
    })

    it('Should not return an user by empty email', async () => {
        const res = await service.getByEmail('')

        expect(res).to.equals(null)
    })

    it('Should update a user', async () => {
        const {userId} = Data[0]
        const {levelId, name, email} = Data[2]

        const res = await service.update({
            userId,
            levelId,
            name,
            email
        })

        expect(!!res).to.equals(true)
    })

    it('Should not update a user for missing id', async () => {
        const {levelId, name, email} = Data[2]

        try {
            const res = await service.update({
                levelId,
                name,
                email
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeDatabaseError')
        }
    })

    it('Should not update a user for missing level', async () => {
        const {userId} = Data[0]
        const {name, email} = Data[2]

        try {
            const res = await service.update({
                userId,
                name,
                email
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not update a user for missing name', async () => {
        const {userId} = Data[0]
        const {levelId, email} = Data[2]

        try {
            const res = await service.update({
                userId,
                levelId,
                email
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should not update a user for missing email', async () => {
        const {userId} = Data[0]
        const {levelId, name} = Data[2]

        try {
            const res = await service.update({
                userId,
                levelId,
                name
            })

            expect(!!res).to.not.equals(true)
        } catch (err) {
            expect(err.name).to.equals('SequelizeValidationError')
        }
    })

    it('Should update an user password by id', async () => {
        const {userId} = Data[0]
        const {password} = Data[2]

        const res = await service.updatePassword(userId, password)

        expect(!!res).to.equals(true)
    })

    it('Should not update an user password by empty id', async () => {
        const {password} = Data[2]

        const res = await service.updatePassword('', password)

        expect(!!res).to.not.equals(true)
    })

    it('Should activate an user by id', async () => {
        const {userId} = Data[0]

        const res = await service.activate(userId)

        expect(res).to.equals(true)
    })

    it('Should not activate an user by empty id', async () => {
        const res = await service.activate('')

        expect(res).to.equals(false)
    })

    it('Should inactivate an user by id', async () => {
        const {userId} = Data[0]

        const res = await service.inactivate(userId)

        expect(res).to.equals(true)
    })

    it('Should not inactivate an user by empty id', async () => {
        const res = await service.inactivate('')

        expect(res).to.equals(false)
    })

    it('Should lock an user by id', async () => {
        const {userId} = Data[0]

        const res = await service.lock(userId)

        expect(res).to.equals(true)
    })

    it('Should not lock an user by empty id', async () => {
        const res = await service.lock('')

        expect(res).to.equals(false)
    })
})