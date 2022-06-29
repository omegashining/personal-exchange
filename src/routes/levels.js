import AbstractRouter from "./abstract-router.js"
import Services from "../services/services.js"
import Passport from "../passport/passport.js"

export default class LevelRouter extends AbstractRouter {
    init() {
        this.post('/', false, Passport.isTokenValid, this.createLevel)
        this.put('/', false, Passport.isTokenValid, this.updateLevel)
        this.get('/company/:company', false, Passport.isTokenValid, this.getLevelsByCompany)
    }

    async createLevel(req, res) {
        this.logger.debug("Create level.")
        const {companyId, order, description} = req.body

        if (!order) throw new Error("Order not provided.")
        if (!description) throw new Error("Description not provided.")

        const company = await this.company(companyId)

        let level = await Services.level.getByCompanyOrder(company.id, order)
        if (level) throw new Error("Level already exists.")

        level = await Services.level.create({
            companyId,
            order,
            description
        })

        res.sendSuccess({
            id: level.id,
            companyId: level.companyId,
            order: level.order,
            description: level.description
        })
    }

    async updateLevel(req, res) {
        this.logger.debug("Update level.")
        const {id, description} = req.body

        await this.level(id)
        if (!description) throw new Error("Description not provided.")

        const level = await Services.level.update({id, description})

        res.sendSuccess({
            id: level.id,
            companyId: level.companyId,
            order: level.order,
            description: level.description
        })
    }

    async getLevelsByCompany(req, res) {
        this.logger.debug("Get levels by company.")

        const company = await this.company(req.params.company)

        const levels = await Services.level.getAllByCompany(company.id)
        if (!levels) throw new Error("Error: Cannot get levels.")

        const result = levels.map(level => ({
            id: level.id,
            companyId: level.companyId,
            order: level.order,
            description: level.description
        }))

        res.sendSuccess(result)
    }
}