import AbstractRouter from "./abstract-router.js"
import Services from "../services/services.js"
import Passport from "../passport/passport.js"
import {hashText} from "../util/hash.js"
import {v4 as Uuid} from "uuid"

export default class UserRouter extends AbstractRouter {
    init() {
        this.post('/', false, Passport.isTokenValid, this.createUser)
        this.put('/', false, Passport.isTokenValid, this.updateUser)
        this.put('/password', false, Passport.isTokenValid, this.updateUserPassword)
        this.get('/:id', false, Passport.isTokenValid, this.getUser)
        this.put('/activate', false, Passport.isTokenValid, this.activateUser)
        this.put('/inactivate', false, Passport.isTokenValid, this.inactivateUser)
        this.put('/lock', false, Passport.isTokenValid, this.lockUser)
    }

    async createUser(req, res) {
        this.logger.debug("Create user.")
        const {companyId, name, email, password} = req.body

        if (!companyId) throw new Error("Company ID not provided.")
        if (!name) throw new Error("Name not provided.")
        if (!email) throw new Error("Email not provided.")

        let user = await Services.user.getByEmail(email)
        if (user) throw new Error("User already exists.")

        const levels = await Services.level.getAllByCompany(companyId)
        if (!levels) throw new Error("Error: Cannot get levels.")
        if (levels.length === 0) throw new Error("The company does not have levels.")

        user = await Services.user.create({
            userId: Uuid(),
            companyId,
            levelId: levels[0].id,
            name,
            email,
            password: password ? hashText(password) : '',
            status: 'INACTIVE'
        })

        let walletData
        const walletsTypes = await Services.walletType.getAll()
        const company = await this.company(user.companyId)

        for (const walletType of walletsTypes) {
            if (walletType.acronym === 'XOY') {
                walletData = { publicKey: '', privateKey: '', address: company.xoyContract }
            } else {
                walletData = await Services.blockchain.createWallet(company.seed, user.id, walletType.acronym)
            }

            await Services.walletUser.create({
                id: Uuid(),
                walletTypeId: walletType.id,
                companyId: company.id,
                userId: user.userId,
                publicKey: walletData.publicKey,
                privateKey: walletData.privateKey,
                address: walletData.address,
                balance: 0
            })
        }

        res.sendSuccess({
            id: user.userId,
            companyId: user.companyId,
            levelId: user.levelId,
            name: user.name,
            email: user.email,
            status: user.status
        })
    }

    async updateUser(req, res) {
        this.logger.debug("Update user.")
        const {id, levelId, name, email} = req.body

        await this.user(id)
        const level = await this.level(levelId)
        if (!name) throw new Error("Name not provided.")
        if (!email) throw new Error("Email not provided.")

        const user = await Services.user.update({userId: id, levelId: level.id, name, email})

        res.sendSuccess({
            id: user.userId,
            companyId: user.companyId,
            levelId: user.levelId,
            name: user.name,
            email: user.email,
            status: user.status
        })
    }

    async updateUserPassword(req, res) {
        this.logger.debug("Update user password.")
        const {id, password} = req.body

        let user = await this.user(id)
        if (!password) throw new Error("Password not provided.")

        user = await Services.user.updatePassword(user.userId, password)

        res.sendSuccess({
            id: user.userId,
            companyId: user.companyId,
            levelId: user.levelId,
            name: user.name,
            email: user.email,
            status: user.status
        })
    }

    async getUser(req, res) {
        this.logger.debug("Get user by id.")

        const user = await this.user(req.params.id)

        res.sendSuccess({
            id: user.userId,
            companyId: user.companyId,
            levelId: user.levelId,
            name: user.name,
            email: user.email,
            status: user.status
        })
    }

    async activateUser(req, res) {
        this.logger.debug("Activate user.")

        const user = await this.user(req.body.id)
        const result = await Services.user.activate(user.userId)

        res.sendSuccess({
            result
        })
    }

    async inactivateUser(req, res) {
        this.logger.debug("Inactivate user.")

        const user = await this.user(req.body.id)
        const result = await Services.user.inactivate(user.userId)

        res.sendSuccess({
            result
        })
    }

    async lockUser(req, res) {
        this.logger.debug("Lock user.")

        const user = await this.user(req.body.id)
        const result = await Services.user.lock(user.userId)

        res.sendSuccess({
            result
        })
    }
}