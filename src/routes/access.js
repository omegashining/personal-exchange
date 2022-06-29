import AbstractRouter from "./abstract-router"
import Services from "../services/services.js"
import Passport from "../passport/passport.js"
import {isHashEquals} from "../util/hash.js"
import {v4 as Uuid} from 'uuid'

export default class AccessRouter extends AbstractRouter {
    init() {
        this.get('/uuid', false, false, this.getUUID)
        this.post('/', false, false, this.authenticate)
        this.get('/', false, Passport.isTokenValid, this.getAccess)
        this.get('/:id', false, Passport.isTokenValid, this.getAccessById)
        this.put('/', false, Passport.isTokenValid, this.enableSession)
        this.delete('/', false, Passport.isTokenValid, this.deleteSession)
        this.put('/activate', false, false, this.activateAccess)
        this.put('/inactivate', false, false, this.inactivateAccess)
        this.put('/lock', false, false, this.lockAccess)
    }

    async getUUID(req, res) {
        this.logger.debug("Get UUID.")

        res.sendSuccess({uuid: Uuid()})
    }

    async authenticate(req, res) {
        this.logger.debug("Authenticate.")
        const {email, password} = req.body

        const access = await Services.access.getByEmail(email)
        if (!access) throw new Error("Access not found.")
        const hash = access.password.replace('$2y$', '$2b$')
        if (!isHashEquals(password, hash)) throw new Error("Invalid credentials.")

        await Services.sessions.removeAllSessions(access)
        const token = await Services.sessions.newSession(access, true)

        res.sendSuccess({
            id: access.id,
            email: access.email,
            status: access.status,
            token
        })
    }

    async getAccess(req, res) {
        this.logger.debug("Get access.")

        const access = await Services.access.getById(req.user.id)
        if (!access) throw new Error("Access not found.")

        res.sendSuccess({
            id: access.id,
            email: access.email,
            status: access.status
        })
    }

    async getAccessById(req, res) {
        this.logger.debug("Get access by id.")

        const access = await Services.access.getById(req.params.id)
        if (!access) throw new Error("Access not found.")

        res.sendSuccess({
            id: access.id,
            email: access.email,
            status: access.status,
        })
    }

    async enableSession(req, res) {
        this.logger.debug("Enable access session.")

        await Services.sessions.validateSession(req.token)

        res.sendSuccess({
            result: true
        })
    }

    async deleteSession(req, res) {
        this.logger.debug("Delete access session.")

        await Services.sessions.removeSession(req.token)

        res.sendSuccess({
            result: true
        })
    }

    async activateAccess(req, res) {
        this.logger.debug("Activate access.")

        const access = await this.access(req.body.id)
        const result = await Services.access.activate(access.id)

        res.sendSuccess({
            result
        })
    }

    async inactivateAccess(req, res) {
        this.logger.debug("Inactivate access.")

        const access = await this.access(req.body.id)
        const result = await Services.access.inactivate(access.id)

        res.sendSuccess({
            result
        })
    }

    async lockAccess(req, res) {
        this.logger.debug("Lock access.")

        const access = await this.access(req.body.id)
        const result = await Services.access.lock(access.id)

        res.sendSuccess({
            result
        })
    }
}