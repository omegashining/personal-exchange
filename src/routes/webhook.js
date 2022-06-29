import AbstractRouter from "./abstract-router.js"
import Services from "../services/services.js"
import Passport from "../passport/passport.js"
import {v4 as Uuid} from "uuid"

export default class WebhookRouter extends AbstractRouter {
    init() {
        this.post('/', false, Passport.isTokenValid, this.createWebhook)
        this.get('/:id', false, Passport.isTokenValid, this.getWebhook)
        this.get('/company/:companyId', false, Passport.isTokenValid, this.getWebhooks)
        this.post('/event/', false, Passport.isTokenValid, this.addEvent)
        this.put('/activate', false, Passport.isTokenValid, this.activateWebhook)
        this.put('/inactivate', false, Passport.isTokenValid, this.inactivateWebhook)
    }

    async createWebhook(req, res) {
        this.logger.debug("Create webhook.")
        const {url, contentType, secret} = req.body

        if (!url) throw new Error("URL not provided.")
        if (!contentType) throw new Error("Content type not provided.")

        let webhook = await Services.webhook.getByUrl(url)
        if (webhook) throw new Error("URL already exists.")

        webhook = await Services.webhook.create({
            id: Uuid(),
            accessId: req.user.id,
            url,
            contentType,
            secret,
            status: 'ACTIVE'
        })

        res.sendSuccess({
            id: webhook.id,
            url: webhook.url,
            contentType: webhook.contentType,
            secret: webhook.secret,
            status: webhook.status
        })
    }

    async getWebhook(req, res) {
        this.logger.debug("Get webhook by id.")

        const webhook = await this.webhook(req.params.id)

        res.sendSuccess({
            id: webhook.id,
            url: webhook.url,
            contentType: webhook.contentType,
            secret: webhook.secret,
            status: webhook.status
        })
    }

    async getWebhooks(req, res) {
        this.logger.debug("Get webhooks by company.")
        const {companyId} = req.params

        if (!companyId) throw new Error("Company ID not provided.")
        const company = await this.company(companyId)

        let webhooks = await Services.webhook.getByAccess(company.accessId)
        if (!webhooks) throw new Error("Error: Cannot get webhooks.")

        const result = webhooks.map(webhook => ({
            id: webhook.id,
            url: webhook.url,
            contentType: webhook.contentType,
            secret: webhook.secret,
            status: webhook.status
        }))

        res.sendSuccess(result)
    }

    async addEvent(req, res){
        this.logger.debug("Add webhook event.")
        const {id, eventId} = req.body

        const webhook = await this.webhook(id)
        const result = await Services.webhook.addEvents([{
            webhook: webhook.id,
            event: eventId
        }])

        res.sendSuccess({
            result
        })
    }

    async activateWebhook(req, res) {
        this.logger.debug("Activate webhook.")

        const webhook = await this.webhook(req.body.id)
        const result = await Services.webhook.activate(webhook.id)

        res.sendSuccess({
            result
        })
    }

    async inactivateWebhook(req, res) {
        this.logger.debug("Inactivate webhook.")

        const webhook = await this.webhook(req.body.id)
        const result = await Services.webhook.inactivate(webhook.id)

        res.sendSuccess({
            result
        })
    }
}